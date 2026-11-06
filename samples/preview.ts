// Inspect tokens with Developer: Inspect Editor Tokens and Scopes.
interface Theme {
  readonly name: string;
  enabled: boolean;
}

enum Surface { Editor, Sidebar, Panel }

export class Preview {
  private count = 3;

  constructor(public theme: Theme) {}

  describe(surface: Surface): string {
    const label = this.theme.enabled ? "enabled" : "disabled";
    return `${this.theme.name}: ${label} (${surface}, ${this.count})`;
  }
}

const preview = new Preview({ name: "Ectoplasm", enabled: true });
console.log(preview.describe(Surface.Editor));

/** @deprecated Use Preview.describe instead. */
function legacyLabel(value: string): string {
  return value;
}
console.log(legacyLabel("Ectoplasm"));
