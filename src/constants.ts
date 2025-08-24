/**
 * Constants for CUIDv2 Tools extension
 * Centralizes all extension constants and command identifiers
 */

/**
 * Extension identifier
 */
export const EXTENSION_ID = 'cuidv2-tools';

/**
 * Command identifiers for VS Code command registration
 */
export const COMMANDS = {
  GENERATE_CUIDV2_AT_CURSOR: 'cuidv2-tools.generateCuidv2AtCursor',
  GENERATE_MULTIPLE_CUIDV2: 'cuidv2-tools.generateMultipleCuidv2',
  VALIDATE_CUIDV2: 'cuidv2-tools.validateCuidv2',
  REGENERATE_CUIDV2: 'cuidv2-tools.regenerateCuidv2',
  REPLACE_UUIDS_WITH_CUIDV2: 'cuidv2-tools.replaceUuidsWithCuidv2',
} as const;
