# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2026-07-13

### Added

- Automated publish workflow on `v*` tags (VS Marketplace + Open VSX)
- Vitest unit tests for `CuidV2Service` (generate, validate, find, regenerate, UUID replace)
- `scripts/package-vsix.mjs` to emit `.vsix` files under `builds/`

### Changed

- Build scripts aligned for packaging: `build` (webpack), `package` (vsix), `vscode:prepublish` runs `build`
- Declared MIT `license` in `package.json`
- Updated `.gitignore` / `.vscodeignore` for `builds/`, CI scripts, and test files

## [0.0.1] - 2025-08-24

### Added

- CUIDv2 generation at cursor position
- Multiple CUIDv2 generation with batch processing
- CUIDv2 validation with detailed feedback
- CUIDv2 regeneration for selected text or entire files
- UUID to CUIDv2 replacement functionality
- Configurable confirmation dialogs for destructive operations
- Context menu integration for right-click access
- Command Palette integration
- Progress indicators for batch operations
- Comprehensive error handling and user feedback

### Technical

- TypeScript implementation with strict typing
- Modular service architecture (CuidV2Service, ConfigurationService)
- Webpack build configuration
- VS Code extension API integration
- Regular expression patterns for UUID detection
- User configuration management

## [Unreleased]

### Planned

- Additional ID format support
- Bulk file processing
- Custom ID format configuration
