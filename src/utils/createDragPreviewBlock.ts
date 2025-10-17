import type { LucideIcon } from "lucide-react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function createDragFeedback(Icon: LucideIcon, label: string): HTMLDivElement {
  const container = document.createElement("div");
  container.setAttribute("class", "flex items-center gap-5 min-w-[100px] p-3 rounded-lg bg-green-600");

  const iconWrapper = document.createElement("div");
  const iconMarkup = renderToStaticMarkup(React.createElement(Icon, { className: "text-white", size: 20 }));
  iconWrapper.innerHTML = iconMarkup;

  const span = document.createElement("span");
  span.setAttribute("class", "text-sm font-medium text-white");
  span.textContent = label;

  container.appendChild(iconWrapper);
  container.appendChild(span);

  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  return container;
}
