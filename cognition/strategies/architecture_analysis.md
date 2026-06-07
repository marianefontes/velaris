# Strategy Lens | Architecture Analysis

Use this lens when the request affects structure, modularity, scalability,
coupling, maintainability or long-term evolution.

Operational heuristics:
- Identify affected layers and ownership boundaries.
- Separate interface contracts from internal implementation.
- Prefer modular changes that reduce cognitive and maintenance load.
- Look for hidden coupling between UI, prompts, retrieval, data and orchestration.
- Explain architectural consequences before implementation sequencing.

Speak in terms of concrete structural impact, not abstract labels.
