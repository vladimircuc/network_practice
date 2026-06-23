/* ----------------------------------------------------------------------------
   IPv4 subnetting math. Pure functions, no UI. Powers every lab widget.
   IPs are handled as unsigned 32-bit integers (0 .. 4294967295).
---------------------------------------------------------------------------- */

export type Octets = [number, number, number, number];

/** [192,168,1,10] -> 3232235786 */
export function octetsToInt(o: Octets): number {
  return (((o[0] << 24) >>> 0) + (o[1] << 16) + (o[2] << 8) + o[3]) >>> 0;
}

/** 3232235786 -> [192,168,1,10] */
export function intToOctets(n: number): Octets {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
}

export function intToIp(n: number): string {
  return intToOctets(n).join(".");
}

export function ipToInt(ip: string): number {
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  return octetsToInt([parts[0], parts[1], parts[2], parts[3]] as Octets);
}

/** Subnet mask as an integer for a given CIDR prefix length. */
export function maskInt(cidr: number): number {
  if (cidr <= 0) return 0;
  if (cidr >= 32) return 0xffffffff;
  return (0xffffffff << (32 - cidr)) >>> 0;
}

export function maskIp(cidr: number): string {
  return intToIp(maskInt(cidr));
}

/** Wildcard (inverse) mask, e.g. /24 -> 0.0.0.255 */
export function wildcardIp(cidr: number): string {
  return intToIp((~maskInt(cidr)) >>> 0);
}

export function networkInt(ipInt: number, cidr: number): number {
  return (ipInt & maskInt(cidr)) >>> 0;
}

export function broadcastInt(ipInt: number, cidr: number): number {
  return (networkInt(ipInt, cidr) | ((~maskInt(cidr)) >>> 0)) >>> 0;
}

export function hostBits(cidr: number): number {
  return 32 - cidr;
}

/** Total addresses in the block (incl. network + broadcast). */
export function totalAddresses(cidr: number): number {
  return Math.pow(2, 32 - cidr);
}

/** Usable host addresses. /31 -> 2 (RFC 3021 p2p), /32 -> 1 (host route). */
export function usableHosts(cidr: number): number {
  const h = 32 - cidr;
  if (h === 0) return 1;
  if (h === 1) return 2;
  return Math.pow(2, h) - 2;
}

export function firstUsableInt(ipInt: number, cidr: number): number {
  const net = networkInt(ipInt, cidr);
  return 32 - cidr <= 1 ? net : net + 1;
}

export function lastUsableInt(ipInt: number, cidr: number): number {
  const bc = broadcastInt(ipInt, cidr);
  return 32 - cidr <= 1 ? bc : bc - 1;
}

/** 32-bit binary string, optionally dotted into octets. */
export function toBinary32(n: number, dotted = false): string {
  const bits = (n >>> 0).toString(2).padStart(32, "0");
  if (!dotted) return bits;
  return bits.match(/.{8}/g)!.join(".");
}

/** 8-bit binary for a single octet value. */
export function octetBinary(v: number): string {
  return (v & 255).toString(2).padStart(8, "0");
}

/**
 * Block size ("magic number") in the interesting octet.
 * e.g. /26 -> mask octet 192 -> 256-192 = 64
 */
export function blockSize(cidr: number): number {
  if (cidr <= 0 || cidr >= 32) return 1;
  const maskOctets = intToOctets(maskInt(cidr));
  // interesting octet = the one that isn't 0 or 255
  const idx = Math.floor((cidr - 1) / 8);
  return 256 - maskOctets[idx];
}

/** Index (0-3) of the octet where the network/host boundary falls. */
export function interestingOctet(cidr: number): number {
  return Math.min(3, Math.floor(cidr / 8));
}

/** Number of subnets created when extending baseCidr to newCidr. */
export function subnetCount(baseCidr: number, newCidr: number): number {
  return Math.pow(2, Math.max(0, newCidr - baseCidr));
}

export type IpKind =
  | "public"
  | "private"
  | "apipa"
  | "loopback"
  | "multicast"
  | "reserved";

/** Classify an address into Network+-relevant categories. */
export function classify(ipInt: number): IpKind {
  const [a, b] = intToOctets(ipInt);
  if (a === 127) return "loopback";
  if (a === 169 && b === 254) return "apipa";
  if (a === 10) return "private";
  if (a === 172 && b >= 16 && b <= 31) return "private";
  if (a === 192 && b === 168) return "private";
  if (a >= 224 && a <= 239) return "multicast";
  if (a >= 240) return "reserved";
  if (a === 0) return "reserved";
  return "public";
}

export const KIND_LABEL: Record<IpKind, string> = {
  public: "Public",
  private: "Private",
  apipa: "APIPA / link-local",
  loopback: "Loopback",
  multicast: "Multicast",
  reserved: "Reserved",
};

/** Classful first-octet class (legacy, still tested). */
export function ipClass(ipInt: number): "A" | "B" | "C" | "D" | "E" {
  const a = intToOctets(ipInt)[0];
  if (a < 128) return "A";
  if (a < 192) return "B";
  if (a < 224) return "C";
  if (a < 240) return "D";
  return "E";
}

/** Everything about an IP+CIDR, in one object. */
export function describe(ipInt: number, cidr: number) {
  return {
    cidr,
    ip: intToIp(ipInt),
    mask: maskIp(cidr),
    wildcard: wildcardIp(cidr),
    network: intToIp(networkInt(ipInt, cidr)),
    broadcast: intToIp(broadcastInt(ipInt, cidr)),
    firstUsable: intToIp(firstUsableInt(ipInt, cidr)),
    lastUsable: intToIp(lastUsableInt(ipInt, cidr)),
    usableHosts: usableHosts(cidr),
    totalAddresses: totalAddresses(cidr),
    hostBits: hostBits(cidr),
    networkInt: networkInt(ipInt, cidr),
    broadcastInt: broadcastInt(ipInt, cidr),
  };
}
