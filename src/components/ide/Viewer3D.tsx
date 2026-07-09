"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Line, Cylinder } from "@react-three/drei";
import * as THREE from "three";

import { BOARDS } from "~/lib/engine/boards";
import type { BuildResult, PlacedComponent } from "~/lib/engine/types";



const BB_W = 6.4; // breadboard width (long axis = X)
const BB_D = 2.2; // breadboard depth (short axis = Z)
const BB_H = 0.18;
const HOLE_SPACING = 0.1; // 2.54mm scaled



function Breadboard() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main body */}
      <RoundedBox args={[BB_W, BB_H, BB_D]} radius={0.04} smoothness={3} position={[0, 0, 0]}>
        <meshStandardMaterial color="#F5F5F0" roughness={0.85} metalness={0} />
      </RoundedBox>

      {/* Center channel divider */}
      <mesh position={[0, BB_H / 2 + 0.001, 0]}>
        <boxGeometry args={[BB_W - 0.3, 0.005, 0.12]} />
        <meshStandardMaterial color="#E0DDD0" roughness={0.9} />
      </mesh>

      {/* Power rail strips (+ and -) — top */}
      <mesh position={[0, BB_H / 2 + 0.001, -BB_D / 2 + 0.15]}>
        <boxGeometry args={[BB_W - 0.4, 0.004, 0.06]} />
        <meshStandardMaterial color="#E5484D" roughness={0.8} />
      </mesh>
      <mesh position={[0, BB_H / 2 + 0.001, -BB_D / 2 + 0.25]}>
        <boxGeometry args={[BB_W - 0.4, 0.004, 0.06]} />
        <meshStandardMaterial color="#2B4BF2" roughness={0.8} />
      </mesh>

      {/* Power rail strips — bottom */}
      <mesh position={[0, BB_H / 2 + 0.001, BB_D / 2 - 0.15]}>
        <boxGeometry args={[BB_W - 0.4, 0.004, 0.06]} />
        <meshStandardMaterial color="#E5484D" roughness={0.8} />
      </mesh>
      <mesh position={[0, BB_H / 2 + 0.001, BB_D / 2 - 0.25]}>
        <boxGeometry args={[BB_W - 0.4, 0.004, 0.06]} />
        <meshStandardMaterial color="#2B4BF2" roughness={0.8} />
      </mesh>

      {/* Hole grid (simplified — show rows of dots) */}
      {Array.from({ length: 50 }).map((_, col) =>
        [-0.4, -0.28, -0.16, 0.16, 0.28, 0.4].map((zOff, row) => (
          <mesh key={`h-${col}-${row}`} position={[-BB_W / 2 + 0.35 + col * 0.115, BB_H / 2 + 0.002, zOff]}>
            <circleGeometry args={[0.018, 8]} />
            <meshStandardMaterial color="#C8C4B8" side={THREE.DoubleSide} />
          </mesh>
        )),
      )}
    </group>
  );
}



