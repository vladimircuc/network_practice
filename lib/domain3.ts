/* Shared Domain 3 (Network Operations) reference data for demos + PBQs. */

// ---- 3.2 Syslog severity (0 = worst, 7 = noise) ----------------------------
export type Severity = { level: number; name: string; meaning: string; example: string };

export const SYSLOG: Severity[] = [
  { level: 0, name: "Emergency", meaning: "System is unusable", example: "Kernel panic; the whole device is down" },
  { level: 1, name: "Alert", meaning: "Act immediately", example: "Primary WAN link down, no failover" },
  { level: 2, name: "Critical", meaning: "Critical condition", example: "Power supply failed; temperature critical" },
  { level: 3, name: "Error", meaning: "Error condition", example: "Interface flapping; OSPF adjacency lost" },
  { level: 4, name: "Warning", meaning: "Warning condition", example: "High CPU; link nearing capacity" },
  { level: 5, name: "Notice", meaning: "Normal but notable", example: "Configuration saved; link came up" },
  { level: 6, name: "Informational", meaning: "Informational", example: "Routine interface statistics" },
  { level: 7, name: "Debug", meaning: "Debug messages", example: "Verbose troubleshooting output" },
];
export const SYSLOG_MNEMONIC = "Every Awesome Cisco Engineer Will Need Icecream Daily";

// ---- 3.4 DNS records -------------------------------------------------------
export type DnsRecord = { type: string; purpose: string; example: string };

export const DNS_RECORDS: DnsRecord[] = [
  { type: "A", purpose: "Name → IPv4 address", example: "web.acme.com → 192.0.2.10" },
  { type: "AAAA", purpose: "Name → IPv6 address", example: "web.acme.com → 2001:db8::10" },
  { type: "CNAME", purpose: "Alias: one name → another name", example: "www → web.acme.com" },
  { type: "MX", purpose: "Mail server for the domain (has priority)", example: "acme.com → mail.acme.com (10)" },
  { type: "TXT", purpose: "Free text — SPF, DKIM, domain verification", example: "v=spf1 include:_spf.acme.com" },
  { type: "NS", purpose: "Which name servers are authoritative", example: "acme.com → ns1.acme.com" },
  { type: "PTR", purpose: "Reverse lookup: IP → name", example: "192.0.2.10 → web.acme.com" },
  { type: "SOA", purpose: "Start of authority — the zone's master record", example: "serial, refresh, TTL for acme.com" },
];

// ---- 3.3 Disaster recovery -------------------------------------------------
export type DrSite = { name: string; recovery: string; cost: string; desc: string };

export const DR_SITES: DrSite[] = [
  { name: "Cold site", recovery: "Days", cost: "$", desc: "Empty space with power & cooling. You ship in hardware and restore from backup — slowest, cheapest." },
  { name: "Warm site", recovery: "Hours", cost: "$$", desc: "Hardware & connectivity already there; you restore recent data and bring it online — the middle ground." },
  { name: "Hot site", recovery: "Minutes", cost: "$$$", desc: "A fully running replica with near-real-time data. Failover is almost instant — fastest, priciest." },
];

export type DrMetric = { abbr: string; name: string; meaning: string };
export const DR_METRICS: DrMetric[] = [
  { abbr: "RPO", name: "Recovery Point Objective", meaning: "Max data you can afford to lose — how far back you'd fall (drives backup frequency)" },
  { abbr: "RTO", name: "Recovery Time Objective", meaning: "Max downtime you can tolerate — how fast you must be back up" },
  { abbr: "MTTR", name: "Mean Time To Repair", meaning: "Average time to fix a failed component" },
  { abbr: "MTBF", name: "Mean Time Between Failures", meaning: "Average uptime between failures (reliability)" },
];

// ---- 3.4 DHCP DORA ---------------------------------------------------------
export type DoraStep = { letter: string; name: string; from: string; desc: string };
export const DORA: DoraStep[] = [
  { letter: "D", name: "Discover", from: "Client → broadcast", desc: "\"Is there a DHCP server out there?\" — sent to everyone (255.255.255.255)." },
  { letter: "O", name: "Offer", from: "Server → client", desc: "\"Here's an address you can use\" — the server offers an IP from its scope." },
  { letter: "R", name: "Request", from: "Client → broadcast", desc: "\"I'll take that one\" — the client formally requests the offered address." },
  { letter: "A", name: "Acknowledge", from: "Server → client", desc: "\"It's yours for the lease period\" — server confirms and records the lease." },
];
