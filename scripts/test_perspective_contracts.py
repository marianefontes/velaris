"""Regression checks for specialized Beatrice perspective contracts."""

from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from cognition.orchestration.strategy_composer import compose_strategy_context
from cognition.orchestration.strategy_selector import StrategyActivation
from cognition.orchestration.complexity_analyzer import analyze_complexity
from cognition.orchestration.ambiguity_detector import detect_ambiguity
from cognition.orchestration.skill_application import filter_applied_skills
from cognition.overrides.manual_override_parser import ManualOverride
from prompts.perspective_contracts import (
    PERSPECTIVE_RESPONSE_CONTRACTS,
    build_response_audit_metadata,
    get_perspective_response_contract,
    validate_perspective_response,
)
from prompts.cognitive_profiles import COGNITIVE_PROFILES
from prompts.perspective_health import (
    EXPECTED_PERSPECTIVE_FILES,
    IGNORED_PERSPECTIVE_FILES,
    build_perspective_health_payload,
)
from prompts.perspective_ids import (
    CANONICAL_PERSPECTIVE_IDS,
    normalize_profile_id,
)
from agent.models import AgentChatRequest
from prompts.prompt_builder import PromptBuildContext, build_system_prompt
from rag.context_builder import build_perspective_evidence_block, serialize_sources


DESTRUCTIVE_ACTION_QUESTION = (
    "Qual componente devo usar para uma ação destrutiva, "
    "como excluir um item importante?"
)


DEVELOPER_COMPLETE = """
## Recomendação técnica
Use o Modal padronizado. O primeiro clique abre o modal e não exclui.
O ownership do estado permanece no fluxo chamador e o limite do componente
termina no evento de confirmação.

## Contrato de componente sugerido
API proposta com props `open`, `onOpenChange`, `onConfirm`, `onCancel`,
`confirmLabel` e `isLoading`.

## Fluxo de estado
Somente `onConfirm` inicia a operação. Durante loading, bloqueie duplo clique.
Em sucesso, feche o modal e atualize a lista. Em erro, mantenha o modal aberto.
Defina o cancelamento.

## Edge cases e cuidados técnicos
Trate falha de rede, permissão negada, item removido por outro usuário,
loading infinito, mobile e dependências relacionadas.

## Acessibilidade técnica mínima
Use focus trap, `aria-modal`, `aria-labelledby`, `aria-describedby`, teclado e
retorno de foco. O texto da ação não deve depender apenas de cor.

## Quando não usar
Para ação reversível, considere undo.

## Integração e reuso
Use o componente padronizado do design system e centralize a lógica para reuso.

## Evidências
Evidence similarity de 81%, evidence tier strong. Limitação: a API é proposta.
"""


ACCESSIBILITY_COMPLETE = """
## Recomendação de acessibilidade
Use um ConfirmDialog ou Modal/Dialog padronizado. O botão destrutivo funciona
somente como gatilho para a confirmação.
A barreira concreta é a exclusão acidental sem contexto. O impacto no usuário
é perda de dados e dificuldade de recuperação.

## Semântica, foco e tecnologia assistiva
Defina gerenciamento de foco, foco visível, focus trap e retorno de foco.
Garanta navegação por teclado com Tab, Shift+Tab e Escape.
Use HTML semântico, `role="dialog"`, `aria-modal`, `aria-labelledby` e
`aria-describedby`.

O leitor de tela ou outra tecnologia assistiva deve anunciar título,
descrição, loading, erro, disabled e sucesso.

## Estados e prevenção de erro
Para prevenção de erro, exija confirmação explícita, descreva a consequência,
ofereça Cancelar e considere desfazer. Bloqueie duplo envio.

## Checklist acessível
- foco e teclado verificados
- semântica e anúncio verificados
- estados acessíveis verificados

## Evidências
Evidence similarity de 81%, evidence tier strong. Limitação: requer teste manual.
"""

DESIGNER_COMPLETE = """
## Diagnóstico visual
A inconsistência visual é o mesmo peso visual em todas as regiões. O efeito
perceptivo é perda de foco.

Elemento ou região: cabeçalho e cards.
Causa visual: peso visual equivalente.
Efeito perceptivo: perda de foco.
Correção sistêmica: reduzir escala e contraste das regiões secundárias.
Dependência de token ou estado: verificar tokens de tipografia e espaçamento.
Fronteira de usabilidade: a prioridade da tarefa requer validação separada.

## Hierarquia, composição e ritmo
Reforce hierarquia e composição com grid, alinhamento e ritmo consistentes.

## Tokens, tipografia e cor
Use tokens documentados para espaçamento, tipografia e cor.

## Estados visuais e consistência
Alinhe estados visuais e affordance à consistência estética do sistema.

## Ajustes recomendados
Reduza o peso das áreas secundárias e preserve o foco principal.

## Evidências e limitações
evidence similarity 81%, evidence tier strong. Limitação: o token oficial não
está documentado; a correção é uma inferência.
"""


