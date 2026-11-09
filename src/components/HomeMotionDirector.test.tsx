import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomeMotionDirector from "./HomeMotionDirector";

describe("HomeMotionDirector", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("reveals section targets when they enter the viewport", () => {
    let notify: IntersectionObserverCallback | undefined;
    const observed: Element[] = [];
    const unobserve = vi.fn();
    const disconnect = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe(target: Element) {
        observed.push(target);
      }
      unobserve = unobserve;
      disconnect = disconnect;
      takeRecords = () => [];
      root = null;
      rootMargin = "0px";
      thresholds = [0.12];
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    const { container } = render(
      <div className="skol-cinematic-home">
        <section data-skol-reveal="true">Hero follow-up</section>
        <HomeMotionDirector />
      </div>,
    );

    const root = container.querySelector(".skol-cinematic-home");
    const target = container.querySelector<HTMLElement>("[data-skol-reveal]");
    expect(root).toHaveClass("skol-motion-ready");
    expect(observed).toHaveLength(1);
    expect(target).not.toHaveAttribute("data-skol-visible");

    notify?.(
      [{ target: observed[0], isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(target).toHaveAttribute("data-skol-visible", "true");
    expect(unobserve).toHaveBeenCalledWith(target);
  });
});
