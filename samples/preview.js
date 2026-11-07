// Comments, parameters, properties, constants, and a template expression.
const LIMIT = 3;
export function describe(theme, count = LIMIT) {
  const enabled = theme.enabled && count > 0;
  return `${theme.name}: ${enabled ? "enabled" : "disabled"}`;
}
console.log(describe({ name: "Ectoplasm", enabled: true }));

// Inspect semantic highlighting and compare with TextMate-only highlighting.
class Preview {
  constructor(value) {
    this.value = value;
  }

  describe(prefix) {
    const label = `${prefix}: ${this.value}`;
    return label;
  }
}

function originalLightness(first, second) {
  const average = (first + second) / 2;
  let result = Math.max(average, 0);
  result += parseFloat("0.5");
  return result;
}

const preview = new Preview(originalLightness(0.2, 0.4));
console.log(preview.describe("Ectoplasm"));
