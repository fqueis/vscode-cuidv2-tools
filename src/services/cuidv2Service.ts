/**
 * CUIDv2 Service
 * Provides CUIDv2 generation, insertion, and validation functionality
 */

import * as vscode from 'vscode';
import { createId } from '@paralleldrive/cuid2';
import { CuidV2ValidationResult } from '@interfaces/cuidv2';

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

  /**
   * Validates a CUIDv2 identifier according to specification requirements
   * @param cuid The CUID string to validate
   * @returns Object containing validation result and details
   */
  static validateCuidV2Format(cuid: string): CuidV2ValidationResult {
    const errors: string[] = [];
    const details = {
      length: cuid.length,
      startsWithLetter: /^[a-z]/.test(cuid),
      containsOnlyValidChars: /^[a-z0-9]+$/.test(cuid),
      format: 'CUIDv2',
    };

    // CUIDv2 specification validation
    // Length should be between 24-32 characters (typical range)
    if (cuid.length < 24 || cuid.length > 32) {
      errors.push(`Invalid length: ${cuid.length} characters (expected 24-32)`);
    }

    // Must start with a lowercase letter
    if (!details.startsWithLetter) {
      errors.push('Must start with a lowercase letter');
    }

    // Must contain only lowercase letters and numbers
    if (!details.containsOnlyValidChars) {
      errors.push(
        'Contains invalid characters (only lowercase letters and numbers allowed)',
      );
    }

    // Check for empty or whitespace
    if (!cuid || cuid.trim() !== cuid) {
      errors.push('Cannot be empty or contain whitespace');
    }

    return {
      isValid: errors.length === 0,
      errors,
      details,
    };
  }
}
