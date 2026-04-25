import fs from "fs";
import path from "path";
import vm from "vm";

const rootDir = process.cwd();
const sourcePath = path.join(rootDir, "app.js");
const outputPath = path.join(rootDir, "mobile", "src", "sampleState.json");

const source = `${fs.readFileSync(sourcePath, "utf8")}\n;globalThis.__EXPORTED_STATE__ = state;`;
const elements = new Map();

function createElement() {
  return {
    _html: "",
    addEventListener() {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() {
        return false;
      },
    },
    set innerHTML(value) {
      this._html = value;
    },
    get innerHTML() {
      return this._html;
    },
    appendChild() {},
    querySelectorAll() {
      return [];
    },
  };
}

const documentStub = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, createElement());
    return elements.get(id);
  },
  querySelectorAll() {
    return [];
  },
  querySelector() {
    return null;
  },
  addEventListener() {},
  body: createElement(),
};

const context = {
  console,
  window: {
    addEventListener() {},
  },
  document: documentStub,
  navigator: {},
  location: {
    protocol: "http:",
    origin: "http://localhost",
  },
  localStorage: {
    getItem() {
      return null;
    },
    setItem() {},
    removeItem() {},
    clear() {},
  },
  confirm() {
    return true;
  },
  alert() {},
  setTimeout,
  clearTimeout,
  Blob,
  URL: {
    createObjectURL() {
      return "blob:mock";
    },
    revokeObjectURL() {},
  },
  FileReader: class {
    readAsText() {}
  },
  Math,
  Date,
  JSON,
  Number,
  String,
  Array,
  Object,
  Set,
  Map,
  Promise,
  RegExp,
  Symbol,
  Intl,
  parseInt,
  parseFloat,
  isFinite,
  encodeURIComponent,
  decodeURIComponent,
};

vm.createContext(context);
vm.runInContext(source, context, { timeout: 5000 });

const state = context.__EXPORTED_STATE__;
if (!state) {
  throw new Error("Failed to export default state from app.js");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(state, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