PRODUCT_DESIGNER_COMPLETE = """
## Diagnóstico da experiência
A ação principal é concluir a configuração e atende à necessidade do usuário
de terminar a tarefa sem contexto adicional. O maior risco comportamental é
abandono.

Ação principal esperada: concluir a configuração.
Necessidade ou contexto: terminar a tarefa sem contexto adicional.
Evidência observada: a descrição fornecida.
Hipótese comportamental: o usuário não percebe a continuação.
Maior risco: abandono.
Mudança proposta: manter a ação principal persistente.
Sinal que sustenta a hipótese: aumento da taxa de conclusão.
Sinal que refuta a hipótese: nenhuma mudança na conclusão ou nos erros.

## Fluxo, fricção e próxima ação
O fluxo tem fricção antes da próxima ação e feedback tardio, aumentando a
carga cognitiva.

## Interface, feedback e carga cognitiva
Mostre feedback no ponto da ação e reduza informação que precisa ser lembrada.

## Evidências, hipóteses e riscos
Evidência observada: a descrição fornecida. Hipótese: o usuário não percebe a
continuação. Risco comportamental: abandono.

## Alternativas de solução
Alternativa: manter a ação principal persistente e comparar a compreensão.

## Validação recomendada
Faça validação qualitativa com teste de usabilidade e validação quantitativa
pela taxa de conclusão.

**Evidências e limitações**
evidence similarity 81%, evidence tier strong.
Limitação: não há pesquisa documentada; a recomendação é uma inferência.
"""


QA_COMPLETE = """
## Risco principal
O risco principal é estado divergente após falha, com superfície de regressão
no fluxo de confirmação.

## Critérios de aceite
Precondição: item existente e usuário autorizado.
Ação: confirmar uma vez.
Passa se: uma requisição é enviada e o sucesso fica visível.
Falha se: duplo clique gera duas requisições.
Observação: UI state, request e resposta persistida.

## Cenários de teste
Happy path com dados válidos, negative path com falha de rede e edge case com
resposta atrasada.

## Edge cases e casos negativos
Permissão negada mantém dados e mostra recuperação observável.

## Regressão e estados
Validar loading, error, disabled, success e empty em mobile.

## Plano de validação
Automatizada para contrato e duplicidade, manual para recuperação e
acessibilidade para teclado e foco.

## Evidências e limitações
evidence similarity 81%, evidence tier strong. Limitação: o resultado de
browser não está documentado e requer teste manual.
"""


TECH_WRITER_COMPLETE = """
## O que precisa ficar claro
A ambiguidade é um defeito do sistema. A interpretação errada possível é ler
similaridade como confiança.

Audiência: usuário do Audit Drawer.
Termo canônico: `evidence similarity`.
Ambiguidade: similaridade pode parecer confiança.
Interpretação errada possível: o percentual mede certeza do modelo.
Redação recomendada: "Relevância da evidência recuperada".
Redação a evitar: "Confiança da resposta".
Próxima ação documental: alinhar UI e glossário.

## Nomenclatura e consistência
O termo canônico é `evidence similarity`; preserve essa terminologia.

## Microcopy e mensagens
Microcopy recomendada para o Audit Drawer: "Relevância da evidência
recuperada". A mensagem de erro deve indicar a próxima ação.

## Exemplo recomendado
Exemplo recomendado: "evidence similarity: 81%".

## Instruções acionáveis
Passo 1: exiba o rótulo. Passo 2: explique o resultado esperado.

## Evidências e limitações
evidence similarity 81%, evidence tier strong. Limitação: a redação oficial
não está documentada; o texto é uma inferência.
"""


MAINTAINER_COMPLETE = """
## Risco de manutenção
O risco de regressão está na mudança futura do contrato assíncrono e no custo
de onboarding.

Disposição: consolidar regra compartilhada.
Gatilho de mudança: uma segunda variação exigir comportamento incompatível.

## Acoplamento, duplicação e ownership
A lógica deve morar no módulo de confirmação, com ownership explícito.
Duplicação aceitável é local e estável; duplicação perigosa replica a mesma
regra. Evite acoplamento e lógica fragmentada.

## Abstração mínima segura
A abstração mínima é o menor caminho estável, testável e removível. Não
abstrair variantes ainda instáveis.

## Custo de evolução
O custo de evolução cresce se cada consumidor alterar a regra separadamente.

## Plano de simplificação
Centralize somente a regra compartilhada e preserve os casos explícitos.

## Validação
Validação por regressão dos consumidores.

**Evidências e limitações**
evidence similarity 81%, evidence tier strong. Limitação: o owner atual não
está documentado; a proposta é uma inferência.
"""


