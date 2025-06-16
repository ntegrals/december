import OpenAI from "openai";
import { config } from "../../config";
import { contextLoader } from "./contextLoader";
import * as dockerService from "./docker";
import * as fileService from "./file";
import { processToolCalls, cleanAssistantResponse } from "./toolProcessor";
import { processDecemberResponse } from "./responseProcessor";

const openai = new OpenAI({
  apiKey: config.aiSdk.apiKey,
  baseURL: config.aiSdk.baseUrl || "https://api.openai.com/v1",
});

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  type: "image" | "document";
  data: string;
  name: string;
  mimeType: string;
  size: number;
}

export interface ChatSession {
  id: string;
  containerId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const chatSessions = new Map<string, ChatSession>();

export async function createChatSession(
  containerId: string
): Promise<ChatSession> {
  const sessionId = `${containerId}-${Date.now()}`;
  const session: ChatSession = {
    id: sessionId,
    containerId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chatSessions.set(sessionId, session);
  return session;
}

export function getChatSession(sessionId: string): ChatSession | undefined {
  return chatSessions.get(sessionId);
}

export function getOrCreateChatSession(containerId: string): ChatSession {
  const existingSession = Array.from(chatSessions.values()).find(
    (session) => session.containerId === containerId
  );

  if (existingSession) {
    return existingSession;
  }

  const sessionId = `${containerId}-${Date.now()}`;
  const session: ChatSession = {
    id: sessionId,
    containerId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chatSessions.set(sessionId, session);
  return session;
}

function buildMessageContent(
  message: string,
  attachments: Attachment[] = []
): any[] {
  const content: any[] = [{ type: "text", text: message }];

  for (const attachment of attachments) {
    if (attachment.type === "image") {
      content.push({
        type: "image_url",
        image_url: {
          url: `data:${attachment.mimeType};base64,${attachment.data}`,
        },
      });
    } else if (attachment.type === "document") {
      const decodedText = Buffer.from(attachment.data, "base64").toString(
        "utf-8"
      );
      content.push({
        type: "text",
        text: `\n\nDocument "${attachment.name}" content:\n${decodedText}`,
      });
    }
  }

  return content;
}

/**
 * Build system prompt with intelligent example loading based on user message
 */
function buildSystemPrompt(userMessage: string, codeContext: string): string {
  try {
    console.log('Building system prompt with intelligent example loading');
    console.log('Analyzing user message:', userMessage.substring(0, 100));
    
    // Analyze user message to determine relevant examples and context
    const analysisResult = contextLoader.analyzeUserRequest(userMessage);
    
    let systemPrompt: string;
    
    if (analysisResult.examples.length > 0 || analysisResult.context.length > 0) {
      console.log(`Pre-loading ${analysisResult.examples.length} example files and ${analysisResult.context.length} context files`);
      
      // Load core instructions with relevant examples and context
      systemPrompt = contextLoader.assemblePromptWithExamples(
        analysisResult.examples,
        analysisResult.context
      );
    } else {
      console.log('No relevant examples found, loading core instructions only');
      // Load only core instructions
      systemPrompt = contextLoader.loadCoreInstructions();
    }
    
    // Add current codebase context
    const finalPrompt = `${systemPrompt}

Current codebase structure and content:
${codeContext}`;

    console.log(`System prompt built successfully. Length: ${finalPrompt.length} characters`);
    return finalPrompt;
    
  } catch (error) {
    console.error('Error building intelligent prompt, falling back to core instructions:', error);
    
    // Fallback to core instructions only
    const corePrompt = contextLoader.loadCoreInstructions();
    return `${corePrompt}

Current codebase structure and content:
${codeContext}`;
  }
}

export async function sendMessage(
  containerId: string,
  userMessage: string,
  attachments: Attachment[] = []
): Promise<{ userMessage: Message; assistantMessage: Message }> {
  const session = getOrCreateChatSession(containerId);

  const userMsg: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  session.messages.push(userMsg);

  const fileContentTree = await fileService.getFileContentTree(
    dockerService.docker,
    containerId
  );

  const codeContext = JSON.stringify(fileContentTree, null, 2);

  // Build intelligent system prompt with pre-loaded examples based on user message
  let systemPrompt = buildSystemPrompt(userMessage, codeContext);

  const openaiMessages = [
    { role: "system" as const, content: systemPrompt },
    ...session.messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content:
        msg.role === "user" && msg.attachments
          ? buildMessageContent(msg.content, msg.attachments)
          : msg.content,
    })),
  ];

  console.log(`Sending initial request to OpenAI with ${openaiMessages.length} messages`);
  console.log(`System prompt length: ${systemPrompt.length} characters`);

