import * as vscode from 'vscode';
import { CuidV2Service } from '../services/cuidv2Service';

/**
 * Command to regenerate CUIDv2 identifiers in the active editor
 * Supports both full file processing and selective text replacement
 */
export async function regenerateCuidV2(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const selection = editor.selection;

  try {
    // Check if text is selected
    if (!selection.isEmpty) {
      await regenerateInSelection(editor, selection);
    } else {
      await regenerateInFullFile(editor);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(
      `Failed to regenerate CUIDv2 identifiers: ${errorMessage}`,
    );
  }
}

/**
 * Regenerates CUIDv2 identifiers in the selected text
 * @param editor The active text editor
 * @param selection The selected text range
 */
async function regenerateInSelection(
  editor: vscode.TextEditor,
  selection: vscode.Selection,
): Promise<void> {
  const document = editor.document;
  const selectedText = document.getText(selection);

  // Find CUIDv2s in the selected text first
  const foundCuids = CuidV2Service.findCuidV2s(selectedText);

  if (foundCuids.length === 0) {
    vscode.window.showInformationMessage(
      'No CUIDv2 identifiers found in the selected text',
    );
    return;
  }

  // Show confirmation dialog
  const action = await vscode.window.showWarningMessage(
    `Found ${foundCuids.length} CUIDv2 identifier(s) in the selected text. Do you want to regenerate them?`,
    { modal: true },
    'Yes',
  );

  if (action !== 'Yes') return;

  // Get the start and end offsets for the selection
  const startOffset = document.offsetAt(selection.start);
  const endOffset = document.offsetAt(selection.end);
  const fullText = document.getText();

  // Regenerate CUIDv2s in the selected range
  const result = CuidV2Service.regenerateCuidV2sInRange(
    fullText,
    startOffset,
    endOffset,
  );

  if (result.count > 0) {
    // Apply the changes to the document
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(fullText.length),
    );

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, result.text);
    });

    vscode.window.showInformationMessage(
      `Successfully regenerated ${result.count} CUIDv2 identifier(s) in the selected text`,
    );
  } else {
    vscode.window.showInformationMessage(
      'No valid CUIDv2 identifiers found to regenerate',
    );
  }
}

/**
 * Regenerates all CUIDv2 identifiers in the entire file
 * @param editor The active text editor
 */
async function regenerateInFullFile(editor: vscode.TextEditor): Promise<void> {
  const document = editor.document;
  const fullText = document.getText();

  // Find CUIDv2s in the entire file first
  const foundCuids = CuidV2Service.findCuidV2s(fullText);

  if (foundCuids.length === 0) {
    vscode.window.showInformationMessage(
      'No CUIDv2 identifiers found in the current file',
    );
    return;
  }

  // Show confirmation dialog with file name
  const fileName = document.fileName.split('/').pop() || 'current file';
  const action = await vscode.window.showWarningMessage(
    `Found ${foundCuids.length} CUIDv2 identifier(s) in ${fileName}. Do you want to regenerate all of them?`,
    { modal: true },
    'Yes',
  );

  if (action !== 'Yes') return;

  // Regenerate all CUIDv2s in the file
  const result = CuidV2Service.regenerateAllCuidV2s(fullText);

  if (result.count > 0) {
    // Apply the changes to the document
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(fullText.length),
    );

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, result.text);
    });

    vscode.window.showInformationMessage(
      `Successfully regenerated ${result.count} CUIDv2 identifier(s) in ${fileName}`,
    );
  } else {
    vscode.window.showInformationMessage(
      'No valid CUIDv2 identifiers found to regenerate',
    );
  }
}