DESIGN_SYSTEM_MANAGER_COMPLETE = """
## Valor estratégico
Classificação: padrão experimental. O critério mínimo é demanda recorrente.

Owner da decisão: não documentado.
Times afetados: design, engenharia, produto, QA e documentação.
Gate de aprovação: problema recorrente e owner definido.
Gate de promoção: implementação, documentação, QA e acessibilidade.
Sinal de adoção: migração concluída e volume de exceções.
Consequência da fragmentação: padrões concorrentes e custo de convergência.

## Impacto sistêmico e adoção
Times afetados: design, engenharia, produto, QA e documentação. O impacto de
adoção inclui migração e treinamento.

## Governança e critérios de exceção
Defina governança, ownership, critério de aprovação e maturidade antes de
promover o padrão.

## Risco de fragmentação
O risco de fragmentação é cada time criar um padrão concorrente.

## Prioridade e roadmap
O roadmap deve comparar prioridade, custo de rollout e métrica de adoção.

## Critérios de maturidade
Promover apenas após documentação, implementação, QA e acessibilidade.

## Evidências e limitações
evidence similarity 81%, evidence tier strong. Limitação: a demanda entre
times não está documentada; a classificação é uma inferência.
"""


def _prompt_context(profile: str, command_mode: str | None = None) -> PromptBuildContext:
    return PromptBuildContext(
        query=DESTRUCTIVE_ACTION_QUESTION,
        retrieval_intent="component_guidance",
        response_intent="component_guidance",
        profile=profile,
        command_mode=command_mode,
        catalog_mode=False,
        catalog_entity="none",
        rag_context="# Aetheris Semantic Evidence\nNo evidence for this fixture.",
    )


def test_contract_registry() -> None:
    expected_paths = {
        "dev": "perspectives/developer.md",
        "designer": "perspectives/designer.md",
        "product_designer": "perspectives/product-designer.md",
        "qa": "perspectives/qa.md",
        "tech_writer": "perspectives/tech-writer.md",
        "a11y": "perspectives/accessibility.md",
        "maintainer": "perspectives/maintainer.md",
        "design_system_manager": "perspectives/design-system-manager.md",
    }
    assert tuple(PERSPECTIVE_RESPONSE_CONTRACTS) == (
        "dev",
        "a11y",
        "designer",
        "product_designer",
        "qa",
        "tech_writer",
        "maintainer",
        "design_system_manager",
    )
    assert set(COGNITIVE_PROFILES) == set(CANONICAL_PERSPECTIVE_IDS)
    for profile, prompt_path in expected_paths.items():
        contract = get_perspective_response_contract(profile)
        assert contract is not None
        assert contract.profile == profile
        assert contract.prompt_path == prompt_path
        assert (ROOT / "prompts" / prompt_path).is_file()

    assert get_perspective_response_contract("pm").profile == "design_system_manager"
    assert get_perspective_response_contract("writer").profile == "tech_writer"


def test_profile_alias_normalization() -> None:
    assert normalize_profile_id("pm") == "design_system_manager"
    assert normalize_profile_id("writer") == "tech_writer"
    assert normalize_profile_id("product_designer") == "product_designer"
    assert normalize_profile_id("unknown") == "general"

    request = AgentChatRequest(
        messages=[{"role": "user", "content": "Teste"}],
        profile="pm",
    )
    assert request.profile == "design_system_manager"


def test_professional_perspective_boundaries() -> None:
    designer = COGNITIVE_PROFILES["designer"]
    product_designer = COGNITIVE_PROFILES["product_designer"]
    manager = COGNITIVE_PROFILES["design_system_manager"]

    assert "tokens" in designer.vocabulary
    assert "validation" in product_designer.vocabulary
    assert "roadmap" in manager.vocabulary
    assert "Product Manager" in product_designer.anti_convergence
    assert "governance" in manager.main_focus.lower()
    assert set(product_designer.vocabulary) != set(designer.vocabulary)
    assert set(product_designer.vocabulary) != set(manager.vocabulary)


