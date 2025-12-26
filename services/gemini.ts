
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import { MockBarQuestion } from "../types";

/**
 * INTERNAL ARCHITECTURAL LAYER: Jurisdiction Scope Registry
 * Defines authorized legal boundaries and statutory corpora per jurisdiction.
 * This registry is used for internal scoping and passive detection.
 */
const JURISDICTION_SCOPE_REGISTRY: Record<string, { 
  id: string, 
  name: string, 
  authorizedStatutoryScope: string[], 
  forbiddenCitations: RegExp[] 
}> = {
  'PH': {
    id: 'PH',
    name: 'Philippines',
    authorizedStatutoryScope: ['1987 Constitution', 'Revised Penal Code', 'Civil Code', 'Rules of Court'],
    forbiddenCitations: [
      /\bU\.S\.\s+Supreme\s+Court\b/i,
      /\bSCOTUS\b/i,
      /\bCommon\s+Law\b(?!\s+principles\s+applied\s+in\s+PH)/i,
      /\bU\.K\.\b/i,
      /\bFederal\s+Rules\s+of\s+Evidence\b/i
    ]
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Jurisdiction Resolver
 * Deterministically resolves the active jurisdiction based on environment signals.
 */
const JurisdictionResolver = {
  resolve: (): string => {
    // Default to PH based on current application footprint
    return (process.env as any).APP_JURISDICTION || 'PH';
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Jurisdiction Guardrail (Passive)
 * Detects jurisdictional bleed-through or incompatible citations post-inference.
 */
const JurisdictionGuardrail = {
  observe: (requestId: string, jurisdictionId: string, text: string) => {
    const scope = JURISDICTION_SCOPE_REGISTRY[jurisdictionId];
    if (!scope) return;

    let violationDetected = false;
    const detectedForbidden: string[] = [];

    scope.forbiddenCitations.forEach(pattern => {
      if (pattern.test(text)) {
        violationDetected = true;
        detectedForbidden.push(pattern.toString());
      }
    });

    if (violationDetected) {
      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'JURISDICTION_SCOPE_VIOLATION',
        component: 'JurisdictionGuardrail',
        metadata: {
          status: 'BLEED_DETECTED',
          jurisdictionId,
          anomalyType: 'FOREIGN_LAW_BLEED',
          securityContext: detectedForbidden.join(', ')
        }
      });
    }
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Orchestration Configuration
 * Defines static routing policies and shadow execution mappings.
 */
const ORCHESTRATION_POLICY = {
  routingMode: 'DETERMINISTIC_STATIC',
  shadowEnabled: true,
  fallbackThreshold: 'MANUAL_OPERATOR_ONLY',
  shadowMappings: {
    'gemini-3-pro-preview': ['gemini-3-flash-preview'] // Flash shadows Pro for performance benchmarking
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Model Registry
 */
const ModelRegistry: Record<string, { 
  version: string, 
  hash: string, 
  status: 'active' | 'deprecated' | 'shadow',
  role: 'primary' | 'fallback' | 'shadow'
}> = {
  'gemini-3-pro-preview': {
    version: '3.0.0-pro-preview-stable',
    hash: 'sha256:7f8e9d0a1b2c3d4e5f6g7h8i9j0k',
    status: 'active',
    role: 'primary'
  },
  'gemini-3-flash-preview': {
    version: '3.0.0-flash-preview-stable',
    hash: 'sha256:1a2b3c4d5e6f7g8h9i0j1k2l3m4n',
    status: 'active',
    role: 'primary'
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Model Orchestrator
 */
const ModelOrchestrator = {
  resolveActiveModel: (requestedModelId: string) => {
    const entry = ModelRegistry[requestedModelId];
    if (!entry || entry.status === 'deprecated') {
      return { id: 'gemini-3-pro-preview', ...ModelRegistry['gemini-3-pro-preview'] };
    }
    return { id: requestedModelId, ...entry };
  },

  getShadowModels: (primaryModelId: string): string[] => {
    if (!ORCHESTRATION_POLICY.shadowEnabled) return [];
    return (ORCHESTRATION_POLICY.shadowMappings as any)[primaryModelId] || [];
  },

  executeShadow: async (requestId: string, modelId: string, contents: any, config: any) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const startTime = performance.now();
      const response = await ai.models.generateContent({
        model: modelId,
        contents,
        config
      });
      const latency = Math.round(performance.now() - startTime);
      
      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'SHADOW_EXECUTION_COMPLETE',
        component: 'ShadowExecutionEngine',
        metadata: {
          model: modelId,
          status: 'SUCCESS',
          latencyMs: latency,
          tokensIn: response.usageMetadata?.promptTokenCount,
          tokensOut: response.usageMetadata?.candidatesTokenCount
        }
      });
    } catch (e) {
      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'SHADOW_EXECUTION_COMPLETE',
        component: 'ShadowExecutionEngine',
        metadata: { model: modelId, status: 'ERROR' }
      });
    }
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Cost Rate Registry
 */
const COST_RATE_REGISTRY: Record<string, { input: number, output: number }> = {
  'gemini-3-pro-preview': { input: 0.00125, output: 0.00375 },
  'gemini-3-flash-preview': { input: 0.000075, output: 0.0003 }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Budget Policies
 */
const BUDGET_POLICIES = {
  dailyAllowanceUSD: 10.00,
  alertThresholds: [0.5, 0.8, 0.9, 1.0],
  quotaGracePeriod: 'active'
};

/**
 * INTERNAL ARCHITECTURAL LAYER: FinOps Engine
 */
const FinOpsEngine = {
  private_cumulativeSpend: 0,
  private_alertedThresholds: new Set<number>(),

  calculateCost: (modelId: string, tokensIn: number = 0, tokensOut: number = 0): number => {
    const rate = COST_RATE_REGISTRY[modelId] || { input: 0, output: 0 };
    return (tokensIn / 1000 * rate.input) + (tokensOut / 1000 * rate.output);
  },

  trackUsage: (requestId: string, modelId: string, tokensIn: number, tokensOut: number) => {
    const cost = FinOpsEngine.calculateCost(modelId, tokensIn, tokensOut);
    FinOpsEngine.private_cumulativeSpend += cost;

    const currentUsageRatio = FinOpsEngine.private_cumulativeSpend / BUDGET_POLICIES.dailyAllowanceUSD;
    
    BUDGET_POLICIES.alertThresholds.forEach(threshold => {
      if (currentUsageRatio >= threshold && !FinOpsEngine.private_alertedThresholds.has(threshold)) {
        FinOpsEngine.private_alertedThresholds.add(threshold);
        AuditLogger.record({
          requestId,
          timestamp: new Date().toISOString(),
          eventType: 'COST_BUDGET_ALERT',
          component: 'FinOpsEngine',
          metadata: {
            status: 'THRESHOLD_REACHED',
            metricName: 'daily_spend_ratio',
            currentValue: Number(currentUsageRatio.toFixed(4)),
            baselineValue: threshold,
            anomalyType: 'BUDGET_EXPOSURE'
          }
        });
      }
    });

    return cost;
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Doctrine Test Corpus
 */
const DOCTRINE_TEST_CORPUS = [
  {
    id: 'REQUISITES_SELF_DEFENSE',
    subject: 'Criminal Law',
    expectedElements: ['unlawful aggression', 'reasonable necessity', 'lack of sufficient provocation'],
    description: 'Article 11, RPC: Justifying circumstances'
  },
  {
    id: 'REQUISITES_MARRIAGE',
    subject: 'Civil Law',
    expectedElements: ['legal capacity', 'consent freely given', 'solemnizing officer', 'marriage license'],
    description: 'Family Code: Essential and Formal Requisites'
  },
  {
    id: 'EMPLOYER_EMPLOYEE_TEST',
    subject: 'Labor Law',
    expectedElements: ['selection and engagement', 'payment of wages', 'power of dismissal', 'power of control'],
    description: 'Four-Fold Test of Employment'
  },
  {
    id: 'PIERCING_CORP_VEIL',
    subject: 'Commercial Law',
    expectedElements: ['separate legal personality', 'alter ego', 'fraud', 'defeat public convenience'],
    description: 'Doctrine of Separate Legal Entity'
  }
];

/**
 * INTERNAL ARCHITECTURAL LAYER: Regression Baseline Registry
 */
const REGRESSION_BASELINE_REGISTRY: Record<string, { coverageThreshold: number, lastVerifiedScore: number }> = {
  'REQUISITES_SELF_DEFENSE': { coverageThreshold: 1.0, lastVerifiedScore: 1.0 },
  'REQUISITES_MARRIAGE': { coverageThreshold: 0.75, lastVerifiedScore: 1.0 },
  'EMPLOYER_EMPLOYEE_TEST': { coverageThreshold: 1.0, lastVerifiedScore: 1.0 }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Regression Engine (Passive)
 */
const RegressionEngine = {
  observe: (requestId: string, text: string) => {
    const normalizedText = text.toLowerCase();
    
    DOCTRINE_TEST_CORPUS.forEach(testCase => {
      const subjectMatch = normalizedText.includes(testCase.subject.toLowerCase()) || 
                           normalizedText.includes(testCase.description.toLowerCase().split(':')[0].toLowerCase());
      
      if (subjectMatch) {
        const foundElements = testCase.expectedElements.filter(el => normalizedText.includes(el.toLowerCase()));
        const score = foundElements.length / testCase.expectedElements.length;
        const baseline = REGRESSION_BASELINE_REGISTRY[testCase.id];

        if (baseline && score < baseline.coverageThreshold) {
          AuditLogger.record({
            requestId,
            timestamp: new Date().toISOString(),
            eventType: 'REGRESSION_ALERT',
            component: 'RegressionEngine',
            metadata: {
              status: 'REGRESSION_DETECTED',
              metricName: `doctrinal_coverage:${testCase.id}`,
              currentValue: score,
              baselineValue: baseline.coverageThreshold,
              anomalyType: 'ACCURACY_DECAY'
            }
          });
        }
      }
    });
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Security Configuration
 */
const SECURITY_POLICY = {
  tlsRequirement: 'TLS_1.3',
  maxRequestsPerMinute: 60,
  tokenQuotaPerSession: 100000,
  threatConfidenceThreshold: 0.85,
  isolationLevel: 'container_isolated'
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Access Controller (Zero Trust)
 */
const AccessController = {
  checkPermission: (modelId: string, context: string): boolean => {
    const allowedMap: Record<string, string[]> = {
      'gemini-3-pro-preview': ['HIGH_IMPACT_LEGAL', 'BAR_SIMULATION', 'COMPLEX_RESEARCH', 'METADATA_SEARCH'],
      'gemini-3-flash-preview': ['METADATA_SEARCH', 'JSON_TRANSFORMATION', 'HIGH_IMPACT_LEGAL']
    };
    return allowedMap[modelId]?.includes(context) ?? false;
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Security Gateway
 */
const SecurityGateway = {
  private_registry: new Map<string, number[]>(),
  
  isRateLimited: (sessionId: string): boolean => {
    const now = Date.now();
    const timestamps = SecurityGateway.private_registry.get(sessionId) || [];
    const window = timestamps.filter(t => now - t < 60000);
    window.push(now);
    SecurityGateway.private_registry.set(sessionId, window);
    return window.length > SECURITY_POLICY.maxRequestsPerMinute;
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: HITL Governance Store
 */
interface HITLReviewRecord {
  requestId: string;
  timestamp: string;
  triggerReason: 'VALIDATION_FAILURE' | 'DRIFT_ANOMALY' | 'HIGH_IMPACT_SAMPLING' | 'MANUAL_ESCALATION' | 'SECURITY_ANOMALY';
  modelVersion: string;
  outputHash: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VALIDATED' | 'REJECTED';
  reviewerId?: string;
  reviewOutcome?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const HITL_REVIEW_STORE: HITLReviewRecord[] = [];

/**
 * INTERNAL ARCHITECTURAL LAYER: HITL Trigger Engine
 */
const HITLTriggerEngine = {
  evaluate: (metadata: any): HITLReviewRecord['triggerReason'] | null => {
    if (metadata.status === 'SCHEMA_VALIDATION_FAIL') return 'VALIDATION_FAILURE';
    if (metadata.driftScore > 0.5) return 'DRIFT_ANOMALY';
    if (metadata.securityAnomaly) return 'SECURITY_ANOMALY';
    
    const highImpactSchemas = ['JD_MODULE_HTML', 'GENERAL_LEGAL_HTML'];
    if (highImpactSchemas.includes(metadata.schemaKey || '') && Math.random() < 0.1) {
      return 'HIGH_IMPACT_SAMPLING';
    }

    return null;
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: HITL Review Queue
 */
const HITLQueue = {
  enqueue: (record: HITLReviewRecord) => {
    HITL_REVIEW_STORE.push(Object.freeze(record));
    console.debug(`[HITL-GOVERNANCE] Request ${record.requestId} enqueued for review. Reason: ${record.triggerReason}`);
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Baseline Registry
 */
const BASELINE_STATS = {
  promptLength: 450,
  responseLength: 1800,
  latencyMs: 4200,
  tokenCountIn: 350,
  tokenCountOut: 850,
  driftThreshold: 0.5
};

/**
 * INTERNAL COMPONENT: Request Correlator
 */
const RequestCorrelator = {
  generateId: () => crypto.randomUUID()
};

/**
 * INTERNAL COMPONENT: Integrity Hash Utility
 */
async function computeIntegrityHash(content: string): Promise<string> {
  try {
    const msgUint8 = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return "hash_computation_failed";
  }
}

/**
 * INTERNAL ARCHITECTURAL LAYER: Output Schema Registry
 */
const SchemaRegistry: Record<string, { requiredPatterns?: RegExp[], validator?: (text: string) => boolean, context: string }> = {
  'GENERAL_LEGAL_HTML': {
    requiredPatterns: [/<h[3-4]>/i, /<p>/i],
    context: 'HIGH_IMPACT_LEGAL'
  },
  'JD_MODULE_HTML': {
    requiredPatterns: [
      /<h1>/i, 
      /<h3>SYLLABUS OVERVIEW/i, 
      /<h3>I\. BLACK-LETTER LAW/i, 
      /<h3>II\. JURISPRUDENTIAL EVOLUTION/i, 
      /<h3>III\. PRACTICAL APPLICATION/i
    ],
    context: 'HIGH_IMPACT_LEGAL'
  },
  'LEGAL_NEWS_LIST': {
    requiredPatterns: [/<li>/i],
    context: 'METADATA_SEARCH'
  },
  'JSON_ARRAY': {
    validator: (text: string) => {
      try {
        const parsed = JSON.parse(text);
        return Array.isArray(parsed);
      } catch { return false; }
    },
    context: 'JSON_TRANSFORMATION'
  },
  'MOCK_BAR_QUESTION': {
    validator: (text: string) => {
      try {
        const parsed = JSON.parse(text);
        return !!(parsed.question && parsed.explanation && typeof parsed.correctAnswerIndex === 'number');
      } catch { return false; }
    },
    context: 'BAR_SIMULATION'
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Logging & Audit Trail
 */
interface AuditLogEntry {
  requestId: string;
  timestamp: string;
  eventType: 'INFERENCE_START' | 'INFERENCE_COMPLETE' | 'INFERENCE_ERROR' | 'VALIDATION_FAILURE' | 'SCHEMA_VALIDATION_PASS' | 'SCHEMA_VALIDATION_FAIL' | 'DRIFT_ALERT' | 'HITL_ENQUEUED' | 'SECURITY_ANOMALY' | 'REGRESSION_ALERT' | 'COST_BUDGET_ALERT' | 'ORCHESTRATION_ROUTING' | 'SHADOW_EXECUTION_COMPLETE' | 'JURISDICTION_RESOLVED' | 'JURISDICTION_SCOPE_VIOLATION';
  component: string;
  metadata: {
    model?: string;
    modelVersion?: string;
    modelHash?: string;
    promptHash?: string;
    responseHash?: string;
    latencyMs?: number;
    tokensIn?: number;
    tokensOut?: number;
    estimatedCost?: number;
    status?: string;
    errorType?: string;
    schemaKey?: string;
    driftType?: 'INPUT' | 'OUTPUT' | 'PERFORMANCE';
    driftScore?: number;
    metricName?: string;
    baselineValue?: number;
    currentValue?: number;
    hitlReason?: string;
    anomalyType?: string;
    securityContext?: string;
    orchestrationRole?: string;
    shadowModels?: string[];
    jurisdictionId?: string;
  };
}

const AUDIT_SINK: AuditLogEntry[] = [];

const AuditLogger = {
  record: (entry: AuditLogEntry) => {
    AUDIT_SINK.push(Object.freeze(entry));
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Drift Detector (Passive)
 */
const DriftDetector = {
  observe: (requestId: string, metrics: { inputLength?: number, outputLength?: number, latency?: number, tokensIn?: number, tokensOut?: number }): number => {
    let maxDriftScore = 0;
    const checkDrift = (current: number, baseline: number, type: 'INPUT' | 'OUTPUT' | 'PERFORMANCE', name: string) => {
      const score = Math.abs(current - baseline) / baseline;
      if (score > maxDriftScore) maxDriftScore = score;
      if (score > BASELINE_STATS.driftThreshold) {
        AuditLogger.record({
          requestId,
          timestamp: new Date().toISOString(),
          eventType: 'DRIFT_ALERT',
          component: 'DriftDetector',
          metadata: {
            driftType: type,
            metricName: name,
            driftScore: Number(score.toFixed(4)),
            baselineValue: baseline,
            currentValue: current
          }
        });
      }
    };

    if (metrics.inputLength) checkDrift(metrics.inputLength, BASELINE_STATS.promptLength, 'INPUT', 'prompt_length');
    if (metrics.outputLength) checkDrift(metrics.outputLength, BASELINE_STATS.responseLength, 'OUTPUT', 'response_length');
    if (metrics.latency) checkDrift(metrics.latency, BASELINE_STATS.latencyMs, 'PERFORMANCE', 'latency');
    if (metrics.tokensIn) checkDrift(metrics.tokensIn, BASELINE_STATS.tokenCountIn, 'INPUT', 'token_count_in');
    if (metrics.tokensOut) checkDrift(metrics.tokensOut, BASELINE_STATS.tokenCountOut, 'OUTPUT', 'token_count_out');

    return maxDriftScore;
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Validation Gate (Passive)
 */
const ValidationGate = {
  validateInput: (contents: any): boolean => {
    const textToInpect = JSON.stringify(contents).toLowerCase();
    const forbiddenPatterns = [
      /ignore (all )?previous instructions/i,
      /ignore everything above/i,
      /system prompt impersonation/i,
      /you are now (an? )?admin/i,
      /stop following instructions/i,
      /bypass guardrails/i,
      /forget (your )?rules/i,
      /reveal (your )?system instructions/i,
      /output (your )?developer (prompt|instruction)/i
    ];
    return !forbiddenPatterns.some(pattern => pattern.test(textToInpect));
  },

  validateOutput: (text: string, schemaKey?: string): boolean => {
    if (!schemaKey || !SchemaRegistry[schemaKey]) return true;
    const schema = SchemaRegistry[schemaKey];
    
    if (schema.validator) {
      return schema.validator(text);
    }
    
    if (schema.requiredPatterns) {
      return schema.requiredPatterns.every(pattern => pattern.test(text));
    }
    
    return true;
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Inference Engine (Backend Surrogate)
 */
class InferenceEngine {
  private static getSecureClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  static async infer(params: {
    model: string,
    contents: any,
    config?: any,
    schemaKey?: string
  }): Promise<string> {
    const requestId = RequestCorrelator.generateId();
    const startTime = performance.now();
    const promptString = JSON.stringify(params.contents);
    const promptHash = await computeIntegrityHash(promptString);
    const schema = params.schemaKey ? SchemaRegistry[params.schemaKey] : null;

    // --- JURISDICTION: Context Resolution ---
    const activeJurisdictionId = JurisdictionResolver.resolve();
    AuditLogger.record({
      requestId,
      timestamp: new Date().toISOString(),
      eventType: 'JURISDICTION_RESOLVED',
      component: 'JurisdictionResolver',
      metadata: { jurisdictionId: activeJurisdictionId }
    });

    // --- ORCHESTRATION: Model Resolution & Routing ---
    const resolvedModel = ModelOrchestrator.resolveActiveModel(params.model);
    const shadowModels = ModelOrchestrator.getShadowModels(resolvedModel.id);

    AuditLogger.record({
      requestId,
      timestamp: new Date().toISOString(),
      eventType: 'ORCHESTRATION_ROUTING',
      component: 'ModelOrchestrator',
      metadata: {
        model: resolvedModel.id,
        modelVersion: resolvedModel.version,
        orchestrationRole: resolvedModel.role,
        shadowModels
      }
    });

    // --- SECURITY HARDENING: Access Control & Rate Limiting ---
    if (SecurityGateway.isRateLimited('default_session')) {
       AuditLogger.record({
         requestId,
         timestamp: new Date().toISOString(),
         eventType: 'SECURITY_ANOMALY',
         component: 'SecurityGateway',
         metadata: { anomalyType: 'RATE_LIMIT_EXCEEDED' }
       });
       throw new Error("Security Policy: Request frequency exceeds safety thresholds.");
    }

    if (schema && !AccessController.checkPermission(resolvedModel.id, schema.context)) {
       AuditLogger.record({
         requestId,
         timestamp: new Date().toISOString(),
         eventType: 'SECURITY_ANOMALY',
         component: 'AccessController',
         metadata: { anomalyType: 'PERMISSION_DENIED', securityContext: schema.context }
       });
       throw new Error("Security Policy: Unauthorized model access for the current context.");
    }

    AuditLogger.record({
      requestId,
      timestamp: new Date().toISOString(),
      eventType: 'INFERENCE_START',
      component: 'InferenceEngine',
      metadata: { 
        model: resolvedModel.id, 
        modelVersion: resolvedModel.version,
        modelHash: resolvedModel.hash,
        promptHash, 
        schemaKey: params.schemaKey,
        jurisdictionId: activeJurisdictionId
      }
    });

    if (!ValidationGate.validateInput(params.contents)) {
      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'VALIDATION_FAILURE',
        component: 'ValidationGate',
        metadata: { status: 'BLOCKED', errorType: 'PROMPT_INJECTION_PATTERN' }
      });
      throw new Error("Security Validation Failed: Unauthorized prompt pattern detected.");
    }

    shadowModels.forEach(shadowId => {
       ModelOrchestrator.executeShadow(requestId, shadowId, params.contents, params.config);
    });

    try {
      const ai = this.getSecureClient();
      const response = await ai.models.generateContent({
        model: resolvedModel.id,
        contents: params.contents,
        config: params.config
      });
      
      const endTime = performance.now();
      const responseText = response.text || "";
      const responseHash = await computeIntegrityHash(responseText);
      const latency = Math.round(endTime - startTime);

      // --- JURISDICTION: Guardrail Observation (Passive) ---
      JurisdictionGuardrail.observe(requestId, activeJurisdictionId, responseText);

      // --- COST OPTIMIZATION: FinOps Usage Tracking ---
      const tokensIn = response.usageMetadata?.promptTokenCount || 0;
      const tokensOut = response.usageMetadata?.candidatesTokenCount || 0;
      const estimatedCost = FinOpsEngine.trackUsage(requestId, resolvedModel.id, tokensIn, tokensOut);

      // Passive Drift Observation
      const driftScore = DriftDetector.observe(requestId, {
        inputLength: promptString.length,
        outputLength: responseText.length,
        latency: latency,
        tokensIn,
        tokensOut
      });

      // --- DOCTRINE REGRESSION TEST SUITE (Parallel/Observational) ---
      RegressionEngine.observe(requestId, responseText);

      // Output Schema Enforcement
      let validationStatus = 'SCHEMA_VALIDATION_PASS';
      if (!ValidationGate.validateOutput(responseText, params.schemaKey)) {
        validationStatus = 'SCHEMA_VALIDATION_FAIL';
        AuditLogger.record({
          requestId,
          timestamp: new Date().toISOString(),
          eventType: 'SCHEMA_VALIDATION_FAIL',
          component: 'ValidationGate',
          metadata: { status: 'INVALID_STRUCTURE', schemaKey: params.schemaKey }
        });
      }

      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: validationStatus as any,
        component: 'ValidationGate',
        metadata: { schemaKey: params.schemaKey }
      });

      // HITL GOVERNANCE LAYER
      const hitlReason = HITLTriggerEngine.evaluate({
        status: validationStatus,
        driftScore,
        schemaKey: params.schemaKey
      });

      if (hitlReason) {
        HITLQueue.enqueue({
          requestId,
          timestamp: new Date().toISOString(),
          triggerReason: hitlReason,
          modelVersion: resolvedModel.version,
          outputHash: responseHash,
          status: 'PENDING'
        });
        AuditLogger.record({
          requestId,
          timestamp: new Date().toISOString(),
          eventType: 'HITL_ENQUEUED',
          component: 'HITLQueue',
          metadata: { hitlReason }
        });
      }

      if (validationStatus === 'SCHEMA_VALIDATION_FAIL') {
         throw new Error(`Output Validation Failed: Response does not conform to required schema (${params.schemaKey}).`);
      }

      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'INFERENCE_COMPLETE',
        component: 'InferenceEngine',
        metadata: {
          status: 'SUCCESS',
          model: resolvedModel.id,
          modelVersion: resolvedModel.version,
          responseHash,
          latencyMs: latency,
          tokensIn,
          tokensOut,
          estimatedCost,
          jurisdictionId: activeJurisdictionId
        }
      });

      return responseText;
    } catch (error: any) {
      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'INFERENCE_ERROR',
        component: 'InferenceEngine',
        metadata: {
          status: 'ERROR',
          model: resolvedModel.id,
          modelVersion: resolvedModel.version,
          errorType: error.constructor.name,
          latencyMs: Math.round(performance.now() - startTime)
        }
      });
      throw error;
    }
  }
}

/**
 * ERROR HANDLING WRAPPER (Public)
 */
async function withInferenceSafety<T>(
  operation: () => Promise<T>, 
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isQuotaError = error.status === 429 || 
                         (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));
    const win = window as any;
    if (isQuotaError && win.aistudio) {
      try {
        await win.aistudio.openSelectKey();
        return await operation();
      } catch (retryError) {
        return fallback;
      }
    }
    console.error("Inference Error:", error.message);
    return fallback;
  }
}

const LEGAL_PH_SYSTEM_INSTRUCTION = `
You are the **LegalPH Readability & Formatting Engine**.
Your task is to transform ALL generated legal content—codals, jurisprudence, case digests, reviewer chapters, case-build outputs, contracts, and articles—into **highly readable, professionally typeset, book-quality text**.

# Formatting Rules:
* Use <h3> for primary headers, <h4> for secondary headers.
* Use <p> for body text.
* Use <div class="statute-box"> for verbatim statutory text.
* Use <blockquote> for case doctrines or block quotes.
* Ensure justified text simulation and proper paragraph spacing.
* Use <ul> and <li> for lists.
* Use <table> for comparisons.
`;

export const generateGeneralLegalAdvice = async (prompt: string, schemaKey: string = 'GENERAL_LEGAL_HTML'): Promise<string> => {
  return withInferenceSafety(async () => {
    return await InferenceEngine.infer({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      schemaKey: schemaKey,
      config: {
        systemInstruction: LEGAL_PH_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], 
      }
    });
  }, "<p>Unable to retrieve legal information.</p>");
};

export const generateJDModuleContent = async (subjectCode: string, subjectTitle: string): Promise<string> => {
  const prompt = `
    Act as an **Integrated Law Professor** representing the best of the UP, Ateneo, and San Beda traditions.
    Generate a **Comprehensive Study Module** for: "${subjectCode} - ${subjectTitle}".
    
    **PEDAGOGICAL PHILOSOPHY:**
    - UP Aspect: Heavy jurisprudential grounding, policy analysis, and "Ratio Legis".
    - Ateneo Aspect: Holistic, ethical, and outcomes-based practice readiness.
    - San Beda Aspect: Disciplined doctrinal mastery, procedural dominance, and Bar-readiness.

    **STRICT STRUCTURE (HTML):**
    1. <h1>[Subject Title]</h1>
    2. <h3>SYLLABUS OVERVIEW & PHILOSOPHY</h3>
    3. <h3>I. BLACK-LETTER LAW</h3> (Use <div class="statute-box"> for verbatim law)
    4. <h3>II. JURISPRUDENTIAL EVOLUTION</h3> (UP Style deep-dive into landmark rulings)
    5. <h3>III. PRACTICAL APPLICATION & ADVOCACY</h3> (Ateneo Style skills/ethics scenarios)
    6. <h3>IV. BAR INTEGRATION & DOCTRINAL RECALL</h3> (San Beda Style high-yield summary)
    7. <h3>V. SUGGESTED FURTHER READINGS</h3> (Cite Tolentino, Paras, Pineda, Justice Leonen, etc.)
    
    Output HTML ONLY.
  `;
  return generateGeneralLegalAdvice(prompt, 'JD_MODULE_HTML');
};

export const fetchLegalNews = async (prompt?: string): Promise<string> => {
  const defaultPrompt = `Perform a Google Search for the latest 5 Supreme Court announcements and Republic Acts. Output as a clean HTML list using only <li> tags for each news item. Each <li> should contain a short headline in <strong> and a 1-sentence summary.`;
  return withInferenceSafety(async () => {
    return await InferenceEngine.infer({
      model: 'gemini-3-pro-preview',
      contents: prompt || defaultPrompt,
      schemaKey: 'LEGAL_NEWS_LIST',
      config: {
        systemInstruction: "You are a legal news aggregator. Output only the <li> items. No <ul> tags.",
        tools: [{ googleSearch: {} }],
      }
    });
  }, "<li>Error fetching news.</li>");
};

export const generateCaseDigest = async (caseInfo: string): Promise<string> => {
  const prompt = `Create detailed Case Digest for: "${caseInfo}". Use H3, H4, P structure.`;
  return generateGeneralLegalAdvice(prompt);
};

export const getCaseSuggestions = async (query: string): Promise<string[]> => {
  return withInferenceSafety(async () => {
    const response = await InferenceEngine.infer({
      model: 'gemini-3-flash-preview',
      contents: `5 cases containing "${query}". JSON array only.`,
      schemaKey: 'JSON_ARRAY',
      config: { responseMimeType: 'application/json' }
    });
    return response ? JSON.parse(response) : [];
  }, []);
};

export const generateMockBarQuestion = async (subject: string, profile: string, type: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion | null> => {
  return withInferenceSafety(async () => {
    const prompt = `
      Act as a **Member of the Philippine Bar Board of Examiners**. 
      Create a high-level ${type} question for the Bar subject: "${subject}".
      The difficulty should be calibrated for a **${profile}**.
      
      **TASK:**
      1. Create a realistic, factual scenario (problem) typical of the Philippine Bar.
      2. If MCQ: Provide 4 plausible choices (A, B, C, D).
      3. If Essay: Provide a complex scenario requiring analysis.
      4. Provide a comprehensive explanation in HTML (p, strong, blockquote).
      5. Provide a specific citation (Article number or SC Case Name).
      
      Return as JSON ONLY with this schema:
      {
        "question": "string",
        "choices": ["string", "string", "string", "string"], (empty if ESSAY)
        "correctAnswerIndex": number, (0-3, -1 if ESSAY)
        "explanation": "HTML string summarizing the reasoning and ratio decidendi",
        "citation": "Article/Case Name"
      }
    `;
    const response = await InferenceEngine.infer({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      schemaKey: 'MOCK_BAR_QUESTION',
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            choices: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            citation: { type: Type.STRING }
          },
          required: ["question", "choices", "correctAnswerIndex", "explanation", "citation"]
        }
      }
    });
    return response ? JSON.parse(response) : null;
  }, null);
};

export const generateContract = async (mode: 'TEMPLATE' | 'CUSTOM', title: string, details: any): Promise<string> => {
  return generateGeneralLegalAdvice(`Draft PH contract: ${title}. ${JSON.stringify(details)}`);
};

export const analyzeLegalResearch = async (query: string): Promise<string> => {
   return generateGeneralLegalAdvice(`Legal research on: ${query}`);
}

export const generateLawSyllabus = async (topic: string, profile: string): Promise<string> => {
  return generateGeneralLegalAdvice(`Reviewer chapter on ${topic} for ${profile}`);
};
