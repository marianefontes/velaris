// MeshGradientBg — isolated ambient background layer for /main.
// Pure CSS keyframes, zero external deps.
// STRICTLY isolated from Framer Motion (design-taste-frontend constraint).
// All animation via transform-only @keyframes defined in index.css.

export function MeshGradientBg() {
  return (
    <div aria-hidden="true" className="mesh-gradient-bg">
      <div className="mesh-blob mesh-blob-1" />
      <div className="mesh-blob mesh-blob-2" />
      <div className="mesh-blob mesh-blob-3" />
      <div className="mesh-blob mesh-blob-4" />
    </div>
  );
}
