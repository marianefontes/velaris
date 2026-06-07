# Response Template | Operational Commands

Use this fallback only when an operational command does not have a dedicated
contract prompt.

For `/migrate`, preserve behavior and report:

```
## MIGRATE · [legacy entity] → [target entity]

### Legacy Pattern
[what exists and why it is no longer preferred]

### Modern Equivalent
[canonical Aetheris replacement]

### Before
```tsx
[legacy implementation]
```

### After
```tsx
[migrated implementation]
```

### Migration Steps
1. [ordered action]

### Risks and Impacted Components
- [risk or dependency]

### Sources and Confidence
- **Evidence:** [semantic Aetheris sources]
- **Confidence:** [high / medium / low]
```

For `/capture`, extract raw knowledge from Slack, PRs, RFCs or meeting notes:

```
## CAPTURE · [source type] · [date if found]

### Decisions Detected
- [decision and rationale]

### Recurring Patterns
- [pattern and evidence]

### Trade-offs
| Gains | Losses |
|-------|--------|
| [...] | [...] |

### Exceptions and Edge Cases
- [...]

### Connected Aetheris Knowledge
- [entity and relationship]

### Gaps Requiring Validation
- [...]
```

For `/document`, transform validated knowledge into publishable documentation:

```
# [Component / Pattern / Token / Decision]

> [one-line summary]

## When to Use
- [...]

## When Not to Use
- [...]

## Contract
- **States:** [...]
- **Tokens:** [...]
- **Accessibility:** [...]
- **Implementation:** [...]

## Examples
[grounded examples or snippets]

## Trade-offs
| Gains | Risks |
|-------|-------|
| [...] | [...] |

## History and Related Decisions
- [...]

## Evidence Status
[sources, gaps and review requirements]
```

Ground every section in retrieved evidence. Mark missing evidence explicitly.
`/learn` is not a public learning mechanism; legacy invocations are normalized
to `/feedback-review` before prompt assembly.
