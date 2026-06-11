import { localizeContent } from "../localizedContent";
import type { Locale } from "../translations";

export function getEvaluationHealthContent(locale: Locale) {
  const t = (ptBr: string, en: string, ptPt?: string) =>
    localizeContent(locale, ptBr, en, ptPt);

  return {
    eyebrow: t("Diagnóstico de confiabilidade", "Reliability diagnostics"),
    title: t("Health do Sistema", "System Health"),
    description: t(
      "Diagnóstico de confiabilidade do ecossistema Velaris e do agente Abraxos, considerando cobertura de conhecimento, consistência do catálogo, rastreabilidade das fontes, validação das respostas, perspectivas profissionais e riscos de alucinação.",
      "Reliability diagnostics for the Velaris ecosystem and the Abraxos agent, covering knowledge coverage, catalog consistency, source traceability, response validation, professional perspectives and hallucination risk.",
    ),
    overall: {
      label: t("Saúde geral do design system", "Overall design system health"),
      description: t(
        "O sistema apresenta boa maturidade geral, com lacunas ainda concentradas em cobertura de evidências, validação de respostas e consistência entre catálogo, RAG e frontend.",
        "The system shows solid overall maturity, with remaining gaps concentrated in evidence coverage, response validation and consistency across catalog, RAG and frontend.",
      ),
      scoreLabel: t("Score geral", "Overall score"),
      scoreSr: t("Score geral: {score} por cento", "Overall score: {score} percent"),
    },
    timeline: {
      title: t("Evolução temporal", "Temporal evolution"),
      score: t("Score", "Score"),
    },
    metricsGrid: {
      title: t("Indicadores por dimensão", "Dimension indicators"),
    },
    statuses: {
      healthy: t("Saudável", "Healthy"),
      attention: t("Atenção", "Attention"),
      critical: t("Crítico", "Critical"),
      evolving: t("Em evolução", "Evolving"),
    },
    trends: {
      improving: t("Melhorando", "Improving"),
      stable: t("Estável", "Stable"),
      declining: t("Em queda", "Declining"),
    },
    metrics: {
      rag: {
        label: t("RAG Health", "RAG Health"),
        description: t(
          "Recuperação semântica, relevância por page_type e cobertura do corpus indexado.",
          "Semantic retrieval, page_type relevance and indexed corpus coverage.",
        ),
      },
      catalog: {
        label: t("Catalog Health", "Catalog Health"),
        description: t(
          "Consistência entre catálogo canônico, metadados e superfície de componentes no frontend.",
          "Consistency between canonical catalog, metadata and component surface in the frontend.",
        ),
      },
      attribution: {
        label: t("Source Attribution Health", "Source Attribution Health"),
        description: t(
          "Rastreabilidade entre afirmações, trechos recuperados e decisões explicadas.",
          "Traceability between claims, retrieved chunks and explained decisions.",
        ),
      },
      perspectives: {
        label: t("Perspective Coverage", "Perspective Coverage"),
        description: t(
          "Profundidade e paridade das sete perspectivas profissionais do Abraxos.",
          "Depth and parity of Abraxos's seven professional perspectives.",
        ),
      },
      validation: {
        label: t("Response Validation", "Response Validation"),
        description: t(
          "Gates de validação, deduplicação e integridade antes da resposta final.",
          "Validation gates, deduplication and integrity before the final response.",
        ),
      },
      unknownComponents: {
        label: t("Unknown Component Handling", "Unknown Component Handling"),
        description: t(
          "Detecção e contenção de recomendações para componentes inexistentes ou não catalogados.",
          "Detection and containment of recommendations for nonexistent or uncatalogued components.",
        ),
      },
      calibration: {
        label: t("Confidence Calibration", "Confidence Calibration"),
        description: t(
          "Alinhamento entre confiança exibida e força real da evidência recuperada.",
          "Alignment between displayed confidence and actual retrieved evidence strength.",
        ),
      },
      evidenceGaps: {
        label: t("Evidence Gaps", "Evidence Gaps"),
        description: t(
          "Lacunas de evidência forte, trade-offs não documentados e decisões órfãs.",
          "Strong evidence gaps, undocumented trade-offs and orphan decisions.",
        ),
      },
      governance: {
        label: t("Governance Health", "Governance Health"),
        description: t(
          "Alertas de governança, duplicações, tokens órfãos e prontidão de adoção.",
          "Governance alerts, duplications, orphan tokens and adoption readiness.",
        ),
      },
      accessibility: {
        label: t("Accessibility Checks", "Accessibility Checks"),
        description: t(
          "Cobertura de regras de acessibilidade, estados de foco e contraste nos componentes.",
          "Coverage of accessibility rules, focus states and contrast in components.",
        ),
      },
    },
    alerts: {
      title: t("Principais alertas", "Key alerts"),
      items: {
        edgeCases: t(
          "Componentes sem cobertura completa de edge cases.",
          "Components without full edge-case coverage.",
        ),
        perspectives: t(
          "Perspectivas profissionais com profundidade desigual.",
          "Professional perspectives with uneven depth.",
        ),
        tradeoffs: t(
          "Lacunas em evidências de trade-offs.",
          "Gaps in trade-off evidence.",
        ),
        parity: t(
          "Necessidade de testes de paridade entre catálogo, RAG e frontend.",
          "Need for parity tests across catalog, RAG and frontend.",
        ),
        empirical: t(
          "Validação empírica com usuários ainda pendente.",
          "Empirical validation with users still pending.",
        ),
      },
    },
    measures: {
      title: t("O que este Health mede", "What this Health measures"),
      caption: t(
        "Cada indicador responde a uma pergunta operacional sobre a maturidade do Velaris e do Abraxos.",
        "Each indicator answers an operational question about Velaris and Abraxos maturity.",
      ),
      labels: {
        knowledge: t("Cobertura de conhecimento", "Knowledge coverage"),
        rag: t("Relevância do RAG", "RAG relevance"),
        catalog: t("Consistência do catálogo", "Catalog consistency"),
        hallucination: t("Contenção de alucinação", "Hallucination containment"),
        perspectives: t("Profundidade de perspectivas", "Perspective depth"),
        traceability: t("Rastreabilidade", "Traceability"),
        confidence: t("Calibração de confiança", "Confidence calibration"),
      },
      items: {
        knowledge: t(
          "Se o conhecimento do design system está coberto de forma suficiente para responder com segurança.",
          "Whether design system knowledge is covered sufficiently to answer safely.",
        ),
        rag: t(
          "Se o RAG recupera fontes relevantes para a intenção e a perspectiva ativa.",
          "Whether RAG retrieves relevant sources for the intent and active perspective.",
        ),
        catalog: t(
          "Se o catálogo canônico está consistente com documentação, metadados e implementação.",
          "Whether the canonical catalog is consistent with documentation, metadata and implementation.",
        ),
        hallucination: t(
          "Se o Abraxos evita recomendar componentes inexistentes ou fora do catálogo.",
          "Whether Abraxos avoids recommending nonexistent or off-catalog components.",
        ),
        perspectives: t(
          "Se as perspectivas profissionais possuem cobertura e profundidade suficientes.",
          "Whether professional perspectives have sufficient coverage and depth.",
        ),
        traceability: t(
          "Se há rastreabilidade entre resposta, fonte e decisão registrada.",
          "Whether there is traceability between response, source and recorded decision.",
        ),
        confidence: t(
          "Se a confiança exibida está calibrada com a força da evidência.",
          "Whether displayed confidence is calibrated to evidence strength.",
        ),
      },
    },
    governanceAgent: {
      eyebrow: t("Governança proativa", "Proactive governance"),
      title: t("Governance Agent", "Governance Agent"),
      command: "/governance",
      modeBadge: t("Modo investigativo", "Investigative mode"),
      description: t(
        "Analisa continuamente o catálogo e identifica problemas de governança de forma proativa.",
        "Continuously analyzes the catalog and proactively identifies governance issues.",
      ),
      whenToUse: t("Quando usar", "When to use"),
      whenToUseBody: t(
        "Quando o maintainer precisa de um scan automático de duplicações, lacunas, tokens órfãos e inconsistências.",
        "When a maintainer needs an automatic scan for duplications, gaps, orphan tokens and inconsistencies.",
      ),
      exampleInput: t("Entrada de exemplo", "Example input"),
      expectedOutput: t("Saída esperada", "Expected output"),
      expectedOutputBody: t(
        "Governance Alerts com severidade, impacto, entidades afetadas, recomendação e prioridade.",
        "Governance Alerts with severity, impact, affected entities, recommendation and priority.",
      ),
      ragEvidence: t("Evidência RAG", "RAG evidence"),
      ragEvidenceBody: t(
        "component-metadata.json, registry de tokens, guidelines, aliases e corpus RAG.",
        "component-metadata.json, token registry, guidelines, aliases and RAG corpus.",
      ),
      combinesWith: t("Combina com habilidades", "Combines with skills"),
      combinesWithBody: t(
        "Governance Readiness Check, Knowledge Gap, Contract Check",
        "Governance Readiness Check, Knowledge Gap, Contract Check",
      ),
      openDashboard: t("Abrir dashboard de Governance Alerts", "Open Governance Alerts dashboard"),
      runInOracle: t("Executar /governance no Oráculo", "Run /governance in the Oracle"),
    },
    research: {
      title: t("Ferramentas de pesquisa", "Research tools"),
      caption: t(
        "Superfícies avançadas para auditoria de conhecimento, laboratório de inteligência e governança proativa do catálogo.",
        "Advanced surfaces for knowledge auditing, intelligence lab workflows and proactive catalog governance.",
      ),
      surfaces: {
        knowledgeHealth: {
          label: t("Knowledge Health", "Knowledge Health"),
          description: t(
            "Auditoria de cobertura, lacunas e consistência do corpus RAG.",
            "Coverage, gap and RAG corpus consistency audit.",
          ),
        },
        intelligenceLab: {
          label: t("Intelligence Lab", "Intelligence Lab"),
          description: t(
            "Experimentação e validação de capacidades cognitivas do Abraxos.",
            "Experimentation and validation of Abraxos cognitive capabilities.",
          ),
        },
        governance: {
          label: t("Governance", "Governance"),
          description: t(
            "Alertas proativos de duplicação, inconsistência e risco no catálogo.",
            "Proactive alerts for duplication, inconsistency and catalog risk.",
          ),
        },
      },
    },
  };
}