  const completion = await openai.chat.completions.create({
    model: config.aiSdk.model,
    messages: openaiMessages,
    //@ts-ignore
    temperature: config.aiSdk.temperature,
  });

  let assistantContent =
    completion.choices[0]?.message?.content ||
    "Sorry, I could not generate a response.";

  // Check if the assistant made any tool calls
  const toolProcessing = processToolCalls(assistantContent);
  
  if (toolProcessing.hasToolCalls) {
    console.log(`Assistant requested ${toolProcessing.toolCalls.length} tool calls`);
    
    // Process tool calls and get loaded content
    const successfulResults = toolProcessing.results.filter(r => r.success);
    
    if (successfulResults.length > 0) {
      // Combine all loaded content
      const loadedContent = successfulResults
        .map(r => r.content)
        .filter(c => c)
        .join('\n\n');
      
      if (loadedContent) {
        console.log(`Loaded ${loadedContent.length} characters of additional context`);
        
        // Create enhanced system prompt with loaded examples
        const enhancedSystemPrompt = `${systemPrompt}\n\n---\n\n# DYNAMICALLY LOADED EXAMPLES AND CONTEXT\n\n${loadedContent}`;
        
        // Clean the assistant response of tool calls
        const cleanedResponse = cleanAssistantResponse(assistantContent);
        
        // Make a second request with the enhanced prompt and cleaned response
        const enhancedMessages = [
          { role: "system" as const, content: enhancedSystemPrompt },
          ...session.messages.slice(0, -1).map((msg) => ({
            role: msg.role as "user" | "assistant",
            content:
              msg.role === "user" && msg.attachments
                ? buildMessageContent(msg.content, msg.attachments)
                : msg.content,
          })),
          // Add the current user message
          {
            role: "user" as const,
            content: userMessage
          },
          // Add the cleaned assistant response if it has content
          ...(cleanedResponse.trim() ? [{
            role: "assistant" as const,
            content: cleanedResponse
          }] : [])
        ];
        
        console.log(`Making enhanced request with ${enhancedMessages.length} messages`);
        console.log(`Enhanced prompt length: ${enhancedSystemPrompt.length} characters`);
        
        const enhancedCompletion = await openai.chat.completions.create({
          model: config.aiSdk.model,
          messages: enhancedMessages,
          //@ts-ignore
          temperature: config.aiSdk.temperature,
        });
        
        assistantContent = enhancedCompletion.choices[0]?.message?.content ||
          assistantContent; // Fallback to original if enhanced fails
        
        console.log('Enhanced response generated successfully');
      }
    }
  }

  // Process December commands in the response
  console.log('Processing December commands in response...');
  const decemberProcessing = await processDecemberResponse(containerId, assistantContent);
  
  if (decemberProcessing.commandsExecuted > 0) {
    console.log(`Executed ${decemberProcessing.commandsExecuted} December commands`);
    if (decemberProcessing.errors.length > 0) {
      console.error('December command errors:', decemberProcessing.errors);
    }
    // Use the cleaned response (with tags removed)
    assistantContent = decemberProcessing.cleanedResponse;
  }

