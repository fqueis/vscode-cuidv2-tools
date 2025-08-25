<p align="center">
  <img src="https://placehold.co/800x200@2x/000/FFF.png?text=Cuidv2+Tools&font=montserrat" width="800" />
</p>

A Visual Studio Code extension that provides a comprehensive toolkit for working with CUIDv2 (Collision-resistant Unique Identifiers) in your development workflow.

## Demo

![CUIDv2 Tools Usage Demo](./usage.gif)

_The above demonstration shows the key features of CUIDv2 Tools in action, including generation, validation, regeneration and UUID replacement capabilities._

## Features

### Core Functionality

- **Generate CUIDv2 at Cursor**: Insert a new CUIDv2 identifier at your current cursor position
- **Generate Multiple CUIDv2s**: Create multiple CUIDv2 identifiers in JSON format (1-1000 at once)
- **Validate CUIDv2**: Verify if a string is a valid CUIDv2 identifier
- **Regenerate CUIDv2s**: Replace existing CUIDv2 identifiers with new ones
- **Replace UUIDs with CUIDv2s**: Convert UUID identifiers to CUIDv2 format

### Advanced Features

- **Smart Text Selection**: Works with both selected text and full file processing
- **Configurable Confirmation Dialogs**: Optional safety prompts for destructive operations
- **Context Menu Integration**: Right-click commands for quick access
- **Batch Processing**: Efficient handling of large quantities with progress indicators
- **Multiple Cursor Support**: Generate identifiers at multiple positions simultaneously

## Installation

### From VS Code Marketplace

1. Open Visual Studio Code
2. Go to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "CUIDv2 Tools"
4. Click Install

## Usage

### Command Palette

Access all commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- `CUIDv2 Tools: Generate CUIDv2 at cursor`
- `CUIDv2 Tools: Generate Multiple CUIDv2s`
- `CUIDv2 Tools: Validate CUIDv2`
- `CUIDv2 Tools: Regenerate CUIDv2 Identifiers`
- `CUIDv2 Tools: Replace UUIDs with CUIDv2`

### Context Menu

Right-click in the editor to access context-sensitive commands:

- **With text selected**: Validate, regenerate, or replace operations
- **Without selection**: Generate new CUIDv2 at cursor position

### Examples

#### Generate Single CUIDv2

```javascript
// Place cursor where you want the identifier
const userId = |  // <- cursor here

// After running "Generate CUIDv2 at cursor"
const userId = clhqv8x9z0a1b2c3d4e5f6g7h;
```

#### Generate Multiple CUIDv2s

```json
{
  "metadata": {
    "count": 5,
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "type": "CUIDv2"
  },
  "identifiers": [
    "clhqv8x9z0a1b2c3d4e5f6g7h",
    "clhqw1y2z3a4b5c6d7e8f9g0h",
    "clhqx2y3z4a5b6c7d8e9f0g1h",
    "clhqy3y4z5a6b7c8d9e0f1g2h",
    "clhqz4y5z6a7b8c9d0e1f2g3h"
  ]
}
```

#### Replace UUIDs with CUIDv2s

```javascript
// Before
const sessionId = '550e8400-e29b-41d4-a716-446655440000';
const requestId = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

// After running "Replace UUIDs with CUIDv2"
const sessionId = 'clhqv8x9z0a1b2c3d4e5f6g7h';
const requestId = 'clhqw1y2z3a4b5c6d7e8f9g0h';
```

## ⚙️ Configuration

### Settings

Configure the extension through VS Code settings:

```json
{
  "cuidv2-tools.confirmBeforeExecution": true
}
```

#### Available Settings

| Setting                  | Type    | Default | Description                                                       |
| ------------------------ | ------- | ------- | ----------------------------------------------------------------- |
| `confirmBeforeExecution` | boolean | `true`  | Show confirmation dialogs before executing destructive operations |

### Accessing Settings

1. Open VS Code Settings (`Ctrl+,` / `Cmd+,`)
2. Search for "CUIDv2 Tools"
3. Modify settings as needed

## 🔧 Development

### Prerequisites

- Node.js 18+ and pnpm
- Visual Studio Code 1.103.0+
- TypeScript knowledge for contributions

### Setup

```bash
# Clone the repository
git clone https://github.com/fqueis/vscode-cuidv2-tools.git
cd vscode-cuidv2-tools

# Install dependencies
pnpm install

# Compile the extension
pnpm run compile

# Watch for changes during development
pnpm run watch
```

### Building

```bash
# Build for production
pnpm run package

# Format code
pnpm run format
```

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Format your code: `pnpm run format`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write comprehensive JSDoc comments
- Follow semantic versioning for releases

### Reporting Issues

When reporting issues, please include:

- VS Code version
- Extension version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## API Reference

### CuidV2Service

Core service class providing CUIDv2 operations:

```typescript
// Generate a new CUIDv2
const newId = CuidV2Service.generateCuidV2();

// Validate a CUIDv2
const isValid = CuidV2Service.validateCuidV2('clhqv8x9z0a1b2c3d4e5f6g7h');

// Find CUIDv2s in text
const found = CuidV2Service.findCuidV2s(text);

// Replace all CUIDv2s in text
const result = CuidV2Service.regenerateAllCuidV2s(text);
```

### ConfigurationService

Manages extension settings:

```typescript
// Check if confirmation dialogs are enabled
const shouldConfirm = ConfigurationService.shouldShowConfirmation();

// Show conditional confirmation dialog
const proceed = await ConfigurationService.showConfirmationIfEnabled(message);
```

## License

This project is licensed under the MIT License - see the [LICENCE](LICENCE) file for details.
