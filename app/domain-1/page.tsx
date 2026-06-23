import type { ReactNode } from "react";
import Link from "next/link";
import { domainBySlug } from "@/lib/domains";
import DomainHeader from "@/components/DomainHeader";
import { Container, Section, SectionTitle, Callout, DemoFrame, Term, Mono } from "@/components/ui";
import QuestionCard from "@/components/QuestionCard";
import OSIExplorer from "@/components/domain1/OSIExplorer";
import CloudStack from "@/components/domain1/CloudStack";
import PortsReference from "@/components/domain1/PortsReference";
import TopologySwitcher from "@/components/domain1/TopologySwitcher";
import OSIMatchPBQ from "@/components/domain1/OSIMatchPBQ";

const domain = domainBySlug("domain-1")!;
const D1 = "var(--color-d1)";
const MESSER = "https://www.professormesser.com/network-plus/n10-009/n10-009-video/";

export const metadata = { title: `${domain.name} · Network+ Prep` };

function Messer({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <a href={`${MESSER}${slug}/`} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-text">
      <span style={{ color: D1 }}>▶</span> Messer: {children}
    </a>
  );
}

/** scannable "term → plain-English explanation" list used to add depth */
function DefList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="my-3 space-y-2">
      {items.map(([term, def]) => (
        <div key={term} className="rounded-lg border border-line-soft bg-surface/40 px-3 py-2 text-sm">
          <dt className="font-semibold text-text">{term}</dt>
          <dd className="mt-0.5 leading-relaxed text-muted">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>;
}

const JUMP = [
  ["obj-1-1", "1.1 OSI"], ["obj-1-2", "1.2 Appliances"], ["obj-1-3", "1.3 Cloud"],
  ["obj-1-4", "1.4 Ports"], ["obj-1-5", "1.5 Media"], ["obj-1-6", "1.6 Topologies"],
  ["obj-1-7", "1.7 IPv4"], ["obj-1-8", "1.8 Modern"],
];

const APPLIANCES = [
  ["Hub", "1", "Dumb repeater — sends bits out every port (legacy)"],
  ["Switch", "2", "Forwards frames by MAC address; the core of a LAN"],
  ["Router", "3", "Moves packets between networks using IP"],
  ["Firewall", "3–7", "Allows/blocks traffic by rules; stateful inspection"],
  ["Load balancer", "4–7", "Spreads traffic across multiple servers"],
  ["IDS / IPS", "3–7", "Detects (IDS) or detects + blocks (IPS) attacks"],
  ["Proxy", "7", "Sits between clients and the internet; caching/filtering"],
  ["Access point", "2", "Bridges Wi-Fi clients onto the wired LAN"],
];

const MEDIA = [
  ["Cat5e", "Copper", "1 Gbps", "100 m"],
  ["Cat6", "Copper", "1 Gbps (10G ≤55m)", "100 m"],
  ["Cat6a", "Copper", "10 Gbps", "100 m"],
  ["Cat8", "Copper", "25–40 Gbps", "30 m"],
  ["Multimode fiber", "Fiber", "10–100 Gbps", "~300–550 m"],
  ["Single-mode fiber", "Fiber", "10–100+ Gbps", "km+"],
];

const MODERN = [
  ["SDN", "Splits the control plane (the brain that decides) from the data plane (that forwards), with central software control."],
  ["VXLAN", "Tunnels Layer-2 networks over Layer-3, scaling far past the 4,096-VLAN limit — key for big data centers."],
  ["Zero Trust", "Never trust, always verify. Every request is authenticated/authorized, with least-privilege access."],
  ["Infrastructure as Code", "Define and deploy network/infra from version-controlled config files instead of by hand."],
  ["SASE / SSE", "Cloud-delivered networking + security (firewall, secure web gateway, ZTNA) as one service."],
  ["IPv6", "128-bit addresses — effectively unlimited, no NAT needed (e.g. 2001:db8::1)."],
];

export default function Page() {
  return (
    <>
      <DomainHeader domain={domain} />

      <Container className="mt-10 space-y-12">
        {/* jump nav */}
        <div className="flex flex-wrap gap-2">
          {JUMP.map(([id, label]) => (
            <a key={id} href={`#${id}`}
              className="rounded-lg border border-line bg-surface/50 px-3 py-1.5 font-mono text-xs font-medium text-muted transition-colors hover:text-text">
              {label}
            </a>
          ))}
        </div>

        {/* 1.1 OSI */}
        <Section id="obj-1-1">
          <SectionTitle objective="1.1" accent={D1} kicker="Networking Concepts">The OSI reference model</SectionTitle>
          <p className="text-sm leading-relaxed text-muted">
            The OSI model breaks networking into <Term>7 layers</Term>, from the cables at the bottom to the
            apps at the top. It is a mental map: when something breaks, you can reason layer by layer. Click
            each layer, then flip to <span className="text-text">encapsulation</span> to see how data gets
            wrapped on the way out.
          </p>
          <DemoFrame title="The 7 layers" accent={D1}><OSIExplorer /></DemoFrame>
          <Callout tone="exam" title="High-value exam facts">
            Switches = <Mono>Layer 2</Mono> (MAC), routers = <Mono>Layer 3</Mono> (IP). The PDU renames at each
            layer: Data → Segment → Packet → Frame → Bits. This was one of your two clean objectives — keep it sharp.
          </Callout>
          <P>
            Two framings make it click. The <Term>upper layers</Term> (5–7) are about the application and
            its data; the <Term>lower layers</Term> (1–4) are about getting that data across the network.
            When you troubleshoot, you can walk the stack in order — &ldquo;is it plugged in?&rdquo; (L1) up
            to &ldquo;is the website itself down?&rdquo; (L7).
          </P>
          <P>
            You will also meet the <Term>TCP/IP model</Term>, which squashes OSI&apos;s seven layers into
            four. Knowing how they line up is a common exam question:
          </P>
          <DefList items={[
            ["Application (TCP/IP) = OSI 5–7", <>The parts users touch — HTTP, DNS, SMTP.</>],
            ["Transport = OSI 4", <>TCP and UDP, plus port numbers.</>],
            ["Internet = OSI 3", <>IP addressing and routing between networks.</>],
            ["Link / Network Access = OSI 1–2", <>Ethernet, MAC addresses, and the physical cabling.</>],
          ]} />
          <Messer slug="understanding-the-osi-model-n10-009">Understanding the OSI Model</Messer>
        </Section>

        {/* 1.2 appliances */}
        <Section id="obj-1-2">
          <SectionTitle objective="1.2" accent={D1}>Networking appliances &amp; functions</SectionTitle>
          <p className="text-sm leading-relaxed text-muted">
            Each box on a network has a job — and it helps to know which OSI layer it works at. The classic
            pair to never confuse: a <Term>switch</Term> connects devices <em>within</em> a network (Layer 2,
            MAC), a <Term>router</Term> connects <em>different</em> networks (Layer 3, IP).
          </p>
          <div className="overflow-hidden rounded-lg border border-line-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-faint">
                <tr><th className="px-3 py-2 font-medium">Appliance</th><th className="px-3 py-2 font-medium">Layer</th><th className="px-3 py-2 font-medium">What it does</th></tr>
              </thead>
              <tbody>
                {APPLIANCES.map(([name, layer, fn]) => (
                  <tr key={name} className="border-t border-line-soft">
                    <td className="px-3 py-2 font-medium text-text">{name}</td>
                    <td className="px-3 py-2"><span className="font-mono text-xs font-bold" style={{ color: D1 }}>L{layer}</span></td>
                    <td className="px-3 py-2 text-muted">{fn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>A few distinctions worth nailing down:</P>
          <DefList items={[
            ["Hub → switch → router", <>A <Term>hub</Term> blindly repeats traffic out every port (one big collision domain, no privacy). A <Term>switch</Term> learns which MAC lives on which port and forwards only there. A <Term>router</Term> connects separate networks and picks the path by IP.</>],
            ["Stateless vs stateful firewall", <>Stateless checks each packet against fixed rules (ACLs). Stateful tracks whole conversations, so it knows a returning reply belongs to a request you already allowed.</>],
            ["Forward vs reverse proxy", <>A forward proxy sits in front of <em>users</em> (caching and filtering outbound traffic). A reverse proxy sits in front of <em>servers</em> (hiding them, load-balancing, handling TLS).</>],
            ["NAS vs SAN", <>A <Term>NAS</Term> shares files over the normal network (like a shared drive). A <Term>SAN</Term> is a dedicated high-speed network that hands raw block storage to servers.</>],
            ["Wireless LAN controller", <>Centrally manages many access points — push one config to all of them instead of touching each AP by hand.</>],
          ]} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Messer slug="networking-devices-n10-009">Networking Devices</Messer>
            <Messer slug="networking-functions-n10-009">Networking Functions</Messer>
          </div>
        </Section>

        {/* 1.3 cloud */}
        <Section id="obj-1-3">
          <SectionTitle objective="1.3" accent={D1}>Cloud concepts</SectionTitle>
          <p className="text-sm leading-relaxed text-muted">
            The cloud models are all about <Term>who manages which layer</Term> of the stack. Deployment models
            describe <em>where</em> it lives: public, private, hybrid, or community.
          </p>
          <DemoFrame title="Who manages what: IaaS / PaaS / SaaS" accent={D1}><CloudStack /></DemoFrame>
          <P>
            Beyond who-manages-what, <Term>deployment models</Term> describe where the cloud lives, and a few
            <Term> characteristics</Term> explain why companies move there:
          </P>
          <DefList items={[
            ["Public / Private / Hybrid / Community", <>Public = shared provider infrastructure (AWS, Azure). Private = dedicated to one organization. Hybrid = a mix, with workloads moving between them. Community = shared by organizations with common needs.</>],
            ["Elasticity & scalability", <>Resources grow and shrink automatically with demand, so you pay for what you use instead of buying for peak.</>],
            ["Multitenancy", <>Many customers share the same physical hardware while staying logically isolated from each other.</>],
            ["Connectivity", <>Reach it over a site-to-site VPN across the internet, or a dedicated private link (Direct Connect / ExpressRoute) for steadier performance.</>],
            ["VPC & security groups", <>A VPC is your own private slice of the provider&apos;s network; security groups are cloud-side firewalls around your resources.</>],
          ]} />
          <Messer slug="cloud-models-n10-009">Cloud Models</Messer>
        </Section>

        {/* 1.4 ports */}
        <Section id="obj-1-4">
          <SectionTitle objective="1.4" accent={D1}>Ports, protocols &amp; traffic types</SectionTitle>
          <p className="text-sm leading-relaxed text-muted">
            Ports are how one device runs many services at once — like apartment numbers at one street address.
            <Term> TCP</Term> is reliable (handshake, ordered, retransmits — web, email, file transfer);
            <Term> UDP</Term> is fast and connectionless (DNS, DHCP, VoIP, streaming). Memorize the common ports,
            then drill them in the game:
          </p>
          <DemoFrame title="Common ports — reference & match game" caption="Switch to the game and build a streak." accent={D1}><PortsReference /></DemoFrame>
          <P>
            <Term>TCP</Term> is connection-oriented: it runs a <Term>three-way handshake</Term> (SYN →
            SYN-ACK → ACK) before sending, numbers every segment, and retransmits anything lost — reliable,
            with some overhead. <Term>UDP</Term> just fires datagrams with no setup and no guarantees —
            less reliable but fast, which is exactly what live voice, video, and quick lookups want.
          </P>
          <P>It is much easier to remember the ports grouped by the job they do:</P>
          <DefList items={[
            ["Web", <>HTTP <Mono>80</Mono>, HTTPS <Mono>443</Mono> (encrypted).</>],
            ["Email", <>SMTP <Mono>25</Mono> (send); POP3 <Mono>110</Mono> / IMAP <Mono>143</Mono> (retrieve); secure on <Mono>995</Mono> / <Mono>993</Mono>.</>],
            ["File transfer", <>FTP <Mono>20/21</Mono>, SFTP <Mono>22</Mono>, TFTP <Mono>69</Mono>, SMB <Mono>445</Mono>.</>],
            ["Remote access", <>SSH <Mono>22</Mono> (secure), RDP <Mono>3389</Mono>, Telnet <Mono>23</Mono> (insecure).</>],
            ["Core services", <>DNS <Mono>53</Mono> (names→IPs), DHCP <Mono>67/68</Mono> (auto-addressing), NTP <Mono>123</Mono> (time).</>],
            ["Management", <>SNMP <Mono>161/162</Mono> (monitoring), Syslog <Mono>514</Mono> (logging), LDAP <Mono>389</Mono> (directory).</>],
          ]} />
          <Callout tone="exam" title="Secure vs insecure pairs (a favorite exam trap)">
            Always prefer the encrypted version: <Mono>SSH 22</Mono> over <Mono>Telnet 23</Mono>,{" "}
            <Mono>HTTPS 443</Mono> over <Mono>HTTP 80</Mono>, and <Mono>SFTP/FTPS</Mono> over plain <Mono>FTP</Mono>.
          </Callout>
          <Callout tone="info" title="Traffic types">
            <span className="text-text">Unicast</span> = one-to-one · <span className="text-text">Broadcast</span> = one-to-all (on the subnet) ·
            <span className="text-text"> Multicast</span> = one-to-many (subscribers) · <span className="text-text">Anycast</span> = one-to-nearest.
          </Callout>
          <div className="flex flex-wrap gap-2">
            <Messer slug="common-ports-n10-009">Common Ports</Messer>
            <Messer slug="network-communication-n10-009">TCP &amp; UDP</Messer>
          </div>
        </Section>

        {/* 1.5 media */}
        <Section id="obj-1-5">
          <SectionTitle objective="1.5" accent={D1}>Transmission media &amp; transceivers</SectionTitle>
          <p className="text-sm leading-relaxed text-muted">
            <Term>Copper</Term> (twisted pair) is cheap and easy but limited to ~100 m and prone to interference.
            <Term> Fiber</Term> goes much farther and faster and ignores electrical noise — single-mode for long
            hauls, multimode for shorter runs. <Term>Transceivers</Term> (SFP, SFP+, QSFP) are the swappable
            modules that plug media into a switch.
          </p>
          <div className="overflow-hidden rounded-lg border border-line-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-faint">
                <tr><th className="px-3 py-2 font-medium">Media</th><th className="px-3 py-2 font-medium">Type</th><th className="px-3 py-2 font-medium">Speed</th><th className="px-3 py-2 font-medium">Max distance</th></tr>
              </thead>
              <tbody>
                {MEDIA.map(([name, type, speed, dist]) => (
                  <tr key={name} className="border-t border-line-soft">
                    <td className="px-3 py-2 font-medium text-text">{name}</td>
                    <td className="px-3 py-2 text-muted">{type}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted">{speed}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted">{dist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout tone="info" title="Connectors to recognize">
            Copper: <Mono>RJ45</Mono> (Ethernet). Fiber: <Mono>LC</Mono>, <Mono>SC</Mono>, <Mono>ST</Mono>, <Mono>MPO</Mono>. Coax: <Mono>F-type</Mono>, <Mono>BNC</Mono>.
          </Callout>
          <P>The detail behind the table:</P>
          <DefList items={[
            ["UTP vs STP", <>Unshielded twisted pair (UTP) is the common, cheap choice. Shielded (STP) adds a foil or braid to fight interference in noisy spots — factory floors, near big motors.</>],
            ["Single-mode vs multimode fiber", <>Single-mode has a tiny core and uses a laser for very long distances (yellow jacket). Multimode has a larger core and uses LED light for shorter runs (aqua or orange).</>],
            ["Why pick fiber", <>Immune to electrical interference, very hard to tap, huge bandwidth, and reaches far past copper&apos;s ~100 m — at higher cost and more careful handling.</>],
            ["Transceivers (SFP / SFP+ / QSFP)", <>Hot-swappable modules that plug media into a switch: SFP ≈ 1 Gbps, SFP+ ≈ 10 Gbps, QSFP/QSFP+ ≈ 40 Gbps and up.</>],
            ["Termination standards", <>Copper is wired to the T568A or T568B pinout — the rule is simply to be consistent on both ends of a run.</>],
          ]} />
          <div className="flex flex-wrap gap-2">
            <Messer slug="copper-cabling-n10-009">Copper Cabling</Messer>
            <Messer slug="optical-fiber-n10-009">Optical Fiber</Messer>
            <Messer slug="network-transceivers-n10-009">Transceivers</Messer>
          </div>
        </Section>

        {/* 1.6 topologies */}
        <Section id="obj-1-6">
          <SectionTitle objective="1.6" accent={D1}>Topologies &amp; architectures</SectionTitle>
          <p className="text-sm leading-relaxed text-muted">
            A <Term>topology</Term> is the shape of how things connect. Modern LANs are almost all{" "}
            <span className="text-text">star</span> (everything to a switch); data centers use{" "}
            <span className="text-text">spine-leaf</span> for fast <em>east-west</em> (server-to-server)
            traffic, versus <em>north-south</em> (in-and-out) traffic.
          </p>
          <DemoFrame title="Pick a topology" accent={D1}><TopologySwitcher /></DemoFrame>
          <P>Also know the <Term>sizes</Term> of networks and the <Term>architectures</Term> used to build big ones:</P>
          <DefList items={[
            ["Network types by size", <>PAN (your desk, e.g. Bluetooth) → LAN (a building) → WLAN (the Wi-Fi version) → CAN (a campus) → MAN (a city) → WAN (across cities / the internet).</>],
            ["Three-tier hierarchy", <>Big campus networks layer into core (fast backbone), distribution (routing and policy), and access (where devices plug in).</>],
            ["Collapsed core", <>Smaller networks merge the core and distribution tiers into one to save money.</>],
            ["Spine-leaf", <>Data-center design where every leaf switch connects to every spine — predictable, low-latency east-west (server-to-server) traffic.</>],
            ["SD-WAN", <>Manages multiple WAN links (broadband, MPLS, LTE) through software, steering each app over the best path.</>],
          ]} />
          <div className="flex flex-wrap gap-2">
            <Messer slug="network-topologies-n10-009">Network Topologies</Messer>
            <Messer slug="network-architectures-n10-009">Network Architectures</Messer>
          </div>
        </Section>

        {/* 1.7 ipv4 -> lab */}
        <Section id="obj-1-7">
          <SectionTitle objective="1.7" accent={D1}>IPv4 addressing &amp; subnetting</SectionTitle>
          <p className="text-sm leading-relaxed text-muted">
            This is the big one — and your weak spot — so it has its own dedicated space. Everything from what an
            IP address means through subnetting, the mask, and endless practice lives in the lab.
          </p>
          <Link href="/ip-subnetting"
            className="flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors hover:bg-surface-2/60"
            style={{ borderColor: "color-mix(in oklab, var(--color-lab) 40%, var(--color-line))", backgroundColor: "color-mix(in oklab, var(--color-lab) 8%, transparent)" }}>
            <div>
              <div className="font-semibold text-text">Open the IP &amp; Subnetting lab →</div>
              <div className="text-sm text-muted">Networks &amp; hosts, masks, same-network checks, and tiered practice — in plain English.</div>
            </div>
            <span className="font-mono text-2xl font-bold" style={{ color: "var(--color-lab)" }}>/</span>
          </Link>
        </Section>

        {/* 1.8 modern */}
        <Section id="obj-1-8">
          <SectionTitle objective="1.8" accent={D1}>Modern network environments</SectionTitle>
          <p className="text-sm leading-relaxed text-muted">
            The newer ideas the exam expects you to <em>summarize</em> — you do not need to configure them, just
            know what each one is and why it exists.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {MODERN.map(([name, desc]) => (
              <div key={name} className="rounded-lg border border-line-soft bg-surface/50 p-3">
                <div className="text-sm font-semibold" style={{ color: D1 }}>{name}</div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Messer slug="software-defined-networking-n10-009">SDN</Messer>
            <Messer slug="zero-trust-n10-009">Zero Trust</Messer>
            <Messer slug="ipv6-addressing-n10-009">IPv6</Messer>
          </div>
        </Section>

        {/* open questions */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-text">Open questions</h2>
            <p className="text-sm text-muted">Answer cold, then reveal. Score each red / amber / green.</p>
          </div>
          <div className="space-y-3">
            <QuestionCard id="d1-q1" objective="1.1" accent={D1} number={1}
              question={<>Name the seven OSI layers in order (either direction) and give a one-word job for each.</>}
              answer={<>7 Application, 6 Presentation, 5 Session, 4 Transport, 3 Network, 2 Data Link, 1 Physical — apps, format/encrypt, sessions, ports/TCP-UDP, IP/routing, MAC/switching, cables/bits.</>}
              listenFor="Correct order and the gist of each — especially L2 = MAC/switch, L3 = IP/router, L4 = ports." />
            <QuestionCard id="d1-q2" objective="1.1" accent={D1} number={2}
              question={<>Which OSI layer do switches operate at, and which do routers operate at? Why?</>}
              answer={<>Switches = Layer 2 (forward by MAC address, within a network). Routers = Layer 3 (forward by IP address, between networks).</>}
              listenFor="L2/MAC for switch, L3/IP for router — and the within-vs-between-networks distinction." />
            <QuestionCard id="d1-q3" objective="1.1" accent={D1} number={3}
              question={<>Explain encapsulation — what happens to your data as it moves down the stack to be sent?</>}
              answer={<>Each layer wraps it in a header: app data → add TCP/UDP header (Segment) → add IP header (Packet) → add frame header/trailer (Frame) → sent as Bits. The receiver unwraps in reverse.</>}
              listenFor="Headers added going down, removed going up; the Data→Segment→Packet→Frame→Bits renaming." />
            <QuestionCard id="d1-q4" objective="1.2" accent={D1} number={4}
              question={<>What is the difference between a switch and a router?</>}
              answer={<>A switch connects devices within one network using MAC addresses (Layer 2). A router connects different networks and forwards by IP address (Layer 3).</>}
              listenFor="MAC/within vs IP/between; bonus for the layer numbers." />
            <QuestionCard id="d1-q5" objective="1.2" accent={D1} number={5}
              question={<>What does a load balancer do, and when would you use one?</>}
              answer={<>It spreads incoming traffic across multiple servers so no single one is overwhelmed — used for high-traffic sites/apps for performance and redundancy.</>}
              listenFor="Distributing load across servers; availability/scaling." />
            <QuestionCard id="d1-q6" objective="1.2" accent={D1} number={6}
              question={<>IDS vs IPS — what is the difference?</>}
              answer={<>An IDS detects and alerts on suspicious traffic (passive). An IPS sits inline and can detect <em>and block</em> it (active).</>}
              listenFor="Detect-only vs detect-and-block / inline." />
            <QuestionCard id="d1-q7" objective="1.3" accent={D1} number={7}
              question={<>Explain IaaS, PaaS, and SaaS with an example of each.</>}
              answer={<>IaaS = you rent raw infrastructure, manage OS up (AWS EC2). PaaS = you deploy apps on a managed platform (App Engine). SaaS = you just use the finished software (Gmail).</>}
              listenFor="The increasing amount the provider manages; a reasonable example for each." />
            <QuestionCard id="d1-q8" objective="1.3" accent={D1} number={8}
              question={<>Public vs private vs hybrid cloud — what is the difference?</>}
              answer={<>Public = shared provider infrastructure (AWS/Azure). Private = dedicated to one organization. Hybrid = a mix, with workloads moving between them.</>}
              listenFor="Shared vs dedicated vs a blend." />
            <QuestionCard id="d1-q9" objective="1.4" accent={D1} number={9}
              question={<>TCP vs UDP — when would you use each, with examples?</>}
              answer={<>TCP when you need reliability/order (web, email, file transfer) — it handshakes and retransmits. UDP when speed matters more than guarantees (DNS, DHCP, VoIP, streaming).</>}
              listenFor="Reliable/ordered vs fast/connectionless; sensible examples." />
            <QuestionCard id="d1-q10" objective="1.4" accent={D1} number={10}
              question={<>Give the ports for HTTP, HTTPS, SSH, DNS, and RDP.</>}
              answer={<>HTTP 80, HTTPS 443, SSH 22, DNS 53, RDP 3389.</>}
              listenFor="All five; these are the bread-and-butter ports." />
            <QuestionCard id="d1-q11" objective="1.4" accent={D1} number={11}
              question={<>What are unicast, broadcast, and multicast?</>}
              answer={<>Unicast = one-to-one. Broadcast = one-to-everyone on the subnet. Multicast = one-to-a-group of subscribers.</>}
              listenFor="One-to-one / one-to-all / one-to-many-subscribed." />
            <QuestionCard id="d1-q12" objective="1.5" accent={D1} number={12}
              question={<>When would you choose fiber over copper?</>}
              answer={<>For long distances (beyond ~100 m), very high speeds, or environments with electrical interference — fiber is immune to EMI and goes much farther.</>}
              listenFor="Distance, speed, and EMI immunity." />
            <QuestionCard id="d1-q13" objective="1.5" accent={D1} number={13}
              question={<>What connector does Ethernet over copper use, and name a fiber connector.</>}
              answer={<>Copper Ethernet uses RJ45. Fiber uses LC, SC, ST, or MPO.</>}
              listenFor="RJ45 for copper; any valid fiber connector." />
            <QuestionCard id="d1-q14" objective="1.6" accent={D1} number={14}
              question={<>Star vs mesh topology — what are the trade-offs?</>}
              answer={<>Star: simple and cheap, but the central switch is a single point of failure. Mesh: every node interconnected, very resilient, but expensive and hard to scale.</>}
              listenFor="Star = central point of failure; mesh = redundant but costly." />
            <QuestionCard id="d1-q15" objective="1.6" accent={D1} number={15}
              question={<>What is the difference between north-south and east-west traffic?</>}
              answer={<>North-south = traffic in and out of the data center (to clients/internet). East-west = traffic between servers inside the data center. Spine-leaf is built to handle heavy east-west.</>}
              listenFor="In/out vs server-to-server; bonus for spine-leaf." />
            <QuestionCard id="d1-q16" objective="1.8" accent={D1} number={16}
              question={<>What is zero trust, in a sentence or two?</>}
              answer={<>&ldquo;Never trust, always verify&rdquo; — every user/device/request is authenticated and authorized every time, with least-privilege access, instead of trusting anything just because it is inside the network.</>}
              listenFor="Verify everything / no implicit trust / least privilege." />
          </div>
        </section>

        {/* PBQ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-text">Performance-based practice</h2>
            <p className="text-sm text-muted">Exam-style hands-on tasks.</p>
          </div>
          <DemoFrame title="PBQ · Match the activity to its OSI layer" accent={D1}><OSIMatchPBQ /></DemoFrame>
          <Callout tone="info" title="More free PBQs (open in a new tab)">
            <div className="flex flex-wrap gap-2 pt-1">
              <a className="underline underline-offset-2 hover:text-text" href="https://crucialexams.com/exams/comptia/network/n10-009/practice-tests-practice-questions" target="_blank" rel="noopener noreferrer">CrucialExams — OSI drag &amp; drop</a>
              <span>·</span>
              <a className="underline underline-offset-2 hover:text-text" href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-pop-quizzes/" target="_blank" rel="noopener noreferrer">Professor Messer pop quizzes</a>
              <span>·</span>
              <span className="text-faint">the ports match game above</span>
            </div>
          </Callout>
        </section>
      </Container>
    </>
  );
}
