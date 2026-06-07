from pathlib import Path


PRIMARY_PATHS = (
    "/main",
    "/reasoning",
    "/perspectives",
    "/foundations",
    "/components",
    "/architecture",
    "/evaluation",
    "/results",
    "/laboratory",
)

SECONDARY_PATHS = ("/oracle",)

app_source = Path("src/App.tsx").read_text()
routes_source = Path("src/routes.tsx").read_text()

missing_from_app = [path for path in PRIMARY_PATHS if f'path="{path}"' not in app_source]
missing_from_menu = [path for path in PRIMARY_PATHS if f'path: "{path}"' not in routes_source]
missing_secondary_routes = [
    path for path in SECONDARY_PATHS if f'path="{path}"' not in app_source
]
secondary_in_menu = [
    path for path in SECONDARY_PATHS if f'path: "{path}"' in routes_source
]

if missing_from_app or missing_from_menu or missing_secondary_routes or secondary_in_menu:
    raise SystemExit(
        f"Primary navigation mismatch. App missing: {missing_from_app}; "
        f"menu missing: {missing_from_menu}; "
        f"secondary routes missing: {missing_secondary_routes}; "
        f"secondary routes in primary menu: {secondary_in_menu}"
    )

print(f"Primary navigation aligned: {len(PRIMARY_PATHS)}/{len(PRIMARY_PATHS)}")
