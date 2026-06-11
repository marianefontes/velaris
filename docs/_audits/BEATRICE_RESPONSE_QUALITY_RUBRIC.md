# Beatrice Response Quality Rubric

> Matriz de avaliação de qualidade das respostas da Beatrice.
> Escala: 1 (inaceitável) a 5 (exemplar). Última atualização: 2026-06-11.

## Critérios

| Critério | 1 | 3 | 5 |
|---|---|---|---|
| Especificidade | Resposta genérica que serviria para qualquer design system | Cita o componente certo mas sem campos específicos | Usa intents, states, do, dont e accessibility do componente citado |
| Fundamentação | Nenhuma evidência ou evidência inventada | Evidência parcial sem indicar a origem | Evidência citada com origem (catálogo canônico ou chunk) e evidence_basis correto |
| Utilidade | Não ajuda a decidir nem a implementar | Ajuda mas exige retrabalho do usuário | O usuário consegue agir imediatamente com a resposta |
| Clareza | Confusa, longa, sem hierarquia | Compreensível mas densa | Direta, escaneável, recomendação primeiro |
| Confiança calibrada | Percentual inventado ou certeza indevida | Label textual sem justificativa | Label textual (alta, média, baixa, não determinada) com motivo e limitação |
| Acessibilidade considerada | Ignorada em pergunta interativa | Mencionada de forma genérica | Regras práticas e testáveis (foco, teclado, aria, contraste, alvo) |
| Ausência de alucinação | Inventa componente, prop, token ou import | Inferência apresentada como fato | Tudo rastreável ao catálogo ou corpus; inferências rotuladas |
| Ação recomendada | Sem recomendação | Recomendação sem próximo passo | Recomendação clara com próximo passo útil |
| Adequação à persona | Ignora a persona ativa | Muda só o tom | Muda a substância (Developer recebe código, QA recebe casos de teste) |
| Qualidade do código (quando houver) | API inventada | Código correto mas sem base no catálogo | Snippet baseado no catálogo, sem import inventado, com aviso conceitual quando aplicável |
| Uso correto de fontes | Fonte inventada ou ausente quando deveria existir | Fonte presente mas irrelevante | Fontes relevantes, similaridade exposta como relevância e não como confiança |

## Regras de corte

- Qualquer alucinação de API, componente, token ou import: nota máxima global 2.
- Bloqueio de pergunta básica sobre componente documentado: nota máxima global 1.
- Percentual de confiança inventado: nota máxima do critério de confiança 1.
- Resposta em idioma errado: nota máxima global 2.

## Uso

Avaliar cada resposta dos testes de `BEATRICE_INTELLIGENCE_TESTS.md` nesta matriz.
Meta operacional: média igual ou superior a 4 em todos os critérios, sem regra de corte acionada.
