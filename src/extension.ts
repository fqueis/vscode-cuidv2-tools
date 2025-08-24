/**
 * CUIDv2 Tools Extension
 * A toolkit for working with CUIDv2 identifiers in VS Code
 */

import * as vscode from 'vscode';
import { registerCommands } from '@commands/index';
import { EXTENSION_ID } from '@constants';

/**
 * Extension activation function
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log(`${EXTENSION_ID} extension is now active`);

  // Register all commands
  registerCommands(context);

  // Show activation message in development mode
  if (process.env.NODE_ENV === 'development') {
    vscode.window.showInformationMessage('CUIDv2 Tools extension activated!');
  }
}

/**
 * Extension deactivation function
 * Called when the extension is deactivated
 */
export function deactivate(): void {
  console.log(`${EXTENSION_ID} extension is now deactivated`);
}
