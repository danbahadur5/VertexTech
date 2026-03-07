import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import IconServiceSelect from "../components/form/IconServiceSelect";

describe("IconServiceSelect", () => {
  const opts = [
    { value: "Cyber Security|shield", label: "Cyber Security", icon: "shield" },
    { value: "Web Development|globe", label: "Web Development", icon: "globe" },
    { value: "Data Analysis|chart", label: "Data Analysis", icon: "chart" }
  ];

  it("renders and opens popover", async () => {
    const onChange = vi.fn();
    render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" label="Services" />);
    const button = screen.getByRole("combobox");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("filters via search input", async () => {
    const onChange = vi.fn();
    render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" />);
    fireEvent.click(screen.getByRole("combobox"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Web" } });
    expect(screen.getByText("Web Development")).toBeInTheDocument();
  });

  it("supports multi-select", async () => {
    const onChange = vi.fn();
    render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" />);
    fireEvent.click(screen.getByRole("combobox"));
    const option = screen.getByRole("option", { name: /Cyber Security/ });
    fireEvent.click(option);
    expect(onChange).toHaveBeenCalled();
  });
}); 
