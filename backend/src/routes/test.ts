import express from 'express';
import { getContextLoaderStats, testModularArchitecture } from '../services/llm';
import { contextLoader } from '../services/contextLoader';
import { processToolCalls, parseToolCalls } from '../services/toolProcessor';

const router = express.Router();

/**
 * Test endpoint for the modular architecture
 */
router.get('/modular-architecture', (req, res) => {
  try {
    console.log('Testing modular architecture endpoint');
    
    const testMessages = [
      'Create a new React component for user profiles',
      'Fix this error in my code',
      'Refactor this large component into smaller pieces',
      'Install React Query and set up data fetching',
      'Style this component with Tailwind CSS',
      'Create Next.js API routes for user management',
    ];

    const results = testMessages.map(message => ({
      message,
      result: testModularArchitecture(message)
    }));

    const stats = getContextLoaderStats();

    res.json({
      success: true,
      message: 'Modular architecture test completed',
      stats,
      testResults: results,
      summary: {
        totalTests: testMessages.length,
        testsWithExamples: results.filter(r => r.result.examplesLoaded).length,
        testsWithContext: results.filter(r => r.result.contextLoaded).length,
        averagePromptLength: Math.round(
          results.reduce((sum, r) => sum + r.result.promptLength, 0) / results.length
        ),
      }
    });

  } catch (error) {
    console.error('Error testing modular architecture:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test modular architecture',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get context loader statistics
 */
router.get('/context-stats', (req, res) => {
  try {
    const stats = getContextLoaderStats();
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting context stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get context statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Test specific message analysis
 */
//@ts-ignore
router.post('/analyze-message', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    console.log('Analyzing message:', message.substring(0, 100));
    
    const analyzed = contextLoader.analyzeUserRequest(message);
    const prompt = contextLoader.assemblePrompt(message);
    
    res.json({
      success: true,
      message: 'Message analyzed successfully',
      analysis: {
        originalMessage: message,
        detectedExamples: analyzed.examples,
        detectedContext: analyzed.context,
        promptLength: prompt.length,
        promptPreview: prompt.substring(0, 500) + '...',
      }
    });

  } catch (error) {
    console.error('Error analyzing message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get available examples and context files
 */
router.get('/available-files', (req, res) => {
  try {
    const examples = contextLoader.getAvailableExamples();
    const context = contextLoader.getAvailableContext();
    
    res.json({
      success: true,
      files: {
        examples: examples.map(file => ({
          filename: file,
          category: file.replace('.md', '').replace(/_/g, ' ')
        })),
        context: context.map(file => ({
          filename: file,
          category: file.replace('.md', '').replace(/_/g, ' ')
        }))
      },
      summary: {
        totalExamples: examples.length,
        totalContext: context.length,
        totalFiles: examples.length + context.length
      }
    });

  } catch (error) {
    console.error('Error getting available files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get available files',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Load specific example or context file content
 */
//@ts-ignore
router.get('/file-content/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    
    if (!type || !['examples', 'context'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be either "examples" or "context"'
      });
    }

    if (!filename || !filename.endsWith('.md')) {
      return res.status(400).json({
        success: false,
        error: 'Filename must end with .md'
      });
    }

    let content = '';
    
    if (type === 'examples') {
      content = contextLoader.loadExamples([filename]);
    } else {
      content = contextLoader.loadContext([filename]);
    }

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'File not found or empty'
      });
    }

    res.json({
      success: true,
      file: {
        type,
        filename,
        content,
        length: content.length,
        lines: content.split('\n').length
      }
    });

  } catch (error) {
    console.error('Error loading file content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load file content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Performance comparison between modular and static prompts
 */
router.get('/performance-comparison', (req, res) => {
  try {
    const testMessage = 'Create a React component with error handling and state management';
    
    console.log('Running performance comparison');
    
    // Test modular approach
    const modularStart = Date.now();
    const modularPrompt = contextLoader.assemblePrompt(testMessage);
    const modularTime = Date.now() - modularStart;
    
    // Test fallback approach
    const fallbackStart = Date.now();
    const fallbackPrompt = contextLoader.getFallbackPrompt();
    const fallbackTime = Date.now() - fallbackStart;
    
    const analysis = contextLoader.analyzeUserRequest(testMessage);
    
    res.json({
      success: true,
      comparison: {
        testMessage,
        modular: {
          promptLength: modularPrompt.length,
          loadTime: modularTime,
          examplesLoaded: analysis.examples.length,
          contextLoaded: analysis.context.length,
          relevantContent: true
        },
        fallback: {
          promptLength: fallbackPrompt.length,
          loadTime: fallbackTime,
          examplesLoaded: 0,
          contextLoaded: 0,
          relevantContent: false
        },
        improvement: {
          sizeReduction: Math.round(((fallbackPrompt.length - modularPrompt.length) / fallbackPrompt.length) * 100),
          relevanceIncrease: analysis.examples.length + analysis.context.length,
          loadTimeIncrease: modularTime - fallbackTime
        }
      }
    });

  } catch (error) {
    console.error('Error running performance comparison:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run performance comparison',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Load examples tool for the agent
 */
router.post('/load-examples', (req, res) => {
  try {
    const { examples = [], context = [] } = req.body;
    
    console.log('Agent requested examples:', examples);
    console.log('Agent requested context:', context);
    
    // Validate input
    const exampleFiles = Array.isArray(examples) ? examples :
                        typeof examples === 'string' ? examples.split(',').map(s => s.trim()) : [];
    const contextFiles = Array.isArray(context) ? context :
                        typeof context === 'string' ? context.split(',').map(s => s.trim()) : [];
    
    // Load requested content
    let content = '';
    
    if (exampleFiles.length > 0) {
      const examplesContent = contextLoader.loadExamples(exampleFiles);
      if (examplesContent) {
        content += '\n\n# LOADED EXAMPLES\n' + examplesContent;
      }
    }
    
    if (contextFiles.length > 0) {
      const contextContent = contextLoader.loadContext(contextFiles);
      if (contextContent) {
        content += '\n\n# LOADED CONTEXT\n' + contextContent;
      }
    }
    
    res.json({
      success: true,
      message: 'Examples loaded successfully',
      loadedFiles: {
        examples: exampleFiles,
        context: contextFiles
      },
      content: content,
      contentLength: content.length
    });
    
  } catch (error) {
    console.error('Error loading examples:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load examples',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Test endpoint for the load_examples tool
 */
//@ts-ignore
router.post('/test-load-examples-tool', (req, res) => {
  try {
    const { assistantResponse } = req.body;
    
    if (!assistantResponse || typeof assistantResponse !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'assistantResponse is required and must be a string'
      });
    }
    
    console.log('Testing load_examples tool with response:', assistantResponse.substring(0, 200));
    
    // Parse tool calls from the assistant response
    const toolCalls = parseToolCalls(assistantResponse);
    
    // Process the tool calls
    const processing = processToolCalls(assistantResponse);
    
    res.json({
      success: true,
      message: 'load_examples tool test completed',
      input: {
        assistantResponse: assistantResponse.substring(0, 500) + (assistantResponse.length > 500 ? '...' : ''),
        responseLength: assistantResponse.length
      },
      results: {
        toolCallsFound: toolCalls.length,
        toolCalls: toolCalls,
        processingResults: processing.results,
        hasToolCalls: processing.hasToolCalls,
        loadedContentLength: processing.results
          .filter(r => r.success)
          .reduce((sum, r) => sum + (r.content?.length || 0), 0)
      }
    });
    
  } catch (error) {
    console.error('Error testing load_examples tool:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test load_examples tool',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Test endpoint with sample load_examples calls
 */
router.get('/test-load-examples-samples', (req, res) => {
  try {
    const sampleResponses = [
      // Sample 1: Load component examples
      `I'll help you create a React component. Let me load some examples first.

<load_examples>
<examples>component_creation_examples.md</examples>
<context>shadcn_documentation.md</context>
</load_examples>

Now I'll create the component for you.`,

      // Sample 2: Load multiple examples
      `For this complex refactoring task, I'll need some examples.

<load_examples>
<examples>refactoring_examples.md,component_creation_examples.md</examples>
<context>project_structure.md</context>
</load_examples>

Let me break down your component.`,

      // Sample 3: Load error handling examples
      `I see you're having an error. Let me load some debugging examples.

<load_examples>
<examples>error_handling_examples.md</examples>
<context>common_errors.md</context>
</load_examples>

Here's how to fix this issue.`
    ];

    const results = sampleResponses.map((response, index) => {
      const processing = processToolCalls(response);
      return {
        sampleIndex: index + 1,
        response: response.substring(0, 200) + '...',
        toolCallsFound: processing.toolCalls.length,
        toolCalls: processing.toolCalls,
        success: processing.results.every(r => r.success),
        loadedContentLength: processing.results
          .filter(r => r.success)
          .reduce((sum, r) => sum + (r.content?.length || 0), 0)
      };
    });

    res.json({
      success: true,
      message: 'load_examples tool samples tested',
      samples: results,
      summary: {
        totalSamples: sampleResponses.length,
        successfulSamples: results.filter(r => r.success).length,
        totalToolCalls: results.reduce((sum, r) => sum + r.toolCallsFound, 0),
        totalContentLoaded: results.reduce((sum, r) => sum + r.loadedContentLength, 0)
      }
    });

  } catch (error) {
    console.error('Error testing load_examples samples:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test load_examples samples',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Comprehensive test for complete modular architecture implementation
 */
router.get('/complete-modular-test', (req, res) => {
  try {
    console.log('Running comprehensive modular architecture test');
    
    // Test 1: Core Instructions Loading
    const coreInstructions = contextLoader.loadCoreInstructions();
    const coreLoaded = !!coreInstructions && coreInstructions.length > 0;
    
    // Test 2: Example Files Availability
    const availableExamples = contextLoader.getAvailableExamples();
    const expectedExamples = [
      'component_creation_examples.md',
      'dependency_management_examples.md',
      'error_handling_examples.md',
      'file_operations_examples.md',
      'nextjs_examples.md',
      'refactoring_examples.md',
      'state_management_examples.md',
      'ui_implementation_examples.md'
    ];
    const allExamplesPresent = expectedExamples.every(ex => availableExamples.includes(ex));
    
    // Test 3: Context Files Availability
    const availableContext = contextLoader.getAvailableContext();
    const expectedContext = [
      'common_errors.md',
      'package_information.md',
      'project_structure.md',
      'shadcn_documentation.md'
    ];
    const allContextPresent = expectedContext.every(ctx => availableContext.includes(ctx));
    
    // Test 4: Intelligent Analysis
    const testMessages = [
      'Create a React component',
      'Fix an error in my code',
      'Style with Tailwind CSS',
      'Add authentication'
    ];
    
    const analysisResults = testMessages.map(message => {
      const analysis = contextLoader.analyzeUserRequest(message);
      return {
        message,
        examplesDetected: analysis.examples.length,
        contextDetected: analysis.context.length,
        analysis
      };
    });
    
    // Test 5: Tag Processing (import and test)
    const { parseDecemberTags } = require('../services/responseProcessor');
    const testResponse = `
<dec-code>
<dec-write file_path="test.tsx">
export function Test() { return <div>Test</div>; }
</dec-write>
</dec-code>
    `;
    
    const tagProcessing = parseDecemberTags(testResponse);
    const tagProcessingWorks = tagProcessing.hasCommands && tagProcessing.commands.length > 0;
    
    // Test 6: Performance Metrics
    const coreLength = coreInstructions.length;
    const exampleContent = contextLoader.loadExamples(['component_creation_examples.md']);
    const contextContent = contextLoader.loadContext(['shadcn_documentation.md']);
    
    const performanceMetrics = {
      coreInstructionsLength: coreLength,
      exampleContentLength: exampleContent.length,
      contextContentLength: contextContent.length,
      totalAvailableExamples: availableExamples.length,
      totalAvailableContext: availableContext.length
    };
    
    // Overall Results
    const allTestsPassed = coreLoaded && allExamplesPresent && allContextPresent && tagProcessingWorks;
    
    res.json({
      success: true,
      message: 'Comprehensive modular architecture test completed',
      overallStatus: allTestsPassed ? 'PASSED' : 'FAILED',
      tests: {
        coreInstructionsLoading: {
          status: coreLoaded ? 'PASSED' : 'FAILED',
          length: coreLength
        },
        exampleFilesAvailability: {
          status: allExamplesPresent ? 'PASSED' : 'FAILED',
          expected: expectedExamples.length,
          found: availableExamples.length,
          missing: expectedExamples.filter(ex => !availableExamples.includes(ex))
        },
        contextFilesAvailability: {
          status: allContextPresent ? 'PASSED' : 'FAILED',
          expected: expectedContext.length,
          found: availableContext.length,
          missing: expectedContext.filter(ctx => !availableContext.includes(ctx))
        },
        intelligentAnalysis: {
          status: analysisResults.every(r => r.examplesDetected > 0) ? 'PASSED' : 'FAILED',
          results: analysisResults
        },
        tagProcessing: {
          status: tagProcessingWorks ? 'PASSED' : 'FAILED',
          commandsFound: tagProcessing.commands.length,
          hasCommands: tagProcessing.hasCommands
        },
        performanceMetrics
      },
      summary: {
        totalTests: 5,
        passedTests: [coreLoaded, allExamplesPresent, allContextPresent, tagProcessingWorks].filter(Boolean).length,
        modularArchitectureComplete: allTestsPassed,
        tagProcessingImplemented: tagProcessingWorks,
        intelligentLoadingWorking: analysisResults.every(r => r.examplesDetected > 0)
      }
    });
    
  } catch (error) {
    console.error('Error in comprehensive modular test:', error);
    res.status(500).json({
      success: false,
      error: 'Comprehensive test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;