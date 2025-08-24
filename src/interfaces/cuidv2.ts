/**
 * CUIDv2 Interface Definitions
 * Contains type definitions for CUIDv2 operations
 */

/**
 * Interface for CUIDv2 validation results
 */
export interface CuidV2ValidationResult {
  isValid: boolean;
  errors: string[];
  details?: {
    length: number;
    startsWithLetter: boolean;
    containsOnlyValidChars: boolean;
    format: string;
  };
}
