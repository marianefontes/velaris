import type { Locale } from "../../../i18n/translations";
import type { AuditEntry as AuditEntryModel, AuditLabels } from "../../types/beatrice";
import { DecisionCard } from "../reasoning/DecisionCard";

export function AuditEntry({
  entry,
  expanded,
  labels,
  locale,
  onToggle,
}: {
  entry: AuditEntryModel;
  expanded: boolean;
  labels: AuditLabels;
  locale: Locale;
  onToggle: () => void;
}) {
  return <DecisionCard entry={entry} expanded={expanded} labels={labels} locale={locale} onToggle={onToggle} />;
}

