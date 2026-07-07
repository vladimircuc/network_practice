/**
 * Shared glossary powering the <Term> hover tooltips.
 * Key = the lowercased term text as written inside <Term>…</Term>
 * (whitespace collapsed, " / " normalized to "/", trailing .,;: stripped).
 * `full` = what an acronym stands for (optional); `def` = one plain-English line.
 * Terms not found here just render as a dotted-underline with no tooltip.
 */
export type GlossaryEntry = { full?: string; def: string };

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // ---- Domain 1/2 shared (so tooltips work site-wide) --------------------
  osi: { full: "Open Systems Interconnection model", def: "A 7-layer map of how networking works, from cables (L1) up to apps (L7) — used to reason about where a problem lives." },
  vlan: { full: "Virtual LAN", def: "A way to split one physical switch into several separate networks (broadcast domains) that can't talk without a router." },
  trunk: { def: "A switch-to-switch link that carries many VLANs at once, tagging each frame so the other side knows which VLAN it belongs to." },
  "native vlan": { def: "The one VLAN whose frames cross a trunk untagged. It must match on both ends or traffic lands in the wrong VLAN." },
  svi: { full: "Switched Virtual Interface", def: "A virtual gateway IP for a VLAN, configured inside a Layer 3 switch so the switch itself can route between VLANs." },
  "layer 3 switch": { def: "A switch that can also route (Layer 3), so it can move traffic between VLANs without a separate router." },
  "access port": { def: "A switch port that carries exactly one VLAN, for a normal end device like a PC or phone." },
  stp: { full: "Spanning Tree Protocol", def: "Automatically blocks redundant switch links so a loop can't form, then re-opens them if a link fails." },
  "spanning tree": { full: "Spanning Tree Protocol", def: "Automatically blocks redundant switch links so a loop can't form, then re-opens them if a link fails." },
  rstp: { full: "Rapid Spanning Tree Protocol", def: "The faster modern version of STP (802.1w) — reconverges in about a second instead of 30–50." },
  "root bridge": { def: "The switch STP elects as the center of the loop-free tree — the one with the lowest bridge ID (priority, then MAC)." },
  "bridge id": { def: "A switch's tie-breaker value in STP: its priority number first, then its MAC address." },
  lacp: { full: "Link Aggregation Control Protocol", def: "Bundles several physical links into one logical link for more bandwidth and redundancy." },
  mtu: { full: "Maximum Transmission Unit", def: "The largest frame size a link will carry (default 1500 bytes); jumbo frames raise it to ~9000." },
  poe: { full: "Power over Ethernet", def: "Delivers electrical power and data over the same network cable — for phones, cameras, and access points." },
  nat: { full: "Network Address Translation", def: "Swaps private IP addresses for public ones at the network edge so many devices can share internet access." },
  pat: { full: "Port Address Translation", def: "NAT overload — many private hosts share one public IP, kept apart by port numbers (what a home router does)." },
  fhrp: { full: "First Hop Redundancy Protocol", def: "Lets two routers share one virtual gateway IP so if the active one dies, a standby takes over instantly." },
  vrrp: { full: "Virtual Router Redundancy Protocol", def: "The open-standard FHRP for a redundant default gateway." },
  hsrp: { full: "Hot Standby Router Protocol", def: "Cisco's proprietary FHRP for a redundant default gateway." },
  capwap: { full: "Control And Provisioning of Wireless Access Points", def: "The protocol a wireless LAN controller uses to manage lightweight access points." },
  wlc: { full: "Wireless LAN Controller", def: "A central box that configures and monitors many access points at once." },
  "band steering": { def: "Nudges dual-band Wi-Fi clients onto the less-congested band (usually 5/6 GHz) instead of crowding 2.4 GHz." },
  ssid: { full: "Service Set Identifier", def: "The Wi-Fi network name you see and connect to." },
  bssid: { full: "Basic Service Set Identifier", def: "A specific access point's radio MAC address — how your device tells two APs on the same SSID apart." },
  essid: { full: "Extended Service Set Identifier", def: "The same SSID shared across many APs so you roam between them seamlessly." },
  sae: { full: "Simultaneous Authentication of Equals", def: "WPA3's handshake — it stops the offline password-guessing that WPA2 was vulnerable to." },
  psk: { full: "Pre-Shared Key", def: "One shared Wi-Fi password everyone uses (home/small-office mode)." },
  mdf: { full: "Main Distribution Frame", def: "The building's main equipment room, where the ISP hand-off and core gear live." },
  idf: { full: "Intermediate Distribution Frame", def: "A smaller wiring closet on a floor/area that connects back to the MDF over a backbone." },
  ups: { full: "Uninterruptible Power Supply", def: "Battery backup that rides through short outages and smooths surges/sags." },
  pdu: { full: "Power Distribution Unit", def: "The rack's managed power strip — distributes power to each device." },
  "rack unit": { def: "The height unit for rack gear: 1U = 1.75 inches; a full rack is commonly 42U." },
  connected: { def: "A route to a network the router is directly attached to — the most trusted (administrative distance 0)." },
  static: { def: "A route you enter by hand (AD 1) — predictable and low-overhead, ideal for small or stable networks." },
  dynamic: { def: "Routes learned automatically from a routing protocol (OSPF, EIGRP, BGP) that adapt when the network changes." },
  "static nat": { def: "A permanent one-to-one mapping between a private and a public IP — used to reach an internal server from outside." },
  "dynamic nat": { def: "A pool of public IPs handed out to internal hosts as needed, with no fixed mapping." },
  "virtual ip": { full: "Virtual IP (VIP)", def: "A shared gateway IP presented by FHRP routers; it keeps working even if the active router fails." },
  "vlan-hopping": { def: "An attack that pushes a device's traffic into a VLAN it shouldn't reach — often by abusing a native-VLAN mismatch." },
  "router-on-a-stick": { def: "Inter-VLAN routing over one trunk link to a router, with a subinterface handling each VLAN." },
  "root port": { def: "The port on a non-root switch with the best path toward the root bridge — normally in the forwarding state." },
  "designated port": { def: "The single forwarding port chosen for each network segment in spanning tree." },
  "duplex mismatch": { def: "One end of a link at full-duplex and the other at half — causes late collisions, CRC errors, and crawling throughput." },
  "jumbo frames": { def: "Ethernet frames larger than the standard 1500 bytes (~9000), for storage/backup throughput — must be enabled on every hop." },
  "aes-ccmp": { full: "AES Counter Mode with CBC-MAC Protocol", def: "WPA2's encryption — AES in Counter Mode with CBC-MAC. Strong, though WPA2's handshake can be guessed offline." },
  "aes-gcmp": { full: "AES Galois/Counter Mode Protocol", def: "WPA3's encryption — AES in Galois/Counter Mode, stronger than WPA2's CCMP." },
  enterprise: { def: "WPA2/3-Enterprise — each user authenticates individually via 802.1X to a RADIUS server, instead of one shared password." },
  lightweight: { def: "A lightweight access point does just the radio; a wireless LAN controller (WLC) handles its config and intelligence centrally." },
  generator: { def: "A backup generator supplies power through long outages — a UPS only bridges the gap until the generator starts." },
  "fire suppression": { def: "Data-center fire systems use clean-agent gas or chemicals (not water) so they don't destroy the electronics." },

  // ---- 3.1 Documentation & processes -------------------------------------
  physical: { def: "A network diagram showing the real cabling, racks, ports, and devices — the literal wiring." },
  logical: { def: "A network diagram showing IP subnets, VLANs, and traffic flow — independent of where the cables actually run." },
  baselines: { def: "A recording of what 'normal' looks like, so you can spot when something later drifts from it." },
  baseline: { def: "A recording of what 'normal' looks like, so you can spot when something later drifts from it." },
  ipam: { full: "IP Address Management", def: "Software that plans, tracks, and reports which IP addresses are used where." },
  eol: { full: "End of Life", def: "The point where a vendor stops actively developing a product — no new features or versions — though it may still ship security patches for a while." },
  eos: { full: "End of Support", def: "The point where a vendor stops issuing patches/updates — a security risk you must plan to replace." },
  sla: { full: "Service Level Agreement", def: "A contract promising a minimum service level, like uptime or response time." },
  aup: { full: "Acceptable Use Policy", def: "The rules for how staff are allowed to use company systems and networks." },
  "service level agreement": { full: "Service Level Agreement", def: "A contract promising a minimum service level, like uptime or response time." },
  "production config": { def: "The configuration currently running on a device — the live one everyone depends on." },
  "backup config": { def: "A saved copy of a device's config, taken before a change so you can revert if it breaks." },
  "golden config": { full: "Baseline / golden config", def: "A known-good reference configuration every similar device should match." },
  "configuration monitoring": { def: "Continuously checking devices against a known-good baseline and alerting on any drift." },
  nda: { full: "Non-Disclosure Agreement", def: "A contract to keep shared information confidential." },
  mou: { full: "Memorandum of Understanding", def: "A non-binding statement of intent between two parties." },
  sow: { full: "Statement of Work", def: "A document spelling out exactly what a vendor will deliver." },
  "heat map": { def: "A wireless coverage map showing signal strength across a space, used to find dead spots." },
  "site survey": { def: "Sampling a space's existing wireless signals to plan access-point placement and avoid interference." },

  // ---- 3.2 Monitoring ----------------------------------------------------
  snmp: { full: "Simple Network Management Protocol", def: "How a monitoring station polls devices for stats (CPU, interface counters) and receives alerts." },
  syslog: { def: "A standard for devices to send event log messages to a central collector, each tagged with a severity 0–7." },
  mib: { full: "Management Information Base", def: "The database of stats and settings that an SNMP device exposes." },
  oid: { full: "Object Identifier", def: "A numbered path (e.g. 1.3.6.1…) that points to one specific value in the MIB." },
  "community string": { def: "SNMP's simple shared password in v1/v2c — 'public' is read-only, 'private' read-write; sent in plaintext." },
  siem: { full: "Security Information and Event Management", def: "Collects logs from everywhere, correlates them, and alerts on suspicious patterns (e.g. many failed logins)." },
  netflow: { def: "A protocol that summarizes traffic flows — who talked to whom and how much — rather than capturing the packets." },
  "port mirroring": { def: "Copies traffic from one switch port to another so a sniffer or IDS can watch it without sitting in-line." },
  span: { full: "Switched Port Analyzer", def: "Cisco's name for port mirroring — copying a port's traffic to a monitoring port." },

  // ---- 3.3 Disaster recovery ---------------------------------------------
  rpo: { full: "Recovery Point Objective", def: "The most data you can afford to lose, measured back to your last backup — it drives how often you back up." },
  rto: { full: "Recovery Time Objective", def: "The longest downtime you can tolerate before you must be back up and running." },
  mttr: { full: "Mean Time To Repair", def: "The average time it takes to fix a failed component." },
  mtbf: { full: "Mean Time Between Failures", def: "The average time a device runs before it fails — a reliability measure." },
  "active-passive": { def: "One device handles all traffic while a synced standby waits to take over the moment it fails." },
  "active-active": { def: "Both devices run and share the load at the same time — more capacity, but more complex." },
  "tabletop exercise": { def: "A disaster drill done on paper — the team talks through a simulated outage without touching real systems." },
  "validation tests": { def: "Actually exercising the failover/recovery to prove the plan really works." },

  // ---- 3.4 IPv4/IPv6 services --------------------------------------------
  dhcp: { full: "Dynamic Host Configuration Protocol", def: "Automatically hands out IP addresses and settings (gateway, DNS) to devices so you don't configure each by hand." },
  dns: { full: "Domain Name System", def: "Translates human names like acme.com into the IP addresses computers actually use." },
  ntp: { full: "Network Time Protocol", def: "Keeps every device's clock in sync (over udp/123) — vital for logs, certificates, and login systems." },
  scope: { def: "The range of IP addresses a DHCP server is allowed to hand out on a subnet." },
  lease: { def: "How long a DHCP client may keep its assigned address before it has to renew." },
  reservation: { def: "A DHCP rule tying a specific address to a device's MAC so it always gets the same IP." },
  exclusion: { def: "Addresses held back from the DHCP pool — e.g. reserved for static servers or gateways." },
  "ip helper": { def: "A router setting (DHCP relay) that forwards DHCP broadcasts to a server on another subnet." },
  t1: { def: "The DHCP renewal timer — at 50% of the lease a client tries to renew with its own server." },
  t2: { def: "The DHCP rebinding timer — at 87.5% of the lease a client will accept any DHCP server if its own is down." },
  "recursive resolver": { def: "A DNS server that does the whole lookup for you (root → TLD → authoritative) and caches the result." },
  authoritative: { def: "The DNS server that actually holds the real records for a domain — the source of truth." },
  forward: { def: "A DNS lookup that turns a name into an IP address (the normal direction)." },
  reverse: { def: "A DNS lookup that turns an IP address back into a name — done with a PTR record." },
  dot: { full: "DNS over TLS", def: "Encrypted DNS on its own port, tcp/853 — hides your lookups from eavesdroppers." },
  doh: { full: "DNS over HTTPS", def: "Encrypted DNS on tcp/443, so it looks just like ordinary web traffic." },
  dnssec: { full: "DNS Security Extensions", def: "Digitally signs DNS records so a forged or spoofed answer is detected — integrity, not encryption." },
  stratum: { def: "How many hops an NTP clock is from the reference source: stratum 0 = atomic/GPS, 1 = directly attached, higher = further." },
  nts: { full: "Network Time Security", def: "Adds authentication to NTP so you can trust the time source you're syncing from." },
  "precision time protocol": { full: "Precision Time Protocol (IEEE 1588)", def: "Hardware-based, sub-microsecond time sync for finance and industrial gear where NTP's milliseconds aren't precise enough." },
  slaac: { full: "Stateless Address Autoconfiguration", def: "How an IPv6 host assigns itself an address using router hints — no DHCP server needed." },
  ndp: { full: "Neighbor Discovery Protocol", def: "IPv6's replacement for ARP — finds routers and neighbors using multicast messages." },
  dad: { full: "Duplicate Address Detection", def: "An IPv6 check that makes sure no one else already has the address before a host uses it." },

  // ---- 3.5 Access & management -------------------------------------------
  "in-band": { def: "Managing a device over the normal production network — e.g. SSH to its regular IP." },
  "out-of-band": { def: "Managing a device over a separate path (console, dedicated port, cellular) that still works when the network is down." },
  "site-to-site": { def: "A VPN that links whole networks together (office to office), always on." },
  "client-to-site": { def: "A VPN for one remote user's device (also called a remote-access VPN)." },
  clientless: { def: "A VPN that runs inside a web browser over TLS, with nothing to install." },
  ssh: { full: "Secure Shell", def: "Encrypted remote command-line access to a device (tcp/22)." },
  telnet: { def: "An old remote command-line protocol that sends everything — including passwords — in cleartext (tcp/23). Avoid it." },
  rdp: { full: "Remote Desktop Protocol", def: "Microsoft's protocol for a remote graphical desktop (tcp/3389)." },
  vnc: { full: "Virtual Network Computing", def: "A cross-platform remote-desktop tool using the RFB protocol." },
  console: { def: "A direct serial/USB connection to a device — the always-available last resort when the network is down." },
  "jump box/bastion": { full: "Jump box / bastion host", def: "A single hardened, logged server everyone must pass through to reach a protected network segment." },
  "jump box": { full: "Jump box / bastion host", def: "A single hardened, logged server everyone must pass through to reach a protected network segment." },
  bastion: { full: "Bastion / jump host", def: "A single hardened, logged server everyone must pass through to reach a protected network segment." },
  "rest apis": { full: "REST Application Programming Interfaces", def: "Programmable HTTP endpoints used to configure many devices at once instead of logging into each by hand." },
  "rest api": { full: "REST Application Programming Interface", def: "A programmable HTTP endpoint used to configure devices in bulk instead of by hand." },
};

// aliases: extra display forms that should resolve to an existing entry
GLOSSARY["switched virtual interface"] = GLOSSARY.svi;
GLOSSARY["switched virtual interface (svi)"] = GLOSSARY.svi;
GLOSSARY["power over ethernet"] = GLOSSARY.poe;
GLOSSARY["rack units"] = GLOSSARY["rack unit"];
GLOSSARY["rack units (u)"] = GLOSSARY["rack unit"];
GLOSSARY["ccmp"] = GLOSSARY["aes-ccmp"];
GLOSSARY["gcmp"] = GLOSSARY["aes-gcmp"];

/** Normalize <Term> children text to a glossary key. Returns the entry or undefined. */
export function lookupTerm(children: unknown): GlossaryEntry | undefined {
  if (typeof children !== "string") return undefined;
  const key = children
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/") // "jump box / bastion" -> "jump box/bastion"
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/, "")
    .trim();
  return GLOSSARY[key];
}
