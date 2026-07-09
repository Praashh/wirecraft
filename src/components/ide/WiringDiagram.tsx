"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { BOARDS } from "~/lib/engine/boards";
import type { BuildResult, AllocatedPin } from "~/lib/engine/types";



interface BoardNodeData {
  label: string;
  chipName: string;
  boardColor: string;
  leftPins: string[];
  rightPins: string[];
  [key: string]: unknown;
}

function BoardNode({ data }: NodeProps<Node<BoardNodeData>>) {
  const { label, chipName, boardColor, leftPins, rightPins } = data;
  const rows = Math.max(leftPins.length, rightPins.length);
  const h = rows * 28 + 64;

  return (
    <div
      style={{ width: 220, height: h, background: boardColor, borderRadius: 14, position: "relative", fontFamily: "JetBrains Mono, monospace" }}
      className="shadow-card"
    >
      <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 52, height: 18, background: "#8E9299", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 8, fontWeight: 700, color: "#17191E" }}>USB</span>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 80, height: 60, background: "#17191E", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#F0B100" }}>{chipName}</span>
      </div>

      <div style={{ position: "absolute", top: -28, left: 0, fontSize: 13, fontWeight: 700, color: "#17191E", fontFamily: "Space Grotesk, sans-serif" }}>{label}</div>

      {leftPins.map((pin, i) => (
        <div key={`l-${pin}-${i}`} style={{ position: "absolute", left: -4, top: 36 + i * 28, display: "flex", alignItems: "center" }}>
          <Handle
            type="source"
            position={Position.Left}
            id={`board-L-${pin}`}
            style={{ width: 10, height: 10, background: "#F0B100", border: "2px solid #17191E", position: "relative", left: -1 }}
          />
          <span style={{ marginLeft: 14, fontSize: 9, color: "#fff", whiteSpace: "nowrap" }}>{pin}</span>
        </div>
      ))}

      {rightPins.map((pin, i) => (
        <div key={`r-${pin}-${i}`} style={{ position: "absolute", right: -4, top: 36 + i * 28, display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
          <Handle
            type="source"
            position={Position.Right}
            id={`board-R-${pin}`}
            style={{ width: 10, height: 10, background: "#F0B100", border: "2px solid #17191E", position: "relative", right: -1 }}
          />
          <span style={{ marginRight: 14, fontSize: 9, color: "#fff", whiteSpace: "nowrap" }}>{pin}</span>
        </div>
      ))}
    </div>
  );
}



interface CompNodeData {
  refName: string;
  category: string;
  pins: AllocatedPin[];
  [key: string]: unknown;
}

function ComponentNode({ data }: NodeProps<Node<CompNodeData>>) {
  const { refName, category, pins } = data;
  const h = 40 + pins.length * 28;

  return (
    <div style={{ width: 220, height: h, borderRadius: 12, overflow: "hidden", border: "1px solid #E3E1D9", background: "#fff", fontFamily: "JetBrains Mono, monospace" }} className="shadow-card">
      <div style={{ height: 28, background: "#17191E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{refName}</span>
        <span style={{ fontSize: 9, color: "#B9BCC4" }}>{category.toUpperCase()}</span>
      </div>
      {pins.map((pin, i) => (
        <div key={pin.name} style={{ position: "relative", height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
          <Handle
            type="target"
            position={Position.Left}
            id={`comp-${pin.name}`}
            style={{ width: 10, height: 10, background: pin.color, border: "2px solid #17191E", left: -5 }}
          />
          <span style={{ fontSize: 10, color: "#17191E", marginLeft: 8 }}>{pin.name}</span>
          <span style={{ fontSize: 10, color: "#6B6E76" }}>{pin.boardPin}</span>
        </div>
      ))}
    </div>
  );
}

const nodeTypes = { board: BoardNode, component: ComponentNode };

export function WiringDiagram({ result }: { result: BuildResult }) {
  const board = BOARDS[result.board];

  const { initialNodes, initialEdges } = useMemo(() => {
    const rows = Math.max(board.svg.left.length, board.svg.right.length);
    const boardH = rows * 28 + 64;

    const boardNode: Node<BoardNodeData> = {
      id: "board",
      type: "board",
      position: { x: 60, y: 80 },
      draggable: true,
      data: {
        label: result.boardLabel,
        chipName: board.svg.name,
        boardColor: board.svg.color,
        leftPins: board.svg.left,
        rightPins: board.svg.right,
      },
    };

    let cy = 40;
    const compNodes: Node<CompNodeData>[] = result.components.map((pc) => {
      const h = 40 + pc.pins.length * 28;
      const node: Node<CompNodeData> = {
        id: pc.refName,
        type: "component",
        position: { x: 480, y: cy },
        draggable: true,
        data: {
          refName: pc.refName,
          category: pc.component.category,
          pins: pc.pins,
        },
      };
      cy += h + 32;
      return node;
    });

    const nodes: Node[] = [boardNode, ...compNodes];

    const edges: Edge[] = result.components.flatMap((pc) =>
      pc.pins.map((pin) => {
        const isRight = board.svg.right.includes(pin.boardPin);
        const handlePrefix = isRight ? "board-R" : "board-L";

        return {
          id: `${pc.refName}-${pin.name}`,
          source: "board",
          sourceHandle: `${handlePrefix}-${pin.boardPin}`,
          target: pc.refName,
          targetHandle: `comp-${pin.name}`,
          type: "default",
          style: { stroke: pin.color, strokeWidth: 3, opacity: 0.88 },
          animated: pin.kind === "power" || pin.kind === "i2c-sda" || pin.kind === "i2c-scl",
        };
      }),
    );

    return { initialNodes: nodes, initialEdges: edges };
  }, [board, result]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="relative h-full w-full" style={{ background: "#F7F3EA" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#DFDDD3" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "board") return board.svg.color;
            return "#fff";
          }}
          maskColor="rgba(0,0,0,0.08)"
          style={{ borderRadius: 8, border: "1px solid #E3E1D9" }}
        />
      </ReactFlow>

      <div className="absolute bottom-4 left-4 flex gap-4 rounded-lg border border-line bg-white/90 px-3 py-2 backdrop-blur-sm" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10 }}>
        {[
          ["#E5484D", "power"],
          ["#17191E", "ground"],
          ["#2B4BF2", "data"],
          ["#2FA36B", "signal"],
          ["#F0B100", "analog"],
        ].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div style={{ width: 16, height: 3, background: c, borderRadius: 2 }} />
            <span className="text-muted">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
