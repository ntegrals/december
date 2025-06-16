import { contextLoader } from './contextLoader';

export interface ToolCall {
  type: 'load_examples';
  examples: string[];
  context: string[];
}

export interface ToolResult {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Parse tool calls from assistant response
 */
export function parseToolCalls(assistantResponse: string): ToolCall[] {
  const toolCalls: ToolCall[] = [];
  
  // Look for <load_examples> tags
  const loadExamplesRegex = /<load_examples>\s*<examples>(.*?)<\/examples>(?:\s*<context>(.*?)<\/context>)?\s*<\/load_examples>/gs;
  
  let match;
  while ((match = loadExamplesRegex.exec(assistantResponse)) !== null) {
    const examplesStr = match[1]?.trim() || '';
    const contextStr = match[2]?.trim() || '';
    
    const examples = examplesStr
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);
    
    const context = contextStr
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    
    if (examples.length > 0) {
      toolCalls.push({
        type: 'load_examples',
        examples,
        context
      });
    }
  }
  
  return toolCalls;
}

/**
 * Execute a tool call and return the result
 */
export function executeToolCall(toolCall: ToolCall): ToolResult {
  try {
    console.log(`Executing tool call: ${toolCall.type}`);
    console.log(`Examples: ${toolCall.examples.join(', ')}`);
    console.log(`Context: ${toolCall.context.join(', ')}`);
    
    if (toolCall.type === 'load_examples') {
      // Load the requested examples and context
      const content = contextLoader.assemblePromptWithExamples(
        toolCall.examples,
        toolCall.context
      );
      
      return {
        success: true,
        content
      };
    }
    
    return {
      success: false,
      error: `Unknown tool type: ${toolCall.type}`
    };
    
  } catch (error) {
    console.error('Error executing tool call:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Process all tool calls in an assistant response
 */
export function processToolCalls(assistantResponse: string): {
  toolCalls: ToolCall[];
  results: ToolResult[];
  hasToolCalls: boolean;
} {
  const toolCalls = parseToolCalls(assistantResponse);
  const results = toolCalls.map(executeToolCall);
  
  return {
    toolCalls,
    results,
    hasToolCalls: toolCalls.length > 0
  };
}

/**
 * Remove tool call tags from assistant response
 */
export function cleanAssistantResponse(assistantResponse: string): string {
  // Remove <load_examples> tags and their content
  return assistantResponse.replace(
    /<load_examples>\s*<examples>.*?<\/examples>(?:\s*<context>.*?<\/context>)?\s*<\/load_examples>/gs,
    ''
  ).trim();
}