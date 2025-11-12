import { createContext } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface ResponsiveContextProps {
  device: DeviceType;
}

export const ResponsiveContext = createContext<ResponsiveContextProps>({
  device: "desktop",
});