def test_contract_prompt_injection() -> None:
    developer_prompt = build_system_prompt(_prompt_context("dev"))
    assert "Perspective Response Contract | Developer" in developer_prompt
    assert "## Recomendação técnica" in developer_prompt
    assert "proposed implementation contract" in developer_prompt

    command_prompt = build_system_prompt(_prompt_context("a11y", "enforce"))
    assert "Operational Command | Enforce" in command_prompt
    assert "Perspective Response Contract | Accessibility Specialist" in command_prompt
    assert "Checklist acessível" in command_prompt

    for profile in CANONICAL_PERSPECTIVE_IDS:
        prompt = build_system_prompt(_prompt_context(profile))
        contract = PERSPECTIVE_RESPONSE_CONTRACTS[profile]
        heading = (ROOT / "prompts" / contract.prompt_path).read_text(
            encoding="utf-8"
        ).splitlines()[0]
        assert heading in prompt

    general_prompt = build_system_prompt(_prompt_context("general"))
    assert "Perspective Response Contract | Developer" not in general_prompt
    assert "Perspective Response Contract | Accessibility Specialist" not in general_prompt

    context = _prompt_context("dev")
    context = PromptBuildContext(
        **{
            **context.__dict__,
            "perspective_evidence_block": (
                "# Evidence Disclosure For The Active Perspective Contract\n"
                "- Modal/Dialog | Component Registry | evidence similarity 81% | "
                "evidence tier strong"
            ),
        }
    )
    prompt_with_evidence = build_system_prompt(context)
    assert prompt_with_evidence.rfind("Perspective Response Contract | Developer") > (
        prompt_with_evidence.rfind("Aetheris Semantic Evidence")
    )
    assert "evidence similarity 81%" in prompt_with_evidence


def test_developer_validation() -> None:
    complete = validate_perspective_response("dev", DEVELOPER_COMPLETE)
    assert complete["status"] == "pass"
    assert complete["profile_contract_applied"] is True
    assert complete["profile_contract_id"] == "developer-response-v1"
    assert complete["perspective_quality_score"] == 1.0
    assert complete["required_signals_missing"] == []
    assert set(complete["matched_signals"]) == {
        "implementation_boundary",
        "api_props",
        "state_flow",
        "edge_cases",
        "technical_accessibility",
        "integration_reuse",
        "evidence_traceability",
        "evidence_limitation",
    }

    incomplete = validate_perspective_response(
        "dev",
        "Use Modal porque a ação é importante.",
    )
    assert incomplete["status"] == "warning"
    assert incomplete["perspective_quality_score"] == 0.0
    assert {
        warning["signal_group"]
        for warning in incomplete["profile_contract_warnings"]
    } == {
        "implementation_boundary",
        "api_props",
        "state_flow",
        "edge_cases",
        "technical_accessibility",
        "integration_reuse",
        "evidence_traceability",
        "evidence_limitation",
    }


def test_accessibility_validation() -> None:
    complete = validate_perspective_response("a11y", ACCESSIBILITY_COMPLETE)
    assert complete["status"] == "pass"
    assert complete["profile_contract_applied"] is True
    assert complete["profile_contract_id"] == "accessibility-response-v1"
    assert complete["perspective_quality_score"] == 1.0
    assert complete["required_signals_missing"] == []
    assert set(complete["matched_signals"]) == {
        "barrier_impact",
        "focus",
        "keyboard",
        "semantics_aria",
        "assistive_technology",
        "accessible_states",
        "error_prevention",
        "evidence_traceability",
        "evidence_limitation",
    }

    incomplete = validate_perspective_response(
        "a11y",
        "Use um modal com bom contraste.",
    )
    assert incomplete["status"] == "warning"
    assert len(incomplete["profile_contract_warnings"]) == 9
    assert incomplete["required_signals_found"] == []
    assert incomplete["perspective_quality_score"] == 0.0


def test_remaining_perspective_validation() -> None:
    complete_responses = {
        "designer": DESIGNER_COMPLETE,
        "product_designer": PRODUCT_DESIGNER_COMPLETE,
        "qa": QA_COMPLETE,
        "tech_writer": TECH_WRITER_COMPLETE,
        "maintainer": MAINTAINER_COMPLETE,
        "design_system_manager": DESIGN_SYSTEM_MANAGER_COMPLETE,
    }
    critical_signals = {
        "designer": "visual_finding",
        "product_designer": "behavioral_hypothesis_record",
        "qa": "test_oracle",
        "tech_writer": "editorial_decision",
        "maintainer": "maintenance_disposition",
        "design_system_manager": "governance_decision_record",
    }

    for profile, response in complete_responses.items():
        audit = validate_perspective_response(profile, response)
        assert audit["status"] == "pass", (
            profile,
            audit["required_signals_missing"],
        )
        assert audit["perspective_quality_score"] == 1.0
        assert audit["profile_contract_id"].endswith("-response-v3")
        assert audit["perspective_contract"]["version"] == "3.0"

        incomplete = validate_perspective_response(
            profile,
            "Recomendo melhorar a solução com consistência.",
        )
        assert incomplete["status"] == "warning"
        assert critical_signals[profile] in incomplete["required_signals_missing"]