function MicrocontrollerBoard({ result }: { result: BuildResult }) {
  const board = BOARDS[result.board];
  const mcuW = 2.2;
  const mcuD = 1.0;
  const mcuH = 0.12;
  const x = -BB_W / 2 + mcuW / 2 + 0.3;
  const y = BB_H / 2 + mcuH / 2 + 0.02;

  return (
    <group position={[x, y, 0]}>
      {/* PCB */}
      <RoundedBox args={[mcuW, mcuH, mcuD]} radius={0.04} smoothness={3}>
        <meshStandardMaterial color={board.svg.color} roughness={0.5} metalness={0.15} />
      </RoundedBox>

      {/* Chip IC */}
      <RoundedBox args={[0.6, 0.08, 0.45]} radius={0.02} smoothness={2} position={[0.1, mcuH / 2 + 0.04, 0]}>
        <meshStandardMaterial color="#17191E" roughness={0.25} metalness={0.5} />
      </RoundedBox>

      {/* Chip label */}
      <Text
        position={[0.1, mcuH / 2 + 0.09, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.08}
        color="#F0B100"
        anchorX="center"
        anchorY="middle"
      >
        {board.svg.name}
      </Text>

      {/* USB port */}
      <RoundedBox args={[0.3, 0.1, 0.2]} radius={0.02} smoothness={2} position={[-mcuW / 2 + 0.1, mcuH / 2 + 0.04, 0]}>
        <meshStandardMaterial color="#8E9299" roughness={0.4} metalness={0.7} />
      </RoundedBox>

      {/* Pin header rows (gold cylinders) */}
      {Array.from({ length: 14 }).map((_, i) => (
        <group key={`pin-t-${i}`}>
          <Cylinder args={[0.02, 0.02, 0.15, 6]} position={[-mcuW / 2 + 0.2 + i * 0.13, -mcuH / 2 - 0.05, -mcuD / 2 + 0.08]}>
            <meshStandardMaterial color="#D4A84B" metalness={0.8} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[0.02, 0.02, 0.15, 6]} position={[-mcuW / 2 + 0.2 + i * 0.13, -mcuH / 2 - 0.05, mcuD / 2 - 0.08]}>
            <meshStandardMaterial color="#D4A84B" metalness={0.8} roughness={0.2} />
          </Cylinder>
        </group>
      ))}

      {/* Board label */}
      <Text
        position={[0, mcuH / 2 + 0.09, -mcuD / 2 + 0.12]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.06}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {result.boardLabel}
      </Text>

      {/* Status LED (green) */}
      <mesh position={[mcuW / 2 - 0.15, mcuH / 2 + 0.03, -0.15]}>
        <boxGeometry args={[0.06, 0.03, 0.03]} />
        <meshStandardMaterial color="#2FA36B" emissive="#2FA36B" emissiveIntensity={0.5} />
      </mesh>

      {/* Power LED (red) */}
      <mesh position={[mcuW / 2 - 0.15, mcuH / 2 + 0.03, 0.15]}>
        <boxGeometry args={[0.06, 0.03, 0.03]} />
        <meshStandardMaterial color="#E5484D" emissive="#E5484D" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}



const COMP_COLORS: Record<string, string> = {
  led: "#E5484D",
  buzzer: "#2A2A2A",
  servo: "#3B82F6",
  relay: "#2563EB",
  neopixel: "#A855F7",
  button: "#6B7280",
  ultrasonic: "#1E7A8C",
  dht22: "#F5F5F0",
  oled: "#111111",
  pir: "#F5F5F0",
  ldr: "#B45309",
  soil: "#6B7280",
  pot: "#374151",
  rfid: "#1E7A8C",
  gas: "#6B7280",
  encoder: "#374151",
};

/** LED: dome + body + two legs */
function LEDMesh({ color }: { color: string }) {
  return (
    <group>
      {/* Dome */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.08, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.85} />
      </mesh>
      {/* Body */}
      <Cylinder args={[0.08, 0.08, 0.18, 16]} position={[0, 0.13, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} transparent opacity={0.8} />
      </Cylinder>
      {/* Flat base */}
      <Cylinder args={[0.1, 0.1, 0.03, 16]} position={[0, 0.04, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </Cylinder>
      {/* Legs */}
      <Cylinder args={[0.01, 0.01, 0.2, 4]} position={[-0.03, -0.08, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
      </Cylinder>
      <Cylinder args={[0.01, 0.01, 0.15, 4]} position={[0.03, -0.055, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
      </Cylinder>
    </group>
  );
}

/** Tactile push button */
function ButtonMesh() {
  return (
    <group>
      <RoundedBox args={[0.24, 0.12, 0.24]} radius={0.02} smoothness={2} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#1A1A1A" roughness={0.6} />
      </RoundedBox>
      {/* Button cap */}
      <Cylinder args={[0.06, 0.06, 0.08, 16]} position={[0, 0.18, 0]}>
        <meshStandardMaterial color="#E5484D" roughness={0.4} />
      </Cylinder>
      {/* 4 legs */}
      {[[-0.08, -0.08], [-0.08, 0.08], [0.08, -0.08], [0.08, 0.08]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.012, 0.012, 0.12, 4]} position={[x!, -0.02, z!]}>
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
        </Cylinder>
      ))}
    </group>
  );
}

/** HC-SR04 ultrasonic sensor — two cylindrical transducers on a PCB */
function UltrasonicMesh() {
  return (
    <group>
      {/* PCB */}
      <RoundedBox args={[0.55, 0.06, 0.35]} radius={0.02} smoothness={2} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1E7A8C" roughness={0.5} />
      </RoundedBox>
      {/* Left transducer */}
      <Cylinder args={[0.1, 0.1, 0.12, 20]} position={[-0.14, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#D4D4D4" metalness={0.6} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.02, 20]} position={[-0.14, 0.14, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#A0A0A0" metalness={0.5} />
      </Cylinder>
      {/* Right transducer */}
      <Cylinder args={[0.1, 0.1, 0.12, 20]} position={[0.14, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#D4D4D4" metalness={0.6} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.02, 20]} position={[0.14, 0.14, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#A0A0A0" metalness={0.5} />
      </Cylinder>
      {/* Crystal between */}
      <mesh position={[0, 0.1, 0.05]}>
        <boxGeometry args={[0.1, 0.06, 0.04]} />
        <meshStandardMaterial color="#17191E" />
      </mesh>
    </group>
  );
}

/** DHT22 temperature sensor — white housing */
function DHT22Mesh() {
  return (
    <group>
      <RoundedBox args={[0.3, 0.35, 0.08]} radius={0.02} smoothness={2} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#F5F5F0" roughness={0.8} />
      </RoundedBox>
      {/* Vent grille */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, 0.28 - i * 0.04, -0.042]}>
          <boxGeometry args={[0.2, 0.015, 0.002]} />
          <meshStandardMaterial color="#D0CFC8" />
        </mesh>
      ))}
      {/* Legs */}
      {[-0.08, 0, 0.08].map((x, i) => (
        <Cylinder key={i} args={[0.01, 0.01, 0.15, 4]} position={[x, -0.03, 0]}>
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
        </Cylinder>
      ))}
    </group>
  );
}

/** OLED 0.96" display — dark screen with blue tint */
function OLEDMesh() {
  return (
    <group>
      {/* PCB back */}
      <RoundedBox args={[0.5, 0.35, 0.06]} radius={0.02} smoothness={2} position={[0, 0.2, 0.01]}>
        <meshStandardMaterial color="#1A5C2E" roughness={0.5} />
      </RoundedBox>
      {/* Screen bezel */}
      <mesh position={[0, 0.22, -0.02]}>
        <boxGeometry args={[0.45, 0.26, 0.02]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.3} />
      </mesh>
      {/* Active display area */}
      <mesh position={[0, 0.22, -0.032]}>
        <boxGeometry args={[0.38, 0.2, 0.002]} />
        <meshStandardMaterial color="#0C1929" emissive="#1A3A5C" emissiveIntensity={0.3} />
      </mesh>
      {/* Simulated text lines */}
      {[0.28, 0.24, 0.2, 0.16].map((yy, i) => (
        <mesh key={i} position={[-0.04 + i * 0.02, yy, -0.034]}>
          <boxGeometry args={[0.2 - i * 0.03, 0.02, 0.001]} />
          <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.6} />
        </mesh>
      ))}
      {/* Header pins */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Cylinder key={i} args={[0.01, 0.01, 0.12, 4]} position={[-0.12 + i * 0.08, 0.01, 0]}>
          <meshStandardMaterial color="#D4A84B" metalness={0.8} />
        </Cylinder>
      ))}
    </group>
  );
}

/** Passive piezo buzzer */
function BuzzerMesh() {
  return (
    <group>
      <Cylinder args={[0.12, 0.12, 0.1, 20]} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#1A1A1A" roughness={0.6} />
      </Cylinder>
      {/* Top grille */}
      <Cylinder args={[0.11, 0.11, 0.015, 20]} position={[0, 0.135, 0]}>
        <meshStandardMaterial color="#2A2A2A" roughness={0.5} metalness={0.3} />
      </Cylinder>
      {/* Sound hole */}
      <Cylinder args={[0.03, 0.03, 0.005, 12]} position={[0, 0.144, 0]}>
        <meshStandardMaterial color="#111" />
      </Cylinder>
      {/* Legs */}
      <Cylinder args={[0.01, 0.01, 0.1, 4]} position={[-0.04, -0.02, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
      </Cylinder>
      <Cylinder args={[0.01, 0.01, 0.1, 4]} position={[0.04, -0.02, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
      </Cylinder>
    </group>
  );
}

/** SG90 micro servo */
function ServoMesh() {
  return (
    <group>
      {/* Body */}
      <RoundedBox args={[0.45, 0.22, 0.2]} radius={0.02} smoothness={2} position={[0, 0.13, 0]}>
        <meshStandardMaterial color="#3B82F6" roughness={0.5} />
      </RoundedBox>
      {/* Mounting tabs */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.6, 0.025, 0.2]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.5} />
      </mesh>
      {/* Output shaft */}
      <Cylinder args={[0.03, 0.03, 0.06, 12]} position={[0.15, 0.27, 0]}>
        <meshStandardMaterial color="#F5F5F0" roughness={0.4} />
      </Cylinder>
      {/* Horn/arm */}
      <mesh position={[0.15, 0.31, 0]}>
        <boxGeometry args={[0.04, 0.015, 0.2]} />
        <meshStandardMaterial color="#F5F5F0" roughness={0.4} />
      </mesh>
      {/* Label */}
      <Text position={[0, 0.13, -0.102]} fontSize={0.05} color="#fff" anchorX="center" anchorY="middle">
        SG90
      </Text>
      {/* Wire bundle */}
      <mesh position={[-0.22, 0.05, 0]}>
        <boxGeometry args={[0.05, 0.03, 0.08]} />
        <meshStandardMaterial color="#4B5563" />
      </mesh>
    </group>
  );
}

/** PIR motion sensor — dome on PCB */
function PIRMesh() {
  return (
    <group>
      {/* PCB */}
      <Cylinder args={[0.18, 0.18, 0.06, 20]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1A5C2E" roughness={0.5} />
      </Cylinder>
      {/* Fresnel dome */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.14, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#F5F5F0" transparent opacity={0.7} roughness={0.3} />
      </mesh>
      {/* Pyro element under dome */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#D4A84B" metalness={0.6} />
      </mesh>
      {/* Trim pots */}
      <Cylinder args={[0.025, 0.025, 0.02, 8]} position={[-0.1, 0.09, 0.08]}>
        <meshStandardMaterial color="#D4A84B" metalness={0.5} />
      </Cylinder>
      <Cylinder args={[0.025, 0.025, 0.02, 8]} position={[0.1, 0.09, 0.08]}>
        <meshStandardMaterial color="#D4A84B" metalness={0.5} />
      </Cylinder>
    </group>
  );
}

/** Relay module */
function RelayMesh() {
  return (
    <group>
      {/* PCB */}
      <RoundedBox args={[0.5, 0.06, 0.35]} radius={0.02} smoothness={2} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1A5C2E" roughness={0.5} />
      </RoundedBox>
      {/* Relay cube */}
      <RoundedBox args={[0.32, 0.25, 0.28]} radius={0.01} smoothness={2} position={[0.05, 0.2, 0]}>
        <meshStandardMaterial color="#2563EB" roughness={0.5} />
      </RoundedBox>
      {/* Label */}
      <Text position={[0.05, 0.2, -0.142]} fontSize={0.04} color="#fff" anchorX="center" anchorY="middle">
        RELAY
      </Text>
      {/* LED indicator */}
      <mesh position={[-0.15, 0.1, -0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#E5484D" emissive="#E5484D" emissiveIntensity={0.5} />
      </mesh>
      {/* Screw terminals */}
      <mesh position={[0.05, 0.34, 0]}>
        <boxGeometry args={[0.34, 0.04, 0.14]} />
        <meshStandardMaterial color="#2B9DDB" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** NeoPixel ring */
function NeoPixelMesh() {
  return (
    <group>
      {/* Ring PCB */}
      <Cylinder args={[0.18, 0.18, 0.03, 24]} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} />
      </Cylinder>
      {/* Center hole */}
      <Cylinder args={[0.1, 0.1, 0.04, 24]} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#0A0A0A" />
      </Cylinder>
      {/* LED pixels around the ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const hue = (i / 8) * 360;
        const color = `hsl(${hue}, 80%, 60%)`;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.14, 0.06, Math.sin(angle) * 0.14]}>
            <boxGeometry args={[0.04, 0.02, 0.04]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Potentiometer */
function PotMesh() {
  return (
    <group>
      {/* Body */}
      <Cylinder args={[0.1, 0.1, 0.08, 16]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.3} />
      </Cylinder>
      {/* Shaft */}
      <Cylinder args={[0.025, 0.025, 0.12, 8]} position={[0, 0.16, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </Cylinder>
      {/* Knob */}
      <Cylinder args={[0.06, 0.06, 0.06, 16]} position={[0, 0.24, 0]}>
        <meshStandardMaterial color="#17191E" roughness={0.4} />
      </Cylinder>
      {/* Knob indicator */}
      <mesh position={[0.04, 0.275, 0]}>
        <boxGeometry args={[0.02, 0.005, 0.005]} />
        <meshStandardMaterial color="#F5F5F0" />
      </mesh>
      {/* 3 legs */}
      {[-0.05, 0, 0.05].map((x, i) => (
        <Cylinder key={i} args={[0.01, 0.01, 0.1, 4]} position={[x, -0.03, 0]}>
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
        </Cylinder>
      ))}
    </group>
  );
}

/** LDR photoresistor */
function LDRMesh() {
  return (
    <group>
      {/* Disc body */}
      <Cylinder args={[0.06, 0.06, 0.04, 16]} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#B45309" roughness={0.6} />
      </Cylinder>
      {/* Squiggly pattern (simplified as cross) */}
      <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.06, 0.005, 0.005]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <boxGeometry args={[0.06, 0.005, 0.005]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      {/* Epoxy coating */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.06, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#B45309" transparent opacity={0.5} />
      </mesh>
      {/* Legs */}
      <Cylinder args={[0.01, 0.01, 0.15, 4]} position={[-0.03, -0.02, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
      </Cylinder>
      <Cylinder args={[0.01, 0.01, 0.15, 4]} position={[0.03, -0.02, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
      </Cylinder>
    </group>
  );
}

/** Soil moisture sensor — long probe */
function SoilMesh() {
  return (
    <group>
      {/* PCB header */}
      <RoundedBox args={[0.2, 0.15, 0.08]} radius={0.01} smoothness={2} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#1A5C2E" roughness={0.5} />
      </RoundedBox>
      {/* Probe body */}
      <mesh position={[0, 0.1, 0.2]}>
        <boxGeometry args={[0.15, 0.08, 0.4]} />
        <meshStandardMaterial color="#1A5C2E" roughness={0.5} />
      </mesh>
      {/* Two copper traces */}
      <mesh position={[-0.04, 0.145, 0.25]}>
        <boxGeometry args={[0.015, 0.003, 0.3]} />
        <meshStandardMaterial color="#D4A84B" metalness={0.7} />
      </mesh>
      <mesh position={[0.04, 0.145, 0.25]}>
        <boxGeometry args={[0.015, 0.003, 0.3]} />
        <meshStandardMaterial color="#D4A84B" metalness={0.7} />
      </mesh>
    </group>
  );
}

/** MQ-135 gas sensor */
function GasMesh() {
  return (
    <group>
      {/* PCB */}
      <RoundedBox args={[0.35, 0.06, 0.25]} radius={0.02} smoothness={2} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1A5C2E" roughness={0.5} />
      </RoundedBox>
      {/* Sensor cylinder */}
      <Cylinder args={[0.1, 0.1, 0.2, 16]} position={[0, 0.18, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.5} roughness={0.3} />
      </Cylinder>
      {/* Mesh cap */}
      <Cylinder args={[0.1, 0.1, 0.03, 16]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#A0A0A0" metalness={0.4} roughness={0.5} wireframe />
      </Cylinder>
    </group>
  );
}

/** RFID reader */
function RFIDMesh() {
  return (
    <group>
      {/* PCB */}
      <RoundedBox args={[0.5, 0.06, 0.4]} radius={0.02} smoothness={2} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1E7A8C" roughness={0.5} />
      </RoundedBox>
      {/* Coil antenna trace (simplified as border) */}
      <mesh position={[0, 0.082, 0]}>
        <boxGeometry args={[0.44, 0.003, 0.34]} />
        <meshStandardMaterial color="#D4A84B" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.082, 0]}>
        <boxGeometry args={[0.38, 0.003, 0.28]} />
        <meshStandardMaterial color="#D4A84B" metalness={0.6} />
      </mesh>
      {/* IC chip */}
      <mesh position={[0.1, 0.1, 0.05]}>
        <boxGeometry args={[0.12, 0.04, 0.12]} />
        <meshStandardMaterial color="#17191E" />
      </mesh>
      {/* Label */}
      <Text position={[0, 0.09, -0.08]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.05} color="#D4A84B" anchorX="center" anchorY="middle">
        RC522
      </Text>
    </group>
  );
}

/** Rotary encoder */
function EncoderMesh() {
  return (
    <group>
      {/* Body */}
      <RoundedBox args={[0.22, 0.12, 0.22]} radius={0.02} smoothness={2} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.2} />
      </RoundedBox>
      {/* Shaft */}
      <Cylinder args={[0.04, 0.04, 0.2, 12]} position={[0, 0.22, 0]}>
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </Cylinder>
      {/* Knob */}
      <Cylinder args={[0.07, 0.07, 0.08, 20]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#17191E" roughness={0.4} />
      </Cylinder>
      {/* Knurling (ridges) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.072, 0.35, Math.sin(a) * 0.072]}>
            <boxGeometry args={[0.005, 0.07, 0.005]} />
            <meshStandardMaterial color="#2A2A2A" />
          </mesh>
        );
      })}
    </group>
  );
}

/** Generic fallback component */
function GenericMesh({ label, color }: { label: string; color: string }) {
  return (
    <group>
      <RoundedBox args={[0.3, 0.15, 0.2]} radius={0.02} smoothness={2} position={[0, 0.1, 0]}>
        <meshStandardMaterial color={color} roughness={0.5} />
      </RoundedBox>
      <Text position={[0, 0.18, -0.102]} fontSize={0.04} color="#fff" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

/** Dispatch component shape by ID */
function ComponentShape({ componentId, shortName }: { componentId: string; shortName: string }) {
  switch (componentId) {
    case "led": return <LEDMesh color="#E5484D" />;
    case "button": return <ButtonMesh />;
    case "ultrasonic": return <UltrasonicMesh />;
    case "dht22": return <DHT22Mesh />;
    case "oled": return <OLEDMesh />;
    case "buzzer": return <BuzzerMesh />;
    case "servo": return <ServoMesh />;
    case "pir": return <PIRMesh />;
    case "ldr": return <LDRMesh />;
    case "soil": return <SoilMesh />;
    case "relay": return <RelayMesh />;
    case "neopixel": return <NeoPixelMesh />;
    case "pot": return <PotMesh />;
    case "rfid": return <RFIDMesh />;
    case "gas": return <GasMesh />;
    case "encoder": return <EncoderMesh />;
    default: return <GenericMesh label={shortName} color={COMP_COLORS[componentId] ?? "#6B7280"} />;
  }
}



function JumperWire({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const points = useMemo(() => {
    const dx = Math.abs(from[0] - to[0]);
    const dz = Math.abs(from[2] - to[2]);
    const sag = -(0.08 + (dx + dz) * 0.04);
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2,
      Math.min(from[1], to[1]) + sag,
      (from[2] + to[2]) / 2,
    ];
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to),
    );
    return curve.getPoints(20);
  }, [from, to]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={3}
      opacity={0.9}
      transparent
    />
  );
}



function Scene({ result }: { result: BuildResult }) {
  const board = BOARDS[result.board];

  const layout = useMemo(() => {
    // MCU occupies the left portion
    const mcuW = 2.2;
    const mcuX = -BB_W / 2 + mcuW / 2 + 0.3;

    // Board pin positions (on the breadboard surface, near the MCU)
    const boardPins = new Map<string, [number, number, number]>();
    const leftPinStartX = mcuX - mcuW / 2 + 0.2;
    const rightPinStartX = mcuX - mcuW / 2 + 0.2;
    board.svg.left.forEach((pin, i) => {
      boardPins.set(pin, [leftPinStartX + i * 0.13, BB_H / 2 + 0.02, -0.5]);
    });
    board.svg.right.forEach((pin, i) => {
      boardPins.set(pin, [rightPinStartX + i * 0.13, BB_H / 2 + 0.02, 0.5]);
    });

    // Place components along the right portion of the breadboard
    const compStartX = mcuX + mcuW / 2 + 0.5;
    const availableW = BB_W / 2 - mcuW / 2 - 0.6;
    const compCount = result.components.length;
    const spacing = Math.min(0.7, availableW / Math.max(compCount, 1));

    const compPositions: { pc: PlacedComponent; pos: [number, number, number]; pinPos: [number, number, number] }[] =
      result.components.map((pc, i) => {
        const x = compStartX + i * spacing;
        const z = i % 2 === 0 ? -0.35 : 0.35; // alternate sides of the channel
        const pos: [number, number, number] = [x, BB_H / 2 + 0.02, z];
        const pinPos: [number, number, number] = [x, BB_H / 2 + 0.02, z > 0 ? z - 0.15 : z + 0.15];
        return { pc, pos, pinPos };
      });

    return { boardPins, compPositions };
  }, [board, result]);

  return (
    <>
      <Breadboard />
      <MicrocontrollerBoard result={result} />

      {/* Components on the breadboard */}
      {layout.compPositions.map(({ pc, pos }) => (
        <group key={pc.refName} position={pos}>
          <ComponentShape componentId={pc.component.id} shortName={pc.component.shortName} />
          {/* Label floating above */}
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.06}
            color="#17191E"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="#fff"
          >
            {pc.refName}
          </Text>
        </group>
      ))}

      {/* Jumper wires */}
      {layout.compPositions.flatMap(({ pc, pinPos }) =>
        pc.pins.flatMap((pin) => {
          if (pin.kind === "power" || pin.kind === "gnd") return [];
          const boardPos = layout.boardPins.get(pin.boardPin);
          if (!boardPos) return [];
          return [
            <JumperWire
              key={`${pc.refName}-${pin.name}`}
              from={boardPos}
              to={pinPos}
              color={pin.color}
            />,
          ];
        }),
      )}

      {/* Power wires (red & black running along power rails) */}
      {layout.compPositions.flatMap(({ pc, pinPos }) =>
        pc.pins.flatMap((pin) => {
          if (pin.kind !== "power" && pin.kind !== "gnd") return [];
          const railZ = pin.kind === "power" ? -BB_D / 2 + 0.15 : -BB_D / 2 + 0.25;
          const railPos: [number, number, number] = [pinPos[0], BB_H / 2 + 0.02, railZ];
          return [
            <JumperWire
              key={`${pc.refName}-${pin.name}`}
              from={railPos}
              to={pinPos}
              color={pin.color}
            />,
          ];
        }),
      )}
    </>
  );
}



function Desk() {
  return (
    <group>
      {/* Wood desk surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#D4A574" roughness={0.85} metalness={0} />
      </mesh>
      {/* Subtle wood grain lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.299, -4 + i * 1.1]}>
          <planeGeometry args={[16, 0.02]} />
          <meshStandardMaterial color="#C4955A" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}



export function Viewer3D({ result }: { result: BuildResult }) {
  return (
    <div className="relative h-full w-full" style={{ background: "linear-gradient(180deg, #E8E4DC 0%, #D5CFC5 100%)" }}>
      <Canvas
        camera={{ position: [3.5, 3, 3.5], fov: 38 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize={2048}
        />
        <directionalLight position={[-3, 5, -3]} intensity={0.3} />
        <pointLight position={[0, 4, 0]} intensity={0.3} />

        <Scene result={result} />
        <Desk />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={1.5}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 0.2, 0]}
        />
      </Canvas>

      {/* Overlay info */}
      <div className="absolute left-4 top-4 rounded-lg border border-line bg-white/90 px-3 py-2 backdrop-blur-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>
        <p className="text-xs font-bold text-ink">{result.name}</p>
        <p className="text-[10px] text-muted">
          {result.boardLabel} · {result.components.length} components · {result.wires.length} wires
        </p>
      </div>

      <div className="absolute bottom-4 right-4 rounded-lg border border-line bg-white/90 px-3 py-2 backdrop-blur-sm">
        <p className="text-[10px] text-muted" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Drag to orbit · Scroll to zoom
        </p>
      </div>
    </div>
  );
}
