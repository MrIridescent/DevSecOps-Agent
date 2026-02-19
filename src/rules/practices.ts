import { AnalyzerRule, CodeIssue } from '../types.js';

export const practiceRules: AnalyzerRule[] = [
  {
    id: 'no-var',
    name: 'Use let/const instead of var',
    category: 'Best Practices',
    severity: 'medium',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (/\bvar\s+\w+/.test(line) && !line.trim().startsWith('//')) {
          issues.push({
            type: 'warning',
            severity: 'medium',
            category: 'Best Practices',
            message: 'Use let or const instead of var',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            suggestedFix: line.trim().replace(/\bvar\b/, 'const'),
            autoFixable: true,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'no-any-type',
    name: 'Avoid using any type in TypeScript',
    category: 'Type Safety',
    severity: 'medium',
    check: (content: string, filePath: string) => {
      if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
        return [];
      }
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (/:\s*any\b/.test(line) && !line.trim().startsWith('//')) {
          issues.push({
            type: 'warning',
            severity: 'medium',
            category: 'Type Safety',
            message: 'Avoid using "any" type - use specific types instead',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            suggestedFix: 'Define a proper interface or use unknown with type guards',
            autoFixable: false,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'no-empty-catch',
    name: 'Empty catch blocks',
    category: 'Error Handling',
    severity: 'high',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line)) {
          issues.push({
            type: 'error',
            severity: 'high',
            category: 'Error Handling',
            message: 'Empty catch block - errors are silently ignored',
            file: filePath,
            line: i + 1,
            code: line.trim(),
            suggestedFix: 'Add error logging or proper error handling',
            autoFixable: false,
          });
          continue;
        }
        if (/catch\s*\([^)]*\)\s*\{/.test(line)) {
          let nextLineIndex = i + 1;
          while (nextLineIndex < lines.length && lines[nextLineIndex].trim() === '') {
            nextLineIndex++;
          }
          if (nextLineIndex < lines.length && lines[nextLineIndex].trim() === '}') {
            issues.push({
              type: 'error',
              severity: 'high',
              category: 'Error Handling',
              message: 'Empty catch block - errors are silently ignored',
              file: filePath,
              line: i + 1,
              code: line.trim(),
              suggestedFix: 'Add error logging or proper error handling',
              autoFixable: false,
            });
          }
        }
      }
      return issues;
    },
  },
];
