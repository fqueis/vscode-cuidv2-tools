/**
 * Command registration and management for CUIDv2 Tools extension
 * Centralizes all command imports and registration logic
 */

import * as vscode from 'vscode';
import { COMMANDS } from '@constants';
import { generateCuidV2AtCursor } from '@commands/generateCuidV2AtCursor';

// Re-export commands for external access
export { generateCuidV2AtCursor };

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

  // Add to context subscriptions for proper cleanup
  context.subscriptions.push(generateCuidV2Command);
}
