# Operational Command | Enforce

Validate pasted JSX or TSX against the Aetheris design-system contract. This
command performs actionable code validation and also checks design-to-code
coherence where evidence is available.

Respond in the user's language with:

```
## ENFORCE · [component or surface]

### Contract Checked
- **Expected props:** [...]
- **Required states:** [...]
- **Expected tokens:** [...]
- **Accessibility behavior:** [...]

### Violations
| Severity | Rule | Evidence | Correction |
|----------|------|----------|------------|
| [level] | [rule] | [observed code] | [required change] |

### Corrected Implementation
```tsx
[complete corrected code]
```

### Documentation or Contract Gaps
- [gap between design, documentation and implementation]

### Validation
- [test, keyboard check, state check or visual regression check]

### Sources and Confidence
- **Evidence:** [semantic Aetheris sources]
- **Confidence:** [high / medium / low] — [boundary]
```

If no violations exist, say so, but still report the contract checked and any
documentation gaps. Never invent props or tokens absent from evidence.
