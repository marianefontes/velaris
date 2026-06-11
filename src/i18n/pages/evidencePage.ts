import type { Locale } from "../translations";
import { localizeContent } from "../localizedContent";

const text = (locale: Locale, ptBr: string, en: string, ptPt?: string) =>
  localizeContent(locale, ptBr, en, ptPt);

export function getEvidencePageContent(locale: Locale) {
  const t = (ptBr: string, en: string, ptPt?: string) => text(locale, ptBr, en, ptPt);

  return {
    eyebrow: t("Epistemologia do Velaris", "Velaris epistemology", "Epistemologia do Velaris"),
    titleLead: t("Evidências", "Evidence", "Evidências"),
    titleAccent: t("e confiança", "and trust", "e confiança"),
    description: t(
      "Como o sistema valida conhecimento antes de recomendar. Esta seção define os critérios pelos quais o Abraxos decide se uma afirmação pode ser sustentada — sem depender de implementação, banco vetorial ou código.",
      "How the system validates knowledge before recommending. This section defines the criteria by which Abraxos decides whether a claim can be sustained — without relying on implementation, vector stores or code.",
      "Como o sistema valida conhecimento antes de recomendar. Esta secção define os critérios pelos quais o Abraxos decide se uma afirmação pode ser sustentada — sem depender de implementação, base vetorial ou código.",
    ),
    noteLabel: t("Pergunta central", "Central question", "Pergunta central"),
    note: t(
      "Como sabemos que algo é verdadeiro no Velaris?",
      "How do we know something is true in Velaris?",
      "Como sabemos que algo é verdadeiro no Velaris?",
    ),
    metrics: [
      { label: t("Níveis de evidência", "Evidence levels", "Níveis de evidência"), value: "4" },
      { label: t("Dimensões separadas", "Separate dimensions", "Dimensões separadas"), value: "2" },
      { label: t("Contrato anti-alucinação", "Anti-hallucination contract", "Contrato anti-alucinação"), value: t("ativo", "active", "ativo") },
    ],
    hierarchy: {
      eyebrow: t("Hierarquia", "Hierarchy", "Hierarquia"),
      title: t("Hierarquia de evidência", "Evidence hierarchy", "Hierarquia de evidência"),
      description: t(
        "Recomendações não possuem o mesmo peso. O Velaris classifica o suporte disponível antes de formular qualquer orientação.",
        "Recommendations do not carry equal weight. Velaris classifies available support before formulating any guidance.",
        "Recomendações não possuem o mesmo peso. O Velaris classifica o suporte disponível antes de formular qualquer orientação.",
      ),
      tiers: [
        {
          id: "strong",
          label: t("Evidência forte", "Strong evidence", "Evidência forte"),
          summary: t(
            "Correspondência direta com o catálogo oficial ou documentação canônica do Velaris. Sustenta recomendações firmes.",
            "Direct match with the official catalog or canonical Velaris documentation. Supports firm recommendations.",
            "Correspondência direta com o catálogo oficial ou documentação canónica do Velaris. Sustenta recomendações firmes.",
          ),
        },
        {
          id: "partial",
          label: t("Evidência parcial", "Partial evidence", "Evidência parcial"),
          summary: t(
            "Suporte presente, mas incompleto — documentação parcial, correspondência aproximada ou cobertura limitada. Exige linguagem cautelosa.",
            "Support is present but incomplete — partial documentation, approximate match or limited coverage. Requires cautious language.",
            "Suporte presente, mas incompleto — documentação parcial, correspondência aproximada ou cobertura limitada. Exige linguagem cautelosa.",
          ),
        },
        {
          id: "inferred",
          label: t("Evidência inferida", "Inferred evidence", "Evidência inferida"),
          summary: t(
            "Conclusão derivada de padrões adjacentes ou contexto recuperado, sem afirmação direta no corpus. Deve ser declarada como inferência, nunca como fato.",
            "Conclusion derived from adjacent patterns or retrieved context, without a direct corpus assertion. Must be declared as inference, never as fact.",
            "Conclusão derivada de padrões adjacentes ou contexto recuperado, sem afirmação direta no corpus. Deve ser declarada como inferência, nunca como facto.",
          ),
        },
        {
          id: "absent",
          label: t("Evidência ausente", "Absent evidence", "Evidência ausente"),
          summary: t(
            "Nenhum suporte verificável no catálogo ou na documentação indexada. O sistema deve declarar desconhecimento em vez de preencher a lacuna.",
            "No verifiable support in the catalog or indexed documentation. The system must declare ignorance rather than fill the gap.",
            "Nenhum suporte verificável no catálogo ou na documentação indexada. O sistema deve declarar desconhecimento em vez de preencher a lacuna.",
          ),
        },
      ],
    },
    confidence: {
      eyebrow: t("Separação conceitual", "Conceptual separation", "Separação conceptual"),
      title: t("Confiança ≠ evidência", "Confidence ≠ evidence", "Confiança ≠ evidência"),
      description: t(
        "Alta confiança não significa evidência forte. Baixa confiança não significa resposta errada. O Velaris mantém duas dimensões independentes.",
        "High confidence does not mean strong evidence. Low confidence does not mean a wrong answer. Velaris maintains two independent dimensions.",
        "Alta confiança não significa evidência forte. Baixa confiança não significa resposta errada. O Velaris mantém duas dimensões independentes.",
      ),
      dimensions: [
        {
          label: t("Força da evidência", "Evidence strength", "Força da evidência"),
          body: t(
            "O grau em que o corpus sustenta a afirmação — forte, parcial, inferida ou ausente.",
            "The degree to which the corpus supports the claim — strong, partial, inferred or absent.",
            "O grau em que o corpus sustenta a afirmação — forte, parcial, inferida ou ausente.",
          ),
        },
        {
          label: t("Confiança da resposta", "Answer confidence", "Confiança da resposta"),
          body: t(
            "O rótulo comunicado ao usuário (alta, média, baixa ou indeterminada) com justificativa textual — nunca inventado, nunca confundido com similaridade de recuperação.",
            "The label communicated to the user (high, medium, low or undetermined) with textual rationale — never invented, never confused with retrieval similarity.",
            "O rótulo comunicado ao utilizador (alta, média, baixa ou indeterminada) com justificativa textual — nunca inventado, nunca confundido com similaridade de recuperação.",
          ),
        },
      ],
      insight: t(
        "Uma resposta pode ser correta com confiança moderada quando a evidência é parcial. Uma resposta com tom assertivo e evidência ausente é uma violação do contrato do sistema.",
        "An answer can be correct with moderate confidence when evidence is partial. An assertive answer with absent evidence is a system contract violation.",
        "Uma resposta pode ser correta com confiança moderada quando a evidência é parcial. Uma resposta com tom assertivo e evidência ausente é uma violação do contrato do sistema.",
      ),
    },
    unknown: {
      eyebrow: t("Entidades desconhecidas", "Unknown entities", "Entidades desconhecidas"),
      title: t("Tratamento de componentes ausentes", "Unknown component handling", "Tratamento de componentes ausentes"),
      description: t(
        "Quando uma entidade não existe no catálogo Velaris, o sistema não inventa, não assume e não extrapola.",
        "When an entity does not exist in the Velaris catalog, the system does not invent, assume or extrapolate.",
        "Quando uma entidade não existe no catálogo Velaris, o sistema não inventa, não assume e não extrapola.",
      ),
      rules: [
        t("Declarar ausência de evidência com mensagem de limite explícita", "Declare absent evidence with an explicit boundary message", "Declarar ausência de evidência com mensagem de limite explícita"),
        t("Não recomendar a entidade inexistente como se fosse canônica", "Do not recommend the non-existent entity as if it were canonical", "Não recomendar a entidade inexistente como se fosse canónica"),
        t("Sugerir alternativas internas apenas quando validadas no catálogo", "Suggest internal alternatives only when validated in the catalog", "Sugerir alternativas internas apenas quando validadas no catálogo"),
        t("Bloquear comparações entre entidade suportada e entidade desconhecida", "Block comparisons between a supported entity and an unknown one", "Bloquear comparações entre entidade suportada e entidade desconhecida"),
      ],
      example: {
        label: t("Exemplo", "Example", "Exemplo"),
        entity: "SideDrawer",
        response: t(
          "«Não encontrei evidência de SideDrawer no catálogo atual.» — o sistema informa a lacuna em vez de descrever um componente inexistente.",
          "«No evidence of SideDrawer was found in the current catalog.» — the system reports the gap instead of describing a non-existent component.",
          "«Não encontrei evidência de SideDrawer no catálogo atual.» — o sistema informa a lacuna em vez de descrever um componente inexistente.",
        ),
      },
    },
    attribution: {
      eyebrow: t("Rastreabilidade", "Traceability", "Rastreabilidade"),
      title: t("Atribuição de fontes", "Source attribution", "Atribuição de fontes"),
      description: t(
        "Toda recomendação deve ser rastreável. O usuário precisa saber de onde veio o suporte — não apenas o que foi recomendado.",
        "Every recommendation must be traceable. The user needs to know where support came from — not just what was recommended.",
        "Toda recomendação deve ser rastreável. O utilizador precisa saber de onde veio o suporte — não apenas o que foi recomendado.",
      ),
      sources: [
        { label: t("Componente", "Component", "Componente"), detail: t("Documentação de uso, props e estados no catálogo", "Usage documentation, props and states in the catalog", "Documentação de uso, props e estados no catálogo") },
        { label: t("Guideline", "Guideline", "Guideline"), detail: t("Princípios e diretrizes do manifesto Velaris", "Principles and guidelines from the Velaris manifesto", "Princípios e diretrizes do manifesto Velaris") },
        { label: t("Decisão", "Decision", "Decisão"), detail: t("Registros de decisão de design (DEC) na memória organizacional", "Design decision records (DEC) in organizational memory", "Registos de decisão de design (DEC) na memória organizacional") },
        { label: t("Padrão", "Pattern", "Padrão"), detail: t("Blueprints de interação documentados em Fundamentos", "Interaction blueprints documented in Foundations", "Blueprints de interação documentados em Fundamentos") },
        { label: t("Documento", "Document", "Documento"), detail: t("Páginas do corpus oficial indexadas como evidência", "Official corpus pages indexed as evidence", "Páginas do corpus oficial indexadas como evidência") },
      ],
    },
    gaps: {
      eyebrow: t("Governança do conhecimento", "Knowledge governance", "Governança do conhecimento"),
      title: t("Lacunas de evidência", "Evidence gaps", "Lacunas de evidência"),
      description: t(
        "Identificar o que falta é parte da governança — não um defeito oculto. O sistema consegue nomear ausências antes que se tornem alucinações.",
        "Identifying what is missing is part of governance — not a hidden defect. The system can name absences before they become hallucinations.",
        "Identificar o que falta é parte da governança — não um defeito oculto. O sistema consegue nomear ausências antes que se tornem alucinações.",
      ),
      gapTypes: [
        { label: t("Documentação ausente", "Missing documentation", "Documentação ausente"), detail: t("Componente ou token sem cobertura mínima", "Component or token without minimum coverage", "Componente ou token sem cobertura mínima") },
        { label: t("Exemplos ausentes", "Missing examples", "Exemplos ausentes"), detail: t("Entidade documentada sem caso de uso demonstrado", "Documented entity without a demonstrated use case", "Entidade documentada sem caso de uso demonstrado") },
        { label: t("Edge cases ausentes", "Missing edge cases", "Edge cases ausentes"), detail: t("Comportamento não coberto em estados extremos", "Behavior not covered in extreme states", "Comportamento não coberto em estados extremos") },
        { label: t("Cobertura parcial", "Partial coverage", "Cobertura parcial"), detail: t("Campos preenchidos de forma incompleta ou com proveniência fraca", "Fields filled incompletely or with weak provenance", "Campos preenchidos de forma incompleta ou com proveniência fraca") },
      ],
    },
    tokenEfficiency: {
      eyebrow: t("Evidência operacional", "Operational evidence", "Evidência operacional"),
      title: t("Eficiência de Tokens", "Token Efficiency", "Eficiência de Tokens"),
      description: t(
        "Mede a capacidade do Abraxos de utilizar apenas o contexto necessário para responder, reduzindo custo, latência e ruído no processamento.",
        "Measures Abraxos's ability to use only the context required to answer, reducing cost, latency and processing noise.",
        "Mede a capacidade do Abraxos de utilizar apenas o contexto necessário para responder, reduzindo custo, latência e ruído no processamento.",
      ),
      score: 76,
      scoreLabel: t("Indicador", "Indicator", "Indicador"),
      scoreSr: t("Indicador de eficiência de tokens: {score} por cento", "Token efficiency indicator: {score} percent", "Indicador de eficiência de tokens: {score} por cento"),
      status: t("Em evolução", "Evolving", "Em evolução"),
      trend: t("Melhorando", "Improving", "A melhorar"),
      detail: t(
        "Abraxos prioriza recuperação seletiva de evidências, respostas determinísticas e uso de metadados antes de recorrer à geração livre. Essa abordagem reduz o consumo de tokens, melhora a velocidade das respostas e evita que o modelo receba contexto desnecessário ou redundante.",
        "Abraxos prioritizes selective evidence retrieval, deterministic responses and metadata use before resorting to free generation. This approach reduces token consumption, improves response speed and prevents the model from receiving unnecessary or redundant context.",
        "Abraxos prioriza recuperação seletiva de evidências, respostas determinísticas e uso de metadados antes de recorrer à geração livre. Esta abordagem reduz o consumo de tokens, melhora a velocidade das respostas e evita que o modelo receba contexto desnecessário ou redundante.",
      ),
      strategiesTitle: t("Como Abraxos economiza tokens", "How Abraxos saves tokens", "Como o Abraxos economiza tokens"),
      strategies: [
        {
          id: "selective",
          label: t("Busca seletiva", "Selective retrieval", "Pesquisa seletiva"),
          description: t(
            "Recupera apenas os chunks mais relevantes para a intenção detectada.",
            "Retrieves only the chunks most relevant to the detected intent.",
            "Recupera apenas os chunks mais relevantes para a intenção detetada.",
          ),
        },
        {
          id: "deterministic",
          label: t("Respostas determinísticas", "Deterministic responses", "Respostas determinísticas"),
          description: t(
            "Utiliza regras, catálogo e metadados quando a resposta não exige geração livre.",
            "Uses rules, catalog and metadata when the answer does not require free generation.",
            "Utiliza regras, catálogo e metadados quando a resposta não exige geração livre.",
          ),
        },
        {
          id: "compact",
          label: t("Contexto compacto", "Compact context", "Contexto compacto"),
          description: t(
            "Evita enviar documentação completa ao modelo quando uma evidência específica é suficiente.",
            "Avoids sending full documentation to the model when a specific piece of evidence is sufficient.",
            "Evita enviar documentação completa ao modelo quando uma evidência específica é suficiente.",
          ),
        },
        {
          id: "noise",
          label: t("Menos ruído", "Less noise", "Menos ruído"),
          description: t(
            "Reduz chunks duplicados ou semanticamente fracos antes da resposta final.",
            "Reduces duplicate or semantically weak chunks before the final response.",
            "Reduz chunks duplicados ou semanticamente fracos antes da resposta final.",
          ),
        },
        {
          id: "scale",
          label: t("Escalabilidade", "Scalability", "Escalabilidade"),
          description: t(
            "Prepara o agente para lidar com design systems maiores sem aumentar custo e latência de forma descontrolada.",
            "Prepares the agent to handle larger design systems without uncontrolled cost and latency growth.",
            "Prepara o agente para lidar com design systems maiores sem aumentar custo e latência de forma descontrolada.",
          ),
        },
      ],
    },
    contract: {
      eyebrow: t("Contrato do sistema", "System contract", "Contrato do sistema"),
      title: t("Contrato anti-alucinação", "Anti-hallucination contract", "Contrato anti-alucinação"),
      description: t(
        "O Velaris prioriza admitir desconhecimento, declarar limitações e mostrar lacunas antes de inventar informações.",
        "Velaris prioritizes admitting ignorance, declaring limitations and surfacing gaps before inventing information.",
        "O Velaris prioriza admitir desconhecimento, declarar limitações e mostrar lacunas antes de inventar informações.",
      ),
      principles: [
        t("Não inventar componentes, tokens, props ou decisões", "Do not invent components, tokens, props or decisions", "Não inventar componentes, tokens, props ou decisões"),
        t("Não apresentar similaridade de recuperação como confiança da resposta", "Do not present retrieval similarity as answer confidence", "Não apresentar similaridade de recuperação como confiança da resposta"),
        t("Não expor marcadores internos de auditoria ao usuário", "Do not expose internal audit markers to the user", "Não expor marcadores internos de auditoria ao utilizador"),
        t("Bloquear recomendações firmes quando a evidência é ausente", "Block firm recommendations when evidence is absent", "Bloquear recomendações firmes quando a evidência é ausente"),
        t("Preferir mensagens de limite explícitas a respostas genéricas plausíveis", "Prefer explicit boundary messages over plausible generic answers", "Preferir mensagens de limite explícitas a respostas genéricas plausíveis"),
      ],
    },
  };
}
