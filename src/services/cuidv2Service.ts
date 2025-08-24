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

  /**
   * Validates if a given string is a valid CUIDv2.
   * A valid CUIDv2 must be between 24 and 32 characters long,
   * contain only lowercase letters and numbers, and start with a lowercase letter.
   * @param cuid The string to validate.
   * @returns True if the string is a valid CUIDv2, false otherwise.
   */
  static validateCuidV2(cuid: string): boolean {
    if (typeof cuid !== 'string') {
      return false;
    }

    return this.validateCuidV2Format(cuid).isValid;
  }

  /**
   * Regular expression pattern to match CUIDv2 identifiers
   * Matches 24-32 character strings that start with a lowercase letter
   * and contain only lowercase letters and numbers
   */
  private static readonly CUIDV2_PATTERN = /\b[a-z][a-z0-9]{23,31}\b/g;

  /**
   * Finds all CUIDv2 identifiers in the given text
   * @param text The text to search for CUIDv2 identifiers
   * @returns Array of found CUIDv2 strings
   */
  static findCuidV2s(text: string): string[] {
    const matches = text.match(this.CUIDV2_PATTERN) || [];
    return matches.filter((match) => this.validateCuidV2(match));
  }

  /**
   * Replaces all CUIDv2 identifiers in the given text with new ones
   * @param text The text containing CUIDv2 identifiers to replace
   * @returns Object containing the updated text and count of replacements
   */
  static regenerateAllCuidV2s(text: string): { text: string; count: number } {
    let count = 0;
    const updatedText = text.replace(this.CUIDV2_PATTERN, (match) => {
      if (this.validateCuidV2(match)) {
        count++;
        return this.generateCuidV2();
      }
      return match;
    });

    return { text: updatedText, count };
  }

  /**
   * Replaces CUIDv2 identifiers in the specified text range
   * @param text The full text content
   * @param startOffset The start position of the range to process
   * @param endOffset The end position of the range to process
   * @returns Object containing the updated text and count of replacements
   */
  static regenerateCuidV2sInRange(
    text: string,
    startOffset: number,
    endOffset: number,
  ): { text: string; count: number } {
    const beforeRange = text.substring(0, startOffset);
    const rangeText = text.substring(startOffset, endOffset);
    const afterRange = text.substring(endOffset);

    const result = this.regenerateAllCuidV2s(rangeText);

    return {
      text: beforeRange + result.text + afterRange,
      count: result.count,
    };
  }
}