def test_markdown_contract_requirements() -> None:
    contract_paths = {
        profile: ROOT / "prompts" / contract.prompt_path
        for profile, contract in PERSPECTIVE_RESPONSE_CONTRACTS.items()
    }
    global_terms = (
        "evidence similarity",
        "evidence tier",
        "relevance of retrieved evidence",
        "internal reasoning trace",
        "inference",
        "not documented",
        "user's language",
        "Never use an em dash",
        "perform this binary checklist",
        "non-compliant if",
    )

    for profile, path in contract_paths.items():
        content = path.read_text(encoding="utf-8")
        assert "\N{EM DASH}" not in content
        assert "\N{EN DASH}" not in content
        for term in global_terms:
            assert term in content, (profile, term)

    required_headings = {
        "design_system_manager": (
            "## Valor estratégico",
            "## Impacto sistêmico e adoção",
            "## Governança e critérios de exceção",
            "## Risco de fragmentação",
            "## Prioridade e roadmap",
            "## Critérios de maturidade",
            "## Evidências e limitações",
        ),
        "designer": (
            "## Diagnóstico visual",
            "## Hierarquia, composição e ritmo",
            "## Tokens, tipografia e cor",
            "## Estados visuais e consistência",
            "## Ajustes recomendados",
            "## Evidências e limitações",
        ),
        "maintainer": (
            "## Risco de manutenção",
            "## Acoplamento, duplicação e ownership",
            "## Abstração mínima segura",
            "## Custo de evolução",
            "## Plano de simplificação",
            "## Validação",
        ),
        "product_designer": (
            "## Diagnóstico da experiência",
            "## Fluxo, fricção e próxima ação",
            "## Interface, feedback e carga cognitiva",
            "## Evidências, hipóteses e riscos",
            "## Alternativas de solução",
            "## Validação recomendada",
        ),
        "qa": (
            "## Risco principal",
            "## Critérios de aceite",
            "## Cenários de teste",
            "## Edge cases e casos negativos",
            "## Regressão e estados",
            "## Plano de validação",
            "## Evidências e limitações",
        ),
        "tech_writer": (
            "## O que precisa ficar claro",
            "## Nomenclatura e consistência",
            "## Microcopy e mensagens",
            "## Exemplo recomendado",
            "## Instruções acionáveis",
            "## Evidências e limitações",
        ),
    }
    for profile, headings in required_headings.items():
        content = contract_paths[profile].read_text(encoding="utf-8")
        positions = [content.index(heading) for heading in headings]
        assert positions == sorted(positions), profile

    for profile in ("maintainer", "product_designer"):
        content = contract_paths[profile].read_text(encoding="utf-8")
        assert "**Evidências e limitações**" in content

    perspective_specific_terms = {
        "dev": (
            "state ownership",
            "component boundaries",
            "onConfirm",
            "focus trapping",
        ),
        "a11y": (
            "accessibility barrier",
            "assistive technology",
            "aria-modal",
            "focus return",
        ),
        "designer": (
            "Mandatory visual finding",
            "perceptual effect",
            "visual weight",
            "Fronteira de usabilidade",
        ),
        "product_designer": (
            "Mandatory behavioral hypothesis record",
            "cognitive load",
            "Sinal que refuta a hipótese",
            "qualitative validation",
        ),
        "qa": (
            "Mandatory test oracle",
            "boundary-value analysis",
            "fault injection",
            "idempotency",
        ),
        "tech_writer": (
            "Mandatory editorial decision record",
            "controlled vocabulary",
            "error-message anatomy",
            "Redação a evitar",
        ),
        "maintainer": (
            "Mandatory maintenance disposition",
            "change amplification",
            "dependency direction",
            "removability",
        ),
        "design_system_manager": (
            "Mandatory governance decision record",
            "Gate de aprovação",
            "Gate de promoção",
            "fragmentation",
        ),
    }
    for profile, terms in perspective_specific_terms.items():
        content = contract_paths[profile].read_text(encoding="utf-8")
        for term in terms:
            assert term in content, (profile, term)

    manual_evaluation = (
        ROOT / "prompts" / "perspectives" / "MANUAL_EVALUATION.md"
    ).read_text(encoding="utf-8")
    for question in (
        "Qual componente devo usar para excluir uma conta?",
        "Como melhorar essa tela de dashboard?",
        "Esse padrão deve virar parte oficial do design system?",
        "Como documentar Modal versus Drawer?",
        "Como testar o fallback da Beatrice?",
        "Essa implementação está ficando difícil de manter?",
        "Qual token usar para erro crítico?",
        "Como explicar evidence similarity no Audit Drawer?",
    ):
        assert question in manual_evaluation


