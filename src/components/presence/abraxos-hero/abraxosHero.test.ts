import { describe, expect, it } from "vitest";
import { ABRAXOS_VIEWBOX, SPINE_CONTROL_POINTS } from "./constants";
import { createGraphTail } from "./graphTail";
import { createHeadLayer } from "./headLayer";
import { densityAt, regionAt, surfaceOpacityAt } from "./material";
import { createParticleBody } from "./particleBody";
import { sampleSpine, widthAt } from "./spine";
import { createStarField } from "./starField";
import { createWingGraphs } from "./wingGraph";

describe("AbraxosHero procedural layers", () => {
  it("uses the canonical 512×768 coordinate space", () => {
    expect(ABRAXOS_VIEWBOX.width).toBe(512);
    expect(ABRAXOS_VIEWBOX.height).toBe(768);
  });

  it("samples a continuous spine from head to tail", () => {
    const head = sampleSpine(0);
    const tail = sampleSpine(1);
    expect(head.y).toBeLessThan(tail.y);
    expect(SPINE_CONTROL_POINTS.length).toBeGreaterThanOrEqual(5);
  });

  it("follows the material gradient law", () => {
    expect(regionAt(0.1)).toBe("head");
    expect(regionAt(0.4)).toBe("body");
    expect(regionAt(0.8)).toBe("graph");
    expect(densityAt(0)).toBe(1);
    expect(densityAt(1)).toBe(0);
    expect(surfaceOpacityAt(0.5)).toBe(1);
    expect(surfaceOpacityAt(1)).toBe(0);
  });

  it("generates anatomical head, body, graph and wing layers", () => {
    const head = createHeadLayer(900);
    const body = createParticleBody();
    const graph = createGraphTail();
    const wings = createWingGraphs();
    const stars = createStarField(100);

    expect(head.particles.length).toBeGreaterThan(400);
    expect(head.eyes).toHaveLength(2);
    expect(body.particles.length).toBeGreaterThan(200);
    expect(body.connections.length).toBeGreaterThan(50);
    expect(graph.nodes.length).toBeGreaterThan(10);
    expect(graph.edges.length).toBeGreaterThan(10);
    expect(wings).toHaveLength(2);
    expect(stars).toHaveLength(100);
  });

  it("tapers body width toward the graph tail", () => {
    expect(widthAt(0.05)).toBeGreaterThan(widthAt(0.5));
    expect(widthAt(0.5)).toBeGreaterThan(widthAt(0.9));
  });
});
