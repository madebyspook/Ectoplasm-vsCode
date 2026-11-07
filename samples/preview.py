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

# Inspect the available TextMate scopes and semantic tokens.
class Preview:
    def __init__(self, value: float):
        self.value = value

    def describe(self, prefix: str) -> str:
        label = f"{prefix}: {self.value}"
        return label


def original_lightness(first: float, second: float) -> float:
    average = (first + second) / 2
    return max(average, 0)


preview = Preview(original_lightness(0.2, 0.4))
print(preview.describe("Ectoplasm"))
