/**
 * Command registration and management for CUIDv2 Tools extension
 * Centralizes all command imports and registration logic
 */

import * as vscode from 'vscode';
import { COMMANDS } from '@constants';
import { generateCuidV2AtCursor } from '@commands/generateCuidV2AtCursor';
import { generateMultipleCuidV2 } from '@commands/generateMultipleCuidV2';
import { validateCuidV2 } from '@commands/validateCuidV2';
import { regenerateCuidV2 } from '@commands/regenerateCuidV2';

// Re-export commands for external access
export { generateCuidV2AtCursor, generateMultipleCuidV2 };
export { validateCuidV2 };
export { regenerateCuidV2 };

/**
 * Registers all commands with VS Code
 * @param context The extension context
 */
export function registerCommands(context: vscode.ExtensionContext): void {
  // Register the generate CUIDv2 at cursor command
  const generateCuidV2Command = vscode.commands.registerCommand(
    COMMANDS.GENERATE_CUIDV2_AT_CURSOR,
    generateCuidV2AtCursor,
  );

  // Register the generate multiple CUIDv2 command
  const generateMultipleCuidV2Command = vscode.commands.registerCommand(
    COMMANDS.GENERATE_MULTIPLE_CUIDV2,
    generateMultipleCuidV2,
  );

  // Register the validate CUIDv2 command
  const validateCuidV2Command = vscode.commands.registerCommand(
    COMMANDS.VALIDATE_CUIDV2,
    validateCuidV2,
  );

  // Register the regenerate CUIDv2 command
  const regenerateCuidV2Command = vscode.commands.registerCommand(
    COMMANDS.REGENERATE_CUIDV2,
    regenerateCuidV2,
  );

  // Add to context subscriptions for proper cleanup
  context.subscriptions.push(
    generateCuidV2Command,
    generateMultipleCuidV2Command,
    validateCuidV2Command,
    regenerateCuidV2Command,
  );
}
