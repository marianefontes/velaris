from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

from pydantic import BaseModel

from .models import ToolPermission


ToolExecutor = Callable[[BaseModel], BaseModel]


@dataclass(frozen=True)
class ToolDefinition:
    name: str
    description: str
    input_schema: type[BaseModel]
    output_schema: type[BaseModel]
    executor: ToolExecutor
    status: ToolPermission
    requires_confirmation: bool


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, ToolDefinition] = {}

    def register(self, definition: ToolDefinition) -> None:
        if not definition.name.strip():
            raise ValueError("Tool name is required")
        if definition.name in self._tools:
            raise ValueError(f"Tool already registered: {definition.name}")
        if not issubclass(definition.input_schema, BaseModel):
            raise TypeError("Tool input_schema must be a Pydantic model")
        if not issubclass(definition.output_schema, BaseModel):
            raise TypeError("Tool output_schema must be a Pydantic model")
        self._tools[definition.name] = definition

    def get(self, name: str) -> ToolDefinition:
        try:
            return self._tools[name]
        except KeyError as error:
            raise KeyError(f"Unknown tool: {name}") from error

    def names(self) -> set[str]:
        return set(self._tools)

    def definitions(self) -> tuple[ToolDefinition, ...]:
        return tuple(self._tools.values())

    def execute(self, name: str, payload: dict[str, Any]) -> BaseModel:
        definition = self.get(name)
        tool_input = definition.input_schema.model_validate(payload)
        raw_output = definition.executor(tool_input)
        return definition.output_schema.model_validate(raw_output)
