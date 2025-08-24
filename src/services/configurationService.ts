import { EXTENSION_ID } from '@constants';
import * as vscode from 'vscode';

/**
 * Service for managing extension configuration settings
 */
export class ConfigurationService {
  private static readonly CONFIRM_BEFORE_EXECUTION_KEY =
    'confirmBeforeExecution';

  /**
   * Gets the current configuration for the extension
   * @returns The workspace configuration for CUIDv2 Tools
   */
  private static getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(EXTENSION_ID);
  }

  /**
   * Checks if confirmation dialogs should be shown before executing destructive operations
   * @returns True if confirmation dialogs should be shown, false otherwise
   */
  static shouldShowConfirmation(): boolean {
    const config = this.getConfiguration();
    return config.get<boolean>(this.CONFIRM_BEFORE_EXECUTION_KEY, true);
  }

  /**
   * Shows a confirmation dialog if the user has enabled confirmation prompts
   * @param message The confirmation message to display
   * @param options Additional options for the confirmation dialog
   * @returns Promise that resolves to true if the user confirmed, false otherwise
   */
  static async showConfirmationIfEnabled(
    message: string,
    options?: { modal?: boolean },
  ): Promise<boolean> {
    // If confirmation is disabled, always return true (proceed)
    if (!this.shouldShowConfirmation()) {
      return true;
    }

    // Show confirmation dialog
    const action = await vscode.window.showWarningMessage(
      message,
      { modal: options?.modal ?? true },
      'Yes',
    );

    return action === 'Yes';
  }

  /**
   * Updates the confirmation setting
   * @param value The new value for the confirmation setting
   * @param target The configuration target (Global, Workspace, or WorkspaceFolder)
   */
  static async updateConfirmationSetting(
    value: boolean,
    target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global,
  ): Promise<void> {
    const config = this.getConfiguration();
    await config.update(this.CONFIRM_BEFORE_EXECUTION_KEY, value, target);
  }

  /**
   * Gets all current configuration values
   * @returns Object containing all configuration values
   */
  static getAllSettings(): { confirmBeforeExecution: boolean } {
    const config = this.getConfiguration();
    return {
      confirmBeforeExecution: config.get<boolean>(
        this.CONFIRM_BEFORE_EXECUTION_KEY,
        true,
      ),
    };
  }
}
