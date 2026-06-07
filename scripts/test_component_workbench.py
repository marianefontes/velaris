import os

from playwright.sync_api import Page, expect, sync_playwright


APP_BASE = os.environ.get("APP_BASE", "http://127.0.0.1:5173")

COMPONENTS = [
    ("button", "Button", ["Default", "Hover", "Focus", "Loading", "Disabled"], ["Primary", "Secondary", "Positive", "Negative"]),
    ("toggle-switch", "Toggle/Switch", ["Off", "On", "Focus", "Disabled"], ["Preference", "Visibility", "Mode"]),
    ("checkbox", "Checkbox", ["Unchecked", "Checked", "Indeterminate", "Focus", "Disabled"], ["Selection", "Consent", "Bulk"]),
    ("radio-button", "Radio Button", ["Unchecked", "Checked", "Focus", "Disabled", "Error"], ["Single choice", "Plan", "Preference"]),
    ("selectable-chip", "Selectable Chip / Badge", ["Default", "Selected", "Hover", "Focus", "Disabled"], ["Filter", "Tag", "Attribute"]),
    ("text-input", "Input / Text Input", ["Empty", "Filled", "Focus", "Error", "Disabled"], ["Text", "Search", "Email"]),
    ("text-area", "Text Area", ["Empty", "Filled", "Focus", "Error", "Disabled"], ["Description", "Prompt", "Comment"]),
    ("select-dropdown", "Select/Dropdown", ["Closed", "Open", "Selected", "Error", "Disabled"], ["Single choice", "Filter", "Configuration"]),
    ("date-picker", "Date Picker", ["Empty", "Selected", "Open", "Invalid", "Disabled"], ["Single date", "Range", "Deadline"]),
    ("form-field", "Form Field", ["Default", "Required", "Valid", "Error", "Disabled"], ["Data entry", "Validation", "Guidance"]),
    ("link", "Link", ["Default", "Hover", "Focus", "Visited", "Disabled"], ["Navigation", "External", "Download"]),
    ("tabs", "Tabs", ["Default", "Active", "Hover", "Focus", "Disabled"], ["Section", "View", "Mode"]),
    ("card", "Card", ["Default", "Hover", "Selected", "Loading", "Disabled"], ["Entity", "Summary", "Choice"]),
    ("modal-dialog", "Modal/Dialog", ["Closed", "Open", "Submitting", "Error", "Disabled"], ["Confirm", "Edit", "Critical decision"]),
    ("data-table", "Table/Data Table", ["Default", "Sorted", "Selected row", "Empty", "Loading"], ["Compare", "Inspect", "Manage"]),
    ("alert", "Alert", ["Info", "Success", "Warning", "Error", "Dismissed"], ["Inform", "Warn", "Block"]),
    ("toast", "Toast/Notification", ["Entering", "Visible", "Actionable", "Leaving", "Paused"], ["Success", "Info", "Undo"]),
    ("skeleton-loader", "Skeleton Loader", ["Loading", "Reduced motion", "Loaded", "Error"], ["Card", "List", "Table"]),
    ("explanation-tooltip", "Explanation Bubble / Tooltip", ["Closed", "Hover", "Focus", "Open", "Dismissed"], ["Definition", "Shortcut", "Explanation"]),
    ("confidence-badge", "Confidence Badge", ["Low", "Medium", "High", "Unavailable", "Inspecting"], ["Calibrate", "Warn", "Support trust"]),
    ("command-palette", "Command Palette / Barra de Comandos", ["Closed", "Searching", "Results", "Empty", "Executing"], ["Navigate", "Search", "Execute"]),
    ("source-attribution", "Source Attribution", ["Collapsed", "Expanded", "High match", "Partial match", "Unavailable"], ["Trace", "Verify", "Inspect"]),
    ("audit-panel", "Audit Panel", ["Collapsed", "Expanded", "Running", "Complete", "Conflict"], ["Audit", "Govern", "Debug"]),
    ("typography", "Typography", ["Display", "Heading", "Body", "Label", "Code"], ["Hierarchy", "Reading", "Metadata"]),
    ("icon", "Icon", ["Decorative", "Labeled", "Interactive", "Active", "Disabled"], ["Action", "Status", "Category"]),
]


