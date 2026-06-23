/* Shared Domain 1 reference data (OSI layers + common ports), used by the
   OSI explorer, the ports reference/game, and the matching PBQs. */

export type OsiLayer = {
  num: number;
  name: string;
  pdu: string;
  fn: string;
  protocols: string[];
  devices: string[];
  /** a plain-English "what happens here" line */
  plain: string;
};

// ordered 7 -> 1 (top of the stack first)
export const OSI_LAYERS: OsiLayer[] = [
  {
    num: 7, name: "Application", pdu: "Data",
    fn: "Interfaces the user/app with the network",
    protocols: ["HTTP/HTTPS", "DNS", "SMTP", "FTP", "SNMP"],
    devices: ["Application firewall", "Proxy"],
    plain: "The apps and services you actually use — web, email, file transfer.",
  },
  {
    num: 6, name: "Presentation", pdu: "Data",
    fn: "Formats, encrypts, and compresses data",
    protocols: ["TLS/SSL", "ASCII", "JPEG", "Encryption"],
    devices: [],
    plain: "Translates and secures data so both sides understand it (e.g. TLS).",
  },
  {
    num: 5, name: "Session", pdu: "Data",
    fn: "Opens, maintains, and closes sessions",
    protocols: ["RPC", "NetBIOS", "Sockets"],
    devices: [],
    plain: "Sets up and tears down the conversation between two devices.",
  },
  {
    num: 4, name: "Transport", pdu: "Segment / Datagram",
    fn: "End-to-end delivery; ports; reliability",
    protocols: ["TCP", "UDP"],
    devices: ["Firewall (stateful)", "Load balancer"],
    plain: "Chops data into pieces and picks TCP (reliable) or UDP (fast). Port numbers live here.",
  },
  {
    num: 3, name: "Network", pdu: "Packet",
    fn: "Logical addressing and routing",
    protocols: ["IP", "ICMP", "IPsec"],
    devices: ["Router", "Layer 3 switch"],
    plain: "IP addresses and routing — getting packets across networks. (This is where subnetting lives.)",
  },
  {
    num: 2, name: "Data Link", pdu: "Frame",
    fn: "MAC addressing on the local link",
    protocols: ["Ethernet", "MAC", "ARP", "802.1Q"],
    devices: ["Switch", "NIC", "Bridge", "Access point"],
    plain: "MAC addresses and switching — moving frames on the local network.",
  },
  {
    num: 1, name: "Physical", pdu: "Bits",
    fn: "The physical signal on the medium",
    protocols: ["Cabling", "Fiber", "Radio", "Signaling"],
    devices: ["Hub", "Repeater", "Cable", "Transceiver"],
    plain: "The actual cables, fiber, radio waves, and the 1s and 0s on the wire.",
  },
];

export const OSI_MNEMONIC = "Please Do Not Throw Sausage Pizza Away";

export type Port = {
  port: string;
  name: string;
  proto: "TCP" | "UDP" | "TCP/UDP";
  use: string;
};

export const PORTS: Port[] = [
  { port: "20/21", name: "FTP", proto: "TCP", use: "File transfer" },
  { port: "22", name: "SSH / SFTP", proto: "TCP", use: "Secure remote access & transfer" },
  { port: "23", name: "Telnet", proto: "TCP", use: "Remote access (insecure)" },
  { port: "25", name: "SMTP", proto: "TCP", use: "Sending email" },
  { port: "53", name: "DNS", proto: "TCP/UDP", use: "Name → IP resolution" },
  { port: "67/68", name: "DHCP", proto: "UDP", use: "Automatic IP assignment" },
  { port: "69", name: "TFTP", proto: "UDP", use: "Simple file transfer" },
  { port: "80", name: "HTTP", proto: "TCP", use: "Web (unencrypted)" },
  { port: "110", name: "POP3", proto: "TCP", use: "Retrieving email" },
  { port: "123", name: "NTP", proto: "UDP", use: "Time synchronization" },
  { port: "143", name: "IMAP", proto: "TCP", use: "Retrieving email (sync)" },
  { port: "161/162", name: "SNMP", proto: "UDP", use: "Network monitoring/management" },
  { port: "389", name: "LDAP", proto: "TCP/UDP", use: "Directory services" },
  { port: "443", name: "HTTPS", proto: "TCP", use: "Web (encrypted, TLS)" },
  { port: "445", name: "SMB", proto: "TCP", use: "Windows file/printer sharing" },
  { port: "514", name: "Syslog", proto: "UDP", use: "Log collection" },
  { port: "636", name: "LDAPS", proto: "TCP", use: "Secure directory services" },
  { port: "993", name: "IMAP (SSL)", proto: "TCP", use: "Secure email retrieval" },
  { port: "995", name: "POP3 (SSL)", proto: "TCP", use: "Secure email retrieval" },
  { port: "3389", name: "RDP", proto: "TCP", use: "Remote Desktop (Windows)" },
  { port: "3306", name: "MySQL", proto: "TCP", use: "MySQL database" },
  { port: "5060/5061", name: "SIP", proto: "TCP/UDP", use: "VoIP call setup" },
];
