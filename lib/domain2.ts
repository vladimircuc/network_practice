/* Shared Domain 2 reference data + pure logic for the demos and PBQs. */
import { ipToInt, networkInt } from "./subnet";

// ---- 2.1 Routing ----------------------------------------------------------
export type RoutingProtocol = {
  name: string;
  kind: string;
  ad: number | string;
  metric: string;
  scope: string;
};

export const ROUTING_PROTOCOLS: RoutingProtocol[] = [
  { name: "Connected", kind: "Directly attached", ad: 0, metric: "—", scope: "Local" },
  { name: "Static", kind: "Manually configured", ad: 1, metric: "—", scope: "Local" },
  { name: "EIGRP", kind: "Advanced distance-vector", ad: 90, metric: "Bandwidth + delay", scope: "IGP (Cisco)" },
  { name: "OSPF", kind: "Link-state", ad: 110, metric: "Cost (bandwidth)", scope: "IGP" },
  { name: "RIP", kind: "Distance-vector", ad: 120, metric: "Hop count (max 15)", scope: "IGP" },
  { name: "BGP", kind: "Path-vector", ad: "20 / 200", metric: "Path attributes", scope: "EGP (the internet)" },
];

export type Route = {
  network: string;
  cidr: number;
  ad: number;
  nextHop: string;
  protocol: string;
};

/** Pick the route a packet to destIp takes: longest prefix, then lowest AD. */
export function selectRoute(table: Route[], destIp: string): Route | null {
  const dest = ipToInt(destIp);
  const matches = table.filter((r) => networkInt(dest, r.cidr) === ipToInt(r.network));
  if (matches.length === 0) return null;
  const longest = Math.max(...matches.map((r) => r.cidr));
  const best = matches.filter((r) => r.cidr === longest).sort((a, b) => a.ad - b.ad);
  return best[0];
}

// ---- 2.2 STP --------------------------------------------------------------
export type StpSwitch = { id: string; priority: number; mac: string };

/** Lower bridge ID wins: compare priority first, then MAC address. */
export function betterBridge(a: StpSwitch, b: StpSwitch): StpSwitch {
  if (a.priority !== b.priority) return a.priority < b.priority ? a : b;
  return a.mac <= b.mac ? a : b; // same-format MAC strings compare correctly
}

/**
 * Equal-cost triangle of 3 switches. Root = best bridge ID. On the link
 * between the two non-root switches, the worse-BID switch blocks its port.
 */
export function electTriangle(switches: StpSwitch[]): {
  rootId: string;
  blockedSwitchId: string;
} {
  const root = switches.reduce((best, s) => betterBridge(best, s));
  const nonRoot = switches.filter((s) => s.id !== root.id);
  const worse = betterBridge(nonRoot[0], nonRoot[1]).id === nonRoot[0].id ? nonRoot[1] : nonRoot[0];
  return { rootId: root.id, blockedSwitchId: worse.id };
}

// ---- 2.3 Wireless ---------------------------------------------------------
export type WifiStd = {
  std: string;
  gen: string;
  bands: string;
  maxRate: string;
  year: string;
};

export const WIFI_STANDARDS: WifiStd[] = [
  { std: "802.11a", gen: "—", bands: "5 GHz", maxRate: "54 Mbps", year: "1999" },
  { std: "802.11b", gen: "—", bands: "2.4 GHz", maxRate: "11 Mbps", year: "1999" },
  { std: "802.11g", gen: "—", bands: "2.4 GHz", maxRate: "54 Mbps", year: "2003" },
  { std: "802.11n", gen: "Wi-Fi 4", bands: "2.4 & 5 GHz", maxRate: "600 Mbps", year: "2009" },
  { std: "802.11ac", gen: "Wi-Fi 5", bands: "5 GHz", maxRate: "~6.9 Gbps", year: "2013" },
  { std: "802.11ax", gen: "Wi-Fi 6 / 6E", bands: "2.4 / 5 / 6 GHz", maxRate: "~9.6 Gbps", year: "2019" },
];

export const CHANNELS_24 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const NON_OVERLAP_24 = [1, 6, 11];

/** Two 2.4 GHz channels interfere if their centers are < 5 apart. */
export function channelsOverlap(a: number, b: number): boolean {
  return Math.abs(a - b) < 5;
}

// ---- 2.2 PoE --------------------------------------------------------------
export type PoeStd = { std: string; name: string; type: string; switchW: number; deviceW: number };

export const POE_STANDARDS: PoeStd[] = [
  { std: "802.3af", name: "PoE", type: "Type 1", switchW: 15.4, deviceW: 12.95 },
  { std: "802.3at", name: "PoE+", type: "Type 2", switchW: 30, deviceW: 25.5 },
  { std: "802.3bt", name: "PoE++ (Type 3)", type: "Type 3", switchW: 60, deviceW: 51 },
  { std: "802.3bt", name: "PoE++ (Type 4)", type: "Type 4", switchW: 100, deviceW: 71 },
];
