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

const preview = new Preview({ name: "Ectoplasma", enabled: true });
console.log(preview.describe(Surface.Editor));
