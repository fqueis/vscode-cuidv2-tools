import * as vscode from 'vscode';
import { CuidV2Service } from '@services/cuidv2Service';
import { CuidV2ValidationResult } from '@interfaces/cuidv2';

/**
 * Displays validation results to the user
 * @param cuid The CUID that was validated
 * @param result The validation result
 */
function displayValidationResult(
  cuid: string,
  result: CuidV2ValidationResult,
): void {
  if (result.isValid) {
    vscode.window.showInformationMessage(`'${cuid}' is a valid CUIDv2`);
  } else {
    vscode.window.showErrorMessage(`'${cuid}' is not a valid CUIDv2`);
  }
}

/**
 * Gets CUID input from the user via input box
 * @returns Promise resolving to the entered CUID or undefined if cancelled
 */
async function getCuidFromInput(): Promise<string | undefined> {
  return await vscode.window.showInputBox({
    prompt: 'Enter a CUIDv2 identifier to validate',
    placeHolder: 'e.g., c7ry8x9z0a1b2c3d4e5f6g7h',
    validateInput: (value: string) => {
      if (!value.trim()) {
        return 'Please enter a CUIDv2 identifier';
      }
      return null;
    },
  });
}

/**
 * Gets CUID from the current text selection
 * @returns The selected text or undefined if no valid selection
 */
function getCuidFromSelection(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }

  const selection = editor.selection;
  if (selection.isEmpty) {
    return undefined;
  }

  return editor.document.getText(selection).trim();
}

/**
 * Main command handler for CUIDv2 validation
 * Supports both context menu (selected text) and direct input methods
 */
export async function validateCuidV2(): Promise<void> {
  try {
    let cuidToValidate: string | undefined;

    // First, try to get CUID from current selection (context menu scenario)
    cuidToValidate = getCuidFromSelection();

    // If no selection, prompt user for input
    if (!cuidToValidate) {
      cuidToValidate = await getCuidFromInput();
    }

    // If user cancelled or no input provided
    if (!cuidToValidate) {
      return;
    }

    // Validate the CUID
    const validationResult = CuidV2Service.validateCuidV2Format(cuidToValidate);

    // Display results
    displayValidationResult(cuidToValidate, validationResult);
  } catch (error: unknown) {
    vscode.window.showErrorMessage(
      `Error during CUIDv2 validation: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
