export type ComponentCategory =
  | "logic-block"
  | "passive-electronic"
  | "active-electronic"
  | "ic"
  | "pcb"
  | "sensor"
  | "actuator"
  | "power"
  | "wiring"
  | "structural"
  | "connector"
  | "shaft"
  | "gear"
  | "wheel-tyre"
  | "mechanical"
  | "marble-stem"
  | "stationery"
  | "consumable"
  | "magnet"
  | "tool";

export interface KitComponent {
  id: string;
  code: string;
  name: string;
  qty: number;
  unit: "pc" | "pcs";
  category: ComponentCategory;
  description: string;
  assetRef?: string;
  aiLabel?: string;
}

export interface KitGroup {
  group: string;
  multiplier?: string;
  items: KitComponent[];
}

export interface KitBox {
  box: string;
  title: string;
  subtitle: string;
  color: string;
  image: string;
  groups: KitGroup[];
}

export const categoryStyle: Record<ComponentCategory, string> = {
  "logic-block":         "bg-yellow-100 text-yellow-800 border-yellow-200",
  "passive-electronic":  "bg-blue-100 text-blue-800 border-blue-200",
  "active-electronic":   "bg-cyan-100 text-cyan-800 border-cyan-200",
  "ic":                  "bg-violet-100 text-violet-800 border-violet-200",
  "pcb":                 "bg-purple-100 text-purple-800 border-purple-200",
  "sensor":              "bg-pink-100 text-pink-800 border-pink-200",
  "actuator":            "bg-rose-100 text-rose-800 border-rose-200",
  "power":               "bg-red-100 text-red-800 border-red-200",
  "wiring":              "bg-slate-100 text-slate-800 border-slate-200",
  "structural":          "bg-green-100 text-green-800 border-green-200",
  "connector":           "bg-emerald-100 text-emerald-800 border-emerald-200",
  "shaft":               "bg-zinc-100 text-zinc-800 border-zinc-200",
  "gear":                "bg-orange-100 text-orange-800 border-orange-200",
  "wheel-tyre":          "bg-stone-100 text-stone-800 border-stone-200",
  "mechanical":          "bg-amber-100 text-amber-800 border-amber-200",
  "marble-stem":         "bg-sky-100 text-sky-800 border-sky-200",
  "stationery":          "bg-neutral-100 text-neutral-800 border-neutral-200",
  "consumable":          "bg-gray-100 text-gray-800 border-gray-200",
  "magnet":              "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  "tool":                "bg-teal-100 text-teal-800 border-teal-200",
};