def test_perspective_artifacts_prevent_convergence() -> None:
    pair_checks = (
        ("designer", PRODUCT_DESIGNER_COMPLETE, "visual_finding"),
        ("product_designer", DESIGNER_COMPLETE, "behavioral_hypothesis_record"),
        ("maintainer", DEVELOPER_COMPLETE, "maintenance_disposition"),
        ("dev", MAINTAINER_COMPLETE, "api_props"),
        ("qa", ACCESSIBILITY_COMPLETE, "test_oracle"),
        ("a11y", QA_COMPLETE, "semantics_aria"),
        ("tech_writer", PRODUCT_DESIGNER_COMPLETE, "editorial_decision"),
        (
            "design_system_manager",
            MAINTAINER_COMPLETE,
            "governance_decision_record",
        ),
    )
    for profile, other_response, expected_missing in pair_checks:
        audit = validate_perspective_response(profile, other_response)
        assert audit["status"] == "warning", profile
        assert expected_missing in audit["required_signals_missing"], (
            profile,
            audit["required_signals_missing"],
        )


def test_audit_metadata_and_skills() -> None:
    metadata = build_response_audit_metadata(
        "dev",
        DEVELOPER_COMPLETE,
        ("implementation_planning", "risk_assessment"),
    )
    assert metadata["status"] == "pass"
    assert metadata["selected_skills"] == [
        "implementation_planning",
        "risk_assessment",
    ]
    assert metadata["validation_method"] == "observable_response_signals"
    assert metadata["profile_contract_applied"] is True
    assert metadata["profile_contract_id"] == "developer-response-v1"
    assert metadata["required_signals_missing"] == []
    assert metadata["perspective_quality_score"] == 1.0

    not_applicable = build_response_audit_metadata(
        "general",
        "Resposta geral.",
    )
    assert not_applicable["profile_contract_applied"] is False
    assert not_applicable["profile_contract_id"] is None
    assert not_applicable["required_signals_found"] == []
    assert not_applicable["required_signals_missing"] == []
    assert not_applicable["perspective_quality_score"] is None


def test_evidence_tier_serialization() -> None:
    sources = serialize_sources([
        {
            "title": "Modal/Dialog",
            "page_type": "component",
            "similarity": 0.81,
            "retrieval_weight": 1.2,
            "weighted_score": 0.972,
        },
    ])
    assert sources[0]["evidence_tier"] == "strong"
    assert sources[0]["similarity"] == 0.81
    disclosure = build_perspective_evidence_block([
        {
            "title": "Modal/Dialog",
            "page_type": "component",
            "similarity": 0.81,
        },
    ])
    assert "evidence similarity 81%" in disclosure
    assert "evidence tier strong" in disclosure
    assert "not answer confidence" in disclosure


def test_skill_content_directive() -> None:
    activation = StrategyActivation(
        id="implementation_planning",
        weight=0.8,
        confidence=0.8,
        reason="implementation requested",
    )
    context = compose_strategy_context(
        activations=[activation],
        complexity=analyze_complexity(
            "Implementar confirmação destrutiva com tratamento de risco.",
            intent="component_guidance",
        ),
        ambiguity=detect_ambiguity(
            "Implementar confirmação destrutiva com tratamento de risco."
        ),
        manual_override=ManualOverride(),
    )
    compact_context = " ".join(context.split())
    assert "materially change at least one recommendation" in compact_context
    assert "Naming a skill without applying" in compact_context
    assert "Do not announce skill names inside the answer" in compact_context


def test_skills_are_announced_only_after_observable_application() -> None:
    selected = (
        {
            "id": "implementation_planning",
            "label": "Implementation Planning",
            "reason": "implementation sequencing",
            "confidence": 0.8,
            "intensity": "high",
        },
        {
            "id": "token_impact_analysis",
            "label": "Token Impact Analysis",
            "reason": "token dependency impact",
            "confidence": 0.7,
            "intensity": "medium",
        },
    )
    applied = filter_applied_skills(
        (
            "A API usa props open e onConfirm. Durante loading, bloqueie a ação. "
            "Em erro, mantenha o diálogo aberto e documente a integração."
        ),
        selected,
    )
    assert [skill["id"] for skill in applied] == ["implementation_planning"]


def _word_jaccard(left: str, right: str) -> float:
    left_words = {
        word.strip("`.,:;!?()[]{}\"'").lower()
        for word in left.split()
        if len(word.strip("`.,:;!?()[]{}\"'")) >= 4
    }
    right_words = {
        word.strip("`.,:;!?()[]{}\"'").lower()
        for word in right.split()
        if len(word.strip("`.,:;!?()[]{}\"'")) >= 4
    }
    return len(left_words & right_words) / len(left_words | right_words)


