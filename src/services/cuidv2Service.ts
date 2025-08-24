/**
 * CUIDv2 Service
 * Provides CUIDv2 generation and insertion functionality
 */

import * as vscode from 'vscode';
import { createId } from '@paralleldrive/cuid2';

/**
 * Service class for CUIDv2 operations
 */
export class CuidV2Service {
  /**
   * Generates a new CUIDv2 identifier
   * @returns A new CUIDv2 string
   */
  static generateCuidV2(): string {
    return createId();
  }

  /**
   * Inserts CUIDv2 at cursor position(s) in the active editor
   * Supports multiple cursors and text selection replacement
   */
  static async insertCuidV2AtCursor(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const cuidv2 = this.generateCuidV2();

    await editor.edit((editBuilder) => {
      editor.selections.forEach((selection) => {
        editBuilder.replace(selection, cuidv2);
      });
    });

    vscode.window.showInformationMessage(`Generated CUIDv2: ${cuidv2}`);
  }
}
