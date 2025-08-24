/**
 * Generate Multiple CUIDv2 Command
 * Allows users to generate multiple CUIDv2 identifiers with customizable quantity
 */

import * as vscode from 'vscode';
import { CuidV2Service } from '@services/cuidv2Service';

/**
 * Command to generate multiple CUIDv2 identifiers
 * Prompts user for quantity and generates the specified number of CUIDv2s
 */
export async function generateMultipleCuidV2(): Promise<void> {
  try {
    // Prompt user for the number of CUIDv2s to generate
    const input = await vscode.window.showInputBox({
      prompt: 'How many would you like to generate?',
      placeHolder: 'Enter a number between 1 and 1000',
      validateInput: (value: string) => {
        const num = parseInt(value, 10);

        // Check if input is a valid number
        if (isNaN(num)) {
          return 'Please enter a valid number';
        }

        // Validate range (1-1000)
        if (num < 1) {
          return 'Number must be at least 1';
        }

        if (num > 1000) {
          return 'Number cannot exceed 1000';
        }

        return null; // Valid input
      },
    });

    // Check if user cancelled the input
    if (input === undefined) {
      return;
    }

    const quantity = parseInt(input, 10);

    // Show progress for larger quantities
    if (quantity > 50) {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Generating ${quantity} CUIDv2 identifiers...`,
          cancellable: false,
        },
        async (progress) => {
          const cuidv2s = await generateBatchCuidV2s(quantity, progress);
          await displayResults(cuidv2s, quantity);
        },
      );
    } else {
      // Generate without progress indicator for smaller quantities
      const cuidv2s = await generateBatchCuidV2s(quantity);
      await displayResults(cuidv2s, quantity);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to generate: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Generate multiple CUIDv2s with performance optimization
 * Uses batch processing for efficient generation of large quantities
 */
async function generateBatchCuidV2s(
  quantity: number,
  progress?: vscode.Progress<{ message?: string; increment?: number }>,
): Promise<string[]> {
  const cuidv2s: string[] = [];
  const batchSize = 100; // Process in batches for better performance
  const totalBatches = Math.ceil(quantity / batchSize);

  for (let batch = 0; batch < totalBatches; batch++) {
    const currentBatchSize = Math.min(batchSize, quantity - batch * batchSize);

    // Generate batch of CUIDv2s
    const batchCuidv2s = Array.from({ length: currentBatchSize }, () =>
      CuidV2Service.generateCuidV2(),
    );

    cuidv2s.push(...batchCuidv2s);

    // Update progress if provided
    if (progress) {
      progress.report({
        message: `Generated ${cuidv2s.length}/${quantity} identifiers`,
        increment: 100 / totalBatches,
      });
    }

    // Yield control to prevent blocking the UI for large batches
    if (batch < totalBatches - 1) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  return cuidv2s;
}

/**
 * Display the generated CUIDv2s in a formatted output
 * Creates a new document with the results for easy copying
 */
async function displayResults(
  cuidv2s: string[],
  quantity: number,
): Promise<void> {
  // Create JSON structure with metadata and identifiers
  const jsonOutput = {
    metadata: {
      count: quantity,
      generatedAt: new Date().toISOString(),
      type: 'CUIDv2',
    },
    identifiers: cuidv2s,
  };

  // Format as pretty-printed JSON
  const content = JSON.stringify(jsonOutput, null, 2);

  // Create and show new document with results
  const document = await vscode.workspace.openTextDocument({
    content,
    language: 'json',
  });

  await vscode.window.showTextDocument(document);

  // Show success message
  vscode.window.showInformationMessage(
    `Successfully generated ${quantity} CUIDv2 identifier${quantity > 1 ? 's' : ''} in JSON format!`,
  );
}
