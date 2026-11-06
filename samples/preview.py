# Classes, types, functions, parameters, strings, numbers, and properties.
from dataclasses import dataclass

LIMIT = 3

@dataclass
class Theme:
    name: str
    enabled: bool = True

    def describe(self, count: int = LIMIT) -> str:
        label = "enabled" if self.enabled and count > 0 else "disabled"
        return f"{self.name}: {label} ({count})"

print(Theme("Ectoplasm").describe())
