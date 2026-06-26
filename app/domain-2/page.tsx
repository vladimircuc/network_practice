import type { ReactNode } from "react";
import { domainBySlug } from "@/lib/domains";
import { ROUTING_PROTOCOLS, WIFI_STANDARDS, POE_STANDARDS } from "@/lib/domain2";
import DomainHeader from "@/components/DomainHeader";
import { Container, Section, SectionTitle, DemoFrame, Term, Mono } from "@/components/ui";
import QuestionCard from "@/components/QuestionCard";
import RoutingDecision from "@/components/domain2/RoutingDecision";
import NatPat from "@/components/domain2/NatPat";
import VlanTrunkLab from "@/components/domain2/VlanTrunkLab";
import StpVisualizer from "@/components/domain2/StpVisualizer";
import ChannelOverlapChart from "@/components/domain2/ChannelOverlapChart";
import PoeBudget from "@/components/domain2/PoeBudget";
import RackDiagram from "@/components/domain2/RackDiagram";
import RoutingTablePBQ from "@/components/domain2/RoutingTablePBQ";
import VlanPBQ from "@/components/domain2/VlanPBQ";
import StpElectionPBQ from "@/components/domain2/StpElectionPBQ";
import PoeBudgetPBQ from "@/components/domain2/PoeBudgetPBQ";
import ChannelPlanningPBQ from "@/components/domain2/ChannelPlanningPBQ";
import DiagnoseMisconfigPBQ from "@/components/domain2/DiagnoseMisconfigPBQ";

const domain = domainBySlug("domain-2")!;
const D2 = "var(--color-d2)";
const MESSER = "https://www.professormesser.com/network-plus/n10-009/n10-009-video/";

export const metadata = { title: `${domain.name} · Network+ Prep` };

function Messer({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <a href={`${MESSER}${slug}/`} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-text">
      <span style={{ color: D2 }}>▶</span> Messer: {children}
    </a>
  );
}
function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>;
}
function DefList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="my-3 space-y-2">
      {items.map(([t, d]) => (
        <div key={t} className="rounded-lg border border-line-soft bg-surface/40 px-3 py-2 text-sm">
          <dt className="font-semibold text-text">{t}</dt>
          <dd className="mt-0.5 leading-relaxed text-muted">{d}</dd>
        </div>
      ))}
    </dl>
  );
}
function PbqBadge() {
  return <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: D2, backgroundColor: "color-mix(in oklab, var(--color-d2) 16%, transparent)" }}>PBQ</span>;
}

const JUMP = [["obj-2-1", "2.1 Routing"], ["obj-2-2", "2.2 Switching"], ["obj-2-3", "2.3 Wireless"], ["obj-2-4", "2.4 Physical"], ["pbqs", "PBQ gauntlet"]];

