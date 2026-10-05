import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(rootDir, "app.js");

// Expose the script's top-level `let state` so callers can read and replace it.
const hooks = `
;globalThis.__getState = () => state;
;globalThis.__setState = (next) => { state = next; };
`;

function createElement() {
  return {
    _html: "",
    style: {},
    dataset: {},
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
    querySelector() {
      return null;
    },
  };
}

function createLocalStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get length() {
      return store.size;
    },
    key(i) {
      return [...store.keys()][i] ?? null;
    },
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

// Runs app.js inside a VM with minimal browser stubs and returns its global
// context, so its top-level functions (and state via getState/setState) can be called.
export function loadApp({ localStorage = {}, narrowScreen = false } = {}) {
  const elements = new Map();
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
    documentElement: createElement(),
    title: "",
  };

  const context = {
    console,
    window: {
      addEventListener() {},
      matchMedia: () => ({ matches: narrowScreen, addEventListener() {} }),
    },
    document: documentStub,
    navigator: {},
    location: {
      protocol: "http:",
      origin: "http://localhost",
    },
    localStorage: createLocalStorage(localStorage),
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
  };

  vm.createContext(context);
  vm.runInContext(`${fs.readFileSync(sourcePath, "utf8")}\n${hooks}`, context, {
    filename: sourcePath,
    timeout: 5000,
  });

  return {
    app: context,
    elements,
    getState: () => context.__getState(),
    setState: (next) => context.__setState(next),
  };
}
