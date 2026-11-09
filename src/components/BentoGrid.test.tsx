import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BentoGrid from "./BentoGrid";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: (key: string) => key, lang: "ru" }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

describe("BentoGrid", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    vi.stubGlobal("IntersectionObserver", class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  it("presents construction directions rather than marketplace widgets", () => {
    render(<BentoGrid />);

    expect(screen.getByRole("button", { name: /services\.demolition/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /services\.concrete/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /services\.renovation/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /services\.construction/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bento\.projectsTitle/ })).toBeInTheDocument();

    expect(screen.queryByText(/от \d+₽/)).not.toBeInTheDocument();
    expect(screen.queryByText(/30 минут|85%/)).not.toBeInTheDocument();
    expect(screen.queryByText(/магазин|подписка|установить приложение/i)).not.toBeInTheDocument();
  });


  it("tracks pointer position for the service-card light field", () => {
    render(<BentoGrid />);
    const card = screen.getByRole("button", { name: /services\\.demolition/ });
    vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
      x: 0, y: 0, top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100,
      toJSON: () => ({}),
    } as DOMRect);

    const pointerMove = new Event("pointermove", { bubbles: true });
    Object.defineProperties(pointerMove, {
      pointerType: { value: "mouse" },
      clientX: { value: 50 },
      clientY: { value: 25 },
    });
    card.dispatchEvent(pointerMove);

    expect((card as HTMLButtonElement).style.getPropertyValue("--skol-spot-x")).toBe("25%");
    expect((card as HTMLButtonElement).style.getPropertyValue("--skol-spot-y")).toBe("25%");

    fireEvent.pointerLeave(card);

    expect((card as HTMLButtonElement).style.getPropertyValue("--skol-spot-x")).toBe("50%");
    expect((card as HTMLButtonElement).style.getPropertyValue("--skol-card-shift-x")).toBe("0px");
  });

  it("routes a selected service card to its matching service page", () => {
    render(<BentoGrid />);

    fireEvent.click(screen.getByRole("button", { name: /services\.demolition/ }));

    expect(navigateMock).toHaveBeenCalledWith("/services/demolition");
  });

  it("routes the projects card to the project archive", () => {
    render(<BentoGrid />);

    fireEvent.click(screen.getByRole("button", { name: /bento\.projectsTitle/ }));

    expect(navigateMock).toHaveBeenCalledWith("/projects");
  });
});
