import { AnalyzerRule, CodeIssue } from '../types.js';

export const securityRules: AnalyzerRule[] = [
  {
    id: 'no-eval',
    name: 'Avoid eval() usage',
    category: 'Security',
    severity: 'critical',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (/\beval\s*\(/.test(line) && !line.trim().startsWith('//')) {
          issues.push({
            type: 'error',
            severity: 'critical',
            category: 'Security',
            message: 'Usage of eval() is dangerous and should be avoided',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            suggestedFix: 'Consider using safer alternatives like JSON.parse() or Function constructor',
            autoFixable: false,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'no-hardcoded-credentials',
    name: 'Detect hardcoded credentials',
    category: 'Security',
    severity: 'critical',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      const patterns = [
        /password\s*[:=]\s*['"]/i,
        /api[_-]?key\s*[:=]\s*['"]/i,
        /secret\s*[:=]\s*['"]/i,
        /token\s*[:=]\s*['"]/i,
      ];
      lines.forEach((line, index) => {
        patterns.forEach(pattern => {
          if (pattern.test(line) && !line.trim().startsWith('//')) {
            issues.push({
              type: 'error',
              severity: 'critical',
              category: 'Security',
              message: 'Possible hardcoded credential detected',
              file: filePath,
              line: index + 1,
              code: line.trim(),
              suggestedFix: 'Use environment variables or secure secret management',
              autoFixable: false,
            });
          }
        });
      });
      return issues;
    },
  },
  {
    id: 'insecure-random',
    name: 'Avoid Math.random() for security',
    category: 'Security',
    severity: 'medium',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (/\bMath\.random\s*\(/.test(line) && !line.trim().startsWith('//')) {
          issues.push({
            type: 'warning',
            severity: 'medium',
            category: 'Security',
            message: 'Math.random() is not cryptographically secure',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            suggestedFix: 'Use crypto.getRandomValues() or crypto.randomBytes()',
            autoFixable: false,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'hardcoded-ip',
    name: 'Detect hardcoded IP addresses',
    category: 'Security',
    severity: 'medium',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
      lines.forEach((line, index) => {
        if (ipRegex.test(line) && !/127\.0\.0\.1|0\.0\.0\.0/.test(line) && !line.trim().startsWith('//')) {
          issues.push({
            type: 'warning',
            severity: 'medium',
            category: 'Security',
            message: 'Potential hardcoded IP address detected',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            suggestedFix: 'Move IP addresses to environment variables or configuration files',
            autoFixable: false,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'potential-xss',
    name: 'Detect potential XSS vulnerabilities',
    category: 'Security',
    severity: 'high',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      const xssPatterns = [
        /\.innerHTML\s*=/,
        /\.outerHTML\s*=/,
        /document\.write\s*\(/,
        /location\.href\s*=\s*[^'"]*?(\+|`)/,
      ];
      lines.forEach((line, index) => {
        xssPatterns.forEach(pattern => {
          if (pattern.test(line) && !line.trim().startsWith('//')) {
            issues.push({
              type: 'error',
              severity: 'high',
              category: 'Security',
              message: 'Potential XSS vulnerability detected',
              file: filePath,
              line: index + 1,
              code: line.trim(),
              suggestedFix: 'Use textContent instead of innerHTML, or sanitize user input',
              autoFixable: false,
            });
          }
        });
      });
      return issues;
    },
  },
  {
    id: 'insecure-crypto',
    name: 'Avoid insecure cryptographic algorithms',
    category: 'Security',
    severity: 'high',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      const cryptoPatterns = [
        /createHash\s*\(\s*['"]md5['"]\s*\)/i,
        /createHash\s*\(\s*['"]sha1['"]\s*\)/i,
      ];
      lines.forEach((line, index) => {
        cryptoPatterns.forEach(pattern => {
          if (pattern.test(line) && !line.trim().startsWith('//')) {
            issues.push({
              type: 'error',
              severity: 'high',
              category: 'Security',
              message: 'Insecure cryptographic hash algorithm detected (MD5/SHA1)',
              file: filePath,
              line: index + 1,
              code: line.trim(),
              suggestedFix: 'Use stronger algorithms like SHA-256 or SHA-512',
              autoFixable: false,
            });
          }
        });
      });
      return issues;
    },
  },
  {
    id: 'unsafe-cors',
    name: 'Avoid overly permissive CORS policies',
    category: 'Security',
    severity: 'medium',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      const corsPatterns = [
        /Access-Control-Allow-Origin['"]\s*,\s*['"]\*['"]/,
        /cors\(\s*\{\s*origin:\s*['"]\*['"]\s*\}\s*\)/,
      ];
      lines.forEach((line, index) => {
        corsPatterns.forEach(pattern => {
          if (pattern.test(line) && !line.trim().startsWith('//')) {
            issues.push({
              type: 'warning',
              severity: 'medium',
              category: 'Security',
              message: 'Overly permissive CORS policy (Allow-Origin: *) detected',
              file: filePath,
              line: index + 1,
              code: line.trim(),
              suggestedFix: 'Restict origins to specific domains in production',
              autoFixable: false,
            });
          }
        });
      });
      return issues;
    },
  },
];