def test_destructive_action_perspectives_are_materially_different() -> None:
    developer_context = _prompt_context("dev")
    accessibility_context = _prompt_context("a11y")
    developer_prompt = build_system_prompt(developer_context)
    accessibility_prompt = build_system_prompt(accessibility_context)
    assert developer_context.query == DESTRUCTIVE_ACTION_QUESTION
    assert accessibility_context.query == DESTRUCTIVE_ACTION_QUESTION
    assert "## Contrato de componente sugerido" in developer_prompt
    assert "## Checklist acessível" in accessibility_prompt

    developer_audit = validate_perspective_response("dev", DEVELOPER_COMPLETE)
    accessibility_audit = validate_perspective_response(
        "a11y",
        ACCESSIBILITY_COMPLETE,
    )
    assert developer_audit["status"] == "pass"
    assert accessibility_audit["status"] == "pass"

    assert "`onConfirm`" in DEVELOPER_COMPLETE
    assert "## Fluxo de estado" in DEVELOPER_COMPLETE
    assert "leitor de tela" in ACCESSIBILITY_COMPLETE
    assert "## Checklist acessível" in ACCESSIBILITY_COMPLETE
    assert _word_jaccard(DEVELOPER_COMPLETE, ACCESSIBILITY_COMPLETE) < 0.45


def test_all_perspective_fixtures_are_materially_different() -> None:
    responses = {
        "dev": DEVELOPER_COMPLETE,
        "a11y": ACCESSIBILITY_COMPLETE,
        "designer": DESIGNER_COMPLETE,
        "product_designer": PRODUCT_DESIGNER_COMPLETE,
        "qa": QA_COMPLETE,
        "tech_writer": TECH_WRITER_COMPLETE,
        "maintainer": MAINTAINER_COMPLETE,
        "design_system_manager": DESIGN_SYSTEM_MANAGER_COMPLETE,
    }
    response_items = list(responses.items())
    for index, (left_profile, left_response) in enumerate(response_items):
        for right_profile, right_response in response_items[index + 1:]:
            similarity = _word_jaccard(left_response, right_response)
            assert similarity < 0.35, (
                left_profile,
                right_profile,
                similarity,
            )


def test_perspective_health_payload() -> None:
    payload = build_perspective_health_payload()
    assert payload["status"] == "healthy"
    assert payload["rag_indexing"] == "not_applicable"
    assert payload["total_perspective_files_expected"] == len(CANONICAL_PERSPECTIVE_IDS)
    assert payload["total_perspective_files_found"] == len(CANONICAL_PERSPECTIVE_IDS)
    assert payload["total_perspective_files_loaded"] == len(CANONICAL_PERSPECTIVE_IDS)
    assert payload["missing_perspectives"] == []
    assert payload["stale_perspectives"] == []
    assert payload["orphan_files"] == []
    assert payload["registry_divergences"] == []
    assert payload["runtime_strategy"] == "hybrid_prompt_contract"
    assert payload["runtime_layers"]["controlled_perspective_contract_injection"] is True
    assert payload["runtime_layers"]["post_generation_validation"] is True
    assert payload["runtime_layers"]["frontend_label_only"] is False
    assert payload["total_perspective_chunks"] == 0
    assert payload["warnings"] == []
    assert all(
        count == 0
        for count in payload["chunks_by_perspective"].values()
    )
    assert payload["audited_at"] is not None

    audited_paths = {entry["file_path"] for entry in payload["contracts"]}
    assert audited_paths == set(EXPECTED_PERSPECTIVE_FILES.values())
    for entry in payload["contracts"]:
        assert entry["exists"] is True
        assert entry["loaded"] is True
        assert entry["used_as_response_rule"] is True
        assert entry["registry_diverged"] is False
        assert entry["repository_only"] is False
        assert entry["bytes"] > 0
        assert entry["mtime"] is not None
        assert entry["sha256"] is not None
        assert len(entry["sha256"]) == 64
        assert entry["loaded_at"] is not None
        assert entry["registry_version"] is not None
        assert entry["heading"].startswith("# Perspective Response Contract")


def test_expected_perspective_files_exist_and_load() -> None:
    for profile in CANONICAL_PERSPECTIVE_IDS:
        relative_path = EXPECTED_PERSPECTIVE_FILES[profile]
        absolute_path = ROOT / "prompts" / relative_path
        assert absolute_path.is_file(), profile
        content = absolute_path.read_text(encoding="utf-8").strip()
        assert content, profile
        prompt = build_system_prompt(_prompt_context(profile))
        heading = content.splitlines()[0]
        assert heading in prompt, profile


def test_no_orphan_perspective_markdown_files() -> None:
    perspective_dir = ROOT / "prompts" / "perspectives"
    registered_names = {
        Path(path).name for path in EXPECTED_PERSPECTIVE_FILES.values()
    }
    registered_names.add("MANUAL_EVALUATION.md")
    for path in sorted(perspective_dir.glob("*.md")):
        assert path.name in registered_names, path.name
    assert IGNORED_PERSPECTIVE_FILES == ("perspectives/MANUAL_EVALUATION.md",)


