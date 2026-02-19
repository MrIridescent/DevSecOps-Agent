---
description: Repository Information Overview
alwaysApply: true
---

# DevOps Agent Information

## Summary
DevOps Agent is an AI-powered code analysis and automated bug-fixing tool that combines static pattern analysis with deep semantic review using **Claude Sonnet 4.5**. It identifies security vulnerabilities, performance bottlenecks, and code quality issues, providing automated fixes with confidence scoring and sequential application to maintain file consistency.

## Structure
- **src/**: Core source code containing the agent's logic, AI integration, and CLI commands.
- **examples/**: Sample code and generated reports used for testing and demonstration.
- **.zencoder/ & .zenflow/**: Workflow configurations for Zencoder/Zenflow platforms.
- **dist/**: Compiled JavaScript output (generated after build).

## Language & Runtime
**Language**: TypeScript  
**Version**: ES2022 (Target/Module)  
**Build System**: TSC (TypeScript Compiler)  
**Package Manager**: npm  

## Dependencies
**Main Dependencies**:
- `@anthropic-ai/sdk`: Anthropic Claude API integration.
- `@typescript-eslint/parser`: TypeScript parsing for static analysis.
- `commander`: CLI command and argument parsing.
- `chalk`: Terminal string styling.
- `dotenv`: Environment variable management.
- `glob`: File pattern matching.
- `ora`: Elegant terminal spinners.
- `typescript`: TypeScript language support.

**Development Dependencies**:
- `@types/node`: Type definitions for Node.js.

## Build & Installation
```bash
# Install dependencies
npm install

# Compile TypeScript to JavaScript
npm run build

# Link globally for terminal access
npm link
```

## Main Files & Resources
- **src/cli-ai.ts**: Primary entry point for AI-powered code review and fixing commands.
- **src/cli.ts**: Entry point for legacy static analysis commands.
- **src/ai-analyzer.ts**: Handles Claude API integration and chunking logic for large files.
- **src/ai-agent.ts**: Orchestrates the combination of static and AI analysis.
- **src/analyzer.ts**: Implements pattern-based static analysis rules (e.g., eval, hardcoded keys).
- **.env.example**: Template for environment variables (ANTHROPIC_API_KEY, ANTHROPIC_MODEL).

## Testing
**Framework**: Not explicitly configured in `package.json`.  
**Status**: The README mentions `npm test`, but no test script or dedicated test framework (like Jest or Vitest) is present in the repository. Testing currently relies on running the agent against files in the `examples/` directory.

**Run Command**:
```bash
# Static Analysis (Fast)
node dist/cli.js review ./src

# AI-Powered Analysis (Thorough)
node dist/cli-ai.js ai-review ./src --mode thorough
```

## Usage & Operations
**Key Commands**:
- `npm run ai-review`: Run AI-powered code analysis.
- `npm run ai-fix`: Generate and apply AI-powered fixes.
- `npm run review`: Run static pattern-based analysis.
- `npm run fix`: Apply static analysis fixes.
- `npm run dev`: Run TSC in watch mode.

**Integration**:
- Supports **GitHub Actions** via a sample workflow provided in the README.
- Can be used as a **pre-commit hook** to block commits with critical issues.
