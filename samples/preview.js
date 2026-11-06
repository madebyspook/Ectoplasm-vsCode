// Comments, parameters, properties, constants, and a template expression.
const LIMIT = 3;
export function describe(theme, count = LIMIT) {
  const enabled = theme.enabled && count > 0;
  return `${theme.name}: ${enabled ? "enabled" : "disabled"}`;
}
console.log(describe({ name: "Ectoplasm", enabled: true }));
