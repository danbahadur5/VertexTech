import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import IconServiceSelect from "../components/form/IconServiceSelect";

describe("IconServiceSelect", () => {
  const opts = [
    { value: "Cyber Security|shield", label: "Cyber Security", icon: "shield" },
    { value: "Web Development|globe", label: "Web Development", icon: "globe" },
    { value: "Data Analysis|chart", label: "Data Analysis", icon: "chart" }
  ];

  it("renders and opens popover", async () => {
    const onChange = vi.fn();
    const { container } = render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" label="Services" />);
    const button = within(container).getAllByLabelText(/services/i)[0];
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("filters via search input", async () => {
    const onChange = vi.fn();
    const { container } = render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" label="Services" />);
    fireEvent.click(within(container).getAllByLabelText(/services/i)[0]);
    const input = within(container).getByPlaceholderText("Search services…");
    fireEvent.change(input, { target: { value: "Web" } });
    expect(within(container).getByText("Web Development")).toBeInTheDocument();
  });

  it("supports multi-select", async () => {
    const onChange = vi.fn();
    const { container } = render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" label="Services" />);
    fireEvent.click(within(container).getAllByLabelText(/services/i)[0]);
    const option = within(container).getByRole("option", { name: /Cyber Security/ });
    fireEvent.click(option);
    expect(onChange).toHaveBeenCalled();
  });
}); 
