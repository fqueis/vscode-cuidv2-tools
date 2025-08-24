/**
 * Generate CUIDv2 at cursor command implementation
 * Handles CUIDv2 generation and insertion at cursor position(s)
 */

import * as vscode from 'vscode';
import { CuidV2Service } from '@services/cuidv2Service';

/**
 * Command handler for generating CUIDv2 at cursor position(s)
 * Supports multiple cursors and text selection replacement
 */
export async function generateCuidV2AtCursor(): Promise<void> {
  try {
    await CuidV2Service.insertCuidV2AtCursor();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(
      `Failed to generate CUIDv2: ${errorMessage}`,
    );
  }
}