def select_component(page: Page, title: str) -> None:
    page.locator("section").last.get_by_role("button", name=title, exact=True).click()


def assert_toggle_semantics(page: Page) -> None:
    select_component(page, "Toggle/Switch")
    preview = page.locator('[data-component-preview="toggle-switch"]')
    switch = preview.get_by_role("switch")
    track = preview.locator("[data-toggle-track]")
    thumb = preview.locator("[data-toggle-thumb]")
    editor = page.get_by_label("Editar code snippet do componente")

    page.get_by_role("button", name="States: Off").click()
    expect(switch).to_have_attribute("aria-checked", "false")
    page.wait_for_timeout(180)
    off_track = track.bounding_box()
    off_thumb = thumb.bounding_box()
    assert off_track and off_thumb
    assert off_track["x"] <= off_thumb["x"]
    assert off_thumb["x"] + off_thumb["width"] <= off_track["x"] + off_track["width"]
    assert off_thumb["x"] < off_track["x"] + off_track["width"] / 2

    page.get_by_role("button", name="States: On").click()
    expect(switch).to_have_attribute("aria-checked", "true")
    page.wait_for_timeout(180)
    on_track = track.bounding_box()
    on_thumb = thumb.bounding_box()
    assert on_track and on_thumb
    assert on_track["x"] <= on_thumb["x"]
    assert on_thumb["x"] + on_thumb["width"] <= on_track["x"] + on_track["width"]
    assert on_thumb["x"] > on_track["x"] + on_track["width"] / 2 - on_thumb["width"]

    page.get_by_role("button", name="States: Focus").click()
    expect(switch).to_have_attribute("aria-checked", "false")
    assert switch.evaluate("(element) => document.activeElement === element")
    assert switch.evaluate("(element) => getComputedStyle(element).boxShadow") != "none"
    assert "checked={false}" in editor.input_value()
    assert "autoFocus" in editor.input_value()

    page.get_by_role("button", name="States: On").click()
    page.get_by_role("button", name="Intents: Preference").click()
    expect(preview.get_by_text("Intent: Preference", exact=True)).to_be_visible()
    expect(preview.get_by_text("Representa uma escolha pessoal, reversível e persistente do usuário.", exact=True)).to_be_visible()
    assert "Reduzir animações" in editor.input_value()

    page.get_by_role("button", name="Intents: Visibility").click()
    expect(preview.get_by_text("Intent: Visibility", exact=True)).to_be_visible()
    expect(preview.get_by_text("Controla se um conteúdo complementar fica visível ou oculto, sem alterar o conteúdo em si.", exact=True)).to_be_visible()
    assert "Mostrar detalhes" in editor.input_value()
    page.get_by_role("button", name="States: Off").click()
    expect(preview.get_by_text("Mostrar detalhes revela ou recolhe informações adicionais.", exact=True)).to_be_visible()

    page.get_by_role("button", name="Intents: Mode").click()
    expect(preview.get_by_text("Intent: Mode", exact=True)).to_be_visible()
    expect(preview.get_by_text("Alterna entre dois comportamentos operacionais mutuamente exclusivos.", exact=True)).to_be_visible()
    assert "Modo de edição" in editor.input_value()
    page.get_by_role("button", name="States: On").click()
    expect(preview.get_by_text("Modo de edição muda como a interface responde às interações.", exact=True)).to_be_visible()


