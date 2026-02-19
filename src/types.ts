export interface CodeIssue {
  ruleId?: string;
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  message: string;
  file: string;
  line: number;
  column?: number;
  code?: string;
  suggestedFix?: string;
  autoFixable: boolean;
}

export interface ReviewReport {
  summary: {
    totalIssues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    autoFixable: number;
  };
  issues: CodeIssue[];
  filesAnalyzed: number;
  timestamp: string;
}

export interface AnalyzerRule {
  id: string;
  name: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  check: (content: string, filePath: string) => CodeIssue[];
}

export interface AgentConfig {
  targetPath: string;
  filePatterns?: string[];
  excludePatterns?: string[];
  autoFix?: boolean;
  useAI?: boolean;
  aiApiKey?: string;
  aiMode?: 'fast' | 'thorough' | 'hybrid';
  architectureReview?: boolean;
  outputFormat?: 'console' | 'json' | 'markdown';
}

export interface AIReviewInsights {
  architecturalReview?: any;
  fileInsights?: Array<{ file: string; insights: string[] }>;
}

export interface FullReviewReport extends ReviewReport {
  aiInsights?: AIReviewInsights;
}
