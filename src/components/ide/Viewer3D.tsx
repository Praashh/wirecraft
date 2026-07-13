"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { BOARDS } from "~/lib/engine/boards";
import type { BuildResult } from "~/lib/engine/types";

const BB_W = 6.4;
const BB_D = 2.2;
const BB_H = 0.18;

/* ── tiny helpers ── */

function mat(color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, ...opts });
}

function boxMesh(w: number, h: number, d: number, color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts));
}

function cylMesh(rT: number, rB: number, h: number, seg: number, color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, seg), mat(color, opts));
}

function halfSphere(radius: number, wSeg: number, hSeg: number, color: string, matOpts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, wSeg, hSeg, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(color, matOpts),
  );
}

function textSprite(text: string, size: number, color: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const px = Math.round(size * 600);
  ctx.font = `bold ${px}px sans-serif`;
  const tw = ctx.measureText(text).width;
  canvas.width = Math.ceil(tw) + 16;
  canvas.height = px + 12;
  ctx.font = `bold ${px}px sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  ctx.fillText(text, 8, 4);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  s.scale.set((canvas.width / canvas.height) * size, size, 1);
  return s;
}

/* ── scene builders ── */

function buildBreadboard(): THREE.Group {
  const g = new THREE.Group();
  const body = boxMesh(BB_W, BB_H, BB_D, "#F5F5F0", { roughness: 0.85, metalness: 0 });
  g.add(body);

  const channel = boxMesh(BB_W - 0.3, 0.005, 0.12, "#E0DDD0", { roughness: 0.9 });
  channel.position.set(0, BB_H / 2 + 0.001, 0);
  g.add(channel);

  const rails: [number, string][] = [
    [-BB_D / 2 + 0.15, "#E5484D"], [-BB_D / 2 + 0.25, "#2B4BF2"],
    [BB_D / 2 - 0.15, "#E5484D"], [BB_D / 2 - 0.25, "#2B4BF2"],
  ];
  for (const [z, c] of rails) {
    const r = boxMesh(BB_W - 0.4, 0.004, 0.06, c, { roughness: 0.8 });
    r.position.set(0, BB_H / 2 + 0.001, z);
    g.add(r);
  }

  const holeMat = mat("#C8C4B8", { side: THREE.DoubleSide });
  const holeGeo = new THREE.CircleGeometry(0.018, 8);
  for (let col = 0; col < 50; col++) {
    for (const zOff of [-0.4, -0.28, -0.16, 0.16, 0.28, 0.4]) {
      const h = new THREE.Mesh(holeGeo, holeMat);
      h.rotation.x = -Math.PI / 2;
      h.position.set(-BB_W / 2 + 0.35 + col * 0.115, BB_H / 2 + 0.002, zOff);
      g.add(h);
    }
  }
  return g;
}

function buildMCU(result: BuildResult): THREE.Group {
  const board = BOARDS[result.board];
  const mcuW = 2.2, mcuD = 1.0, mcuH = 0.12;
  const x = -BB_W / 2 + mcuW / 2 + 0.3;
  const y = BB_H / 2 + mcuH / 2 + 0.02;
  const g = new THREE.Group();
  g.position.set(x, y, 0);

  g.add(boxMesh(mcuW, mcuH, mcuD, board.svg.color, { roughness: 0.5, metalness: 0.15 }));

  const chip = boxMesh(0.6, 0.08, 0.45, "#17191E", { roughness: 0.25, metalness: 0.5 });
  chip.position.set(0.1, mcuH / 2 + 0.04, 0);
  g.add(chip);

  const chipLabel = textSprite(board.svg.name, 0.08, "#F0B100");
  chipLabel.position.set(0.1, mcuH / 2 + 0.1, 0);
  g.add(chipLabel);

  const usb = boxMesh(0.3, 0.1, 0.2, "#8E9299", { roughness: 0.4, metalness: 0.7 });
  usb.position.set(-mcuW / 2 + 0.1, mcuH / 2 + 0.04, 0);
  g.add(usb);

  const pinMat = mat("#D4A84B", { metalness: 0.8, roughness: 0.2 });
  const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 6);
  for (let i = 0; i < 14; i++) {
    const px = -mcuW / 2 + 0.2 + i * 0.13;
    const py = -mcuH / 2 - 0.05;
    const p1 = new THREE.Mesh(pinGeo, pinMat);
    p1.position.set(px, py, -mcuD / 2 + 0.08);
    g.add(p1);
    const p2 = new THREE.Mesh(pinGeo, pinMat);
    p2.position.set(px, py, mcuD / 2 - 0.08);
    g.add(p2);
  }

  const boardLabel = textSprite(result.boardLabel, 0.06, "#ffffff");
  boardLabel.position.set(0, mcuH / 2 + 0.1, -mcuD / 2 + 0.12);
  g.add(boardLabel);

  const statusLed = boxMesh(0.06, 0.03, 0.03, "#2FA36B", { emissive: new THREE.Color("#2FA36B"), emissiveIntensity: 0.5 });
  statusLed.position.set(mcuW / 2 - 0.15, mcuH / 2 + 0.03, -0.15);
  g.add(statusLed);

  const pwrLed = boxMesh(0.06, 0.03, 0.03, "#E5484D", { emissive: new THREE.Color("#E5484D"), emissiveIntensity: 0.3 });
  pwrLed.position.set(mcuW / 2 - 0.15, mcuH / 2 + 0.03, 0.15);
  g.add(pwrLed);

  return g;
}

/* ── component shapes ── */

const COMP_COLORS: Record<string, string> = {
  led: "#E5484D", buzzer: "#2A2A2A", servo: "#3B82F6", relay: "#2563EB",
  neopixel: "#A855F7", button: "#6B7280", ultrasonic: "#1E7A8C", dht22: "#F5F5F0",
  oled: "#111111", pir: "#F5F5F0", ldr: "#B45309", soil: "#6B7280",
  pot: "#374151", rfid: "#1E7A8C", gas: "#6B7280", encoder: "#374151",
};

const legMat = mat("#C0C0C0", { metalness: 0.8 });

function buildLED(color: string): THREE.Group {
  const g = new THREE.Group();
  const dome = halfSphere(0.08, 16, 12, color, { emissive: new THREE.Color(color), emissiveIntensity: 0.4, transparent: true, opacity: 0.85 });
  dome.position.set(0, 0.22, 0);
  g.add(dome);
  const body = cylMesh(0.08, 0.08, 0.18, 16, color, { emissive: new THREE.Color(color), emissiveIntensity: 0.2, transparent: true, opacity: 0.8 });
  body.position.set(0, 0.13, 0);
  g.add(body);
  const base = cylMesh(0.1, 0.1, 0.03, 16, color, { transparent: true, opacity: 0.7 });
  base.position.set(0, 0.04, 0);
  g.add(base);
  const legGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 4);
  const l1 = new THREE.Mesh(legGeo, legMat); l1.position.set(-0.03, -0.08, 0); g.add(l1);
  const legGeo2 = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 4);
  const l2 = new THREE.Mesh(legGeo2, legMat); l2.position.set(0.03, -0.055, 0); g.add(l2);
  return g;
}

function buildButton(): THREE.Group {
  const g = new THREE.Group();
  const body = boxMesh(0.24, 0.12, 0.24, "#1A1A1A", { roughness: 0.6 });
  body.position.set(0, 0.08, 0);
  g.add(body);
  const cap = cylMesh(0.06, 0.06, 0.08, 16, "#E5484D", { roughness: 0.4 });
  cap.position.set(0, 0.18, 0);
  g.add(cap);
  const legGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 4);
  for (const [lx, lz] of [[-0.08, -0.08], [-0.08, 0.08], [0.08, -0.08], [0.08, 0.08]]) {
    const l = new THREE.Mesh(legGeo, legMat); l.position.set(lx, -0.02, lz); g.add(l);
  }
  return g;
}

function buildUltrasonic(): THREE.Group {
  const g = new THREE.Group();
  const pcb = boxMesh(0.55, 0.06, 0.35, "#1E7A8C", { roughness: 0.5 });
  pcb.position.set(0, 0.05, 0);
  g.add(pcb);
  for (const xOff of [-0.14, 0.14]) {
    const t = cylMesh(0.1, 0.1, 0.12, 20, "#D4D4D4", { metalness: 0.6, roughness: 0.3 });
    t.position.set(xOff, 0.14, 0); t.rotation.x = Math.PI / 2; g.add(t);
    const tc = cylMesh(0.08, 0.08, 0.02, 20, "#A0A0A0", { metalness: 0.5 });
    tc.position.set(xOff, 0.14, -0.07); tc.rotation.x = Math.PI / 2; g.add(tc);
  }
  const crystal = boxMesh(0.1, 0.06, 0.04, "#17191E");
  crystal.position.set(0, 0.1, 0.05);
  g.add(crystal);
  return g;
}

function buildDHT22(): THREE.Group {
  const g = new THREE.Group();
  const body = boxMesh(0.3, 0.35, 0.08, "#F5F5F0", { roughness: 0.8 });
  body.position.set(0, 0.2, 0);
  g.add(body);
  for (let i = 0; i < 5; i++) {
    const v = boxMesh(0.2, 0.015, 0.002, "#D0CFC8");
    v.position.set(0, 0.28 - i * 0.04, -0.042);
    g.add(v);
  }
  const legGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 4);
  for (const lx of [-0.08, 0, 0.08]) {
    const l = new THREE.Mesh(legGeo, legMat); l.position.set(lx, -0.03, 0); g.add(l);
  }
  return g;
}

function buildOLED(): THREE.Group {
  const g = new THREE.Group();
  const pcb = boxMesh(0.5, 0.35, 0.06, "#1A5C2E", { roughness: 0.5 });
  pcb.position.set(0, 0.2, 0.01);
  g.add(pcb);
  const bezel = boxMesh(0.45, 0.26, 0.02, "#0A0A0A", { roughness: 0.3 });
  bezel.position.set(0, 0.22, -0.02);
  g.add(bezel);
  const screen = boxMesh(0.38, 0.2, 0.002, "#0C1929", { emissive: new THREE.Color("#1A3A5C"), emissiveIntensity: 0.3 });
  screen.position.set(0, 0.22, -0.032);
  g.add(screen);
  [0.28, 0.24, 0.2, 0.16].forEach((yy, idx) => {
    const line = boxMesh(0.2 - idx * 0.03, 0.02, 0.001, "#3B82F6", { emissive: new THREE.Color("#3B82F6"), emissiveIntensity: 0.6 });
    line.position.set(-0.04 + idx * 0.02, yy, -0.034);
    g.add(line);
  });
  const pinGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.12, 4);
  const pinMat = mat("#D4A84B", { metalness: 0.8 });
  for (let i = 0; i < 4; i++) {
    const p = new THREE.Mesh(pinGeo, pinMat); p.position.set(-0.12 + i * 0.08, 0.01, 0); g.add(p);
  }
  return g;
}

function buildBuzzer(): THREE.Group {
  const g = new THREE.Group();
  const body = cylMesh(0.12, 0.12, 0.1, 20, "#1A1A1A", { roughness: 0.6 });
  body.position.set(0, 0.08, 0); g.add(body);
  const grille = cylMesh(0.11, 0.11, 0.015, 20, "#2A2A2A", { roughness: 0.5, metalness: 0.3 });
  grille.position.set(0, 0.135, 0); g.add(grille);
  const hole = cylMesh(0.03, 0.03, 0.005, 12, "#111111");
  hole.position.set(0, 0.144, 0); g.add(hole);
  const legGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 4);
  const l1 = new THREE.Mesh(legGeo, legMat); l1.position.set(-0.04, -0.02, 0); g.add(l1);
  const l2 = new THREE.Mesh(legGeo, legMat); l2.position.set(0.04, -0.02, 0); g.add(l2);
  return g;
}

function buildServo(): THREE.Group {
  const g = new THREE.Group();
  const body = boxMesh(0.45, 0.22, 0.2, "#3B82F6", { roughness: 0.5 });
  body.position.set(0, 0.13, 0); g.add(body);
  const tabs = boxMesh(0.6, 0.025, 0.2, "#3B82F6", { roughness: 0.5 });
  tabs.position.set(0, 0.22, 0); g.add(tabs);
  const shaft = cylMesh(0.03, 0.03, 0.06, 12, "#F5F5F0", { roughness: 0.4 });
  shaft.position.set(0.15, 0.27, 0); g.add(shaft);
  const horn = boxMesh(0.04, 0.015, 0.2, "#F5F5F0", { roughness: 0.4 });
  horn.position.set(0.15, 0.31, 0); g.add(horn);
  const label = textSprite("SG90", 0.05, "#ffffff");
  label.position.set(0, 0.13, -0.11); g.add(label);
  const wire = boxMesh(0.05, 0.03, 0.08, "#4B5563");
  wire.position.set(-0.22, 0.05, 0); g.add(wire);
  return g;
}

function buildPIR(): THREE.Group {
  const g = new THREE.Group();
  const pcb = cylMesh(0.18, 0.18, 0.06, 20, "#1A5C2E", { roughness: 0.5 });
  pcb.position.set(0, 0.05, 0); g.add(pcb);
  const dome = halfSphere(0.14, 16, 12, "#F5F5F0", { transparent: true, opacity: 0.7, roughness: 0.3 });
  dome.position.set(0, 0.18, 0); g.add(dome);
  const pyro = boxMesh(0.06, 0.06, 0.06, "#D4A84B", { metalness: 0.6 });
  pyro.position.set(0, 0.1, 0); g.add(pyro);
  const potGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 8);
  const potMat = mat("#D4A84B", { metalness: 0.5 });
  const tp1 = new THREE.Mesh(potGeo, potMat); tp1.position.set(-0.1, 0.09, 0.08); g.add(tp1);
  const tp2 = new THREE.Mesh(potGeo, potMat); tp2.position.set(0.1, 0.09, 0.08); g.add(tp2);
  return g;
}

function buildRelay(): THREE.Group {
  const g = new THREE.Group();
  const pcb = boxMesh(0.5, 0.06, 0.35, "#1A5C2E", { roughness: 0.5 });
  pcb.position.set(0, 0.05, 0); g.add(pcb);
  const cube = boxMesh(0.32, 0.25, 0.28, "#2563EB", { roughness: 0.5 });
  cube.position.set(0.05, 0.2, 0); g.add(cube);
  const label = textSprite("RELAY", 0.04, "#ffffff");
  label.position.set(0.05, 0.2, -0.15); g.add(label);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), mat("#E5484D", { emissive: new THREE.Color("#E5484D"), emissiveIntensity: 0.5 }));
  led.position.set(-0.15, 0.1, -0.1); g.add(led);
  const term = boxMesh(0.34, 0.04, 0.14, "#2B9DDB", { roughness: 0.5 });
  term.position.set(0.05, 0.34, 0); g.add(term);
  return g;
}

function buildNeoPixel(): THREE.Group {
  const g = new THREE.Group();
  const ring = cylMesh(0.18, 0.18, 0.03, 24, "#1A1A1A", { roughness: 0.5 });
  ring.position.set(0, 0.04, 0); g.add(ring);
  const center = cylMesh(0.1, 0.1, 0.04, 24, "#0A0A0A");
  center.position.set(0, 0.04, 0); g.add(center);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const hue = (i / 8);
    const c = new THREE.Color().setHSL(hue, 0.8, 0.6);
    const px = boxMesh(0.04, 0.02, 0.04, "#000000", { emissive: c, emissiveIntensity: 0.6 });
    px.material.color = c;
    px.position.set(Math.cos(a) * 0.14, 0.06, Math.sin(a) * 0.14);
    g.add(px);
  }
  return g;
}

function buildPot(): THREE.Group {
  const g = new THREE.Group();
  const body = cylMesh(0.1, 0.1, 0.08, 16, "#374151", { roughness: 0.5, metalness: 0.3 });
  body.position.set(0, 0.06, 0); g.add(body);
  const shaft = cylMesh(0.025, 0.025, 0.12, 8, "#C0C0C0", { metalness: 0.8, roughness: 0.2 });
  shaft.position.set(0, 0.16, 0); g.add(shaft);
  const knob = cylMesh(0.06, 0.06, 0.06, 16, "#17191E", { roughness: 0.4 });
  knob.position.set(0, 0.24, 0); g.add(knob);
  const ind = boxMesh(0.02, 0.005, 0.005, "#F5F5F0");
  ind.position.set(0.04, 0.275, 0); g.add(ind);
  const legGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 4);
  for (const lx of [-0.05, 0, 0.05]) {
    const l = new THREE.Mesh(legGeo, legMat); l.position.set(lx, -0.03, 0); g.add(l);
  }
  return g;
}

function buildLDR(): THREE.Group {
  const g = new THREE.Group();
  const disc = cylMesh(0.06, 0.06, 0.04, 16, "#B45309", { roughness: 0.6 });
  disc.position.set(0, 0.08, 0); g.add(disc);
  const cross1 = boxMesh(0.06, 0.005, 0.005, "#D97706");
  cross1.position.set(0, 0.105, 0); cross1.rotation.x = -Math.PI / 2; g.add(cross1);
  const cross2 = boxMesh(0.06, 0.005, 0.005, "#D97706");
  cross2.position.set(0, 0.105, 0); cross2.rotation.x = -Math.PI / 2; cross2.rotation.z = Math.PI / 2; g.add(cross2);
  const epoxy = halfSphere(0.06, 12, 8, "#B45309", { transparent: true, opacity: 0.5 });
  epoxy.position.set(0, 0.1, 0); g.add(epoxy);
  const legGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 4);
  const l1 = new THREE.Mesh(legGeo, legMat); l1.position.set(-0.03, -0.02, 0); g.add(l1);
  const l2 = new THREE.Mesh(legGeo, legMat); l2.position.set(0.03, -0.02, 0); g.add(l2);
  return g;
}

function buildSoil(): THREE.Group {
  const g = new THREE.Group();
  const header = boxMesh(0.2, 0.15, 0.08, "#1A5C2E", { roughness: 0.5 });
  header.position.set(0, 0.1, 0); g.add(header);
  const probe = boxMesh(0.15, 0.08, 0.4, "#1A5C2E", { roughness: 0.5 });
  probe.position.set(0, 0.1, 0.2); g.add(probe);
  for (const tx of [-0.04, 0.04]) {
    const trace = boxMesh(0.015, 0.003, 0.3, "#D4A84B", { metalness: 0.7 });
    trace.position.set(tx, 0.145, 0.25); g.add(trace);
  }
  return g;
}

function buildGas(): THREE.Group {
  const g = new THREE.Group();
  const pcb = boxMesh(0.35, 0.06, 0.25, "#1A5C2E", { roughness: 0.5 });
  pcb.position.set(0, 0.05, 0); g.add(pcb);
  const cyl = cylMesh(0.1, 0.1, 0.2, 16, "#C0C0C0", { metalness: 0.5, roughness: 0.3 });
  cyl.position.set(0, 0.18, 0); g.add(cyl);
  const cap = cylMesh(0.1, 0.1, 0.03, 16, "#A0A0A0", { metalness: 0.4, roughness: 0.5, wireframe: true });
  cap.position.set(0, 0.3, 0); g.add(cap);
  return g;
}

function buildRFID(): THREE.Group {
  const g = new THREE.Group();
  const pcb = boxMesh(0.5, 0.06, 0.4, "#1E7A8C", { roughness: 0.5 });
  pcb.position.set(0, 0.05, 0); g.add(pcb);
  const coil1 = boxMesh(0.44, 0.003, 0.34, "#D4A84B", { metalness: 0.6 });
  coil1.position.set(0, 0.082, 0); g.add(coil1);
  const coil2 = boxMesh(0.38, 0.003, 0.28, "#D4A84B", { metalness: 0.6 });
  coil2.position.set(0, 0.082, 0); g.add(coil2);
  const ic = boxMesh(0.12, 0.04, 0.12, "#17191E");
  ic.position.set(0.1, 0.1, 0.05); g.add(ic);
  const label = textSprite("RC522", 0.05, "#D4A84B");
  label.position.set(0, 0.1, -0.08); g.add(label);
  return g;
}

function buildEncoder(): THREE.Group {
  const g = new THREE.Group();
  const body = boxMesh(0.22, 0.12, 0.22, "#374151", { roughness: 0.5, metalness: 0.2 });
  body.position.set(0, 0.08, 0); g.add(body);
  const shaft = cylMesh(0.04, 0.04, 0.2, 12, "#C0C0C0", { metalness: 0.8, roughness: 0.2 });
  shaft.position.set(0, 0.22, 0); g.add(shaft);
  const knob = cylMesh(0.07, 0.07, 0.08, 20, "#17191E", { roughness: 0.4 });
  knob.position.set(0, 0.35, 0); g.add(knob);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const ridge = boxMesh(0.005, 0.07, 0.005, "#2A2A2A");
    ridge.position.set(Math.cos(a) * 0.072, 0.35, Math.sin(a) * 0.072);
    g.add(ridge);
  }
  return g;
}

function buildGeneric(label: string, color: string): THREE.Group {
  const g = new THREE.Group();
  const body = boxMesh(0.3, 0.15, 0.2, color, { roughness: 0.5 });
  body.position.set(0, 0.1, 0); g.add(body);
  const txt = textSprite(label, 0.04, "#ffffff");
  txt.position.set(0, 0.18, -0.11); g.add(txt);
  return g;
}

function buildComponentShape(id: string, shortName: string): THREE.Group {
  switch (id) {
    case "led": return buildLED("#E5484D");
    case "button": return buildButton();
    case "ultrasonic": return buildUltrasonic();
    case "dht22": return buildDHT22();
    case "oled": return buildOLED();
    case "buzzer": return buildBuzzer();
    case "servo": return buildServo();
    case "pir": return buildPIR();
    case "ldr": return buildLDR();
    case "soil": return buildSoil();
    case "relay": return buildRelay();
    case "neopixel": return buildNeoPixel();
    case "pot": return buildPot();
    case "rfid": return buildRFID();
    case "gas": return buildGas();
    case "encoder": return buildEncoder();
    default: return buildGeneric(shortName, COMP_COLORS[id] ?? "#6B7280");
  }
}

/* ── wires ── */

function buildWire(from: THREE.Vector3, to: THREE.Vector3, color: string): THREE.Line {
  const dx = Math.abs(from.x - to.x);
  const dz = Math.abs(from.z - to.z);
  const sag = -(0.08 + (dx + dz) * 0.04);
  const mid = new THREE.Vector3(
    (from.x + to.x) / 2,
    Math.min(from.y, to.y) + sag,
    (from.z + to.z) / 2,
  );
  const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
  const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, linewidth: 2 });
  return new THREE.Line(geo, lineMat);
}

/* ── desk ── */

function buildDesk(): THREE.Group {
  const g = new THREE.Group();
  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 12),
    mat("#D4A574", { roughness: 0.85, metalness: 0 }),
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.set(0, -0.3, 0);
  surface.receiveShadow = true;
  g.add(surface);
  const grainMat = mat("#C4955A", { roughness: 0.9 });
  for (let i = 0; i < 8; i++) {
    const grain = new THREE.Mesh(new THREE.PlaneGeometry(16, 0.02), grainMat);
    grain.rotation.x = -Math.PI / 2;
    grain.position.set(0, -0.299, -4 + i * 1.1);
    g.add(grain);
  }
  return g;
}

/* ── full scene assembly ── */

function buildFullScene(result: BuildResult): THREE.Group {
  const root = new THREE.Group();
  const board = BOARDS[result.board];

  root.add(buildBreadboard());
  root.add(buildMCU(result));
  root.add(buildDesk());

  // Layout
  const mcuW = 2.2;
  const mcuX = -BB_W / 2 + mcuW / 2 + 0.3;

  const boardPins = new Map<string, THREE.Vector3>();
  const leftPinStartX = mcuX - mcuW / 2 + 0.2;
  board.svg.left.forEach((pin, i) => {
    boardPins.set(pin, new THREE.Vector3(leftPinStartX + i * 0.13, BB_H / 2 + 0.02, -0.5));
  });
  board.svg.right.forEach((pin, i) => {
    boardPins.set(pin, new THREE.Vector3(leftPinStartX + i * 0.13, BB_H / 2 + 0.02, 0.5));
  });

  const compStartX = mcuX + mcuW / 2 + 0.5;
  const availableW = BB_W / 2 - mcuW / 2 - 0.6;
  const spacing = Math.min(0.7, availableW / Math.max(result.components.length, 1));

  result.components.forEach((pc, i) => {
    const x = compStartX + i * spacing;
    const z = i % 2 === 0 ? -0.35 : 0.35;
    const pos = new THREE.Vector3(x, BB_H / 2 + 0.02, z);
    const pinPos = new THREE.Vector3(x, BB_H / 2 + 0.02, z > 0 ? z - 0.15 : z + 0.15);

    const shape = buildComponentShape(pc.component.id, pc.component.shortName);
    shape.position.copy(pos);
    root.add(shape);

    const label = textSprite(pc.refName, 0.06, "#17191E");
    label.position.set(pos.x, pos.y + 0.5, pos.z);
    root.add(label);

    // Signal wires
    for (const pin of pc.pins) {
      if (pin.kind === "power" || pin.kind === "gnd") {
        const railZ = pin.kind === "power" ? -BB_D / 2 + 0.15 : -BB_D / 2 + 0.25;
        root.add(buildWire(new THREE.Vector3(pinPos.x, BB_H / 2 + 0.02, railZ), pinPos, pin.color));
      } else {
        const bp = boardPins.get(pin.boardPin);
        if (bp) root.add(buildWire(bp, pinPos, pin.color));
      }
    }
  });

  return root;
}

/* ── React component ── */

export function Viewer3D({ result }: { result: BuildResult }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    el.insertBefore(renderer.domElement, el.firstChild);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(3.5, 3, 3.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.5;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 0.2, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dir1.position.set(6, 8, 4);
    dir1.castShadow = true;
    dir1.shadow.mapSize.set(2048, 2048);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dir2.position.set(-3, 5, -3);
    scene.add(dir2);
    const point = new THREE.PointLight(0xffffff, 0.3);
    point.position.set(0, 4, 0);
    scene.add(point);

    scene.add(buildFullScene(result));

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(el);

    let raf = 0;
    const animate = () => { raf = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [result]);

  return (
    <div ref={containerRef} className="relative h-full w-full" style={{ background: "linear-gradient(180deg, #E8E4DC 0%, #D5CFC5 100%)" }}>
      <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-line bg-white/90 px-3 py-2 backdrop-blur-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>
        <p className="text-xs font-bold text-ink">{result.name}</p>
        <p className="text-[10px] text-muted">
          {result.boardLabel} · {result.components.length} components · {result.wires.length} wires
        </p>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-line bg-white/90 px-3 py-2 backdrop-blur-sm">
        <p className="text-[10px] text-muted" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Drag to orbit · Scroll to zoom
        </p>
      </div>
    </div>
  );
}
