import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Index } from "@/routes/index";

describe("Chai Nashta Corner storefront", () => {
  it("renders the storefront hero and menu", () => {
    render(<Index />);

    expect(
      screen.getByRole("heading", { name: "Chai and snacks, now online!" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our Menu" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Samosa" })).toBeInTheDocument();
  });
});
