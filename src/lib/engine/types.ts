export type BoardId = "arduino-uno" | "esp32" | "pico";

export type PinKind =
  | "digital"
  | "pwm"
  | "analog"
  | "i2c-sda"
  | "i2c-scl"
  | "power"
  | "gnd";

export interface ComponentPin {
  /** name printed on the component, e.g. "TRIG" */
  name: string;
  kind: PinKind;
  /** wire color used in the diagram */
  color: string;
  /** for power pins: required voltage */
  volts?: 3.3 | 5;
}

export interface CatalogComponent {
  id: string;
  name: string;
  shortName: string;
  category: string;
  keywords: string[];
  summary: string;
  price: number;
  pins: ComponentPin[];
  /** platformio lib_deps entries */
  libs: string[];
  code: {
    includes: string[];
    defines?: string[]; // may contain {PIN:<pinName>} placeholders
    globals: string[];
    setup: string[];
    loop: string[];
    helpers?: string[];
  };
  /** sensor components expose a reading variable used by behaviors */
  readingVar?: string;
  /** actuator components expose an action snippet: {ON} / {OFF} */
  actuate?: { on: string; off: string };
  buildTip: string;
}

export interface AllocatedPin extends ComponentPin {
  /** board pin label it was wired to, e.g. "D7" / "GPIO23" / "GP15" */
  boardPin: string;
}

export interface PlacedComponent {
  component: CatalogComponent;
  instance: number; // 1-based, for duplicates
  refName: string; // e.g. "LED_1"
  pins: AllocatedPin[];
}

export interface WireRun {
  fromBoardPin: string;
  toComponent: string; // refName
  toPin: string;
  color: string;
  kind: PinKind;
}

export interface BuildStep {
  title: string;
  body: string;
}

export interface BuildResult {
  name: string;
  board: BoardId;
  boardLabel: string;
  summary: string;
  components: PlacedComponent[];
  wires: WireRun[];
  code: string;
  platformioIni: string;
  steps: BuildStep[];
  bom: { name: string; qty: number; price: number; refs: string[] }[];
  warnings: string[];
}

export interface ParsedIntent {
  board: BoardId;
  componentIds: string[];
  projectName: string;
  behaviors: Behavior[];
}

export interface Behavior {
  /** e.g. "when soil is dry, run the pump" */
  description: string;
  sensorId: string;
  actuatorId: string;
  comparator: "<" | ">";
  threshold: number;
  thresholdLabel: string;
}
