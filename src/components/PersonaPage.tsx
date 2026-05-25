import { useMemo } from "react";
import {
  Activity,
  BadgeCheck,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Compass,
  Construction,
  FileQuestion,
  Group,
  Lightbulb,
  MessageSquareQuote,
  Target,
  Timer,
  UserRound,
  Verified,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface MetaItem {
  label: string;
  value: string;
  detail?: string;
}

interface GoalItem {
  title: string;
  text: string;
}

interface FrustrationItem {
  title: string;
  severity: string;
  width: string;
  tone: string;
  text: string;
}

interface SecondaryPersona {
  title: string;
  level: string;
  text: string;
  tone: string;
}

interface JourneyStep {
  moment: string;
  tag: string;
  title: string;
  text: string;
}

interface OracleCapability {
  title: string;
  tag: string;
  text: string;
  tone: string;
}

interface LiteratureQuote {
  text: string;
  source: string;
  tone: string;
}

interface AdditionalPersona {
  id: string;
  name: string;
  role: string;
  chips: [string, string, string];
  trustLabel: string;
  trustValue: string;
  trustWidth: string;
  trustColor: string;
  quote: string;
  goals: { title: string; text: string }[];
  frustrations: { title: string; severity: string; width: string; tone: string }[];
  capabilities: { title: string; tag: string; text: string; tone: string }[];
  tools: string[];
  accentColor: string;
}

function getPersonaContent(locale: Locale) {
  if (locale === "en-US") {
    return {
      heroEyebrow: "Research Foundation · Intelligent Oracle",
      heroTitle: "User Persona",
      heroText:
        "A design system consumer derived from the Intelligent Oracle research: an assistant based on XAI, RAG and UX to support people using Aetheris in correctly understanding and applying components and patterns.",
      personaName: "Francisco Soares",
      personaRole: "Product Manager · DS Consumer",
      chips: ["Agility", "Product", "Sprint"],
      trustLabel: "Trust in DS",
      trustValue: "Medium",
      trustText: "Uses it, but wants the answer now and has no patience to search",
      docsLabel: "Time in docs/day",
      docsText: "Time that should be under 5 min",
      quote:
        "I don't have time to read page after page. I need to know which component to use, why, and move on. The right answer in 30 seconds is worth more than the perfect answer in half an hour.",
      quoteLabel: "Representative persona quote",
      goalsTitle: "Goals",
      goalsEyebrow: "What Francisco wants to achieve",
      frustrationsTitle: "Frustrations",
      frustrationsEyebrow: "Documented friction points",
      toolsTitle: "Daily Tools",
      secondaryTitle: "Other Consumer Profiles",
      secondaryEyebrow:
        "The oracle needs to support different experience levels and perspectives.",
      journeyTitle: "Journey of a Question Without the Oracle",
      idealAnswerTitle: "Aetheris Oracle · Ideal Response",
      questionLabel: "Question",
      idealScenario: "Ideal scenario",
      capabilityTitle: "Francisco's pain points → Intelligence / XAI components",
      capabilityEyebrow: "How Aetheris resolves each user barrier",
      literatureTitle: "Literature grounding",
      opportunityTitle: "Design Opportunity",
      opportunityEyebrow: "How Aetheris + Beatrice respond to Francisco",
      problemLabel: "Core Problem",
      solutionLabel: "Aetheris Response",
      researchQuestionLabel: "Research Question",
      successTitle: "How Oracle Success Will Be Measured",
      successEyebrow: "Evaluation metrics aligned with Francisco as a study participant",
      footerEyebrow: "Aetheris Design System — Persona v2.0 · Intelligent Oracle",
      footerText:
        "It is not about reading more documentation. It is about having the right decision at the right time with the why behind it so you can move forward without wasting time.",
      footerAccent: "the right decision at the right time",
      footerPrimary: "Use the Oracle",
      footerSecondary: "View Components",
      leftMeta: [
        { label: "Age", value: "32 years old" },
        { label: "Location", value: "Sao Paulo, SP — Brazil" },
        {
          label: "Background",
          value: "Digital Product Management",
          detail: "+ MBA in Agile Innovation",
        },
        {
          label: "DS experience",
          value: "2 years as a consumer",
          detail: "Has never built a design system",
        },
      ] satisfies MetaItem[],
      rightMeta: [
        {
          label: "Company",
          value: "Digital product scale-up",
          detail: "150–300 people · B2B SaaS sector",
        },
        {
          label: "DS profile",
          value: "Intermediate consumer",
          detail: "Knows enough to give opinions, but not edge cases",
        },
        {
          label: "Usage context",
          value: "2–4 DS questions per sprint",
          detail: "Wants quick decisions and no time for long docs",
        },
        {
          label: "Distinct trait",
          value: "High impatience",
          detail: "Wants more agility than average and hates losing time searching",
        },
      ] satisfies MetaItem[],
      goals: [
        {
          title: "Instant answer, without manual searching",
          text: "Ask in natural language and get the component name plus rationale in seconds, without opening tabs or navigating multiple sections.",
        },
        {
          title: "Fast decision without depending on design",
          text: "Resolve component doubts alone, during a sprint or meeting, without waiting for outside validation.",
        },
        {
          title: "Fast team alignment",
          text: "Ensure designers and developers make the same decision and reduce rework caused by divergent interpretation.",
        },
        {
          title: "Enough confidence to decide and move forward",
          text: "He does not need absolute certainty; he needs calibrated confidence to proceed without revisiting the issue later.",
        },
      ] satisfies GoalItem[],
      frustrations: [
        {
          title: "Long documentation with no contextual guidance",
          severity: "Critical",
          width: "w-[96%]",
          tone: "from-error to-red-400",
          text: "He needs to read many pages for an answer that should arrive in seconds, which does not fit sprint pace.",
        },
        {
          title: 'Does not understand the "why" behind patterns',
          severity: "Critical",
          width: "w-[90%]",
          tone: "from-error to-red-400",
          text: "The system says what to use, but does not explain why that decision makes sense in context.",
        },
        {
          title: "Inconsistency across team members",
          severity: "High",
          width: "w-[82%]",
          tone: "from-amber-500 to-amber-400",
          text: "The same guideline can be read in different ways, generating variation and misalignment.",
        },
        {
          title: "Ad hoc solutions outside the system",
          severity: "High",
          width: "w-[75%]",
          tone: "from-amber-500 to-yellow-400",
          text: "When the answer does not arrive fast, the team improvises or pushes the decision to someone else.",
        },
        {
          title: "Does not know where to start in a new product",
          severity: "Critical",
          width: "w-[88%]",
          tone: "from-error to-red-400",
          text: "When starting from scratch, there is no guidance on component combinations, screen structure or the principles behind choices.",
        },
        {
          title: "Validation always depends on another human",
          severity: "Medium",
          width: "w-[65%]",
          tone: "from-primary/60 to-secondary/60",
          text: "Even simple decisions end up depending on the design lead, creating a bottleneck he sees as unacceptable.",
        },
      ] satisfies FrustrationItem[],
      tools: [
        ["Jira", "Sprint, backlog and roadmap", "Primary"],
        ["Linear", "Issues and delivery cycle", "Daily"],
        ["Beatrice Chat", "Aetheris oracle", "Meta"],
        ["Notion", "Product docs and decisions", "Daily"],
        ["Figma", "Prototype review and handoff", "Review"],
      ] as const,
      secondaryPersonas: [
        {
          title: "Frontend Dev",
          level: "Intermediate–Advanced",
          text: "Seeks technical precision, exact tokens, correct props and traceability back to the decision source.",
          tone: "text-secondary border-secondary/20 bg-secondary/10",
        },
        {
          title: "Product Manager",
          level: "DS novice",
          text: "Needs to understand concept differences and product impact without relying on technical jargon.",
          tone: "text-amber-400 border-amber-400/20 bg-amber-400/10",
        },
        {
          title: "Senior Designer / Tech Lead",
          level: "Advanced",
          text: "Wants access to design reasoning, governance and documented trade-offs to challenge the system deeply.",
          tone: "text-green-400 border-green-400/20 bg-green-400/10",
        },
      ] satisfies SecondaryPersona[],
      journeySteps: [
        {
          moment: "D+0",
          tag: "Kickoff",
          title: "Starts a new product and does not know where to begin",
          text: "Which components to use, how to structure screens and which patterns make sense here?",
        },
        {
          moment: "+1 day",
          tag: "Question",
          title: "A specific component question appears",
          text: 'Example: "Is it Neural Input or Search Command Bar?"',
        },
        {
          moment: "+5 min",
          tag: "Effort",
          title: "Opens the documentation and starts navigating",
          text: "Reads several similar sections without finding direct guidance on when to use each option.",
        },
        {
          moment: "+20 min",
          tag: "Blocker",
          title: "Still uncertain",
          text: "Insecurity grows because multiple alternatives seem plausible and rework risk increases.",
        },
        {
          moment: "+30 min",
          tag: "Dependency",
          title: "Asks the design lead",
          text: "Work pauses until someone answers what could have been solved in seconds.",
        },
        {
          moment: "With oracle",
          tag: "Ideal",
          title: "Aetheris answers in 30 seconds",
          text: "Delivers recommended component, why, source and confidence level, and the flow continues without blockage.",
        },
      ] satisfies JourneyStep[],
      idealQuestion:
        "I am building a new management module. Where should I start? Which components make sense together and why?",
      idealAnswerBlocks: [
        ["Suggested structure:", "Neural Input + Data Table + Action Bar"],
        [
          "Why (XAI):",
          "progressive disclosure principle. Start with data input, show results in a table and keep actions in context.",
        ],
        ["Confidence:", "high, consolidated pattern in `patterns`"],
        ["Source:", "patterns + components"],
      ] as const,
      idealScenarioText:
        "When I enter a sprint, I do not want to spend 30 minutes reading docs just to know which component to use. I want to ask, get the answer with the why, and move on. Without depending on anyone.",
      oracleCapabilities: [
        {
          title: "Explanation Bubble",
          tag: "XAI Widget",
          text: "Fills the gap between rule and reasoning by explaining why a component is recommended and which UX principle supports the choice.",
          tone: "border-primary/12 bg-primary/5",
        },
        {
          title: "Source Attribution Link",
          tag: "Provenance",
          text: "Shows the exact origin of the answer so Francisco can validate, share and end discussions with traceability.",
          tone: "border-amber-500/12 bg-amber-500/5",
        },
        {
          title: "Confidence Meter",
          tag: "Trust Signal",
          text: "Communicates certainty level so he can calibrate risk and decide without extra validation.",
          tone: "border-secondary/12 bg-secondary/5",
        },
        {
          title: "Beatrice Chat (RAG + NLP)",
          tag: "Oracle",
          text: "Transforms natural language into a layered answer with recommendation, context, explanation and source within seconds.",
          tone: "border-green-500/12 bg-green-500/5",
        },
      ] satisfies OracleCapability[],
      literature: [
        {
          text: "Users struggle to navigate long documentation, understand the implications of their choices and obtain contextualized recommendations.",
          source: "Zhang (2023) · Design System Governance",
          tone: "border-primary/40",
        },
        {
          text: "The way information is presented and perceived directly affects user understanding and trust.",
          source: "Mangold et al. (2025) · Human-centered XAI",
          tone: "border-secondary/40",
        },
        {
          text: "When explanation is not clear or contextualized, cognitive load increases and people tend to bypass the system in favor of local solutions.",
          source: "Voigt et al. (2021) · NLP Interfaces",
          tone: "border-slate-500/40",
        },
        {
          text: "RAG is especially suitable for specialized domains where the knowledge base is well structured and frequently updated.",
          source: "Gupta, Ranjan & Singh (2024) · RAG Survey",
          tone: "border-amber-500/40",
        },
      ] satisfies LiteratureQuote[],
      problemText:
        "Static documentation that tells what to do, but does not explain why, nor how to structure a new product.",
      solutionText:
        "An oracle with RAG + XAI + UX that guides structure, explains reasoning, points to principles and exposes sources and confidence.",
      opportunityBullets: [
        "RAG removes navigation effort by automatically retrieving relevant excerpts.",
        "XAI builds calibrated trust by making the reasoning behind the recommendation visible.",
        "Source Attribution ensures traceability to close discussions with concrete evidence.",
        "Conversational UX reduces cognitive load by adapting depth and language to the user's profile.",
      ],
      researchQuestion:
        "How can an intelligent oracle, based on XAI and UX principles, be developed to support design system consumers in understanding and effectively using components and patterns?",
      successMetrics: [
        ["Explanation clarity", "Did Francisco understand the reasoning behind the recommendation?"],
        ["Perceived usefulness", "Did the answer concretely help move the work forward?"],
        ["Satisfaction", "Was the interaction fluid and frustration-free?"],
        ["Trust", "Would Francisco use the recommendation without validating with someone else?"],
        ["Adoption effectiveness", "Was the chosen option consistent with DS patterns?"],
      ] as const,
      additionalPersonasTitle: "Additional Consumer Profiles",
      additionalPersonasEyebrow: "Each profile has a distinct relationship with the design system — and a distinct need from Beatrice.",
      additionalPersonas: [
        {
          id: "dev-fullstack",
          name: "Lucas Menezes",
          role: "Full Stack Developer · DS Consumer",
          chips: ["Frontend", "Backend", "Tokens"] as [string, string, string],
          trustLabel: "Trust in DS",
          trustValue: "High (conditional)",
          trustWidth: "82%",
          trustColor: "from-secondary to-blue-400",
          quote:
            "Don't tell me what it is — tell me the exact token, the correct prop and the expected behavior. The rest I figure out in the code.",
          goals: [
            { title: "Token names, copy-pasteable", text: "Needs the exact CSS variable or design token value instantly, without inferring from visual descriptions." },
            { title: "Prop behavior without reading source", text: "Understand what each prop does and when to pass it, without diving into the component implementation." },
            { title: "When-not-to-use as PR criteria", text: "Use DS constraints directly as acceptance criteria when reviewing pull requests or approving implementations." },
            { title: "Traceable answer to cite in code review", text: "Every recommendation must have a source he can link in a PR comment to justify the decision to the team." },
          ] satisfies GoalItem[],
          frustrations: [
            { title: "No code examples in docs", severity: "Critical", width: "w-[94%]", tone: "from-error to-red-400" },
            { title: "Token names unclear or inconsistent", severity: "Critical", width: "w-[88%]", tone: "from-error to-red-400" },
            { title: "Component props not documented", severity: "High", width: "w-[78%]", tone: "from-amber-500 to-amber-400" },
            { title: "Can't verify if implementation matches DS intent", severity: "High", width: "w-[72%]", tone: "from-amber-500 to-yellow-400" },
          ] satisfies FrustrationItem[],
          capabilities: [
            { title: "Token Lookup", tag: "Precision", text: "Returns exact CSS variable names and their semantic role — no interpretation needed.", tone: "border-secondary/12 bg-secondary/5" },
            { title: "When-Not-To-Use", tag: "PR Criteria", text: "Converts DS constraints into testable, linkable acceptance criteria for code review.", tone: "border-error/12 bg-error/5" },
            { title: "Source Attribution", tag: "Traceability", text: "Every answer includes a citable source Lucas can paste into a PR comment to close discussions.", tone: "border-amber-500/12 bg-amber-500/5" },
          ] satisfies OracleCapability[],
          tools: ["VS Code", "GitHub", "Storybook", "Chrome DevTools", "Beatrice"],
          accentColor: "text-secondary",
        },
        {
          id: "designer",
          name: "Isabela Torres",
          role: "UX/UI Designer · DS Consumer",
          chips: ["Figma", "UX", "Patterns"] as [string, string, string],
          trustLabel: "Trust in DS",
          trustValue: "Medium–High",
          trustWidth: "68%",
          trustColor: "from-violet-500 to-primary",
          quote:
            "I know what it should look like. What I need is why Aetheris made this choice and not another — so I can defend it to the client with substance.",
          goals: [
            { title: "Understand component anatomy and visual rationale", text: "Know not just what a component looks like, but why it was designed that way and what UX principle it encodes." },
            { title: "Know when patterns break", text: "Identify edge cases and failure modes before they reach production or client presentation." },
            { title: "Find trade-offs to justify to stakeholders", text: "Use documented trade-offs as argumentation material in design reviews, not just personal opinion." },
            { title: "Map tokens to design decisions", text: "Connect the color, spacing and type tokens directly to the reasoning behind the system's visual identity." },
          ] satisfies GoalItem[],
          frustrations: [
            { title: "No visual context for token descriptions", severity: "Critical", width: "w-[90%]", tone: "from-error to-red-400" },
            { title: "Pattern rationale not documented", severity: "Critical", width: "w-[85%]", tone: "from-error to-red-400" },
            { title: "Trade-offs missing for most components", severity: "High", width: "w-[80%]", tone: "from-amber-500 to-amber-400" },
            { title: "Can't map Figma vocabulary to DS vocabulary", severity: "Medium", width: "w-[60%]", tone: "from-primary/60 to-secondary/60" },
          ] satisfies FrustrationItem[],
          capabilities: [
            { title: "Pattern Guidance", tag: "Visual Rationale", text: "Explains the UX principle behind each pattern, not just its structure — directly usable in design presentations.", tone: "border-primary/12 bg-primary/5" },
            { title: "Design Decisions", tag: "Stakeholder Defense", text: "Surfaces the documented reason for each system choice, giving Isabela argumentation grounded in the DS.", tone: "border-violet-500/12 bg-violet-500/5" },
            { title: "XAI Explanation", tag: "Why This, Not That", text: "Answers comparison questions (drawer vs modal, this pattern vs that one) with structured trade-off reasoning.", tone: "border-amber-500/12 bg-amber-500/5" },
          ] satisfies OracleCapability[],
          tools: ["Figma", "FigJam", "Storybook", "Beatrice", "Lottie"],
          accentColor: "text-violet-400",
        },
        {
          id: "tech-writer",
          name: "Camila Reis",
          role: "Technical Writer · DS Consumer",
          chips: ["Docs", "UX Writing", "Content"] as [string, string, string],
          trustLabel: "Trust in DS",
          trustValue: "Low–Medium",
          trustWidth: "34%",
          trustColor: "from-slate-500 to-slate-400",
          quote:
            "If I don't understand why a component exists, I can't explain it to others. I need the reasoning, not just the description.",
          goals: [
            { title: "Canonical definitions for each component", text: "A single authoritative source for what a component is, does and intends — so documentation stays consistent across all channels." },
            { title: "Understand intent to document it correctly", text: "Grasp the purpose behind each design decision so written documentation reflects design thinking, not just behavior." },
            { title: "Trade-offs available to document", text: "When-to-use and when-not-to-use must be explicit so she can surface them to developers and designers reading her docs." },
            { title: "Consistent naming across code, design and docs", text: "A Button in code, a Button in Figma and a Button in documentation must be the same concept with the same vocabulary." },
          ] satisfies GoalItem[],
          frustrations: [
            { title: "Naming inconsistency across tools", severity: "Critical", width: "w-[92%]", tone: "from-error to-red-400" },
            { title: "No canonical definition for components", severity: "Critical", width: "w-[88%]", tone: "from-error to-red-400" },
            { title: "Reasoning and intent not captured anywhere", severity: "Critical", width: "w-[86%]", tone: "from-error to-red-400" },
            { title: "Can't verify accuracy of documentation", severity: "High", width: "w-[78%]", tone: "from-amber-500 to-amber-400" },
          ] satisfies FrustrationItem[],
          capabilities: [
            { title: "Source Attribution", tag: "Canonical Citation", text: "Beatrice points to the exact DS page and section — Camila cites that source in documentation instead of paraphrasing.", tone: "border-amber-500/12 bg-amber-500/5" },
            { title: "Reasoning Engine", tag: "Intent Capture", text: "The XAI layer exposes design intent and UX principles that are otherwise invisible — directly documentable.", tone: "border-primary/12 bg-primary/5" },
            { title: "Component Guidance", tag: "Canonical Def", text: "Returns a structured answer with description, context, when-to-use and when-not-to-use — documentation-ready.", tone: "border-green-500/12 bg-green-500/5" },
          ] satisfies OracleCapability[],
          tools: ["Notion", "Confluence", "Storybook", "Beatrice", "Vale"],
          accentColor: "text-slate-300",
        },
        {
          id: "qa",
          name: "Rafael Nunes",
          role: "QA Engineer · DS Consumer",
          chips: ["Testing", "Quality", "Compliance"] as [string, string, string],
          trustLabel: "Trust in DS",
          trustValue: "High (operational)",
          trustWidth: "80%",
          trustColor: "from-green-600 to-green-400",
          quote:
            "I need to know what 'correct' looks like. If the DS says when not to use a component, that becomes an acceptance criterion in my test case.",
          goals: [
            { title: "Clear acceptance criteria from the DS", text: "When-to-use and when-not-to-use must be explicit enough to become pass/fail conditions in a test plan." },
            { title: "Identify deviations from DS intent", text: "Detect when an implementation diverges from what the design system specifies — even in subtle behavior." },
            { title: "Understand expected behavior per component", text: "Know the interaction states, edge cases and error behaviors that a correctly implemented component must exhibit." },
            { title: "Test Beatrice consistency across sessions", text: "Validate that the oracle gives consistent, traceable answers for the same question across different users and times." },
          ] satisfies GoalItem[],
          frustrations: [
            { title: "No testable acceptance criteria in docs", severity: "Critical", width: "w-[93%]", tone: "from-error to-red-400" },
            { title: "Hard to test intent vs implementation", severity: "Critical", width: "w-[88%]", tone: "from-error to-red-400" },
            { title: "Inconsistencies between documented and actual behavior", severity: "High", width: "w-[82%]", tone: "from-amber-500 to-amber-400" },
            { title: "No clear diff between similar components", severity: "Medium", width: "w-[65%]", tone: "from-primary/60 to-secondary/60" },
          ] satisfies FrustrationItem[],
          capabilities: [
            { title: "When-Not-To-Use", tag: "Test Criteria", text: "Converts DS constraints into operationalizable conditions Rafael can paste directly into TestRail as acceptance criteria.", tone: "border-error/12 bg-error/5" },
            { title: "Confidence Meter", tag: "Risk Signal", text: "Low confidence scores flag components that need extra testing coverage — a risk signal for the QA plan.", tone: "border-green-500/12 bg-green-500/5" },
            { title: "Component Comparison", tag: "Diff Tool", text: "Explains the behavioral difference between similar components (Drawer vs Modal, Input vs Search) — maps to test distinctions.", tone: "border-amber-500/12 bg-amber-500/5" },
          ] satisfies OracleCapability[],
          tools: ["Jira", "TestRail", "Chrome DevTools", "Storybook", "Beatrice"],
          accentColor: "text-green-400",
        },
      ] satisfies AdditionalPersona[],
    };
  }

  const isPtPt = locale === "pt-PT";

  return {
    heroEyebrow: "Research Foundation · Oráculo Inteligente",
    heroTitle: "User Persona",
    heroText: isPtPt
      ? "Consumidor de design system derivado da investigação sobre o Oráculo Inteligente: um assistente baseado em XAI, RAG e UX para apoiar quem usa o Aetheris na compreensão e aplicação correta de componentes e padrões."
      : "Consumidor de design system derivado da pesquisa sobre o Oráculo Inteligente: um assistente baseado em XAI, RAG e UX para apoiar quem usa o Aetheris na compreensão e aplicação correta de componentes e padrões.",
    personaName: "Francisco Soares",
    personaRole: "Product Manager · DS Consumer",
    chips: ["Agilidade", "Produto", "Sprint"],
    trustLabel: "Confiança no DS",
    trustValue: isPtPt ? "Média" : "Média",
    trustText: isPtPt
      ? "Usa, mas quer a resposta agora e não tem paciência para procurar"
      : "Usa, mas quer a resposta agora e não tem paciência para procurar",
    docsLabel: "Tempo em docs/dia",
    docsText: isPtPt ? "Tempo que deveria ser inferior a 5 min" : "Tempo que deveria ser menor que 5 min",
    quote:
      "Não tenho tempo para ficar a ler página por página. Preciso de saber qual componente usar, porquê, e seguir em frente. A resposta certa em 30 segundos vale mais do que a resposta perfeita em meia hora.",
    quoteLabel: isPtPt ? "Citação representativa da persona" : "Citação representativa da persona",
    goalsTitle: "Objetivos",
    goalsEyebrow: isPtPt ? "O que Francisco quer alcançar" : "O que Francisco quer alcançar",
    frustrationsTitle: "Frustrações",
    frustrationsEyebrow: isPtPt ? "Pontos de atrito documentados" : "Pontos de atrito documentados",
    toolsTitle: isPtPt ? "Ferramentas do dia a dia" : "Ferramentas do dia a dia",
    secondaryTitle: isPtPt ? "Outros perfis de consumidores" : "Outros Perfis de Consumidores",
    secondaryEyebrow: isPtPt
      ? "O oráculo precisa de atender a diferentes níveis de experiência e perspetivas."
      : "O oráculo precisa atender a diferentes níveis de experiência e perspectivas.",
    journeyTitle: isPtPt ? "Jornada de uma dúvida sem o Oráculo" : "Jornada de uma Dúvida Sem o Oráculo",
    idealAnswerTitle: isPtPt ? "Oráculo Beatrice — Resposta ideal" : "Oráculo Beatrice — Resposta Ideal",
    questionLabel: isPtPt ? "Pergunta" : "Pergunta",
    idealScenario: isPtPt ? "Cenário ideal" : "Cenário Ideal",
    capabilityTitle: isPtPt
      ? "Dores de Francisco → Componentes Intelligence / XAI"
      : "Dores de Francisco → Componentes Intelligence / XAI",
    capabilityEyebrow: isPtPt
      ? "Como o Aetheris resolve cada barreira do utilizador"
      : "Como o Aetheris resolve cada barreira do usuário",
    literatureTitle: isPtPt ? "Embasamento na literatura" : "Embasamento na Literatura",
    opportunityTitle: isPtPt ? "Oportunidade de Design" : "Oportunidade de Design",
    opportunityEyebrow: isPtPt
      ? "Como Aetheris + Beatrice respondem ao Francisco"
      : "Como Aetheris + Beatrice respondem a Francisco",
    problemLabel: isPtPt ? "Problema central" : "Problema Central",
    solutionLabel: isPtPt ? "Resposta do Aetheris" : "Resposta do Aetheris",
    researchQuestionLabel: isPtPt ? "Pergunta de investigação" : "Pergunta de Pesquisa (TCC)",
    successTitle: isPtPt ? "Como o sucesso do Oráculo será medido" : "Como o Sucesso do Oráculo Será Medido",
    successEyebrow: isPtPt
      ? "Métricas de avaliação alinhadas ao Francisco como participante dos estudos"
      : "Métricas de avaliação alinhadas a Francisco como participante dos estudos",
    footerEyebrow: "Aetheris Design System — Persona v2.0 · Oráculo Inteligente",
    footerText: isPtPt
      ? "Não é sobre ler mais documentação. É sobre ter a decisão certa no momento certo com o porquê por trás dela para seguir em frente sem perder tempo."
      : "Não é sobre ler mais documentação. É sobre ter a decisão certa no momento certo com o porquê por trás dela para seguir em frente sem perder tempo.",
    footerAccent: isPtPt ? "decisão certa no momento certo" : "decisão certa no momento certo",
    footerPrimary: isPtPt ? "Usar o Oráculo" : "Usar o Oráculo",
    footerSecondary: isPtPt ? "Ver Componentes" : "Ver Componentes",
    leftMeta: [
      { label: "Idade", value: "32 anos" },
      { label: "Localização", value: "São Paulo, SP — Brasil" },
      {
        label: "Formação",
        value: isPtPt ? "Gestão de Produtos Digitais" : "Gestão de Produtos Digitais",
        detail: "+ MBA em Inovação Ágil",
      },
      {
        label: "Experiência com DS",
        value: isPtPt ? "2 anos a consumir" : "2 anos consumindo",
        detail: isPtPt ? "Nunca produziu um DS" : "Nunca produziu um DS",
      },
    ] satisfies MetaItem[],
    rightMeta: [
      {
        label: "Empresa",
        value: isPtPt ? "Scale-up de produto digital" : "Scale-up de produto digital",
        detail: "150–300 pessoas · Setor SaaS B2B",
      },
      {
        label: "Perfil no DS",
        value: isPtPt ? "Consumidor intermédio" : "Consumidor intermediário",
        detail: isPtPt
          ? "Conhece o suficiente para opinar, mas não domina edge cases"
          : "Conhece o suficiente para opinar, mas não domina edge cases",
      },
      {
        label: "Contexto de uso",
        value: "2–4 dúvidas de DS por sprint",
        detail: isPtPt
          ? "Quer decisão rápida e não tem tempo para ler documentação longa"
          : "Quer decisão rápida — não tem tempo para ler documentação longa",
      },
      {
        label: "Traço característico",
        value: isPtPt ? "Alta impaciência" : "Alta impaciência",
        detail: isPtPt
          ? "Quer mais agilidade do que o normal e não tolera perder tempo a procurar"
          : "Quer mais agilidade que o normal — não tolera perder tempo procurando",
      },
    ] satisfies MetaItem[],
    goals: [
      {
        title: isPtPt ? "Resposta instantânea, sem pesquisa manual" : "Resposta instantânea, sem busca manual",
        text: isPtPt
          ? "Perguntar em linguagem natural e receber o nome do componente e o motivo em segundos, sem abrir abas nem navegar por várias secções."
          : "Perguntar em linguagem natural e receber o nome do componente e o motivo em segundos, sem abrir abas nem navegar por várias seções.",
      },
      {
        title: isPtPt ? "Decisão ágil sem depender da equipa de design" : "Decisão ágil sem depender do time de design",
        text: isPtPt
          ? "Resolver dúvidas de componente sozinho, no meio da sprint ou de uma reunião, sem esperar por validação externa."
          : "Resolver dúvidas de componente sozinho, no meio da sprint ou de uma reunião, sem esperar por validação externa.",
      },
      {
        title: isPtPt ? "Alinhamento rápido da equipa" : "Alinhamento rápido de equipe",
        text: isPtPt
          ? "Garantir que designers e devs tomem a mesma decisão e reduzam retrabalho por interpretação divergente."
          : "Garantir que designers e devs tomem a mesma decisão e reduzam retrabalho por interpretação divergente.",
      },
      {
        title: isPtPt ? "Confiança suficiente para decidir e avançar" : "Confiança suficiente para decidir e avançar",
        text: isPtPt
          ? "Não precisa de certeza absoluta; precisa de confiança calibrada para seguir em frente sem revisitar o tema depois."
          : "Não precisa de certeza absoluta; precisa de confiança calibrada para seguir em frente sem revisitar o tema depois.",
      },
    ] satisfies GoalItem[],
    frustrations: [
      {
        title: isPtPt ? "Documentação extensa sem orientação contextual" : "Documentação extensa sem orientação contextual",
        severity: isPtPt ? "Crítico" : "Crítico",
        width: "w-[96%]",
        tone: "from-error to-red-400",
        text: isPtPt
          ? "Precisa de ler muitas páginas para uma resposta que deveria chegar em segundos, o que é incompatível com o ritmo de sprint."
          : "Precisa ler muitas páginas para uma resposta que deveria chegar em segundos, o que é incompatível com o ritmo de sprint.",
      },
      {
        title: 'Não entende o "porquê" dos padrões',
        severity: isPtPt ? "Crítico" : "Crítico",
        width: "w-[90%]",
        tone: "from-error to-red-400",
        text: isPtPt
          ? "O sistema diz o que usar, mas não explica por que essa decisão faz sentido no contexto."
          : "O sistema diz o que usar, mas não explica por que aquela decisão faz sentido no contexto.",
      },
      {
        title: isPtPt ? "Inconsistências entre membros da equipa" : "Inconsistências entre membros da equipe",
        severity: isPtPt ? "Alto" : "Alto",
        width: "w-[82%]",
        tone: "from-amber-500 to-amber-400",
        text: isPtPt
          ? "A mesma diretriz pode ser lida de formas diferentes, gerando variações e desalinhamento entre equipas."
          : "A mesma diretriz pode ser lida de formas diferentes, gerando variações e desalinhamento entre times.",
      },
      {
        title: isPtPt ? "Soluções ad hoc fora do sistema" : "Soluções ad hoc fora do sistema",
        severity: isPtPt ? "Alto" : "Alto",
        width: "w-[75%]",
        tone: "from-amber-500 to-yellow-400",
        text: isPtPt
          ? "Quando a resposta não chega depressa, a equipa improvisa ou empurra a decisão para outra pessoa."
          : "Quando a resposta não vem rápido, a equipe improvisa ou empurra a decisão para outra pessoa.",
      },
      {
        title: isPtPt ? "Não sabe por onde começar num produto novo" : "Não sabe por onde começar em produto novo",
        severity: isPtPt ? "Crítico" : "Crítico",
        width: "w-[88%]",
        tone: "from-error to-red-400",
        text:
          "Ao começar algo do zero, falta orientação sobre combinação de componentes, estrutura de ecrã/tela e princípios por trás das escolhas.",
      },
      {
        title: isPtPt ? "Validação depende sempre de outro humano" : "Validação sempre depende de outro humano",
        severity: isPtPt ? "Médio" : "Médio",
        width: "w-[65%]",
        tone: "from-primary/60 to-secondary/60",
        text: isPtPt
          ? "Mesmo decisões simples acabam por depender do design lead, criando um gargalo que ele considera inaceitável."
          : "Mesmo decisões simples acabam dependendo do design lead, criando um gargalo que ele considera inaceitável.",
      },
    ] satisfies FrustrationItem[],
    tools: [
      ["Jira", "Sprint, backlog e roadmap", isPtPt ? "Primário" : "Primário"],
      ["Linear", isPtPt ? "Issues e ciclo de entrega" : "Issues e ciclo de entrega", isPtPt ? "Diário" : "Diário"],
      ["Beatrice Chat", "Oráculo Beatrice", "Meta"],
      ["Notion", isPtPt ? "Docs de produto e decisões" : "Docs de produto e decisões", isPtPt ? "Diário" : "Diário"],
      ["Figma", isPtPt ? "Revisão de protótipos e handoff" : "Revisão de protótipos e handoff", isPtPt ? "Revisão" : "Revisão"],
    ] as const,
    secondaryPersonas: [
      {
        title: "Dev Frontend",
        level: isPtPt ? "Intermédio–Avançado" : "Intermediário–Avançado",
        text: isPtPt
          ? "Procura precisão técnica, tokens exatos, props corretas e rastreabilidade até à fonte da decisão."
          : "Busca precisão técnica, tokens exatos, props corretas e rastreabilidade até a fonte da decisão.",
        tone: "text-secondary border-secondary/20 bg-secondary/10",
      },
      {
        title: isPtPt ? "Gestor de Produto" : "Gerente de Produto",
        level: isPtPt ? "Iniciante no DS" : "Novato no DS",
        text: isPtPt
          ? "Precisa de entender diferença entre conceitos e impacto no produto sem depender de jargão técnico."
          : "Precisa entender diferença entre conceitos e impacto no produto sem depender de jargão técnico.",
        tone: "text-amber-400 border-amber-400/20 bg-amber-400/10",
      },
      {
        title: isPtPt ? "Designer Sénior / Tech Lead" : "Designer Sênior / Tech Lead",
        level: isPtPt ? "Avançado" : "Avançado",
        text: isPtPt
          ? "Quer acesso ao raciocínio de design, governação e trade-offs documentados para questionar o sistema com profundidade."
          : "Quer acesso ao raciocínio de design, governança e trade-offs documentados para questionar o sistema com profundidade.",
        tone: "text-green-400 border-green-400/20 bg-green-400/10",
      },
    ] satisfies SecondaryPersona[],
    journeySteps: [
      {
        moment: "D+0",
        tag: "Kickoff",
        title: isPtPt ? "Começa um produto novo e não sabe por onde começar" : "Começa um produto novo e não sabe por onde começar",
        text: isPtPt
          ? "Que componentes usar, como estruturar os ecrãs e que padrões fazem sentido aqui?"
          : "Quais componentes usar, como estruturar as telas e quais padrões fazem sentido aqui?",
      },
      {
        moment: "+1 dia",
        tag: isPtPt ? "Dúvida" : "Dúvida",
        title: isPtPt ? "Surge uma dúvida específica de componente" : "Surge uma dúvida específica de componente",
        text: 'Exemplo: "É Neural Input ou Search Command Bar?"',
      },
      {
        moment: "+5 min",
        tag: isPtPt ? "Esforço" : "Esforço",
        title: isPtPt ? "Abre a documentação e começa a navegar" : "Abre a documentação e começa a navegar",
        text: isPtPt
          ? "Lê várias secções semelhantes sem encontrar uma orientação direta sobre quando usar cada opção."
          : "Lê várias seções similares sem encontrar uma orientação direta de quando usar cada opção.",
      },
      {
        moment: "+20 min",
        tag: isPtPt ? "Bloqueio" : "Bloqueio",
        title: isPtPt ? "Ainda sem certeza" : "Ainda sem certeza",
        text: isPtPt
          ? "A insegurança aumenta porque várias alternativas parecem plausíveis e o risco de retrabalho cresce."
          : "A insegurança aumenta porque várias alternativas parecem plausíveis e o risco de retrabalho cresce.",
      },
      {
        moment: "+30 min",
        tag: isPtPt ? "Dependência" : "Dependência",
        title: isPtPt ? "Pergunta ao design lead" : "Pergunta ao design lead",
        text: isPtPt
          ? "O trabalho pára até alguém responder ao que poderia ter sido resolvido em segundos."
          : "O trabalho pausa até alguém responder o que poderia ter sido resolvido em segundos.",
      },
      {
        moment: isPtPt ? "Com oráculo" : "Com oráculo",
        tag: "Ideal",
        title: isPtPt ? "Aetheris responde em 30 segundos" : "Aetheris responde em 30 segundos",
        text: isPtPt
          ? "Entrega componente recomendado, porquê, fonte e nível de confiança, e o fluxo segue sem bloqueio."
          : "Entrega componente recomendado, porquê, fonte e nível de confiança, e o fluxo segue sem bloqueio.",
      },
    ] satisfies JourneyStep[],
    idealQuestion: isPtPt
      ? "Estou a montar um novo módulo de gestão. Por onde começo? Que componentes fazem sentido juntos e porquê?"
      : "Estou montando um novo módulo de gestão. Por onde começo? Quais componentes fazem sentido juntos e por quê?",
    idealAnswerBlocks: [
      ["Estrutura sugerida:", "Neural Input + Data Table + Action Bar"],
      [
        isPtPt ? "Porquê (XAI):" : "Por quê (XAI):",
        isPtPt
          ? "princípio de progressividade. Comece pela entrada de dados, mostre resultados em tabela e deixe ações no contexto."
          : "princípio de progressividade. Comece pela entrada de dados, mostre resultados em tabela e deixe ações no contexto.",
      ],
      ["Confiança:", isPtPt ? "alta, padrão consolidado em `patterns`" : "alta, padrão consolidado em `patterns`"],
      ["Fonte:", "patterns + components"],
    ] as const,
    idealScenarioText: isPtPt
      ? "Quando entro numa sprint, não quero perder 30 minutos a ler docs para saber qual componente usar. Quero perguntar, receber a resposta com o porquê, e seguir em frente. Sem depender de ninguém."
      : "Quando entro em um sprint, não quero perder 30 minutos lendo docs para saber qual componente usar. Quero perguntar, receber a resposta com o porquê, e seguir em frente. Sem depender de ninguém.",
    oracleCapabilities: [
      {
        title: "Explanation Bubble",
        tag: "XAI Widget",
        text: isPtPt
          ? "Resolve o vazio entre regra e raciocínio ao explicar por que um componente é recomendado e que princípio de UX está por trás da escolha."
          : "Resolve o vazio entre regra e raciocínio ao explicar por que um componente é recomendado e qual princípio de UX está por trás da escolha.",
        tone: "border-primary/12 bg-primary/5",
      },
      {
        title: "Source Attribution Link",
        tag: "Provenance",
        text: isPtPt
          ? "Mostra a origem exata da resposta para que Francisco valide, partilhe e encerre discussões com rastreabilidade."
          : "Mostra a origem exata da resposta para que Francisco valide, compartilhe e encerre discussões com rastreabilidade.",
        tone: "border-amber-500/12 bg-amber-500/5",
      },
      {
        title: "Confidence Meter",
        tag: "Trust Signal",
        text: isPtPt
          ? "Comunica o grau de certeza da recomendação para que ele calibre risco e tome decisão sem validação adicional."
          : "Comunica o grau de certeza da recomendação para que ele calibre risco e tome decisão sem validação adicional.",
        tone: "border-secondary/12 bg-secondary/5",
      },
      {
        title: "Beatrice Chat (RAG + NLP)",
        tag: "Oráculo",
        text: isPtPt
          ? "Transforma linguagem natural em resposta hierárquica com recomendação, contexto, explicação e fonte em poucos segundos."
          : "Transforma linguagem natural em resposta hierárquica com recomendação, contexto, explicação e fonte em poucos segundos.",
        tone: "border-green-500/12 bg-green-500/5",
      },
    ] satisfies OracleCapability[],
    literature: [
      {
        text: isPtPt
          ? "Utilizadores enfrentam dificuldades em navegar documentação extensa, compreender as implicações das suas escolhas e obter recomendações contextualizadas."
          : "Usuários enfrentam dificuldades em navegar documentação extensa, compreender as implicações de suas escolhas e obter recomendações contextualizadas.",
        source: "Zhang (2023) · Design System Governance",
        tone: "border-primary/40",
      },
      {
        text: isPtPt
          ? "A forma como as informações são apresentadas e percebidas afeta diretamente a compreensão e o nível de confiança dos utilizadores."
          : "A forma como as informações são apresentadas e percebidas afeta diretamente a compreensão e o nível de confiança dos usuários.",
        source: "Mangold et al. (2025) · Human-centered XAI",
        tone: "border-secondary/40",
      },
      {
        text: isPtPt
          ? "Quando a explicação não é clara ou contextualizada, aumentam a sobrecarga cognitiva e a tendência para contornar o sistema em favor de soluções locais."
          : "Quando a explicação não é clara ou contextualizada, aumentam a sobrecarga cognitiva e a tendência de contornar o sistema em favor de soluções locais.",
        source: "Voigt et al. (2021) · NLP Interfaces",
        tone: "border-slate-500/40",
      },
      {
        text: isPtPt
          ? "RAG é especialmente apropriado para domínios especializados onde a base de conhecimento é bem estruturada e frequentemente atualizada."
          : "RAG é especialmente apropriado para domínios especializados onde a base de conhecimento é bem estruturada e frequentemente atualizada.",
        source: "Gupta, Ranjan & Singh (2024) · RAG Survey",
        tone: "border-amber-500/40",
      },
    ] satisfies LiteratureQuote[],
    problemText: isPtPt
      ? "Documentação estática que informa o que fazer, mas não explica o porquê, nem como estruturar um produto novo."
      : "Documentação estática que informa o que fazer, mas não explica o porquê, nem como estruturar um produto novo.",
    solutionText: isPtPt
      ? "Um oráculo com RAG + XAI + UX que orienta estrutura, explica raciocínio, aponta princípios e expõe fontes e confiança."
      : "Um oráculo com RAG + XAI + UX que orienta estrutura, explica raciocínio, aponta princípios e expõe fontes e confiança.",
    opportunityBullets: [
      isPtPt
        ? "RAG elimina o esforço de navegação ao recuperar automaticamente os trechos relevantes."
        : "RAG elimina o esforço de navegação recuperando automaticamente os trechos relevantes.",
      isPtPt
        ? "XAI constrói confiança calibrada ao tornar visível o raciocínio por trás da recomendação."
        : "XAI constrói confiança calibrada ao tornar visível o raciocínio por trás da recomendação.",
      "Source Attribution garante rastreabilidade para encerrar discussões com evidência concreta.",
      isPtPt
        ? "UX conversacional reduz sobrecarga cognitiva ao adaptar profundidade e linguagem ao perfil do utilizador."
        : "UX conversacional reduz sobrecarga cognitiva ao adaptar profundidade e linguagem ao perfil do usuário.",
    ],
    researchQuestion: isPtPt
      ? "Como desenvolver um oráculo inteligente, baseado em XAI e princípios de UX, para apoiar consumidores de design systems na compreensão e utilização eficaz de componentes e padrões?"
      : "Como desenvolver um oráculo inteligente, baseado em XAI e princípios de UX, para apoiar consumidores de design systems na compreensão e utilização eficaz de componentes e padrões?",
    successMetrics: [
      ["Clareza das Explicações", "Francisco entendeu o raciocínio por trás da recomendação?"],
      [
        isPtPt ? "Utilidade Percebida" : "Utilidade Percebida",
        isPtPt
          ? "A resposta ajudou a avançar o trabalho de forma concreta?"
          : "A resposta ajudou a avançar o trabalho de forma concreta?",
      ],
      ["Satisfação", isPtPt ? "A experiência de interação foi fluida e sem frustração?" : "A experiência de interação foi fluida e sem frustração?"],
      ["Confiança", isPtPt ? "Francisco usaria a recomendação sem validar com outra pessoa?" : "Francisco usaria a recomendação sem validar com outra pessoa?"],
      ["Eficácia na Adoção", isPtPt ? "A escolha feita foi consistente com os padrões do DS?" : "A escolha feita foi consistente com os padrões do DS?"],
    ] as const,
    additionalPersonasTitle: isPtPt ? "Perfis Adicionais de Consumidores" : "Perfis Adicionais de Consumidores",
    additionalPersonasEyebrow: isPtPt
      ? "Cada perfil tem uma relação distinta com o design system — e uma necessidade distinta da Beatrice."
      : "Cada perfil tem uma relação distinta com o design system — e uma necessidade distinta da Beatrice.",
    additionalPersonas: [
      {
        id: "dev-fullstack",
        name: "Lucas Menezes",
        role: "Dev Full Stack · Consumidor do DS",
        chips: ["Frontend", "Backend", "Tokens"] as [string, string, string],
        trustLabel: isPtPt ? "Confiança no DS" : "Confiança no DS",
        trustValue: isPtPt ? "Alta (condicional)" : "Alta (condicional)",
        trustWidth: "82%",
        trustColor: "from-secondary to-blue-400",
        quote: isPtPt
          ? "Não me digas o que é — diz-me o token exato, a prop correta e o comportamento esperado. O resto descubro no código."
          : "Não me diz o que é — me diz o token exato, a prop correta e o comportamento esperado. O resto eu descubro no código.",
        goals: [
          {
            title: isPtPt ? "Nomes de token prontos para colar" : "Nomes de token prontos para colar",
            text: isPtPt
              ? "Precisa do nome exato da variável CSS ou do token de design instantaneamente, sem interpretar descrições visuais."
              : "Precisa do nome exato da variável CSS ou do token de design instantaneamente, sem inferir de descrições visuais.",
          },
          {
            title: isPtPt ? "Comportamento de props sem ler o fonte" : "Comportamento de props sem ler o fonte",
            text: isPtPt
              ? "Entender o que cada prop faz e quando passá-la, sem mergulhar na implementação do componente."
              : "Entender o que cada prop faz e quando passá-la, sem mergulhar na implementação do componente.",
          },
          {
            title: isPtPt ? "Quando-não-usar como critério de PR" : "Quando-não-usar como critério de PR",
            text: isPtPt
              ? "Usar restrições do DS diretamente como critérios de aceite ao revisar pull requests ou aprovar implementações."
              : "Usar restrições do DS diretamente como critérios de aceite ao revisar pull requests ou aprovar implementações.",
          },
          {
            title: isPtPt ? "Resposta rastreável para citar em code review" : "Resposta rastreável para citar em code review",
            text: isPtPt
              ? "Toda recomendação precisa ter uma fonte que ele possa linkar num comentário de PR para justificar a decisão."
              : "Toda recomendação precisa ter uma fonte que ele possa linkar num comentário de PR para justificar a decisão.",
          },
        ] satisfies GoalItem[],
        frustrations: [
          { title: isPtPt ? "Sem exemplos de código na documentação" : "Sem exemplos de código na documentação", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[94%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Nomes de token inconsistentes" : "Nomes de token inconsistentes", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[88%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Props dos componentes não documentadas" : "Props dos componentes não documentadas", severity: isPtPt ? "Alto" : "Alto", width: "w-[78%]", tone: "from-amber-500 to-amber-400" },
          { title: isPtPt ? "Não consegue verificar se a implementação bate com o DS" : "Não consegue verificar se implementação bate com o DS", severity: isPtPt ? "Alto" : "Alto", width: "w-[72%]", tone: "from-amber-500 to-yellow-400" },
        ] satisfies FrustrationItem[],
        capabilities: [
          { title: "Token Lookup", tag: "Precisão", text: isPtPt ? "Retorna nomes exatos de variáveis CSS e o papel semântico de cada uma — sem interpretação." : "Retorna nomes exatos de variáveis CSS e o papel semântico de cada uma — sem interpretação.", tone: "border-secondary/12 bg-secondary/5" },
          { title: "When-Not-To-Use", tag: "Critério de PR", text: isPtPt ? "Converte restrições do DS em critérios de aceite rastreáveis para code review." : "Converte restrições do DS em critérios de aceite rastreáveis para code review.", tone: "border-error/12 bg-error/5" },
          { title: "Source Attribution", tag: "Rastreabilidade", text: isPtPt ? "Toda resposta inclui uma fonte citável que Lucas pode colar no PR para encerrar discussões." : "Toda resposta inclui uma fonte citável que Lucas pode colar no PR para encerrar discussões.", tone: "border-amber-500/12 bg-amber-500/5" },
        ] satisfies OracleCapability[],
        tools: ["VS Code", "GitHub", "Storybook", "Chrome DevTools", "Beatrice"],
        accentColor: "text-secondary",
      },
      {
        id: "designer",
        name: "Isabela Torres",
        role: isPtPt ? "Designer UX/UI · Consumidora do DS" : "Designer UX/UI · Consumidora do DS",
        chips: ["Figma", "UX", "Patterns"] as [string, string, string],
        trustLabel: isPtPt ? "Confiança no DS" : "Confiança no DS",
        trustValue: isPtPt ? "Média–Alta" : "Média–Alta",
        trustWidth: "68%",
        trustColor: "from-violet-500 to-primary",
        quote: isPtPt
          ? "Eu sei como deve parecer. O que preciso é saber por que o Aetheris fez essa escolha e não outra — para defender ao cliente com embasamento."
          : "Eu sei como deve parecer. O que preciso é saber por que o Aetheris fez essa escolha e não outra — para defender ao cliente com embasamento.",
        goals: [
          {
            title: isPtPt ? "Anatomia e racional visual do componente" : "Anatomia e racional visual do componente",
            text: isPtPt
              ? "Saber não só como um componente parece, mas por que foi desenhado assim e que princípio de UX ele codifica."
              : "Saber não só como um componente parece, mas por que foi desenhado assim e qual princípio de UX ele codifica.",
          },
          {
            title: isPtPt ? "Quando os padrões quebram" : "Quando os padrões quebram",
            text: isPtPt
              ? "Identificar edge cases e modos de falha antes que cheguem à produção ou a uma apresentação ao cliente."
              : "Identificar edge cases e modos de falha antes que cheguem à produção ou à apresentação ao cliente.",
          },
          {
            title: isPtPt ? "Trade-offs para justificar a stakeholders" : "Trade-offs para justificar a stakeholders",
            text: isPtPt
              ? "Usar trade-offs documentados como material de argumentação em design reviews, não só opinião pessoal."
              : "Usar trade-offs documentados como material de argumentação em design reviews, não só opinião pessoal.",
          },
          {
            title: isPtPt ? "Ligar tokens às decisões de design" : "Ligar tokens às decisões de design",
            text: isPtPt
              ? "Conectar tokens de cor, espaçamento e tipografia ao raciocínio por trás da identidade visual do sistema."
              : "Conectar tokens de cor, espaçamento e tipografia ao raciocínio por trás da identidade visual do sistema.",
          },
        ] satisfies GoalItem[],
        frustrations: [
          { title: isPtPt ? "Sem contexto visual na descrição dos tokens" : "Sem contexto visual na descrição dos tokens", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[90%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Racional dos padrões não documentado" : "Racional dos padrões não documentado", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[85%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Trade-offs ausentes na maioria dos componentes" : "Trade-offs ausentes na maioria dos componentes", severity: isPtPt ? "Alto" : "Alto", width: "w-[80%]", tone: "from-amber-500 to-amber-400" },
          { title: isPtPt ? "Vocabulário Figma ≠ vocabulário do DS" : "Vocabulário Figma ≠ vocabulário do DS", severity: isPtPt ? "Médio" : "Médio", width: "w-[60%]", tone: "from-primary/60 to-secondary/60" },
        ] satisfies FrustrationItem[],
        capabilities: [
          { title: "Pattern Guidance", tag: "Racional Visual", text: isPtPt ? "Explica o princípio de UX por trás de cada padrão — diretamente usável em apresentações de design." : "Explica o princípio de UX por trás de cada padrão — diretamente usável em apresentações de design.", tone: "border-primary/12 bg-primary/5" },
          { title: "Design Decisions", tag: "Defesa a Stakeholders", text: isPtPt ? "Expõe o motivo documentado de cada escolha do sistema, dando a Isabela argumentação fundamentada no DS." : "Expõe o motivo documentado de cada escolha do sistema, dando a Isabela argumentação fundamentada no DS.", tone: "border-violet-500/12 bg-violet-500/5" },
          { title: "XAI Explanation", tag: "Por que Este e Não Aquele", text: isPtPt ? "Responde perguntas de comparação com raciocínio estruturado de trade-off." : "Responde perguntas de comparação com raciocínio estruturado de trade-off.", tone: "border-amber-500/12 bg-amber-500/5" },
        ] satisfies OracleCapability[],
        tools: ["Figma", "FigJam", "Storybook", "Beatrice", "Lottie"],
        accentColor: "text-violet-400",
      },
      {
        id: "tech-writer",
        name: "Camila Reis",
        role: "Technical Writer · Consumidora do DS",
        chips: ["Docs", "UX Writing", "Content"] as [string, string, string],
        trustLabel: isPtPt ? "Confiança no DS" : "Confiança no DS",
        trustValue: isPtPt ? "Baixa–Média" : "Baixa–Média",
        trustWidth: "34%",
        trustColor: "from-slate-500 to-slate-400",
        quote: isPtPt
          ? "Se não entendo por que um componente existe, não consigo explicá-lo a outros. Preciso do raciocínio, não só da descrição."
          : "Se eu não entendo por que um componente existe, não consigo explicá-lo para outros. Preciso do raciocínio, não só da descrição.",
        goals: [
          {
            title: isPtPt ? "Definições canônicas por componente" : "Definições canônicas por componente",
            text: isPtPt
              ? "Uma fonte autoritativa única sobre o que um componente é, faz e pretende — para a documentação ser consistente em todos os canais."
              : "Uma fonte autoritativa única sobre o que um componente é, faz e intenciona — para a documentação ser consistente em todos os canais.",
          },
          {
            title: isPtPt ? "Entender a intenção para documentar corretamente" : "Entender a intenção para documentar corretamente",
            text: isPtPt
              ? "Compreender o propósito por trás de cada decisão de design para que a documentação reflita o pensamento de design, não só o comportamento."
              : "Compreender o propósito por trás de cada decisão de design para que a documentação reflita o pensamento de design, não só o comportamento.",
          },
          {
            title: isPtPt ? "Trade-offs disponíveis para documentar" : "Trade-offs disponíveis para documentar",
            text: isPtPt
              ? "Quando-usar e quando-não-usar têm de ser explícitos para que ela os possa surfaçar a devs e designers que leem os docs."
              : "Quando-usar e quando-não-usar precisam ser explícitos para que ela possa surfacear para devs e designers que leem os docs.",
          },
          {
            title: isPtPt ? "Nomenclatura consistente entre código, design e docs" : "Nomenclatura consistente entre código, design e docs",
            text: isPtPt
              ? "Um Button no código, um Button no Figma e um Button na documentação têm de ser o mesmo conceito com o mesmo vocabulário."
              : "Um Button no código, um Button no Figma e um Button na documentação precisam ser o mesmo conceito com o mesmo vocabulário.",
          },
        ] satisfies GoalItem[],
        frustrations: [
          { title: isPtPt ? "Inconsistência de nomenclatura entre ferramentas" : "Inconsistência de nomenclatura entre ferramentas", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[92%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Sem definição canônica dos componentes" : "Sem definição canônica dos componentes", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[88%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Raciocínio e intenção não capturados em lugar nenhum" : "Raciocínio e intenção não capturados em lugar nenhum", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[86%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Não consegue verificar a exatidão da documentação" : "Não consegue verificar a exatidão da documentação", severity: isPtPt ? "Alto" : "Alto", width: "w-[78%]", tone: "from-amber-500 to-amber-400" },
        ] satisfies FrustrationItem[],
        capabilities: [
          { title: "Source Attribution", tag: isPtPt ? "Citação Canônica" : "Citação Canônica", text: isPtPt ? "Beatrice aponta para a página exata do DS — Camila cita essa fonte nos docs em vez de parafrasear." : "Beatrice aponta para a página exata do DS — Camila cita essa fonte nos docs em vez de parafrasear.", tone: "border-amber-500/12 bg-amber-500/5" },
          { title: "Reasoning Engine", tag: isPtPt ? "Captura de Intenção" : "Captura de Intenção", text: isPtPt ? "A camada XAI expõe intenção de design e princípios de UX que de outra forma são invisíveis — prontos para documentar." : "A camada XAI expõe intenção de design e princípios de UX que de outra forma são invisíveis — prontos para documentar.", tone: "border-primary/12 bg-primary/5" },
          { title: "Component Guidance", tag: isPtPt ? "Definição Canônica" : "Definição Canônica", text: isPtPt ? "Retorna resposta estruturada com descrição, contexto, quando-usar e quando-não-usar — pronta para documentação." : "Retorna resposta estruturada com descrição, contexto, quando-usar e quando-não-usar — pronta para documentação.", tone: "border-green-500/12 bg-green-500/5" },
        ] satisfies OracleCapability[],
        tools: ["Notion", "Confluence", "Storybook", "Beatrice", "Vale"],
        accentColor: "text-slate-300",
      },
      {
        id: "qa",
        name: "Rafael Nunes",
        role: isPtPt ? "Engenheiro de QA · Consumidor do DS" : "Engenheiro de QA · Consumidor do DS",
        chips: ["Testing", "Quality", "Compliance"] as [string, string, string],
        trustLabel: isPtPt ? "Confiança no DS" : "Confiança no DS",
        trustValue: isPtPt ? "Alta (operacional)" : "Alta (operacional)",
        trustWidth: "80%",
        trustColor: "from-green-600 to-green-400",
        quote: isPtPt
          ? "Preciso de saber como é o 'correto'. Se o DS diz quando não usar um componente, isso vira critério de aceite no meu test case."
          : "Preciso saber como é o 'correto'. Se o DS diz quando não usar um componente, isso vira critério de aceite no meu test case.",
        goals: [
          {
            title: isPtPt ? "Critérios de aceite claros a partir do DS" : "Critérios de aceite claros a partir do DS",
            text: isPtPt
              ? "Quando-usar e quando-não-usar têm de ser explícitos o suficiente para se tornarem condições de pass/fail num plano de testes."
              : "Quando-usar e quando-não-usar precisam ser explícitos o suficiente para se tornarem condições de pass/fail num plano de testes.",
          },
          {
            title: isPtPt ? "Identificar desvios da intenção do DS" : "Identificar desvios da intenção do DS",
            text: isPtPt
              ? "Detetar quando uma implementação diverge do que o design system especifica — mesmo em comportamento sutil."
              : "Detectar quando uma implementação diverge do que o design system especifica — mesmo em comportamento sutil.",
          },
          {
            title: isPtPt ? "Comportamento esperado por componente" : "Comportamento esperado por componente",
            text: isPtPt
              ? "Conhecer os estados de interação, edge cases e comportamentos de erro que um componente corretamente implementado deve exibir."
              : "Conhecer os estados de interação, edge cases e comportamentos de erro que um componente corretamente implementado deve exibir.",
          },
          {
            title: isPtPt ? "Testar consistência da Beatrice entre sessões" : "Testar consistência da Beatrice entre sessões",
            text: isPtPt
              ? "Validar que o oráculo dá respostas consistentes e rastreáveis para a mesma pergunta em diferentes utilizadores e momentos."
              : "Validar que o oráculo dá respostas consistentes e rastreáveis para a mesma pergunta em diferentes usuários e momentos.",
          },
        ] satisfies GoalItem[],
        frustrations: [
          { title: isPtPt ? "Sem critérios de aceite testáveis nos docs" : "Sem critérios de aceite testáveis nos docs", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[93%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Difícil testar intenção vs implementação" : "Difícil testar intenção vs implementação", severity: isPtPt ? "Crítico" : "Crítico", width: "w-[88%]", tone: "from-error to-red-400" },
          { title: isPtPt ? "Inconsistências entre comportamento documentado e real" : "Inconsistências entre comportamento documentado e real", severity: isPtPt ? "Alto" : "Alto", width: "w-[82%]", tone: "from-amber-500 to-amber-400" },
          { title: isPtPt ? "Sem distinção clara entre componentes similares" : "Sem distinção clara entre componentes similares", severity: isPtPt ? "Médio" : "Médio", width: "w-[65%]", tone: "from-primary/60 to-secondary/60" },
        ] satisfies FrustrationItem[],
        capabilities: [
          { title: "When-Not-To-Use", tag: isPtPt ? "Critério de Teste" : "Critério de Teste", text: isPtPt ? "Converte restrições do DS em condições operacionalizáveis que Rafael cola diretamente no TestRail." : "Converte restrições do DS em condições operacionalizáveis que Rafael cola diretamente no TestRail.", tone: "border-error/12 bg-error/5" },
          { title: "Confidence Meter", tag: isPtPt ? "Sinal de Risco" : "Sinal de Risco", text: isPtPt ? "Scores de confiança baixos sinalizam componentes que precisam de cobertura extra de testes." : "Scores de confiança baixos sinalizam componentes que precisam de cobertura extra de testes.", tone: "border-green-500/12 bg-green-500/5" },
          { title: isPtPt ? "Comparação de Componentes" : "Comparação de Componentes", tag: "Diff", text: isPtPt ? "Explica a diferença comportamental entre componentes similares — mapeia para distinções nos testes." : "Explica a diferença comportamental entre componentes similares — mapeia para distinções nos testes.", tone: "border-amber-500/12 bg-amber-500/5" },
        ] satisfies OracleCapability[],
        tools: ["Jira", "TestRail", "Chrome DevTools", "Storybook", "Beatrice"],
        accentColor: "text-green-400",
      },
    ] satisfies AdditionalPersona[],
  };
}

function MetaColumn({ items }: { items: MetaItem[] }) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {item.label}
          </p>
          <p className="font-semibold text-white">{item.value}</p>
          {item.detail ? <p className="text-xs text-slate-400">{item.detail}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function PersonaPage() {
  const { locale } = useI18n();
  const content = getPersonaContent(locale);
  const trustWidth = useMemo(() => "48%", []);
  const docsWidth = useMemo(() => "72%", []);

  return (
    <div className="space-y-8 pb-24">
      <section className="max-w-3xl">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-primary">{content.heroEyebrow}</p>
        <h1 className="mb-6 text-6xl font-extrabold leading-none tracking-tight text-white md:text-7xl">
          {content.heroTitle.split(" ")[0]} <span className="signature-text">{content.heroTitle.split(" ")[1] ?? ""}</span>
        </h1>
        <p className="text-lg font-light leading-relaxed text-slate-400">{content.heroText}</p>
      </section>

      <section className="glass-card overflow-hidden rounded-[32px] border border-primary/10">
        <div className="grid md:grid-cols-3">
          <div className="relative border-r border-white/5 bg-gradient-to-b from-primary/5 to-transparent p-10">
            <div className="absolute inset-0 bg-haze opacity-70" />
            <div className="relative flex flex-col items-center">
              <div className="mb-6 flex h-36 w-36 items-center justify-center rounded-[28px] border border-primary/20 bg-[linear-gradient(135deg,rgba(222,204,253,0.1),rgba(194,160,252,0.05))]">
                <UserRound className="h-16 w-16 text-primary" />
              </div>
              <h2 className="mb-1 text-2xl font-black tracking-tight text-white">{content.personaName}</h2>
              <p className="mb-4 text-sm font-semibold text-primary">{content.personaRole}</p>
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {content.chips.map((label, index) => (
                  <span
                    key={label}
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                      index === 0
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : index === 1
                          ? "border-secondary/20 bg-secondary/10 text-secondary"
                          : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="w-full space-y-3 rounded-2xl border border-white/5 bg-surface-container p-4">
                <div>
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {content.trustLabel}
                    </span>
                    <span className="text-xs font-black text-amber-400">{content.trustValue}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: trustWidth }} />
                  </div>
                  <p className="mt-1 text-[9px] text-slate-500">{content.trustText}</p>
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {content.docsLabel}
                    </span>
                    <span className="text-xs font-black text-error">~35 min</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full rounded-full bg-gradient-to-r from-error to-red-400" style={{ width: docsWidth }} />
                  </div>
                  <p className="mt-1 text-[9px] text-slate-500">{content.docsText}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 md:col-span-2">
            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <MetaColumn items={content.leftMeta} />
              <MetaColumn items={content.rightMeta} />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-6">
              <div className="absolute inset-0 bg-haze opacity-70" />
              <div className="relative">
                <blockquote className="text-lg font-medium italic leading-relaxed text-white">
                  {content.quote}
                </blockquote>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary">
                  {content.quoteLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="glass-card rounded-[24px] p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{content.goalsTitle}</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{content.goalsEyebrow}</p>
            </div>
          </div>
          <div className="space-y-4">
            {content.goals.map((goal) => (
              <div key={goal.title} className="flex items-start gap-4 rounded-xl border border-green-500/10 bg-green-500/5 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <div>
                  <p className="mb-0.5 text-sm font-semibold text-white">{goal.title}</p>
                  <p className="text-xs leading-relaxed text-slate-400">{goal.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-error/20 bg-error/10">
              <Timer className="h-5 w-5 text-error" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{content.frustrationsTitle}</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{content.frustrationsEyebrow}</p>
            </div>
          </div>
          <div className="space-y-5">
            {content.frustrations.map((item) => (
              <div key={item.title}>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                  <span
                    className={`text-[10px] font-bold ${
                      item.severity === "Crítico"
                        ? "text-error"
                        : item.severity === "Alto"
                          ? "text-amber-400"
                          : "text-primary"
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="mb-1 h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div className={`h-full rounded-full bg-gradient-to-r ${item.tone} ${item.width}`} />
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-5">
        <div className="glass-card rounded-[24px] p-8 md:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <Construction className="h-6 w-6 text-primary" />
            <h3 className="text-base font-bold text-white">{content.toolsTitle}</h3>
          </div>
          <div className="space-y-3">
            {content.tools.map(([name, desc, tag]) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <span className="text-[10px] font-black text-slate-300">{name.slice(0, 2)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{name}</p>
                  <p className="text-[9px] text-slate-500">{desc}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-8 md:col-span-3">
          <div className="mb-2 flex items-center gap-3">
            <Group className="h-6 w-6 text-primary" />
            <h3 className="text-base font-bold text-white">{content.secondaryTitle}</h3>
          </div>
          <p className="mb-6 text-xs text-slate-500">{content.secondaryEyebrow}</p>
          <div className="space-y-4">
            {content.secondaryPersonas.map((persona) => (
              <div
                key={persona.title}
                className="flex items-start gap-4 rounded-2xl border border-white/5 bg-surface-container/40 p-5 transition-all hover:border-primary/15"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Code2 className="h-4 w-4 text-slate-300" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">{persona.title}</span>
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-bold ${persona.tone}`}>
                      {persona.level}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">{persona.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="glass-card rounded-[24px] p-8 md:col-span-2">
          <div className="mb-7 flex items-center gap-3">
            <Compass className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-bold text-white">{content.journeyTitle}</h3>
          </div>
          <div className="space-y-5">
            {content.journeySteps.map((step, index) => (
              <div key={step.title} className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-surface-container-high">
                  {index === content.journeySteps.length - 1 ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <FileQuestion className="h-4 w-4 text-slate-300" />
                  )}
                </div>
                <div className="pt-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {step.moment}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
                        step.tag === "Ideal"
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : step.tag === "Bloqueio" || step.tag === "Blocker"
                            ? "border-red-500/20 bg-red-500/10 text-red-400"
                            : step.tag === "Esforço" || step.tag === "Effort"
                              ? "border-amber-400/20 bg-amber-400/10 text-amber-400"
                              : "border-white/10 bg-white/5 text-slate-400"
                      }`}
                    >
                      {step.tag}
                    </span>
                  </div>
                  <p className="mb-1 text-sm font-semibold text-white">{step.title}</p>
                  <p className="text-xs text-slate-400">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-[24px] p-7">
            <p className="mb-5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <Bot className="h-3.5 w-3.5" />
              {content.idealAnswerTitle}
            </p>
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {content.questionLabel}
                </p>
                <p className="text-xs italic text-white">{content.idealQuestion}</p>
              </div>
              <div className="space-y-3 rounded-xl bg-surface-container-high/40 p-4">
                {content.idealAnswerBlocks.map(([label, value]) => (
                  <p key={label} className="text-xs text-slate-300">
                    <span className="font-bold text-white">{label}</span> {value}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[24px] border border-primary/10 p-7">
            <p className="mb-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <MessageSquareQuote className="h-3.5 w-3.5" />
              {content.idealScenario}
            </p>
            <p className="text-sm italic leading-relaxed text-slate-300">{content.idealScenarioText}</p>
          </div>
        </div>
      </section>

      <section className="glass-card relative overflow-hidden rounded-[24px] border border-primary/10 p-8">
        <div className="absolute inset-0 bg-haze opacity-70" />
        <div className="relative">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-signature">
              <BrainCircuit className="h-5 w-5 text-on-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{content.capabilityTitle}</h3>
              <p className="text-xs text-slate-500">{content.capabilityEyebrow}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {content.oracleCapabilities.map((item) => (
              <div
                key={item.title}
                className={`flex items-start gap-4 rounded-2xl border p-5 transition-all ${item.tone}`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-300">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="glass-card rounded-[24px] p-8">
          <div className="mb-6 flex items-center gap-3">
            <MessageSquareQuote className="h-6 w-6 text-primary" />
            <h3 className="text-base font-bold text-white">{content.literatureTitle}</h3>
          </div>
          <div className="space-y-5">
            {content.literature.map((quote) => (
              <div key={quote.source} className={`rounded-xl border-l-2 bg-surface-container-high/40 p-4 ${quote.tone}`}>
                <p className="mb-2 text-xs italic leading-relaxed text-slate-300">{quote.text}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                  {quote.source}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card relative overflow-hidden rounded-[24px] border border-primary/10 p-8 md:col-span-2">
          <div className="absolute inset-0 bg-haze opacity-70" />
          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-signature">
                <Lightbulb className="h-5 w-5 text-on-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{content.opportunityTitle}</h3>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">{content.opportunityEyebrow}</p>
              </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-surface-container/60 p-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {content.problemLabel}
                </p>
                <p className="text-sm font-semibold leading-relaxed text-white">{content.problemText}</p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  {content.solutionLabel}
                </p>
                <p className="text-sm font-semibold leading-relaxed text-white">{content.solutionText}</p>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              {content.opportunityBullets.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ArrowItem />
                  <p className="text-xs leading-relaxed text-slate-300">{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-primary/15 bg-primary/8 p-5">
              <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Activity className="h-3.5 w-3.5" />
                {content.researchQuestionLabel}
              </p>
              <p className="text-sm font-semibold italic leading-relaxed text-white">
                {content.researchQuestion}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[24px] p-8">
        <div className="mb-7 flex items-center gap-3">
          <Verified className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-lg font-bold text-white">{content.successTitle}</h3>
            <p className="text-xs text-slate-500">{content.successEyebrow}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {content.successMetrics.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/5 bg-surface-container-high/40 p-5 text-center">
              <BadgeCheck className="mx-auto mb-2 h-7 w-7 text-primary" />
              <p className="mb-1 text-xs font-bold text-white">{title}</p>
              <p className="text-[10px] leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Additional personas — 2×2 grid */}
      <section className="space-y-6">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-primary">{content.additionalPersonasTitle}</p>
          <p className="text-sm text-slate-500">{content.additionalPersonasEyebrow}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {content.additionalPersonas.map((persona) => (
            <AdditionalPersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      </section>

      <section className="relative mt-24 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
          <span className="text-9xl font-black tracking-tighter text-white">FRANCISCO</span>
        </div>
        <p className="relative z-10 mb-4 text-sm uppercase tracking-widest text-slate-500">
          {content.footerEyebrow}
        </p>
        <p className="relative z-10 mx-auto max-w-3xl text-3xl font-light italic leading-relaxed text-white">
          {content.footerText.split(content.footerAccent)[0]}
          <span className="text-primary">{content.footerAccent}</span>
          {content.footerText.split(content.footerAccent)[1]}
        </p>
        <div className="relative z-10 mt-12 flex justify-center gap-4">
          <Link
            to="/beatrice-chat"
            className="rounded-full bg-signature px-8 py-3 text-sm font-bold tracking-tight text-on-primary shadow-glow transition-transform hover:scale-105"
          >
            {content.footerPrimary}
          </Link>
          <Link
            to="/components"
            className="rounded-full border border-white/10 px-8 py-3 text-sm font-bold tracking-tight text-white transition-all hover:bg-white/5"
          >
            {content.footerSecondary}
          </Link>
        </div>
      </section>
    </div>
  );
}

function AdditionalPersonaCard({ persona }: { persona: AdditionalPersona }) {
  return (
    <div className="glass-card overflow-hidden rounded-[24px] border border-white/5">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-white/5 bg-surface-container-high/30 p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-surface-container">
          <UserRound className={`h-7 w-7 ${persona.accentColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-black tracking-tight text-white">{persona.name}</h3>
          <p className={`text-xs font-semibold ${persona.accentColor}`}>{persona.role}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {persona.chips.map((chip, i) => (
              <span
                key={chip}
                className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${
                  i === 0
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : i === 1
                      ? "border-secondary/20 bg-secondary/10 text-secondary"
                      : "border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        {/* Trust bar */}
        <div className="hidden w-28 shrink-0 sm:block">
          <div className="mb-1 flex justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{persona.trustLabel}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div className={`h-full rounded-full bg-gradient-to-r ${persona.trustColor}`} style={{ width: persona.trustWidth }} />
          </div>
          <p className={`mt-0.5 text-[9px] font-bold ${persona.accentColor}`}>{persona.trustValue}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Quote */}
        <blockquote className="rounded-xl border-l-2 border-primary/30 bg-primary/5 px-4 py-3 text-xs italic leading-relaxed text-slate-300">
          {persona.quote}
        </blockquote>

        {/* Goals + Frustrations side by side */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
              <Target className="h-3 w-3 text-green-400" /> Objetivos
            </p>
            <div className="space-y-2">
              {persona.goals.map((g) => (
                <div key={g.title} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-400" />
                  <p className="text-[10px] leading-relaxed text-slate-300">{g.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
              <Timer className="h-3 w-3 text-error" /> Frustrações
            </p>
            <div className="space-y-2.5">
              {persona.frustrations.map((f) => (
                <div key={f.title}>
                  <div className="mb-0.5 flex items-center justify-between">
                    <p className="text-[10px] text-slate-300">{f.title}</p>
                    <span className={`text-[9px] font-bold ${f.severity === "Crítico" || f.severity === "Critical" ? "text-error" : f.severity === "Alto" || f.severity === "High" ? "text-amber-400" : "text-primary"}`}>{f.severity}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-surface-container-high">
                    <div className={`h-full rounded-full bg-gradient-to-r ${f.tone} ${f.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Oracle capabilities */}
        <div>
          <p className="mb-2.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            <Bot className="h-3 w-3 text-primary" /> Beatrice resolve
          </p>
          <div className="space-y-2">
            {persona.capabilities.map((cap) => (
              <div key={cap.title} className={`flex items-start gap-3 rounded-xl border p-3 ${cap.tone}`}>
                <div>
                  <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white">{cap.title}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-slate-400">{cap.tag}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-400">{cap.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
          {persona.tools.map((tool) => (
            <span key={tool} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold text-slate-500">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowItem() {
  return <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />;
}
