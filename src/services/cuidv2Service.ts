/**
 * CUIDv2 Service
 * Provides CUIDv2 generation, insertion, and validation functionality
 */

import * as vscode from 'vscode';
import { createId } from '@paralleldrive/cuid2';

/**
 * Service class for CUIDv2 operations
 */
export class CuidV2Service {
  /**
   * Regular expression pattern to match CUIDv2 identifiers
   * Matches 24-32 character strings that start with a lowercase letter
   * and contain only lowercase letters and numbers
   */
  private static readonly CUIDV2_PATTERN = /\b[a-z][a-z0-9]{23,31}\b/g;

  /**
   * Regular expression pattern to match UUID identifiers
   * Matches standard UUID format: 8-4-4-4-12 hexadecimal characters
   * Supports both uppercase and lowercase, with or without hyphens
   */
  private static readonly UUID_PATTERN =
    /\b[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}\b/g;

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
   * Validates if a given string is a valid CUIDv2.
   * A valid CUIDv2 must be between 24 and 32 characters long,
   * contain only lowercase letters and numbers, and start with a lowercase letter.
   * @param cuid The string to validate.
   * @returns True if the string is a valid CUIDv2, false otherwise.
   */
  static validateCuidV2(cuid: string): boolean {
    // CUIDv2 specification validation
    // Length should be between 24-32 characters (typical range)
    if (cuid.length < 24 || cuid.length > 32) return false;

    // Must start with a lowercase letter
    if (!/^[a-z]/.test(cuid)) return false;

    // Must contain only lowercase letters and numbers
    if (!/^[a-z0-9]+$/.test(cuid)) return false;

    return true;
  }

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

  /**
   * Finds all UUID identifiers in the given text
   * @param text The text to search for UUID identifiers
   * @returns Array of found UUID strings
   */
  static findUuids(text: string): string[] {
    const matches = text.match(this.UUID_PATTERN);
    return matches ? [...new Set(matches)] : [];
  }

  /**
   * Replaces all UUID identifiers in the text with new CUIDv2 identifiers
   * @param text The text containing UUIDs to replace
   * @returns Object containing the modified text and count of replacements
   */
  static replaceAllUuidsWithCuidV2(text: string): {
    text: string;
    count: number;
  } {
    let replacedCount = 0;
    const newText = text.replace(this.UUID_PATTERN, () => {
      replacedCount++;
      return this.generateCuidV2();
    });

    return { text: newText, count: replacedCount };
  }

  /**
   * Replaces UUID identifiers within a specific range of text with CUIDv2 identifiers
   * @param text The full text
   * @param startOffset The start position of the range
   * @param endOffset The end position of the range
   * @returns Object containing the modified text and count of replacements
   */
  static replaceUuidsWithCuidV2InRange(
    text: string,
    startOffset: number,
    endOffset: number,
  ): { text: string; count: number } {
    const beforeRange = text.substring(0, startOffset);
    const rangeText = text.substring(startOffset, endOffset);
    const afterRange = text.substring(endOffset);

    const result = this.replaceAllUuidsWithCuidV2(rangeText);

    return {
      text: beforeRange + result.text + afterRange,
      count: result.count,
    };
  }
}