export const componentBoxes: KitBox[] = [
  {
    box: "Box 1",
    title: "Logic Blocks, Discovering Electricity, Junior Electronics",
    subtitle: "E-circuits, logic blocks & junior electronics — 2 sets per kit",
    color: "bg-yellow-500",
    image: "/box1.jpg",
    groups: [
      {
        group: "Logic Blocks (screenless coding)",
        multiplier: "x2 per kit",
        items: [
          { id: "power-block",    code: "POWER",    name: "Power Block",               qty: 1, unit: "pc",  category: "logic-block", description: "Powers the screenless logic-block circuit." },
          { id: "not-block",      code: "NOT",      name: "Not Block",                 qty: 1, unit: "pc",  category: "logic-block", description: "Inverts the logical input signal." },
          { id: "led-block",      code: "LED",      name: "LED Block",                 qty: 1, unit: "pc",  category: "logic-block", description: "Lights up to indicate logical HIGH." },
          { id: "buzzer-block",   code: "BUZZER",   name: "Buzzer Block",              qty: 1, unit: "pc",  category: "logic-block", description: "Audio output for HIGH-state alerts." },
          { id: "motor-block",    code: "MOTOR",    name: "Motor Block",               qty: 2, unit: "pcs", category: "logic-block", description: "Drives a motor when input is HIGH." },
          { id: "distance-block", code: "DISTANCE", name: "Distance Block",            qty: 2, unit: "pcs", category: "logic-block", description: "Senses proximity (HIGH on near object)." },
          { id: "ir-block",       code: "IR",       name: "IR Block",                  qty: 2, unit: "pcs", category: "logic-block", description: "Infrared input — line / object detection." },
          { id: "switch-block",   code: "SWITCH",   name: "Switch Block",              qty: 1, unit: "pc",  category: "logic-block", description: "Manual ON/OFF input for logic chains." },
          { id: "ir-relimate",    code: "3CR-IR",   name: "3-Core Relimate (for IR)",  qty: 2, unit: "pcs", category: "wiring",      description: "Cable connecting the IR block to the controller." },
        ],
      },
      {
        group: "Discovering Electricity (passive & active components)",
        multiplier: "x2 per kit",
        items: [
          { id: "push-button",      code: "PB",    name: "Push Button",            qty: 3, unit: "pcs", category: "active-electronic",  description: "Momentary contact switch." },
          { id: "led-green",        code: "LED-G", name: "Green LED",              qty: 1, unit: "pc",  category: "active-electronic",  description: "Polarised light-emitting diode (green)." },
          { id: "led-red",          code: "LED-R", name: "Red LED",                qty: 2, unit: "pcs", category: "active-electronic",  description: "Polarised light-emitting diode (red)." },
          { id: "buzzer",           code: "BZ",    name: "Buzzer",                 qty: 1, unit: "pc",  category: "active-electronic",  description: "Piezoelectric audio output." },
          { id: "slide-switch",     code: "SW",    name: "Slide Switch",           qty: 1, unit: "pc",  category: "active-electronic",  description: "SPDT slide — bi-stable input." },
          { id: "capacitor",        code: "CAP",   name: "Capacitor",              qty: 2, unit: "pcs", category: "passive-electronic", description: "Stores electric charge — RC timing." },
          { id: "resistor-10k",     code: "R-10K", name: "10K Resistor",           qty: 1, unit: "pc",  category: "passive-electronic", description: "Limits current — voltage divider stage." },
          { id: "resistor-20k",     code: "R-20K", name: "20K Resistor",           qty: 1, unit: "pc",  category: "passive-electronic", description: "Higher-resistance current limiter." },
          { id: "resistor-3k3",     code: "R-3K3", name: "3.3K Resistor",          qty: 1, unit: "pc",  category: "passive-electronic", description: "Pull-up / current-limit resistor." },
          { id: "potentiometer",    code: "POT",   name: "Potentiometer",          qty: 1, unit: "pc",  category: "active-electronic",  description: "Variable resistor — analog input." },
          { id: "ldr",              code: "LDR",   name: "Light Dependent Resistor", qty: 1, unit: "pc", category: "sensor",            description: "Resistance varies with incident light." },
          { id: "motor",            code: "M",     name: "Motor",                  qty: 1, unit: "pc",  category: "actuator",           description: "Small DC motor for kinetic projects." },
          { id: "alligator-red",    code: "AC-R",  name: "Red Alligator Clips",    qty: 1, unit: "pc",  category: "wiring",             description: "Test-lead pair for + (red) connections." },
          { id: "alligator-black",  code: "AC-B",  name: "Black Alligator Clips",  qty: 1, unit: "pc",  category: "wiring",             description: "Test-lead pair for − (black) connections." },
          { id: "jumper-wire",      code: "JW",    name: "Jumper Wire",            qty: 3, unit: "pcs", category: "wiring",             description: "Flexible wires for breadboard-free wiring." },
          { id: "battery-box",      code: "BB",    name: "Battery Box",            qty: 1, unit: "pc",  category: "power",              description: "AA-cell holder powering the circuit." },
          { id: "connecting-tower", code: "CT-TWR",name: "Connecting Tower",       qty: 6, unit: "pcs", category: "wiring",             description: "Stackable nodes for solderless joins." },
          { id: "rainbow-disk",     code: "RD",    name: "Rainbow Disk",           qty: 1, unit: "pc",  category: "active-electronic",  description: "Spinning colour-mix demo for persistence of vision." },
        ],
      },
      {
        group: "Junior Electronics (Queaky)",
        multiplier: "x2 per kit",
        items: [
          { id: "queaky", code: "QY",   name: "Queaky", qty: 1, unit: "pc", category: "active-electronic", description: "Audio-feedback device for open/closed-loop games." },
          { id: "thread", code: "TH",   name: "Thread", qty: 1, unit: "pc", category: "consumable",        description: "Conductive thread for Queaky games." },
          { id: "wire",   code: "WIRE", name: "Wire",   qty: 1, unit: "pc", category: "wiring",             description: "Bare wire roll for custom circuits." },
        ],
      },
    ],
  },

  {
    box: "Box 2",
    title: "Marble Stem",
    subtitle: "Marble-run construction kit — 1 set per kit",
    color: "bg-blue-500",
    image: "/box2.jpg",
    groups: [
      {
        group: "Marble Stem track parts",
        multiplier: "x1 per kit",
        items: [
          { id: "p3-marble",     code: "P3",    name: "Pillar (3-hole)",               qty: 25, unit: "pcs", category: "structural",  description: "Short pillar — vertical track support." },
          { id: "p3c2-marble",   code: "P3C2",  name: "P3C2 angled beam",              qty: 62, unit: "pcs", category: "structural",  description: "Angled connector beam — track curves." },
          { id: "ct1x2-marble",  code: "CT1X2", name: "Connector (2 pieces, 1 plane)", qty: 4,  unit: "pcs", category: "connector",   description: "Joins two beams in one plane." },
          { id: "tw2",           code: "TW-2",  name: "Tubular Washer (2-hole)",       qty: 44, unit: "pcs", category: "connector",   description: "Spacer washer for axles." },
          { id: "marbles",       code: "MAR",   name: "Marbles",                       qty: 10, unit: "pcs", category: "marble-stem", description: "Glass marbles — payload through the run." },
          { id: "rubber-band",   code: "RB",    name: "Rubber Band",                   qty: 2,  unit: "pcs", category: "consumable",  description: "Elastic energy / launchers." },
          { id: "mrs14",         code: "MRS14", name: "MRS14 chute",                   qty: 8,  unit: "pcs", category: "marble-stem", description: "Straight chute — 14-unit slide." },
          { id: "mrb7",          code: "MRB7",  name: "MRB7 curved chute",             qty: 12, unit: "pcs", category: "marble-stem", description: "Curved chute — 7-unit bend." },
          { id: "stencil-sheet", code: "ST-SH", name: "Stencil Sheet",                 qty: 1,  unit: "pc",  category: "consumable",  description: "Layout reference for builds." },
          { id: "mrh5",          code: "MRH5",  name: "MRH5 hopper",                   qty: 6,  unit: "pcs", category: "marble-stem", description: "Hopper / collector for marbles." },
          { id: "bucket",        code: "BCKT",  name: "Bucket",                        qty: 10, unit: "pcs", category: "marble-stem", description: "Marble catch-cups." },
          { id: "paper-strips",  code: "PS",    name: "Paper Strips",                  qty: 3,  unit: "pcs", category: "consumable",  description: "Custom track surfaces." },
          { id: "wheel-no-tyre", code: "W-NT",  name: "Wheel without Tyre",            qty: 1,  unit: "pc",  category: "wheel-tyre",  description: "Bare hub — used in marble flywheel demos." },
        ],
      },
    ],
  },

  {
    box: "Box 3",
    title: "Discovering Electronics & Boffin Basic Electronics",
    subtitle: "Digital ICs, PCBs, ESP32 — 2 sets of ICs / 1 set of boards",
    color: "bg-purple-500",
    image: "/box3.jpg",
    groups: [
      {
        group: "Integrated Circuits (digital logic)",
        multiplier: "x2 per kit",
        items: [
          { id: "ic-555",   code: "IC555",   name: "IC 555 (timer)",         qty: 1, unit: "pc", category: "ic", description: "Astable / monostable timer." },
          { id: "ic-7408",  code: "IC7408",  name: "IC 7408 (quad AND)",     qty: 1, unit: "pc", category: "ic", description: "Four 2-input AND gates." },
          { id: "ic-7432",  code: "IC7432",  name: "IC 7432 (quad OR)",      qty: 1, unit: "pc", category: "ic", description: "Four 2-input OR gates." },
          { id: "ic-7404",  code: "IC7404",  name: "IC 7404 (hex NOT)",      qty: 1, unit: "pc", category: "ic", description: "Six inverters." },
          { id: "ic-7400",  code: "IC7400",  name: "IC 7400 (quad NAND)",    qty: 1, unit: "pc", category: "ic", description: "Four 2-input NAND gates." },
          { id: "ic-7402",  code: "IC7402",  name: "IC 7402 (quad NOR)",     qty: 1, unit: "pc", category: "ic", description: "Four 2-input NOR gates." },
          { id: "ic-7486",  code: "IC7486",  name: "IC 7486 (quad XOR)",     qty: 1, unit: "pc", category: "ic", description: "Four 2-input XOR gates." },
          { id: "ic-7426",  code: "IC7426",  name: "IC 7426 (quad NAND-OC)", qty: 1, unit: "pc", category: "ic", description: "Quad open-collector NAND." },
          { id: "ic-74151", code: "IC74151", name: "IC 74151 (8:1 mux)",     qty: 1, unit: "pc", category: "ic", description: "8-to-1 multiplexer." },
          { id: "ic-74138", code: "IC74138", name: "IC 74138 (3:8 demux)",   qty: 1, unit: "pc", category: "ic", description: "3-to-8 line decoder / demux." },
        ],
      },
      {
        group: "PCB carriers & wiring",
        multiplier: "x2 per kit",
        items: [
          { id: "connecting-wire", code: "CW",       name: "Connecting Wire",       qty: 40, unit: "pcs", category: "wiring",     description: "Pre-cut hookup wires." },
          { id: "p21x21-box3",     code: "P21X21",   name: "P21x21 base plate",     qty: 1,  unit: "pc",  category: "structural", description: "21×21-stud plate for breadboard-free electronics." },
          { id: "pcb-7segment",    code: "PCB-7SEG", name: "PCB 7-Segment Display", qty: 1,  unit: "pc",  category: "pcb",        description: "Common-cathode digit display module." },
          { id: "pcb-peripheral",  code: "PCB-PER",  name: "PCB Peripheral IC",     qty: 1,  unit: "pc",  category: "pcb",        description: "Adapter PCB for peripheral ICs." },
          { id: "pcb-switch",      code: "PCB-SW",   name: "PCB Switch",            qty: 1,  unit: "pc",  category: "pcb",        description: "Switch carrier PCB." },
          { id: "pcb-ic-holder",   code: "PCB-ICH",  name: "PCB IC Holder",         qty: 3,  unit: "pcs", category: "pcb",        description: "DIP-IC mounting carrier." },
          { id: "pcb-stencils",    code: "PCB-ST",   name: "PCB Stencils",          qty: 10, unit: "pcs", category: "consumable", description: "Layout overlays mapping ICs to functions." },
        ],
      },
      {
        group: "Boffin Boards (ESP32 + sensors)",
        multiplier: "x1 per kit",
        items: [
          { id: "ir-sensor",       code: "IR-S",  name: "IR Sensor",        qty: 2, unit: "pcs", category: "sensor",           description: "Reflective IR — line / proximity input." },
          { id: "esp32",           code: "ESP32", name: "ESP32 Board",      qty: 1, unit: "pc",  category: "ic",               description: "WiFi/BT MCU — runs Ardublock, MicroPython & Codeskool." },
          { id: "limit-switch",    code: "LS",    name: "Limit Switch",     qty: 1, unit: "pc",  category: "sensor",           description: "Mechanical end-stop input." },
          { id: "led-boffin",      code: "LED-B", name: "LED (Boffin)",     qty: 1, unit: "pc",  category: "active-electronic", description: "Indicator LED for Boffin circuits." },
          { id: "dc-motor-board",  code: "DCMB",  name: "DC Motor Board",   qty: 2, unit: "pcs", category: "actuator",         description: "H-bridge motor driver board." },
          { id: "servo-motor",     code: "SERVO", name: "Servo Motor",      qty: 1, unit: "pc",  category: "actuator",         description: "Position-controlled servo (0–180°)." },
          { id: "p7x11-box3",      code: "P7X11", name: "P7x11 base plate", qty: 1, unit: "pc",  category: "structural",       description: "7×11-stud baseplate for ESP32 builds." },
          { id: "core-cable-4",    code: "CC4",   name: "4-Core Cable",     qty: 6, unit: "pcs", category: "wiring",           description: "Sensor / motor cable." },
          { id: "programming-cable", code: "PC",  name: "Programming Cable", qty: 1, unit: "pc", category: "wiring",           description: "USB programmer cable for ESP32." },
        ],
      },
    ],
  },

  {
    box: "Box 4",
    title: "Plastic Construction Parts",
    subtitle: "Pillars, connectors, gears, wheels — 2 sets per kit",
    color: "bg-green-500",
    image: "/box4.jpg",
    groups: [
      {
        group: "Pillars (load-bearing beams)",
        multiplier: "x2 per kit",
        items: [
          { id: "p3",     code: "P3",     name: "Pillar (3 holes)",    qty: 12, unit: "pcs", category: "structural", description: "Short pillar — basic frame element." },
          { id: "p5",     code: "P5",     name: "Pillar (5 holes)",    qty: 18, unit: "pcs", category: "structural", description: "Medium pillar." },
          { id: "p7",     code: "P7",     name: "Pillar (7 holes)",    qty: 12, unit: "pcs", category: "structural", description: "Long pillar." },
          { id: "p11",    code: "P11",    name: "Pillar (11 holes)",   qty: 16, unit: "pcs", category: "structural", description: "Extra-long pillar." },
          { id: "pu5x13", code: "PU5X13", name: "U-pillar (29 holes)", qty: 5,  unit: "pcs", category: "structural", description: "U-shaped frame for big structures." },
          { id: "pu5x7",  code: "PU5X7",  name: "U-pillar (17 holes)", qty: 1,  unit: "pc",  category: "structural", description: "Smaller U-frame." },
        ],
      },
      {
        group: "Connectors (joints)",
        items: [
          { id: "ct1x2", code: "CT1X2", name: "Tight connector (2 pieces, 1 plane)", qty: 4,  unit: "pcs", category: "connector", description: "Coplanar tight join." },
          { id: "cl2",   code: "CL2",   name: "Loose connector (2 pieces)",          qty: 20, unit: "pcs", category: "connector", description: "Pivoting loose join." },
          { id: "ch2",   code: "CH2",   name: "Hole connector (2 pieces)",           qty: 32, unit: "pcs", category: "connector", description: "Connector with axle hole." },
          { id: "ct2",   code: "CT2",   name: "Tight connector (2 pieces)",          qty: 50, unit: "pcs", category: "connector", description: "Standard rigid join." },
          { id: "ct3",   code: "CT3",   name: "Tight connector (3 pieces)",          qty: 30, unit: "pcs", category: "connector", description: "Three-piece rigid join." },
        ],
      },
      {
        group: "Shafts & axles",
        items: [
          { id: "sh60",  code: "SH60",  name: "Shaft (6 cm)",            qty: 4,  unit: "pcs", category: "shaft",     description: "Short axle." },
          { id: "sh100", code: "SH100", name: "Shaft (10 cm)",           qty: 5,  unit: "pcs", category: "shaft",     description: "Medium axle." },
          { id: "sh170", code: "SH170", name: "Shaft (17 cm)",           qty: 4,  unit: "pcs", category: "shaft",     description: "Long axle." },
          { id: "tw1",   code: "TW1",   name: "Tubular Washer (1-hole)", qty: 30, unit: "pcs", category: "connector", description: "Spacer for shafts." },
        ],
      },
      {
        group: "Gears & mechanical drive",
        items: [
          { id: "g20",         code: "G20",     name: "Gear (20 teeth)",       qty: 6,  unit: "pcs", category: "gear",       description: "Small spur gear — driver in reductions." },
          { id: "g20-plus",    code: "G20+",    name: "Gear-Plus (20 teeth)",  qty: 6,  unit: "pcs", category: "gear",       description: "G20 with hub — locks to motor shaft." },
          { id: "g20-idler",   code: "G20-IDL", name: "Gear Idler (20 teeth)", qty: 6,  unit: "pcs", category: "gear",       description: "Free-rotating idler — direction reversal." },
          { id: "g60",         code: "G60",     name: "Gear (60 teeth)",       qty: 3,  unit: "pcs", category: "gear",       description: "Large spur gear — 3:1 ratio with G20." },
          { id: "rack",        code: "RACK",    name: "Rack",                  qty: 10, unit: "pcs", category: "gear",       description: "Linear-motion rack — pairs with G20." },
          { id: "suspension",  code: "SUSP",    name: "Suspension",            qty: 2,  unit: "pcs", category: "mechanical", description: "Spring suspension — bumpy-terrain bots." },
          { id: "p5-nut",      code: "P5-NUT",  name: "P5-NUT",                qty: 1,  unit: "pc",  category: "connector",  description: "Threaded captive-nut beam." },
          { id: "power-screw", code: "PS",      name: "Power Screw",           qty: 1,  unit: "pc",  category: "mechanical", description: "Lead screw for linear actuators." },
          { id: "remover",     code: "RT",      name: "Remover Tool",          qty: 1,  unit: "pc",  category: "tool",       description: "Pries apart tightly fitted parts." },
        ],
      },
      {
        group: "Body & wheels",
        items: [
          { id: "mud-guard-l", code: "MGL",  name: "Mud Guard (left)",      qty: 3, unit: "pcs", category: "structural", description: "Left-side wheel arch." },
          { id: "mud-guard-r", code: "MGR",  name: "Mud Guard (right)",     qty: 3, unit: "pcs", category: "structural", description: "Right-side wheel arch." },
          { id: "spoiler",     code: "SPL",  name: "Spoiler",               qty: 1, unit: "pc",  category: "structural", description: "Decorative aero element." },
          { id: "steering",    code: "STR",  name: "Steering Wheel",        qty: 1, unit: "pc",  category: "mechanical", description: "Driver-input control wheel." },
          { id: "pulley",      code: "PUL",  name: "Pulley",                qty: 1, unit: "pc",  category: "mechanical", description: "Belt-drive pulley." },
          { id: "p3-plus",     code: "P3+",  name: "Pillar Plus (3 holes)", qty: 6, unit: "pcs", category: "structural", description: "P3 with stud topping." },
          { id: "pc3",         code: "PC3",  name: "Plate Connector (3)",   qty: 8, unit: "pcs", category: "connector",  description: "Plate-to-pillar joiner." },
        ],
      },
    ],
  },

  {
    box: "Box 5",
    title: "Accessories",
    subtitle: "Stationery, magnets, motors, batteries — 1 set per kit",
    color: "bg-orange-500",
    image: "/box5.jpg",
    groups: [
      {
        group: "Stationery & consumables",
        multiplier: "x1 per kit",
        items: [
          { id: "pencil",          code: "PNCL",  name: "Pencil",                qty: 2, unit: "pcs", category: "stationery", description: "For sketching designs." },
          { id: "eraser",          code: "ERSR",  name: "Eraser",                qty: 2, unit: "pcs", category: "stationery", description: "For corrections." },
          { id: "black-marker",    code: "MKR",   name: "Black Marker",          qty: 1, unit: "pc",  category: "stationery", description: "For labelling parts and wiring." },
          { id: "rubber-band-acc", code: "RB-A",  name: "Rubber Band",           qty: 4, unit: "pcs", category: "consumable", description: "Drive belts, elastic energy storage." },
          { id: "chart-paper",     code: "CHRT",  name: "Chart Paper",           qty: 1, unit: "pc",  category: "consumable", description: "For posters / circuit diagrams." },
          { id: "straw",           code: "STR-A", name: "Straw",                 qty: 2, unit: "pcs", category: "consumable", description: "Air friction / aerodynamics tests." },
          { id: "balloon",         code: "BLN",   name: "Balloon",               qty: 2, unit: "pcs", category: "consumable", description: "Pneumatic / propulsion experiments." },
          { id: "insulation-tape", code: "TAPE",  name: "Black Insulation Tape", qty: 1, unit: "pc",  category: "consumable", description: "Insulates joints & secures wiring." },
          { id: "copper-wire",     code: "CU",    name: "Copper Wire",           qty: 2, unit: "pcs", category: "wiring",     description: "Bare conductor — coils and electromagnets." },
          { id: "sand-paper",      code: "SP",    name: "Sand Paper",            qty: 1, unit: "pc",  category: "consumable", description: "Surface friction studies." },
          { id: "iron-nail",       code: "FE",    name: "Iron Nail",             qty: 2, unit: "pcs", category: "consumable", description: "Magnetism / electromagnet cores." },
          { id: "foam",            code: "FOAM",  name: "Foam",                  qty: 2, unit: "pcs", category: "consumable", description: "Buoyancy and impact-absorption demos." },
        ],
      },
      {
        group: "Mechanisms & magnets",
        items: [
          { id: "fan",          code: "FAN",  name: "Fan",                     qty: 2, unit: "pcs", category: "actuator", description: "Propeller for motor outputs." },
          { id: "scissor",      code: "SCSR", name: "Scissor",                 qty: 1, unit: "pc",  category: "tool",     description: "For cutting paper / tape / straws." },
          { id: "donut-magnet", code: "DM",   name: "Donut Magnet",            qty: 3, unit: "pcs", category: "magnet",   description: "Ring magnet — generators / repulsion demos." },
          { id: "screw-driver", code: "SD",   name: "Mechanix Screwdriver",    qty: 1, unit: "pc",  category: "tool",     description: "Tightens captive-nut beams (P5-NUT)." },
          { id: "bar-magnet",   code: "BM",   name: "Bar Magnet",              qty: 2, unit: "pcs", category: "magnet",   description: "Polarised bar magnet — field-line demos." },
        ],
      },
      {
        group: "Power & motors",
        items: [
          { id: "battery-3v",  code: "BB3V",  name: "3 V Battery Box", qty: 2, unit: "pcs", category: "power",    description: "Powers small DC motors and LEDs." },
          { id: "motor-acc",   code: "M-ACC", name: "Motor",           qty: 4, unit: "pcs", category: "actuator", description: "Standard DC motor for vehicle builds." },
          { id: "battery-6v",  code: "BB6V",  name: "6 V Battery Box", qty: 2, unit: "pcs", category: "power",    description: "Higher-voltage supply — geared bots." },
        ],
      },
    ],
  },

  {
    box: "Box 6",
    title: "Big Construction Parts",
    subtitle: "Base plates and wheels — 1 set per kit",
    color: "bg-emerald-500",
    image: "/box6.jpg",
    groups: [
      {
        group: "Plates & wheels",
        multiplier: "x1 per kit",
        items: [
          { id: "p21x21", code: "P21X21", name: "P21x21 base plate", qty: 5,  unit: "pcs", category: "structural", description: "Large 21×21-stud plate — main chassis." },
          { id: "p7x11",  code: "P7X11",  name: "P7x11 base plate",  qty: 8,  unit: "pcs", category: "structural", description: "Medium 7×11-stud plate." },
          { id: "wheel",  code: "W",      name: "Wheel",             qty: 10, unit: "pcs", category: "wheel-tyre", description: "Standard wheel-with-tyre for vehicle drive." },
        ],
      },
    ],
  },
];
