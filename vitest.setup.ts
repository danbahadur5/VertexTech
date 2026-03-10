import "@testing-library/jest-dom/vitest";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
if (typeof globalThis.ResizeObserver === "undefined") {
  // @ts-ignore
  globalThis.ResizeObserver = ResizeObserver;
}

// jsdom doesn't implement scrollIntoView
// @ts-ignore
if (typeof HTMLElement !== "undefined" && !HTMLElement.prototype.scrollIntoView) {
  // @ts-ignore
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    value: () => {},
    writable: true,
  });
}
