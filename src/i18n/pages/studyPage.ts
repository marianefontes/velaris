import type { Locale } from "../translations";
import { localizeContent } from "../localizedContent";

const text = (locale: Locale, ptBr: string, en: string, ptPt?: string) =>
  localizeContent(locale, ptBr, en, ptPt);

export function getStudyPageContent(locale: Locale) {
  const t = (ptBr: string, en: string, ptPt?: string) => text(locale, ptBr, en, ptPt);

  return {
    brandSubtitle: t("Pesquisa acadêmica", "Academic research", "Investigação académica"),
    participantLabel: (code: string) =>
      t(`Participante ${code}`, `Participant ${code}`, `Participante ${code}`),
    optional: t("Opcional", "Optional", "Opcional"),
    selectPlaceholder: t("Selecione uma opção", "Select an option", "Selecione uma opção"),
    loading: t("Validando convite de pesquisa", "Validating research invite", "A validar convite de investigação"),
    inviteEyebrow: t("Convite de pesquisa", "Research invite", "Convite de investigação"),
    usedTitle: t("Este convite já foi utilizado.", "This invite has already been used.", "Este convite já foi utilizado."),
    invalidTitle: t(
      "Este convite não está disponível.",
      "This invite is not available.",
      "Este convite não está disponível.",
    ),
    usedBody: t(
      "Abra o convite no mesmo navegador usado no cadastro ou entre em contato com as pesquisadoras.",
      "Open the invite in the same browser used during enrollment or contact the researchers.",
      "Abra o convite no mesmo navegador usado no registo ou contacte as investigadoras.",
    ),
    invalidBody: t(
      "O link pode ter expirado, sido revogado ou estar incompleto. Solicite um novo convite às pesquisadoras.",
      "The link may have expired, been revoked, or be incomplete. Request a new invite from the researchers.",
      "A ligação pode ter expirado, sido revogada ou estar incompleta. Solicite um novo convite às investigadoras.",
    ),
    connectionError: t(
      "Não foi possível validar o convite. Verifique sua conexão e tente novamente.",
      "Could not validate the invite. Check your connection and try again.",
      "Não foi possível validar o convite. Verifique a sua ligação e tente novamente.",
    ),
    successEyebrow: (code: string) =>
      t(`Participação ${code}`, `Participation ${code}`, `Participação ${code}`),
    successTitle: t(
      "Cadastro concluído. Sua sessão está pronta.",
      "Enrollment complete. Your session is ready.",
      "Registo concluído. A sua sessão está pronta.",
    ),
    successBody: t(
      "A partir do próximo passo, sua navegação e suas interações com o Oráculo serão associadas apenas ao código da pesquisa.",
      "From the next step on, your navigation and interactions with the Oracle will be linked only to your research code.",
      "A partir do passo seguinte, a sua navegação e as suas interações com o Oráculo serão associadas apenas ao código da investigação.",
    ),
    startExperience: t("Começar experiência", "Start experience", "Começar experiência"),
    heroTitle: t("Antes de consultar Abraxos.", "Before consulting Abraxos.", "Antes de consultar Abraxos."),
    heroBody: t(
      "Precisamos conhecer brevemente seu contexto profissional e registrar seu consentimento para a pesquisa do TCC.",
      "We need a brief overview of your professional context and your consent for this undergraduate research study.",
      "Precisamos de conhecer brevemente o seu contexto profissional e registar o seu consentimento para a investigação do TCC.",
    ),
    highlights: [
      {
        title: t("Duração estimada", "Estimated duration", "Duração estimada"),
        body: t("Aproximadamente 30 minutos", "Approximately 30 minutes", "Aproximadamente 30 minutos"),
      },
      {
        title: t("Finalidade", "Purpose", "Finalidade"),
        body: t("Uso acadêmico e estudantil", "Academic and student use", "Utilização académica e estudantil"),
      },
      {
        title: t("Apresentação dos dados", "Data presentation", "Apresentação dos dados"),
        body: t(
          "Identificação substituída por código",
          "Identification replaced by code",
          "Identificação substituída por código",
        ),
      },
    ],
    sections: {
      about: {
        title: t("Sobre você", "About you", "Sobre si"),
        description: t(
          "Esses dados ajudam a interpretar os resultados conforme o perfil profissional.",
          "This information helps interpret results according to professional profile.",
          "Estes dados ajudam a interpretar os resultados de acordo com o perfil profissional.",
        ),
      },
      company: {
        title: t("Empresa", "Company", "Empresa"),
        description: t(
          "Essa informação é opcional e não será divulgada no trabalho.",
          "This information is optional and will not be disclosed in the thesis.",
          "Esta informação é opcional e não será divulgada no trabalho.",
        ),
        legend: t(
          "Você deseja informar a empresa onde trabalha?",
          "Do you want to share the company where you work?",
          "Deseja indicar a empresa onde trabalha?",
        ),
        yes: t("Sim, desejo informar", "Yes, I want to share", "Sim, desejo indicar"),
        no: t("Prefiro não informar", "Prefer not to share", "Prefiro não indicar"),
      },
      consent: {
        title: t("Consentimento", "Consent", "Consentimento"),
        description: t(
          "Leia as condições abaixo antes de iniciar sua participação.",
          "Read the conditions below before starting your participation.",
          "Leia as condições abaixo antes de iniciar a sua participação.",
        ),
        summaryTitle: t("Termo resumido de consentimento", "Summary consent statement", "Termo resumido de consentimento"),
        summaryParagraphs: [
          t(
            "Esta atividade integra o trabalho acadêmico sobre o Velaris, desenvolvido por Mariane Beatriz Soares Fontes e Gabrielle Canalle no CESAR.",
            "This activity is part of the academic work on Velaris, developed by Mariane Beatriz Soares Fontes and Gabrielle Canalle at CESAR.",
            "Esta atividade integra o trabalho académico sobre o Velaris, desenvolvido por Mariane Beatriz Soares Fontes e Gabrielle Canalle no CESAR.",
          ),
          t(
            "Nome, cargo, perfil profissional, respostas, perguntas enviadas, respostas recebidas, páginas acessadas e tempo de interação poderão ser registrados para análise acadêmica e estudantil.",
            "Name, role, professional profile, responses, submitted questions, received answers, visited pages, and interaction time may be recorded for academic analysis.",
            "Nome, cargo, perfil profissional, respostas, perguntas enviadas, respostas recebidas, páginas visitadas e tempo de interação poderão ser registados para análise académica e estudantil.",
          ),
          t(
            "Em relatórios, apresentações e publicações, seu nome e a empresa informada não serão divulgados. A participação será apresentada por um código, como {code}. Os dados poderão ser mantidos por até 12 meses para auditoria acadêmica.",
            "In reports, presentations, and publications, your name and the company you provide will not be disclosed. Participation will be shown using a code such as {code}. Data may be kept for up to 12 months for academic audit.",
            "Em relatórios, apresentações e publicações, o seu nome e a empresa indicada não serão divulgados. A participação será apresentada por um código, como {code}. Os dados poderão ser mantidos durante até 12 meses para auditoria académica.",
          ),
          t(
            "A participação é voluntária. Você pode interrompê-la a qualquer momento e solicitar a retirada dos dados pelo mesmo canal em que recebeu o convite. Não inclua informações confidenciais da sua empresa nas perguntas ao Oráculo.",
            "Participation is voluntary. You may stop at any time and request data withdrawal through the same channel where you received the invite. Do not include confidential company information in questions to the Oracle.",
            "A participação é voluntária. Pode interrompê-la a qualquer momento e solicitar a retirada dos dados pelo mesmo canal em que recebeu o convite. Não inclua informações confidenciais da sua empresa nas perguntas ao Oráculo.",
          ),
        ],
      },
    },
    fields: {
      fullName: t("Nome completo", "Full name", "Nome completo"),
      fullNamePlaceholder: t(
        "Como podemos identificar você?",
        "How should we identify you?",
        "Como podemos identificá-lo(a)?",
      ),
      roleTitle: t("Cargo ou função atual", "Current role or title", "Cargo ou função atual"),
      roleTitlePlaceholder: t("Ex.: Product Designer", "E.g. Product Designer", "Ex.: Product Designer"),
      primaryArea: t("Principal área de atuação", "Primary area of practice", "Principal área de atuação"),
      experienceRange: t("Tempo de experiência profissional", "Professional experience", "Tempo de experiência profissional"),
      designSystemExperience: t(
        "Experiência com design systems",
        "Design system experience",
        "Experiência com design systems",
      ),
      designSystemFrequency: t(
        "Frequência de uso de design systems",
        "Design system usage frequency",
        "Frequência de utilização de design systems",
      ),
      companyName: t("Nome da empresa", "Company name", "Nome da empresa"),
      companyNamePlaceholder: t(
        "Informe o nome da organização",
        "Enter the organization name",
        "Indique o nome da organização",
      ),
    },
    areaOptions: [
      ["design", t("Design / UX / UI", "Design / UX / UI", "Design / UX / UI")],
      ["frontend", t("Desenvolvimento front-end", "Front-end development", "Desenvolvimento front-end")],
      ["product", t("Produto / Gestão de produto", "Product / Product management", "Produto / Gestão de produto")],
      ["qa", t("Qualidade / QA", "Quality / QA", "Qualidade / QA")],
      ["content", t("Conteúdo / UX Writing", "Content / UX writing", "Conteúdo / UX Writing")],
      ["accessibility", t("Acessibilidade", "Accessibility", "Acessibilidade")],
      ["research", t("Pesquisa", "Research", "Investigação")],
      ["other", t("Outra área", "Other area", "Outra área")],
    ] as const,
    experienceOptions: [
      ["under-1", t("Menos de 1 ano", "Less than 1 year", "Menos de 1 ano")],
      ["1-2", t("1 a 2 anos", "1 to 2 years", "1 a 2 anos")],
      ["3-5", t("3 a 5 anos", "3 to 5 years", "3 a 5 anos")],
      ["6-10", t("6 a 10 anos", "6 to 10 years", "6 a 10 anos")],
      ["over-10", t("Mais de 10 anos", "More than 10 years", "Mais de 10 anos")],
    ] as const,
    designSystemExperienceOptions: [
      ["none", t("Nenhuma experiência", "No experience", "Nenhuma experiência")],
      ["basic", t("Básica", "Basic", "Básica")],
      ["intermediate", t("Intermediária", "Intermediate", "Intermédia")],
      ["advanced", t("Avançada", "Advanced", "Avançada")],
    ] as const,
    designSystemFrequencyOptions: [
      ["never", t("Nunca utilizo", "Never use", "Nunca utilizo")],
      ["rarely", t("Raramente", "Rarely", "Raramente")],
      ["monthly", t("Algumas vezes por mês", "A few times per month", "Algumas vezes por mês")],
      ["weekly", t("Semanalmente", "Weekly", "Semanalmente")],
      ["daily", t("Diariamente", "Daily", "Diariamente")],
    ] as const,
    consentChecks: {
      adult: t("Confirmo que tenho 18 anos ou mais.", "I confirm that I am 18 years or older.", "Confirmo que tenho 18 anos ou mais."),
      academicUse: t(
        "Autorizo o uso dos dados informados exclusivamente para finalidades acadêmicas e estudantis relacionadas a esta pesquisa.",
        "I authorize use of the provided data exclusively for academic and student purposes related to this study.",
        "Autorizo a utilização dos dados indicados exclusivamente para finalidades académicas e estudantis relacionadas com esta investigação.",
      ),
      recording: t(
        "Estou ciente de que minha navegação, perguntas, respostas e resultados das tarefas serão registrados para análise.",
        "I understand that my navigation, questions, answers, and task results will be recorded for analysis.",
        "Estou ciente de que a minha navegação, perguntas, respostas e resultados das tarefas serão registados para análise.",
      ),
      voluntary: t(
        "Entendo que minha participação é voluntária e que minha identidade e empresa não serão divulgadas nos resultados.",
        "I understand that my participation is voluntary and that my identity and company will not be disclosed in the results.",
        "Compreendo que a minha participação é voluntária e que a minha identidade e empresa não serão divulgadas nos resultados.",
      ),
    },
    errors: {
      consentRequired: t(
        "Confirme todos os itens de consentimento para continuar.",
        "Confirm all consent items to continue.",
        "Confirme todos os itens de consentimento para continuar.",
      ),
      companyRequired: t(
        "Informe o nome da empresa ou selecione que prefere não informar.",
        "Enter the company name or choose not to share.",
        "Indique o nome da empresa ou selecione que prefere não indicar.",
      ),
      inviteUsed: t("Este convite já foi utilizado.", "This invite has already been used.", "Este convite já foi utilizado."),
      enrollmentFailed: t(
        "Não foi possível iniciar a participação. Tente novamente em alguns instantes.",
        "Could not start participation. Try again in a few moments.",
        "Não foi possível iniciar a participação. Tente novamente dentro de alguns instantes.",
      ),
    },
    consentVersion: (version: string) => t(`Consentimento v${version}`, `Consent v${version}`, `Consentimento v${version}`),
    submitPreparing: t("Preparando sessão", "Preparing session", "A preparar sessão"),
    submitCta: t("Concordar e participar", "Agree and participate", "Concordar e participar"),
  };
}

export type StudyPageContent = ReturnType<typeof getStudyPageContent>;
