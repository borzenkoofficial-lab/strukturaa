import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BentoGrid from "./BentoGrid";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

describe("BentoGrid", () => {
  beforeEach(() => navigateMock.mockClear());

  it("presents construction directions rather than marketplace widgets", () => {
    render(<BentoGrid />);

    expect(screen.getByRole("button", { name: /services\.demolition/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bento\.exclusiveTitle/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /services\.renovation/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /services\.construction/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bento\.projectsTitle/ })).toBeInTheDocument();

    expect(screen.queryByText(/от \d+₽/)).not.toBeInTheDocument();
    expect(screen.queryByText(/30 минут|85%/)).not.toBeInTheDocument();
    expect(screen.queryByText(/магазин|подписка|установить приложение/i)).not.toBeInTheDocument();
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
