# Architecture Route Rename

## Goal

Rename the primary Developers navigation surface to Architecture and make
`/architecture` its canonical route.

## Navigation

- Replace the primary menu path `/developers` with `/architecture`.
- Display `Arquitetura` in Portuguese locales and `Architecture` in English.
- Use Lucide's `Workflow` icon to communicate system architecture and preserve
  the existing icon size, spacing, active state, and accessibility behavior.

## Compatibility

- Keep `/developers` as a compatibility redirect to `/architecture`.
- Change `/dev-integration` to redirect to `/architecture`.
- Update every application redirect that currently targets `/developers` to
  target `/architecture`.

## Scope

The page component and its internal translation namespace remain unchanged.
Only the public route, top-menu label and icon, compatibility redirects, and
navigation tests are updated.

## Verification

- The primary navigation contract recognizes `/architecture`.
- The top menu renders the Architecture label and icon.
- `/architecture` loads the existing page and receives the active menu state.
- `/developers` and `/dev-integration` resolve to `/architecture`.
- The TypeScript build and navigation checks pass.
