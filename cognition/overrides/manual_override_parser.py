"""Parse advanced `/use ...` directives without creating a separate pipeline."""

from dataclasses import dataclass, field

from cognition.orchestration.orchestration_weights import STRATEGY_ALIASES


@dataclass(frozen=True)
class ManualOverride:
    active: bool = False
    exclusive: bool = False
    boosted_strategies: tuple[str, ...] = field(default_factory=tuple)
    blocked_strategies: tuple[str, ...] = field(default_factory=tuple)
    clean_query: str = ""
    raw_directive: str = ""


def normalize_strategy_alias(value: str) -> tuple[str | None, bool]:
    token = value.strip().lower().replace("_", "-")
    exclusive = token.endswith("-only")
    if exclusive:
        token = token[:-5]
    strategy = STRATEGY_ALIASES.get(token)
    return strategy, exclusive


def _consume_strategy_tokens(text: str) -> tuple[list[str], bool, str]:
    remaining = text.strip()
    boosted: list[str] = []
    exclusive = False
    aliases = sorted(STRATEGY_ALIASES.keys(), key=len, reverse=True)

    while remaining:
        normalized = remaining.lower().replace("_", "-")
        matched_alias = None
        matched_exclusive = False

        for alias in aliases:
            for candidate in (f"{alias}-only", alias):
                if normalized == candidate or normalized.startswith(candidate + " "):
                    matched_alias = alias
                    matched_exclusive = candidate.endswith("-only")
                    break
                if normalized.startswith(candidate + ",") or normalized.startswith(candidate + "+"):
                    matched_alias = alias
                    matched_exclusive = candidate.endswith("-only")
                    break
            if matched_alias:
                break

        if not matched_alias:
            break

        strategy = STRATEGY_ALIASES[matched_alias]
        if strategy not in boosted:
            boosted.append(strategy)
        exclusive = exclusive or matched_exclusive

        consumed = f"{matched_alias}-only" if matched_exclusive else matched_alias
        remaining = remaining[len(consumed):].lstrip(" ,+")
        for connector in ("and ", "e "):
            if remaining.lower().startswith(connector):
                remaining = remaining[len(connector):].lstrip()

    return boosted, exclusive, remaining.strip()


def parse_manual_override(query: str) -> ManualOverride:
    lines = query.splitlines()
    directive_index = next(
        (index for index, line in enumerate(lines) if line.strip().lower().startswith("/use ")),
        None,
    )
    if directive_index is None:
        return ManualOverride(clean_query=query.strip())

    directive_line = lines[directive_index].strip()
    directive_body = directive_line[5:].strip()
    boosted, exclusive, inline_remainder = _consume_strategy_tokens(directive_body)

    clean_lines = lines[:directive_index] + lines[directive_index + 1:]
    if inline_remainder:
        clean_lines.insert(directive_index, inline_remainder)
    clean_query = "\n".join(line for line in clean_lines).strip()

    return ManualOverride(
        active=bool(boosted),
        exclusive=exclusive,
        boosted_strategies=tuple(boosted),
        blocked_strategies=tuple(),
        clean_query=clean_query,
        raw_directive=directive_line,
    )
