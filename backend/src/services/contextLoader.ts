import fs from 'fs';
import path from 'path';

interface LoadedContext {
  examples: string[];
  context: string[];
}

export class ContextLoader {
  private instructionsPath: string;
  private examplesPath: string;
  private contextPath: string;

  constructor() {
    this.instructionsPath = path.join(__dirname, '../instructions');
    this.examplesPath = path.join(this.instructionsPath, 'examples');
    this.contextPath = path.join(this.instructionsPath, 'context');
  }

  /**
   * Analyze user message to determine which examples and context to load
   */
  analyzeUserRequest(userMessage: string): LoadedContext {
    const message = userMessage.toLowerCase();
    const loadedContext: LoadedContext = {
      examples: [],
      context: []
    };

    console.log('Analyzing user request for context loading:', userMessage.substring(0, 100));

    // Example loading triggers
    const exampleTriggers = {
      'refactoring_examples.md': [
        'refactor', 'reorganize', 'restructure', 'extract', 'split', 'break down',
        'move function', 'separate', 'modularize', 'clean up code'
      ],
      'dependency_management_examples.md': [
        'install', 'package', 'dependency', 'library', 'npm', 'yarn', 'add package',
        'update package', 'version', 'import', 'module'
      ],
      'file_operations_examples.md': [
        'create file', 'delete file', 'rename file', 'move file', 'file structure',
        'directory', 'folder', 'organize files', 'file extension'
      ],
      'component_creation_examples.md': [
        'component', 'create component', 'new component', 'ui component',
        'react component', 'button', 'form', 'modal', 'card', 'layout'
      ],
      'error_handling_examples.md': [
        'error', 'bug', 'fix', 'debug', 'exception', 'try catch', 'validation',
        'error boundary', 'handle error', 'error message'
      ],
      'state_management_examples.md': [
        'state', 'useState', 'context', 'redux', 'zustand', 'react query',
        'data flow', 'global state', 'local state', 'state update'
      ],
      'ui_implementation_examples.md': [
        'style', 'css', 'tailwind', 'design', 'responsive', 'layout',
        'animation', 'theme', 'color', 'spacing', 'typography'
      ],
      'nextjs_examples.md': [
        'next.js', 'nextjs', 'app router', 'routing', 'api route', 'server component',
        'client component', 'ssr', 'ssg', 'isr', 'metadata', 'dynamic route'
      ]
    };

    // Context loading triggers
    const contextTriggers = {
      'shadcn_documentation.md': [
        'shadcn', 'ui component', 'button', 'card', 'dialog', 'form',
        'input', 'select', 'accordion', 'alert', 'badge', 'sidebar'
      ],
      'common_errors.md': [
        'error', 'bug', 'issue', 'problem', 'fix', 'debug', 'troubleshoot',
        'not working', 'broken', 'failed', 'exception'
      ],
      'package_information.md': [
        'package', 'dependency', 'library', 'install', 'version',
        'npm', 'yarn', 'import', 'module', 'available packages'
      ],
      'project_structure.md': [
        'structure', 'organization', 'directory', 'folder', 'file structure',
        'organize', 'architecture', 'file permissions', 'allowed files'
      ]
    };

    // Load relevant examples
    for (const [filename, triggers] of Object.entries(exampleTriggers)) {
      if (triggers.some(trigger => message.includes(trigger))) {
        loadedContext.examples.push(filename);
        console.log(`Loading example file: ${filename}`);
      }
    }

    // Load relevant context
    for (const [filename, triggers] of Object.entries(contextTriggers)) {
      if (triggers.some(trigger => message.includes(trigger))) {
        loadedContext.context.push(filename);
        console.log(`Loading context file: ${filename}`);
      }
    }

    // Always load common errors if any error-related keywords are found
    if (message.includes('error') || message.includes('bug') || message.includes('issue')) {
      if (!loadedContext.context.includes('common_errors.md')) {
        loadedContext.context.push('common_errors.md');
      }
    }

    // Load shadcn documentation if UI components are mentioned
    if (message.includes('component') || message.includes('ui') || message.includes('button')) {
      if (!loadedContext.context.includes('shadcn_documentation.md')) {
        loadedContext.context.push('shadcn_documentation.md');
      }
    }

    return loadedContext;
  }