def assert_component_sync(page: Page, component_id: str, title: str, states: list[str], intents: list[str]) -> tuple[str, str]:
    select_component(page, title)
    preview = page.locator(f'[data-component-preview="{component_id}"]')
    editor = page.get_by_label("Editar code snippet do componente")
    do_guidance = page.locator('[data-usage-guidance="do"]')
    dont_guidance = page.locator('[data-usage-guidance="dont"]')
    assert preview.count() == 1
    assert editor.count() == 1
    assert do_guidance.locator("li").count() >= 3
    assert dont_guidance.locator("li").count() >= 3
    first_do = do_guidance.locator("li").first.inner_text()
    first_dont = dont_guidance.locator("li").first.inner_text()
    assert len(first_do) > 25
    assert len(first_dont) > 25

    intent_descriptions: set[str] = set()
    for intent in intents:
        page.get_by_role("button", name=f"Intents: {intent}").click()
        intent_card = preview.locator(f'[data-intent-explanation="{intent}"]')
        expect(intent_card.get_by_text(f"Intent: {intent}", exact=True)).to_be_visible()
        description = intent_card.locator("p").nth(1).inner_text()
        assert "Descreve a finalidade que este componente atende" not in description
        intent_descriptions.add(description)

    assert len(intent_descriptions) == len(intents), component_id

    page.get_by_role("button", name=f"States: {states[0]}").click()
    page.get_by_role("button", name=f"Intents: {intents[0]}").click()
    initial_snippet = editor.input_value()
    initial_intent_description = preview.locator("[data-intent-explanation] p").nth(1).inner_text()
    target_state = states[-1]
    target_intent = intents[-1]
    page.get_by_role("button", name=f"States: {target_state}").click()
    page.get_by_role("button", name=f"Intents: {target_intent}").click()

    assert preview.get_attribute("data-state") == target_state
    assert preview.get_attribute("data-intent") == target_intent
    intent_card = preview.locator(f'[data-intent-explanation="{target_intent}"]')
    assert intent_card.count() == 1
    expect(intent_card.get_by_text(f"Intent: {target_intent}", exact=True)).to_be_visible()
    assert intent_card.locator("p").nth(1).inner_text() != initial_intent_description, component_id
    assert "Descreve a finalidade que este componente atende" not in intent_card.inner_text()
    assert page.get_by_role("button", name=f"States: {target_state}").get_attribute("aria-pressed") == "true"
    assert page.get_by_role("button", name=f"Intents: {target_intent}").get_attribute("aria-pressed") == "true"

    configured_snippet = editor.input_value()
    assert configured_snippet != initial_snippet

    page.get_by_role("button", name=f"States: {states[0]}").click()
    page.get_by_role("button", name=f"Intents: {intents[0]}").click()
    editor.fill(configured_snippet)

    assert preview.get_attribute("data-state") == target_state
    assert preview.get_attribute("data-intent") == target_intent

    editor.fill("<InvalidComponent />")
    assert page.locator("#component-snippet-error").count() == 1, component_id
    assert preview.get_attribute("data-state") == target_state
    assert preview.get_attribute("data-intent") == target_intent

    editor.fill(configured_snippet)
    assert page.locator("#component-snippet-error").count() == 0
    return first_do, first_dont


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = context.new_page()
        errors: list[str] = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(f"{APP_BASE}/components")
        page.wait_for_load_state("networkidle")

        assert_toggle_semantics(page)

        first_do_rules: set[str] = set()
        first_dont_rules: set[str] = set()
        for component in COMPONENTS:
            first_do, first_dont = assert_component_sync(page, *component)
            first_do_rules.add(first_do)
            first_dont_rules.add(first_dont)

        assert len(first_do_rules) == len(COMPONENTS)
        assert len(first_dont_rules) == len(COMPONENTS)

        assert page.get_by_text("Destructive", exact=True).count() == 0
        assert not errors, errors

        mobile = context.new_page()
        mobile.set_viewport_size({"width": 390, "height": 844})
        mobile.goto(f"{APP_BASE}/components")
        mobile.wait_for_load_state("networkidle")
        assert mobile.locator("body").evaluate(
            "(element) => element.scrollWidth <= window.innerWidth"
        )

        context.close()
        browser.close()

    print("All component workbench synchronization checks passed.")


if __name__ == "__main__":
    main()