export default function Page() {
  return (
    <>
      <DomainHeader domain={domain} />
      <Container className="mt-10 space-y-12">
        <div className="flex flex-wrap gap-2">
          {JUMP.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-lg border border-line bg-surface/50 px-3 py-1.5 font-mono text-xs font-medium text-muted transition-colors hover:text-text">{label}</a>
          ))}
        </div>

        {/* 2.1 ROUTING */}
        <Section id="obj-2-1">
          <SectionTitle objective="2.1" accent={D2} kicker="Network Implementation">Routing &amp; bandwidth management</SectionTitle>
          <P>
            Routing moves packets <span className="text-text">between</span> networks. A router can learn routes three ways:
            <Term> connected</Term> (interfaces it&apos;s attached to), <Term>static</Term> (you type them in), and
            <Term> dynamic</Term> (protocols share routes automatically). When several routes could reach the same place,
            the router follows a strict order to choose:
          </P>
          <DefList items={[
            ["1. Longest prefix match", <>The most specific route wins — a <Mono>/24</Mono> beats a <Mono>/16</Mono> beats a <Mono>/8</Mono>, regardless of protocol.</>],
            ["2. Administrative distance (AD)", <>If prefixes tie, the most <em>trusted</em> source wins (lower AD): Connected 0 &lt; Static 1 &lt; EIGRP 90 &lt; OSPF 110 &lt; RIP 120.</>],
            ["3. Metric", <>Within one protocol, the lowest metric (OSPF cost, RIP hops, EIGRP bandwidth+delay) wins.</>],
          ]} />
          <DemoFrame title="Watch the router choose a route" accent={D2}><RoutingDecision /></DemoFrame>

          <P>Know the routing protocols by type, trust level (AD), and where they&apos;re used:</P>
          <div className="overflow-hidden rounded-lg border border-line-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-faint"><tr><th className="px-3 py-2">Protocol</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">AD</th><th className="px-3 py-2">Metric</th><th className="px-3 py-2">Use</th></tr></thead>
              <tbody>
                {ROUTING_PROTOCOLS.map((r) => (
                  <tr key={r.name} className="border-t border-line-soft">
                    <td className="px-3 py-2 font-semibold text-text">{r.name}</td>
                    <td className="px-3 py-2 text-muted">{r.kind}</td>
                    <td className="px-3 py-2 font-mono" style={{ color: D2 }}>{r.ad}</td>
                    <td className="px-3 py-2 text-muted">{r.metric}</td>
                    <td className="px-3 py-2 text-muted">{r.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <P>Two more 2.1 staples — address translation and gateway redundancy — plus bandwidth control:</P>
          <DefList items={[
            ["NAT / PAT", <>NAT swaps private addresses for public ones at the edge. <Term>PAT</Term> (what home routers do) maps many private hosts to one public IP using port numbers.</>],
            ["FHRP (VRRP / HSRP)", <>Two routers share one <Term>virtual IP</Term> as the gateway; if the active one dies, the standby takes over instantly — no client reconfiguration.</>],
            ["Subinterfaces", <>One physical router port split into logical interfaces (one per VLAN) — &ldquo;router-on-a-stick&rdquo; inter-VLAN routing.</>],
            ["QoS & traffic shaping", <>Mark and prioritize traffic (voice/video over bulk downloads) and cap rates so latency-sensitive apps stay smooth.</>],
          ]} />
          <DemoFrame title="PAT: many private hosts, one public IP" accent={D2}><NatPat /></DemoFrame>

          <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
            <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Route the packets</span></div>
            <RoutingTablePBQ />
          </div>

          <div className="flex flex-wrap gap-2">
            <Messer slug="static-routing-n10-009">Static Routing</Messer>
            <Messer slug="dynamic-routing-n10-009">Dynamic Routing</Messer>
            <Messer slug="network-address-translation-n10-009">NAT</Messer>
          </div>
        </Section>

        {/* 2.2 SWITCHING */}
        <Section id="obj-2-2">
          <SectionTitle objective="2.2" accent={D2}>Switching technologies</SectionTitle>
          <P>
            Switches move frames <span className="text-text">within</span> a network. <Term>VLANs</Term> let one physical
            switch host several isolated networks (separate broadcast domains). An <Term>access port</Term> belongs to one
            VLAN; a <Term>trunk</Term> carries many between switches using <Mono>802.1Q</Mono> tags.
          </P>
          <DemoFrame title="VLANs, trunks & who can talk to whom" accent={D2}><VlanTrunkLab /></DemoFrame>
          <DefList items={[
            ["Native VLAN", <>The one untagged VLAN on a trunk — it must match on both ends or frames cross into the wrong VLAN.</>],
            ["Voice VLAN", <>A dedicated VLAN for IP phones so voice traffic is separated and prioritized.</>],
            ["Link aggregation (LACP)", <>Bundle several physical links into one logical link for more bandwidth and redundancy.</>],
            ["Speed / duplex", <>Mismatched duplex (one full, one half) causes collisions, CRC errors, and crawling throughput — a classic fault.</>],
          ]} />

          <P>
            <Term>Spanning Tree (STP/RSTP)</Term> prevents switching loops by electing a <Term>root bridge</Term> (lowest
            bridge ID = priority, then MAC) and blocking redundant links until needed.
          </P>
          <DemoFrame title="Elect the root bridge" accent={D2}><StpVisualizer /></DemoFrame>
          <DefList items={[
            ["Port states", <>Blocking → Listening → Learning → Forwarding (RSTP collapses these for faster convergence).</>],
            ["BPDU Guard / Root Guard", <>BPDU Guard err-disables an edge port that receives BPDUs (rogue switch); Root Guard stops a port from becoming root.</>],
            ["PortFast", <>Skips the listening/learning delay on access ports so devices come online immediately.</>],
            ["MTU / jumbo frames", <>Default MTU is 1500 bytes; jumbo frames (~9000) boost storage/backup throughput but must be enabled end-to-end.</>],
          ]} />

          <P><Term>Power over Ethernet</Term> delivers power and data over one cable — but the switch has a finite power budget:</P>
          <div className="overflow-hidden rounded-lg border border-line-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-faint"><tr><th className="px-3 py-2">Standard</th><th className="px-3 py-2">Name</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">At the switch</th></tr></thead>
              <tbody>
                {POE_STANDARDS.map((p) => (
                  <tr key={p.name} className="border-t border-line-soft">
                    <td className="px-3 py-2 font-mono font-semibold text-text">{p.std}</td>
                    <td className="px-3 py-2 text-muted">{p.name}</td>
                    <td className="px-3 py-2 text-muted">{p.type}</td>
                    <td className="px-3 py-2 font-mono" style={{ color: D2 }}>{p.switchW} W</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DemoFrame title="Stay under the PoE budget" accent={D2}><PoeBudget /></DemoFrame>

          <div className="space-y-4">
            <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
              <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Configure the switchports + fix inter-VLAN</span></div>
              <VlanPBQ />
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
              <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Find the root bridge &amp; the blocked port</span></div>
              <StpElectionPBQ />
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
              <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Will the PoE budget hold?</span></div>
              <PoeBudgetPBQ />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Messer slug="vlans-and-trunking-n10-009">VLANs &amp; Trunking</Messer>
            <Messer slug="interface-configurations-n10-009">Interface Configs</Messer>
            <Messer slug="spanning-tree-protocol-n10-009">Spanning Tree</Messer>
          </div>
        </Section>

        {/* 2.3 WIRELESS */}
        <Section id="obj-2-3">
          <SectionTitle objective="2.3" accent={D2}>Wireless</SectionTitle>
          <P>
            Wi-Fi runs on <Term>2.4 GHz</Term> (farther reach, more interference, slower),
            <Term> 5 GHz</Term> (faster, shorter range), and <Term>6 GHz</Term> (Wi-Fi 6E, lots of clean spectrum). Know the
            standards:
          </P>
          <div className="overflow-hidden rounded-lg border border-line-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-faint"><tr><th className="px-3 py-2">Standard</th><th className="px-3 py-2">Wi-Fi</th><th className="px-3 py-2">Band(s)</th><th className="px-3 py-2">Max rate</th><th className="px-3 py-2">Year</th></tr></thead>
              <tbody>
                {WIFI_STANDARDS.map((w) => (
                  <tr key={w.std} className="border-t border-line-soft">
                    <td className="px-3 py-2 font-mono font-semibold text-text">{w.std}</td>
                    <td className="px-3 py-2 text-muted">{w.gen}</td>
                    <td className="px-3 py-2 text-muted">{w.bands}</td>
                    <td className="px-3 py-2 font-mono" style={{ color: D2 }}>{w.maxRate}</td>
                    <td className="px-3 py-2 text-faint">{w.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>The 2.4 GHz band only has room for three non-overlapping channels — get this wrong and APs jam each other:</P>
          <DemoFrame title="2.4 GHz channel overlap" accent={D2}><ChannelOverlapChart /></DemoFrame>
          <DefList items={[
            ["SSID / BSSID / ESSID", <>SSID = the network name; BSSID = a specific AP&apos;s radio MAC; ESSID = the same SSID shared across many APs for seamless roaming.</>],
            ["Security: WPA2 vs WPA3", <>WPA3 is current (SAE handshake, stronger crypto). <Term>PSK</Term> = one shared password (home); <Term>Enterprise</Term> = per-user logins via 802.1X/RADIUS.</>],
            ["AP types", <>Autonomous APs are configured one-by-one; <Term>lightweight</Term> APs are managed centrally by a <Term>WLC</Term> (wireless LAN controller).</>],
            ["Antennas", <>Omnidirectional spreads signal all around; directional (Yagi, parabolic) focuses it for point-to-point links.</>],
            ["Survey & placement", <>A site survey / heat map finds dead spots and interference before you mount APs.</>],
          ]} />

          <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
            <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Plan the channels (no overlap)</span></div>
            <ChannelPlanningPBQ />
          </div>

          <div className="flex flex-wrap gap-2">
            <Messer slug="wireless-technologies-n10-009">Wireless Technologies</Messer>
            <Messer slug="wireless-encryption-n10-009">Wireless Encryption</Messer>
          </div>
        </Section>

        {/* 2.4 PHYSICAL */}
        <Section id="obj-2-4">
          <SectionTitle objective="2.4" accent={D2}>Physical installations</SectionTitle>
          <P>
            Where gear physically lives matters. The <Term>MDF</Term> is the building&apos;s main equipment room; each floor or
            wing has an <Term>IDF</Term> wired back to it. Inside, everything mounts in racks measured in <Term>rack units (U)</Term>.
          </P>
          <DemoFrame title="Inside the rack" accent={D2}><RackDiagram /></DemoFrame>
          <DefList items={[
            ["Power: UPS vs PDU vs generator", <>A <Term>UPS</Term> is battery backup for short outages + surge protection; a <Term>PDU</Term> distributes power to each device; a generator covers long outages. Watch total power load and voltage.</>],
            ["Environmental", <>Control temperature and <Term>humidity</Term> (too dry = static, too humid = condensation), and plan <Term>fire suppression</Term> (clean agent, not water, over electronics).</>],
            ["Airflow", <>Align hot/cold aisles and respect port-side exhaust/intake so equipment doesn&apos;t overheat.</>],
            ["Cabling & security", <>Patch panels and fiber distribution panels keep runs tidy; lockable racks/rooms keep gear physically secure.</>],
          ]} />
          <div className="flex flex-wrap gap-2">
            <Messer slug="installing-networks-n10-009">Installing Networks</Messer>
            <Messer slug="power-n10-009">Power</Messer>
            <Messer slug="environmental-factors-n10-009">Environmental Factors</Messer>
          </div>
        </Section>

        {/* capstone PBQ */}
        <Section id="pbqs">
          <SectionTitle accent={D2} kicker="Performance-based">Capstone: spot the misconfiguration</SectionTitle>
          <P>A rotating, domain-wide troubleshooting challenge — the options are shuffled every time, so read carefully.</P>
          <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
            <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Diagnose the fault</span></div>
            <DiagnoseMisconfigPBQ />
          </div>
        </Section>

        {/* open questions */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-text">Open questions</h2>
            <p className="text-sm text-muted">Answer cold, then reveal. Score each red / amber / green.</p>
          </div>
          <div className="space-y-3">
            <QuestionCard id="d2-q1" objective="2.1" accent={D2} number={1}
              question={<>A router has two routes to a destination: <Mono>10.1.0.0/16</Mono> via OSPF and <Mono>10.1.1.0/24</Mono> via RIP. Which does it use to reach <Mono>10.1.1.5</Mono>, and why?</>}
              answer={<>The <Mono>/24</Mono> (RIP) route — longest prefix match wins before administrative distance even matters.</>}
              listenFor="Longest prefix first; AD only breaks ties at the same prefix length." />
            <QuestionCard id="d2-q2" objective="2.1" accent={D2} number={2}
              question={<>What is the difference between NAT and PAT?</>}
              answer={<>NAT maps private addresses to public ones (often 1:1). PAT maps many private hosts to a single public IP by tracking port numbers — what a home router does.</>}
              listenFor="PAT = many-to-one using ports; NAT = address translation generally." />
            <QuestionCard id="d2-q3" objective="2.1" accent={D2} number={3}
              question={<>What problem does an FHRP like VRRP or HSRP solve?</>}
              answer={<>Gateway redundancy — two routers share one virtual IP; if the active one fails, the standby takes over with no client reconfiguration.</>}
              listenFor="Redundant default gateway / virtual IP / automatic failover." />
            <QuestionCard id="d2-q4" objective="2.1" accent={D2} number={4}
              question={<>Static vs dynamic routing — when would you use each?</>}
              answer={<>Static for small, stable networks or a single default route (predictable, no overhead). Dynamic (OSPF/EIGRP/BGP) for larger networks that change, so routes update automatically.</>}
              listenFor="Static = small/manual/predictable; dynamic = scalable/auto-adapting." />
            <QuestionCard id="d2-q5" objective="2.2" accent={D2} number={5}
              question={<>Access port vs trunk port?</>}
              answer={<>An access port carries one VLAN to an endpoint. A trunk carries many VLANs between switches using 802.1Q tags (with one untagged native VLAN).</>}
              listenFor="One VLAN vs many + 802.1Q tagging + native VLAN." />
            <QuestionCard id="d2-q6" objective="2.2" accent={D2} number={6}
              question={<>What does STP do, and how is the root bridge chosen?</>}
              answer={<>It prevents switching loops by blocking redundant paths. The root is the switch with the lowest bridge ID — priority first, then lowest MAC address.</>}
              listenFor="Loop prevention; lowest priority then lowest MAC." />
            <QuestionCard id="d2-q7" objective="2.2" accent={D2} number={7}
              question={<>What is a native VLAN and why must it match across a trunk?</>}
              answer={<>The single untagged VLAN on a trunk. If the two ends disagree, untagged frames are placed into different VLANs on each side — a security and connectivity problem.</>}
              listenFor="Untagged VLAN on a trunk; mismatch = VLAN leak / STP warning." />
            <QuestionCard id="d2-q8" objective="2.2" accent={D2} number={8}
              question={<>A link is slow with CRC errors and late collisions. What is the likely cause?</>}
              answer={<>A duplex mismatch — one side full-duplex, the other half (often from one end auto-negotiating against a hard-set peer).</>}
              listenFor="Duplex mismatch; set both ends the same." />
            <QuestionCard id="d2-q9" objective="2.2" accent={D2} number={9}
              question={<>PoE vs PoE+ vs PoE++ — roughly how much power at the switch?</>}
              answer={<>PoE (802.3af) ~15 W, PoE+ (802.3at) ~30 W, PoE++ (802.3bt) ~60 W (Type 3) up to ~100 W (Type 4).</>}
              listenFor="~15 / ~30 / ~60–100 W and the 802.3af/at/bt names." />
            <QuestionCard id="d2-q10" objective="2.2" accent={D2} number={10}
              question={<>What does link aggregation (LACP) give you?</>}
              answer={<>Bundling multiple physical links into one logical link for more total bandwidth and redundancy if one link fails.</>}
              listenFor="More bandwidth + redundancy from bundled links." />
            <QuestionCard id="d2-q11" objective="2.3" accent={D2} number={11}
              question={<>Why are only channels 1, 6, and 11 recommended on 2.4 GHz?</>}
              answer={<>Each channel is ~22 MHz wide, so neighbors overlap. 1, 6, and 11 are the only three that don&apos;t overlap each other, avoiding interference.</>}
              listenFor="Channel width causes overlap; 1/6/11 are the non-overlapping set." />
            <QuestionCard id="d2-q12" objective="2.3" accent={D2} number={12}
              question={<>WPA2 vs WPA3, and PSK vs Enterprise?</>}
              answer={<>WPA3 is the newer, stronger standard (SAE). PSK uses one shared passphrase (home); Enterprise authenticates each user individually via 802.1X/RADIUS.</>}
              listenFor="WPA3 newer/stronger; PSK shared key vs Enterprise per-user 802.1X." />
            <QuestionCard id="d2-q13" objective="2.3" accent={D2} number={13}
              question={<>2.4 GHz vs 5 GHz — the trade-off?</>}
              answer={<>2.4 GHz travels farther and penetrates walls better but is slower and more congested. 5 GHz is faster with more channels but shorter range.</>}
              listenFor="Range/penetration vs speed/congestion." />
            <QuestionCard id="d2-q14" objective="2.3" accent={D2} number={14}
              question={<>Autonomous AP vs lightweight AP + WLC?</>}
              answer={<>Autonomous APs are each configured individually. Lightweight APs are managed centrally by a wireless LAN controller — push one config/policy to all of them.</>}
              listenFor="Individually managed vs centrally managed by a WLC." />
            <QuestionCard id="d2-q15" objective="2.4" accent={D2} number={15}
              question={<>What is the difference between an MDF and an IDF?</>}
              answer={<>The MDF is the building&apos;s main distribution frame (core gear, ISP demarc). IDFs are smaller closets on each floor/area that connect back to the MDF over a backbone.</>}
              listenFor="MDF = main/central; IDF = per-floor, uplinked to the MDF." />
            <QuestionCard id="d2-q16" objective="2.4" accent={D2} number={16}
              question={<>UPS vs PDU — what does each do?</>}
              answer={<>A UPS is battery backup that rides through short outages and protects from surges. A PDU distributes power to each device in the rack (a managed power strip).</>}
              listenFor="UPS = battery/backup/surge; PDU = power distribution." />
            <QuestionCard id="d2-q17" objective="2.4" accent={D2} number={17}
              question={<>Why does humidity matter in a server room?</>}
              answer={<>Too dry invites static discharge that can damage components; too humid risks condensation and corrosion. Keep it in a controlled range.</>}
              listenFor="Static (too dry) vs condensation/corrosion (too humid)." />
            <QuestionCard id="d2-q18" objective="2.2" accent={D2} number={18}
              question={<>A user in VLAN 20 cannot reach a server in VLAN 10, though both ports are correct and the trunk is up. What is needed?</>}
              answer={<>Inter-VLAN routing — a router or Layer 3 switch (router-on-a-stick subinterfaces, or an SVI per VLAN). VLANs are separate broadcast domains and need a Layer 3 device to talk.</>}
              listenFor="A router / L3 switch for inter-VLAN routing; VLANs = separate broadcast domains." />
          </div>
        </section>
      </Container>
    </>
  );
}
