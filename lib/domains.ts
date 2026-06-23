export type Objective = {
  id: string;
  title: string;
  /** Tim answered every question in this objective correctly on his attempt. */
  clean?: boolean;
};

export type Domain = {
  num: number;
  /** route slug, e.g. "domain-1" */
  slug: string;
  /** short tab label */
  short: string;
  name: string;
  /** exam weight (%) */
  weight: number;
  /** CSS color expression for this domain's accent */
  accent: string;
  blurb: string;
  /** whether the full teaching content for this domain has been built yet */
  built: boolean;
  objectives: Objective[];
};

export const DOMAINS: Domain[] = [
  {
    num: 1,
    slug: "domain-1",
    short: "Concepts",
    name: "Networking Concepts",
    weight: 23,
    accent: "var(--color-d1)",
    built: false,
    blurb:
      "The vocabulary of networking: the OSI model, appliances, ports & protocols, media, topologies, IPv4 addressing & subnetting, and modern environments.",
    objectives: [
      { id: "1.1", title: "Open Systems Interconnection (OSI) reference model", clean: true },
      { id: "1.2", title: "Networking appliances, applications, and functions" },
      { id: "1.3", title: "Cloud concepts and connectivity options" },
      { id: "1.4", title: "Common ports, protocols, services, and traffic types" },
      { id: "1.5", title: "Transmission media and transceivers" },
      { id: "1.6", title: "Network topologies, architectures, and types" },
      { id: "1.7", title: "IPv4 network addressing (and subnetting)" },
      { id: "1.8", title: "Evolving use cases for modern network environments" },
    ],
  },
  {
    num: 2,
    slug: "domain-2",
    short: "Implementation",
    name: "Network Implementation",
    weight: 20,
    accent: "var(--color-d2)",
    built: false,
    blurb:
      "Building the network: routing technologies, switching features (VLANs, STP, PoE), wireless devices and standards, and physical installation factors.",
    objectives: [
      { id: "2.1", title: "Routing technologies and bandwidth management" },
      { id: "2.2", title: "Switching technologies and features" },
      { id: "2.3", title: "Select and configure wireless devices and technologies" },
      { id: "2.4", title: "Important factors of physical installations" },
    ],
  },
  {
    num: 3,
    slug: "domain-3",
    short: "Operations",
    name: "Network Operations",
    weight: 19,
    accent: "var(--color-d3)",
    built: false,
    blurb:
      "Running the network: organizational processes, monitoring (SNMP, syslog, SIEM), disaster recovery, IPv4/IPv6 services (DHCP, DNS, NTP), and access/management methods.",
    objectives: [
      { id: "3.1", title: "Organizational processes and procedures", clean: true },
      { id: "3.2", title: "Network monitoring technologies" },
      { id: "3.3", title: "Disaster recovery (DR) concepts" },
      { id: "3.4", title: "Implement IPv4 and IPv6 network services" },
      { id: "3.5", title: "Network access and management methods" },
    ],
  },
  {
    num: 4,
    slug: "domain-4",
    short: "Security",
    name: "Network Security",
    weight: 14,
    accent: "var(--color-d4)",
    built: false,
    blurb:
      "Defending the network: core security concepts (CIA, AAA, zero trust), attack types (DoS, on-path, ARP/DNS spoofing, VLAN hopping), and defense techniques.",
    objectives: [
      { id: "4.1", title: "Importance of basic network security concepts" },
      { id: "4.2", title: "Types of attacks and their impact to the network" },
      { id: "4.3", title: "Apply network security features, defense techniques, and solutions" },
    ],
  },
  {
    num: 5,
    slug: "domain-5",
    short: "Troubleshooting",
    name: "Network Troubleshooting",
    weight: 24,
    accent: "var(--color-d5)",
    built: false,
    blurb:
      "Fixing the network: the troubleshooting methodology, cabling & physical issues, network service issues, performance issues, and the right tools & protocols.",
    objectives: [
      { id: "5.1", title: "The troubleshooting methodology" },
      { id: "5.2", title: "Troubleshoot common cabling and physical interface issues" },
      { id: "5.3", title: "Troubleshoot common issues with network services" },
      { id: "5.4", title: "Troubleshoot common performance issues" },
      { id: "5.5", title: "Use the appropriate tool or protocol to solve networking issues" },
    ],
  },
];

export const EXAM = {
  code: "N10-009",
  maxQuestions: 90,
  minutes: 90,
  scaleMin: 100,
  scaleMax: 900,
  pass: 720,
};

export function domainBySlug(slug: string): Domain | undefined {
  return DOMAINS.find((d) => d.slug === slug);
}
