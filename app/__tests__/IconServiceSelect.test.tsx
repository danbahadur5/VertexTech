import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { IconServiceSelect } from "../components/form/IconServiceSelect";

describe("IconServiceSelect", () => {
  afterEach(() => {
    cleanup();
  });

  const opts = [
    { value: "Cyber Security|shield", label: "Cyber Security", icon: "shield" },
    { value: "Web Development|globe", label: "Web Development", icon: "globe" },
    { value: "Data Analysis|chart", label: "Data Analysis", icon: "chart" }
  ];

  it("renders and opens popover", async () => {
    const onChange = vi.fn();
    render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" label="Services" />);
    
    const button = screen.getByRole("combobox", { name: /^services$/i });
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    
    expect(await screen.findByPlaceholderText("Search services…")).toBeInTheDocument();
  });

  it("filters via search input", async () => {
    const onChange = vi.fn();
    render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" label="Services" />);
    
    fireEvent.click(screen.getByRole("combobox", { name: /^services$/i }));
    
    const input = await screen.findByPlaceholderText("Search services…");
    fireEvent.change(input, { target: { value: "Web" } });
    
    expect(screen.getByText("Web Development")).toBeInTheDocument();
    expect(screen.queryByText("Cyber Security")).not.toBeInTheDocument();
  });

  it("supports multi-select", async () => {
    const onChange = vi.fn();
    render(<IconServiceSelect value={[]} onChange={onChange} options={opts} name="svc" label="Services" multi={true} />);
    
    fireEvent.click(screen.getByRole("combobox", { name: /^services$/i }));
    
    const option = await screen.findByRole("option", { name: /Cyber Security/ });
    fireEvent.click(option);
    
    expect(onChange).toHaveBeenCalledWith(["Cyber Security|shield"]);
  });
});
