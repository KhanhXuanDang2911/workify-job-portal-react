import type { LucideIcon } from "lucide-react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function createDragFeedback(Icon: LucideIcon, label: string): HTMLDivElement {
  const container = document.createElement("div");
  container.setAttribute("class", "flex items-center gap-3 p-3 bg-accent rounded-lg shadow-lg");

  const iconWrapper = document.createElement("div");
  const iconMarkup = renderToStaticMarkup(React.createElement(Icon, { className: "text-muted-foreground", size: 20 }));
  iconWrapper.innerHTML = iconMarkup;

  const span = document.createElement("span");
  span.setAttribute("class", "text-sm font-medium");
  span.textContent = label;

  container.appendChild(iconWrapper);
  container.appendChild(span);

  return container;
}
