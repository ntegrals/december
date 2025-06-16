import * as fileService from './file';

export interface DecemberCommand {
  type: 'write' | 'rename' | 'delete' | 'add-dependency';
  filePath?: string;
  content?: string;
  oldPath?: string;
  newPath?: string;
  package?: string;
}

export interface ProcessedResponse {
  cleanedContent: string;
  commands: DecemberCommand[];
  hasCommands: boolean;
}

/**
 * Parse December-specific tags from LLM response
 */
export function parseDecemberTags(response: string): ProcessedResponse {
  const commands: DecemberCommand[] = [];
  let cleanedContent = response;

  // Parse <dec-write> tags
  const writeRegex = /<dec-write\s+file_path="([^"]+)">([\s\S]*?)<\/dec-write>/g;
  let writeMatch;
  while ((writeMatch = writeRegex.exec(response)) !== null) {
    const filePath = writeMatch[1];
    const content = writeMatch[2]?.trim() || '';
    
    commands.push({
      type: 'write',
      filePath,
      content
    });
    
    console.log(`Parsed dec-write command for: ${filePath}`);
  }

  // Parse <dec-rename> tags
  const renameRegex = /<dec-rename\s+from="([^"]+)"\s+to="([^"]+)"\s*\/>/g;
  let renameMatch;
  while ((renameMatch = renameRegex.exec(response)) !== null) {
    commands.push({
      type: 'rename',
      oldPath: renameMatch[1],
      newPath: renameMatch[2]
    });
    
    console.log(`Parsed dec-rename command: ${renameMatch[1]} -> ${renameMatch[2]}`);
  }

  // Parse <dec-delete> tags
  const deleteRegex = /<dec-delete\s+file_path="([^"]+)"\s*\/>/g;
  let deleteMatch;
  while ((deleteMatch = deleteRegex.exec(response)) !== null) {
    commands.push({
      type: 'delete',
      filePath: deleteMatch[1]
    });
    
    console.log(`Parsed dec-delete command for: ${deleteMatch[1]}`);
  }

  // Parse <dec-add-dependency> tags
  const depRegex = /<dec-add-dependency\s+package="([^"]+)"\s*\/>/g;
  let depMatch;
  while ((depMatch = depRegex.exec(response)) !== null) {
    commands.push({
      type: 'add-dependency',
      package: depMatch[1]
    });
    
    console.log(`Parsed dec-add-dependency command for: ${depMatch[1]}`);
  }

  // Remove all December tags from the content
  cleanedContent = cleanedContent
    .replace(writeRegex, '')
    .replace(renameRegex, '')
    .replace(deleteRegex, '')
    .replace(depRegex, '')
    .replace(/<dec-code>([\s\S]*?)<\/dec-code>/g, '$1') // Keep content inside dec-code
    .replace(/<dec-thinking>([\s\S]*?)<\/dec-thinking>/g, '') // Remove thinking blocks
    .replace(/<dec-error>([\s\S]*?)<\/dec-error>/g, '$1') // Keep error content
    .replace(/<dec-success>([\s\S]*?)<\/dec-success>/g, '$1') // Keep success content
    .trim();

  return {
    cleanedContent,
    commands,
    hasCommands: commands.length > 0
  };
}

/**
 * Execute December commands
 */
export async function executeDecemberCommands(
  containerId: string,
  commands: DecemberCommand[]
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  for (const command of commands) {
    try {
      switch (command.type) {
        case 'write':
          if (command.filePath && command.content !== undefined) {
            await fileService.writeFile(containerId, command.filePath, command.content);
            console.log(`Successfully wrote file: ${command.filePath}`);
          } else {
            errors.push(`Invalid write command: missing filePath or content`);
          }
          break;
          
        case 'rename':
          if (command.oldPath && command.newPath) {
            // Note: fileService.renameFile would need to be implemented
            console.log(`Rename operation: ${command.oldPath} -> ${command.newPath}`);
            errors.push(`Rename operation not yet implemented`);
          } else {
            errors.push(`Invalid rename command: missing oldPath or newPath`);
          }
          break;
          
        case 'delete':
          if (command.filePath) {
            // Note: fileService.deleteFile would need to be implemented
            console.log(`Delete operation: ${command.filePath}`);
            errors.push(`Delete operation not yet implemented`);
          } else {
            errors.push(`Invalid delete command: missing filePath`);
          }
          break;
          
        case 'add-dependency':
          if (command.package) {
            // Note: package installation would need to be implemented
            console.log(`Add dependency: ${command.package}`);
            errors.push(`Add dependency operation not yet implemented`);
          } else {
            errors.push(`Invalid add-dependency command: missing package`);
          }
          break;
          
        default:
          errors.push(`Unknown command type: ${(command as any).type}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Error executing ${command.type} command: ${errorMsg}`);
      console.error(`Error executing command:`, error);
    }
  }
  
  return {
    success: errors.length === 0,
    errors
  };
}

/**
 * Process LLM response and execute December commands
 */
export async function processDecemberResponse(
  containerId: string,
  response: string
): Promise<{
  cleanedResponse: string;
  commandsExecuted: number;
  errors: string[];
}> {
  console.log('Processing December response for commands...');
  
  const parsed = parseDecemberTags(response);
  
  if (!parsed.hasCommands) {
    console.log('No December commands found in response');
    return {
      cleanedResponse: response,
      commandsExecuted: 0,
      errors: []
    };
  }
  
  console.log(`Found ${parsed.commands.length} December commands`);
  
  const execution = await executeDecemberCommands(containerId, parsed.commands);
  
  return {
    cleanedResponse: parsed.cleanedContent,
    commandsExecuted: parsed.commands.length,
    errors: execution.errors
  };
}