  /**
   * Load content from example files
   */
  loadExamples(filenames: string[]): string {
    let content = '';

    for (const filename of filenames) {
      try {
        const filePath = path.join(this.examplesPath, filename);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          content += `\n\n## ${filename.replace('.md', '').replace(/_/g, ' ').toUpperCase()}\n\n${fileContent}`;
          console.log(`Loaded example file: ${filename}`);
        } else {
          console.warn(`Example file not found: ${filename}`);
        }
      } catch (error) {
        console.error(`Error loading example file ${filename}:`, error);
      }
    }

    return content;
  }

  /**
   * Load content from context files
   */
  loadContext(filenames: string[]): string {
    let content = '';

    for (const filename of filenames) {
      try {
        const filePath = path.join(this.contextPath, filename);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          content += `\n\n## ${filename.replace('.md', '').replace(/_/g, ' ').toUpperCase()}\n\n${fileContent}`;
          console.log(`Loaded context file: ${filename}`);
        } else {
          console.warn(`Context file not found: ${filename}`);
        }
      } catch (error) {
        console.error(`Error loading context file ${filename}:`, error);
      }
    }

    return content;
  }

  /**
   * Load core instructions
   */
  loadCoreInstructions(): string {
    try {
      const corePath = path.join(this.instructionsPath, 'december_core.txt');
      if (fs.existsSync(corePath)) {
        console.log('Loading core instructions');
        return fs.readFileSync(corePath, 'utf-8');
      } else {
        console.error('Core instructions file not found');
        return '';
      }
    } catch (error) {
      console.error('Error loading core instructions:', error);
      return '';
    }
  }

  /**
   * Assemble prompt with specific examples (for agent-requested loading)
   */
  assemblePromptWithExamples(exampleFiles: string[] = [], contextFiles: string[] = []): string {
    console.log('Assembling prompt with requested examples');
    
    // Load core instructions
    let prompt = this.loadCoreInstructions();

    // Load and append requested examples
    if (exampleFiles.length > 0) {
      const examplesContent = this.loadExamples(exampleFiles);
      if (examplesContent) {
        prompt += '\n\n---\n\n# REQUESTED EXAMPLES\n' + examplesContent;
      }
    }

    // Load and append requested context
    if (contextFiles.length > 0) {
      const contextContent = this.loadContext(contextFiles);
      if (contextContent) {
        prompt += '\n\n---\n\n# REQUESTED CONTEXT\n' + contextContent;
      }
    }

    console.log(`Assembled prompt with ${exampleFiles.length} example files and ${contextFiles.length} context files`);
    console.log(`Total prompt length: ${prompt.length} characters`);

    return prompt;
  }

  /**
   * Legacy method - now just returns core instructions
   */
  assemblePrompt(userMessage: string): string {
    console.log('Loading core instructions only - agent will decide if examples are needed');
    return this.loadCoreInstructions();
  }

  /**
   * Get fallback prompt (original static prompt) if dynamic loading fails
   */
  getFallbackPrompt(): string {
    try {
      const fallbackPath = path.join(__dirname, '../utils/prompt.txt');
      if (fs.existsSync(fallbackPath)) {
        console.log('Loading fallback prompt');
        return fs.readFileSync(fallbackPath, 'utf-8');
      } else {
        console.error('Fallback prompt file not found');
        return this.loadCoreInstructions(); // Use core as ultimate fallback
      }
    } catch (error) {
      console.error('Error loading fallback prompt:', error);
      return this.loadCoreInstructions();
    }
  }

  /**
   * Get available example files
   */
  getAvailableExamples(): string[] {
    try {
      if (fs.existsSync(this.examplesPath)) {
        return fs.readdirSync(this.examplesPath).filter(file => file.endsWith('.md'));
      }
      return [];
    } catch (error) {
      console.error('Error reading examples directory:', error);
      return [];
    }
  }

  /**
   * Get available context files
   */
  getAvailableContext(): string[] {
    try {
      if (fs.existsSync(this.contextPath)) {
        return fs.readdirSync(this.contextPath).filter(file => file.endsWith('.md'));
      }
      return [];
    } catch (error) {
      console.error('Error reading context directory:', error);
      return [];
    }
  }
}

// Export singleton instance
export const contextLoader = new ContextLoader();