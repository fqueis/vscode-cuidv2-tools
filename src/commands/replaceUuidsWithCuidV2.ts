import * as vscode from 'vscode';
import { CuidV2Service } from '@services/cuidv2Service';
import { ConfigurationService } from '@services/configurationService';

/**
 * Command to replace UUID identifiers with CUIDv2 identifiers in the active editor
 * Supports both full file processing and selective text replacement
 */
export async function replaceUuidsWithCuidV2(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const selection = editor.selection;

  try {
    // Check if text is selected
    if (!selection.isEmpty) {
      await replaceInSelection(editor, selection);
    } else {
      await replaceInFullFile(editor);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(
      `Failed to replace UUIDs with CUIDv2 identifiers: ${errorMessage}`,
    );
  }
}

/**
 * Replaces UUID identifiers with CUIDv2 identifiers in the selected text
 * @param editor The active text editor
 * @param selection The selected text range
 */
async function replaceInSelection(
  editor: vscode.TextEditor,
  selection: vscode.Selection,
): Promise<void> {
  const document = editor.document;
  const selectedText = document.getText(selection);

  // Find UUIDs in the selected text first
  const foundUuids = CuidV2Service.findUuids(selectedText);

  if (foundUuids.length === 0) {
    vscode.window.showInformationMessage(
      'No UUID identifiers found in the selected text',
    );
    return;
  }

  // Show confirmation dialog if enabled
  const shouldProceed = await ConfigurationService.showConfirmationIfEnabled(
    `Found ${foundUuids.length} UUID identifier(s) in the selected text. Do you want to replace them with CUIDv2 identifiers?`,
    { modal: true },
  );

  if (!shouldProceed) return;

  // Get the start and end offsets for the selection
  const startOffset = document.offsetAt(selection.start);
  const endOffset = document.offsetAt(selection.end);
  const fullText = document.getText();

  // Replace UUIDs with CUIDv2s in the selected range
  const result = CuidV2Service.replaceUuidsWithCuidV2InRange(
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
      `Successfully replaced ${result.count} UUID identifier(s) with CUIDv2 identifiers in the selected text`,
    );
  } else {
    vscode.window.showInformationMessage(
      'No valid UUID identifiers found to replace',
    );
  }
}

/**
 * Replaces all UUID identifiers with CUIDv2 identifiers in the entire file
 * @param editor The active text editor
 */
async function replaceInFullFile(editor: vscode.TextEditor): Promise<void> {
  const document = editor.document;
  const fullText = document.getText();

  // Find UUIDs in the entire file first
  const foundUuids = CuidV2Service.findUuids(fullText);

  if (foundUuids.length === 0) {
    vscode.window.showInformationMessage(
      'No UUID identifiers found in the current file',
    );
    return;
  }

  // Show confirmation dialog with file name if enabled
  const fileName = document.fileName.split('/').pop() || 'current file';
  const shouldProceed = await ConfigurationService.showConfirmationIfEnabled(
    `Found ${foundUuids.length} UUID identifier(s) in ${fileName}. Do you want to replace all of them with CUIDv2 identifiers?`,
    { modal: true },
  );

  if (!shouldProceed) return;

  // Replace all UUIDs with CUIDv2s in the file
  const result = CuidV2Service.replaceAllUuidsWithCuidV2(fullText);

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
      `Successfully replaced ${result.count} UUID identifier(s) with CUIDv2 identifiers in ${fileName}`,
    );
  } else {
    vscode.window.showInformationMessage(
      'No valid UUID identifiers found to replace',
    );
  }
}
