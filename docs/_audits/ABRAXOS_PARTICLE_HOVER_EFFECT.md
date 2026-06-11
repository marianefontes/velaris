# Abraxos Particle Hover Effect

## Separation of concerns

| Element | Component | Role |
|---------|-----------|------|
| **Abraxos** | `AbraxosDragon.tsx` | Recognizable dragon entity (filled silhouette, head, wing, eye, tail) |
| **Navigation path** | `KnowledgeNavigationPath.tsx` | Luminous trail connecting library chips |
| **Particles** | `abraxosParticleEngine.ts` | Hover stardust from dragon edges only |

## Technology

**Canvas 2D** for particles. **SVG** for dragon body and navigation path.

## Hover

Implemented on `div.abraxos-interactive` in `AbraxosInteractive.tsx`. Particles sample `ABRAXOS_DRAGON_OUTLINE`, not the navigation path.

## Reduced motion

Canvas not mounted. Hover applies subtle brightness on the dragon SVG only.

## Commands

```bash
npm run build
npm run test:agent-ui
```
