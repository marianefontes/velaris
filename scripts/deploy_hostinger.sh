#!/usr/bin/env bash
# Deploy the Vite production build (dist/) to Hostinger.
#
# Setup (once):
#   cp .env.deploy.example .env.deploy
#   # fill in credentials from hPanel → Websites → beatrice.world → FTP / SSH
#
# Usage:
#   npm run deploy:hostinger
#   npm run deploy:hostinger -- --dry-run
#   npm run deploy:hostinger -- --skip-build

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${HOSTINGER_ENV_FILE:-.env.deploy}"
DRY_RUN=0
SKIP_BUILD=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  echo "Missing $ENV_FILE — copy .env.deploy.example and fill in your Hostinger credentials." >&2
  exit 1
fi

: "${HOSTINGER_HOST:?Set HOSTINGER_HOST in $ENV_FILE}"
: "${HOSTINGER_USER:?Set HOSTINGER_USER in $ENV_FILE}"
REMOTE_PATH="${HOSTINGER_REMOTE_PATH:-public_html}"
METHOD="${HOSTINGER_DEPLOY_METHOD:-rsync}"
SITE_URL="${HOSTINGER_SITE_URL:-https://beatrice.world}"
SSH_PORT="${HOSTINGER_SSH_PORT:-65002}"
FTP_PORT="${HOSTINGER_FTP_PORT:-21}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

assert_production_build() {
  if [[ ! -f dist/index.html ]]; then
    echo "dist/index.html not found." >&2
    exit 1
  fi
  if grep -q '/src/main.tsx' dist/index.html; then
    echo "dist/index.html still points to /src/main.tsx (dev build). Run npm run build." >&2
    exit 1
  fi
  if ! grep -q '/assets/' dist/index.html; then
    echo "dist/index.html has no /assets/ bundle reference." >&2
    exit 1
  fi
  if [[ ! -f dist/.htaccess ]]; then
    echo "dist/.htaccess missing — SPA routes will 404 on Hostinger." >&2
    exit 1
  fi
}

run_build() {
  echo "→ Building production bundle…"
  npm run build
  assert_production_build
  echo "→ Build OK ($(find dist/assets -type f | wc -l | tr -d ' ') assets)"
}

upload_rsync() {
  require_command rsync
  require_command ssh

  local -a rsync_args=(
    -avz
    --delete
    --exclude '.DS_Store'
    -e "ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new"
  )

  if [[ "$DRY_RUN" -eq 1 ]]; then
    rsync_args+=(--dry-run)
    echo "→ Dry run: rsync dist/ → ${HOSTINGER_USER}@${HOSTINGER_HOST}:${REMOTE_PATH}/"
  else
    echo "→ Uploading via rsync (SSH port ${SSH_PORT})…"
  fi

  rsync "${rsync_args[@]}" dist/ "${HOSTINGER_USER}@${HOSTINGER_HOST}:${REMOTE_PATH}/"
}

upload_lftp() {
  require_command lftp
  : "${HOSTINGER_PASSWORD:?Set HOSTINGER_PASSWORD in $ENV_FILE for lftp/FTP deploy}"

  local mirror_flags="--reverse --delete --verbose --parallel=4"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    mirror_flags="$mirror_flags --dry-run"
    echo "→ Dry run: lftp mirror dist/ → ${REMOTE_PATH}/"
  else
    echo "→ Uploading via lftp (FTP port ${FTP_PORT})…"
  fi

  lftp -u "${HOSTINGER_USER}","${HOSTINGER_PASSWORD}" -p "${FTP_PORT}" "${HOSTINGER_HOST}" <<EOF
set ftp:ssl-allow true
set ssl:verify-certificate no
mirror ${mirror_flags} dist ${REMOTE_PATH}
bye
EOF
}

verify_live_site() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "→ Skipping live verification (dry run)."
    return 0
  fi

  require_command curl

  echo "→ Verifying ${SITE_URL}…"

  local index_body main_status
  index_body="$(curl -fsSL "${SITE_URL}/")"
  if grep -q '/src/main.tsx' <<<"$index_body"; then
    echo "Live site still serves dev index.html (/src/main.tsx)." >&2
    exit 1
  fi
  if ! grep -q '/assets/' <<<"$index_body"; then
    echo "Live index.html has no /assets/ bundle." >&2
    exit 1
  fi

  main_status="$(curl -s -o /dev/null -w '%{http_code}' "${SITE_URL}/main")"
  if [[ "$main_status" != "200" ]]; then
    echo "SPA route /main returned HTTP ${main_status} (expected 200). Check dist/.htaccess on Hostinger." >&2
    exit 1
  fi

  echo "→ Live site OK (index bundles + /main → 200)"
}

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  run_build
else
  assert_production_build
fi

case "$METHOD" in
  rsync|sftp|ssh) upload_rsync ;;
  lftp|ftp) upload_lftp ;;
  *)
    echo "Unknown HOSTINGER_DEPLOY_METHOD: $METHOD (use rsync or lftp)" >&2
    exit 1
    ;;
esac

verify_live_site
echo "Deploy complete."