  const assistantMsg: Message = {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content: assistantContent,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(assistantMsg);
  session.updatedAt = new Date().toISOString();

  console.log('Message processed successfully');

  return {
    userMessage: userMsg,
    assistantMessage: assistantMsg,
  };
}

export async function* sendMessageStream(
  containerId: string,
  userMessage: string,
  attachments: Attachment[] = []
): AsyncGenerator<{ type: "user" | "assistant" | "done" | "tool_processing"; data: any }> {
  const session = getOrCreateChatSession(containerId);

  const userMsg: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  session.messages.push(userMsg);
  yield { type: "user", data: userMsg };

  const fileContentTree = await fileService.getFileContentTree(
    dockerService.docker,
    containerId
  );

  const codeContext = JSON.stringify(fileContentTree, null, 2);

  // Build intelligent system prompt with pre-loaded examples based on user message
  let systemPrompt = buildSystemPrompt(userMessage, codeContext);

  const openaiMessages = [
    { role: "system" as const, content: systemPrompt },
    ...session.messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content:
        msg.role === "user" && msg.attachments
          ? buildMessageContent(msg.content, msg.attachments)
          : msg.content,
    })),
  ];

  console.log(`Starting streaming request to OpenAI`);
  console.log(`System prompt length: ${systemPrompt.length} characters`);

  const assistantId = `assistant-${Date.now()}`;
  let assistantContent = "";

  const stream = await openai.chat.completions.create({
    model: config.aiSdk.model,
    messages: openaiMessages,
    //@ts-ignore
    temperature: config.aiSdk.temperature,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;
    if (delta?.content) {
      assistantContent += delta.content;
      yield {
        type: "assistant",
        data: {
          id: assistantId,
          role: "assistant",
          content: assistantContent,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  // Check if the assistant made any tool calls
  const toolProcessing = processToolCalls(assistantContent);
  
  if (toolProcessing.hasToolCalls) {
    console.log(`Assistant requested ${toolProcessing.toolCalls.length} tool calls`);
    
    yield {
      type: "tool_processing",
      data: {
        message: "Loading additional examples and context...",
        toolCalls: toolProcessing.toolCalls
      }
    };
    
    // Process tool calls and get loaded content
    const successfulResults = toolProcessing.results.filter(r => r.success);
    
    if (successfulResults.length > 0) {
      // Combine all loaded content
      const loadedContent = successfulResults
        .map(r => r.content)
        .filter(c => c)
        .join('\n\n');
      
      if (loadedContent) {
        console.log(`Loaded ${loadedContent.length} characters of additional context`);
        
        // Create enhanced system prompt with loaded examples
        const enhancedSystemPrompt = `${systemPrompt}\n\n---\n\n# DYNAMICALLY LOADED EXAMPLES AND CONTEXT\n\n${loadedContent}`;
        
        // Clean the assistant response of tool calls
        const cleanedResponse = cleanAssistantResponse(assistantContent);
        
        // Make a second streaming request with the enhanced prompt
        const enhancedMessages = [
          { role: "system" as const, content: enhancedSystemPrompt },
          ...session.messages.slice(0, -1).map((msg) => ({
            role: msg.role as "user" | "assistant",
            content:
              msg.role === "user" && msg.attachments
                ? buildMessageContent(msg.content, msg.attachments)
                : msg.content,
          })),
          // Add the current user message
          {
            role: "user" as const,
            content: userMessage
          },
          // Add the cleaned assistant response if it has content
          ...(cleanedResponse.trim() ? [{
            role: "assistant" as const,
            content: cleanedResponse
          }] : [])
        ];
        
        console.log(`Making enhanced streaming request with ${enhancedMessages.length} messages`);
        console.log(`Enhanced prompt length: ${enhancedSystemPrompt.length} characters`);
        
        // Reset assistant content for enhanced response
        assistantContent = "";
        
        const enhancedStream = await openai.chat.completions.create({
          model: config.aiSdk.model,
          messages: enhancedMessages,
          //@ts-ignore
          temperature: config.aiSdk.temperature,
          stream: true,
        });
        
        for await (const chunk of enhancedStream) {
          const delta = chunk.choices[0]?.delta;
          if (delta?.content) {
            assistantContent += delta.content;
            yield {
              type: "assistant",
              data: {
                id: assistantId,
                role: "assistant",
                content: assistantContent,
                timestamp: new Date().toISOString(),
              },
            };
          }
        }
        
        console.log('Enhanced streaming response completed');
      }
    }
  }

  // Process December commands in the streaming response
  console.log('Processing December commands in streaming response...');
  const decemberProcessing = await processDecemberResponse(containerId, assistantContent);
  
  if (decemberProcessing.commandsExecuted > 0) {
    console.log(`Executed ${decemberProcessing.commandsExecuted} December commands`);
    if (decemberProcessing.errors.length > 0) {
      console.error('December command errors:', decemberProcessing.errors);
    }
    // Use the cleaned response (with tags removed)
    assistantContent = decemberProcessing.cleanedResponse;
  }

  const finalAssistantMsg: Message = {
    id: assistantId,
    role: "assistant",
    content: assistantContent,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(finalAssistantMsg);
  session.updatedAt = new Date().toISOString();

  console.log('Streaming completed successfully');

  yield { type: "done", data: finalAssistantMsg };
}

/**
 * Get context loader statistics for monitoring
 */
export function getContextLoaderStats() {
  return {
    availableExamples: contextLoader.getAvailableExamples(),
    availableContext: contextLoader.getAvailableContext(),
    coreInstructionsLoaded: !!contextLoader.loadCoreInstructions(),
  };
}

/**
 * Test the modular architecture with a sample message
 */
export function testModularArchitecture(testMessage: string) {
  console.log('Testing modular architecture with message:', testMessage);
  
  const analyzed = contextLoader.analyzeUserRequest(testMessage);
  const prompt = contextLoader.assemblePrompt(testMessage);
  
  return {
    analyzedContext: analyzed,
    promptLength: prompt.length,
    coreLoaded: prompt.includes('December AI Agent Instructions'),
    examplesLoaded: analyzed.examples.length > 0,
    contextLoaded: analyzed.context.length > 0,
  };
}