PERSPECTIVE_RETRIEVAL_FIXTURES = (
    (
        "a11y",
        "Como garantir acessibilidade no fluxo de exclusao de conta?",
        "perspectives/accessibility.md",
        ("accessibility barrier", "assistive technology"),
    ),
    (
        "dev",
        "Como implementar confirmacao destrutiva com estados assincronos?",
        "perspectives/developer.md",
        ("state ownership", "component boundaries"),
    ),
    (
        "qa",
        "Como testar o fluxo de confirmacao destrutiva?",
        "perspectives/qa.md",
        ("Mandatory test oracle", "acceptance criteria"),
    ),
    (
        "tech_writer",
        "Como documentar Modal versus Drawer para exclusao?",
        "perspectives/tech-writer.md",
        ("Mandatory editorial decision record", "microcopy"),
    ),
    (
        "design_system_manager",
        "Esse padrao deve virar parte oficial do design system?",
        "perspectives/design-system-manager.md",
        ("Mandatory governance decision record", "governance"),
    ),
)


def test_perspective_contract_retrieval_by_profile() -> None:
    for profile, _query, relative_path, markers in PERSPECTIVE_RETRIEVAL_FIXTURES:
        contract_text = (ROOT / "prompts" / relative_path).read_text(encoding="utf-8")
        prompt = build_system_prompt(_prompt_context(profile))
        assert contract_text.splitlines()[0] in prompt
        assert any(marker in prompt for marker in markers), profile


def test_perspective_fallback_for_general_profile() -> None:
    payload = build_perspective_health_payload()
    general_prompt = build_system_prompt(_prompt_context("general"))
    assert "Perspective Response Contract | Developer" not in general_prompt
    audit = build_response_audit_metadata("general", "Resposta neutra.")
    assert audit["profile_contract_applied"] is False
    assert audit["status"] == "not_applicable"
    assert payload["runtime_layers"]["controlled_perspective_contract_injection"] is True


def test_perspectives_health_endpoint() -> None:
    from fastapi.testclient import TestClient
    from server import app

    client = TestClient(app)
    response = client.get("/api/knowledge/perspectives/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "healthy"
    assert payload["rag_indexing"] == "not_applicable"
    assert payload["total_perspective_files_loaded"] == len(CANONICAL_PERSPECTIVE_IDS)
    assert payload["runtime_strategy"] == "hybrid_prompt_contract"
    assert payload["warnings"] == []
    for entry in payload["contracts"]:
        assert entry["sha256"]
        assert entry["registry_version"]


def test_accessibility_and_developer_focus_signals() -> None:
    developer_audit = validate_perspective_response("dev", DEVELOPER_COMPLETE)
    accessibility_audit = validate_perspective_response("a11y", ACCESSIBILITY_COMPLETE)
    qa_audit = validate_perspective_response("qa", QA_COMPLETE)
    writer_audit = validate_perspective_response("tech_writer", TECH_WRITER_COMPLETE)

    assert "api_props" in developer_audit["matched_signals"]
    assert "edge_cases" in developer_audit["matched_signals"]
    assert "keyboard" in accessibility_audit["matched_signals"]
    assert "semantics_aria" in accessibility_audit["matched_signals"]
    assert "test_oracle" in qa_audit["matched_signals"]
    assert "microcopy_messages" in writer_audit["matched_signals"]


def test_similarity_is_not_named_confidence_in_comparison() -> None:
    service = (ROOT / "src/services/comparisonService.ts").read_text(encoding="utf-8")
    panel = (ROOT / "src/components/comparison/AnswerPanel.tsx").read_text(encoding="utf-8")
    assert "confidenceFromSources" not in service
    assert "evidenceSimilarityFromSources" in service
    assert "result.confidence" not in panel
    assert "result.evidenceSimilarity" in panel


if __name__ == "__main__":
    test_contract_registry()
    test_profile_alias_normalization()
    test_professional_perspective_boundaries()
    test_contract_prompt_injection()
    test_developer_validation()
    test_accessibility_validation()
    test_remaining_perspective_validation()
    test_markdown_contract_requirements()
    test_perspective_artifacts_prevent_convergence()
    test_audit_metadata_and_skills()
    test_evidence_tier_serialization()
    test_skill_content_directive()
    test_skills_are_announced_only_after_observable_application()
    test_destructive_action_perspectives_are_materially_different()
    test_all_perspective_fixtures_are_materially_different()
    test_perspective_health_payload()
    test_expected_perspective_files_exist_and_load()
    test_no_orphan_perspective_markdown_files()
    test_perspective_contract_retrieval_by_profile()
    test_perspective_fallback_for_general_profile()
    test_perspectives_health_endpoint()
    test_accessibility_and_developer_focus_signals()
    test_similarity_is_not_named_confidence_in_comparison()
    print("Specialized perspective contract checks passed.")
