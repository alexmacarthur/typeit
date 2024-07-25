import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import TypeIt from "../src/index";

describe("rendering as specific element", () => {
  it("renders a span", async () => {
    await new Promise<void>((resolve) => {
      render(
        <TypeIt
          options={{
            speed: 0,
            afterComplete: () => {
              resolve();
            },
          }}
        >
          A span tag.
        </TypeIt>,
      );
    });

    const element = document.querySelector("span");

    expect(element.tagName).toEqual("SPAN");
    expect(screen.getByText("A span tag.")).toBeInTheDocument();
  });

  it("renders an h1", async () => {
    await new Promise<void>((resolve) => {
      render(
        <TypeIt
          as={"h1"}
          options={{
            speed: 0,
            afterComplete: () => {
              resolve();
            },
          }}
        >
          An H1 tag.
        </TypeIt>,
      );
    });

    const element = document.querySelector("h1");

    expect(element.tagName).toEqual("H1");
    expect(screen.getByText("An H1 tag.")).toBeInTheDocument();
  });
});
