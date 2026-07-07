import type { ReactNode } from "react";
import { domainBySlug } from "@/lib/domains";
import { ROUTING_PROTOCOLS, WIFI_STANDARDS, POE_STANDARDS } from "@/lib/domain2";
import DomainHeader from "@/components/DomainHeader";
import { Container, Section, SectionTitle, Callout, DemoFrame, Term, Mono } from "@/components/ui";
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
function Analogy({ children }: { children: ReactNode }) {
  return (
    <div className="my-3 flex gap-2.5 rounded-lg border px-3 py-2.5 text-sm leading-relaxed text-muted"
      style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, transparent)", backgroundColor: "color-mix(in oklab, var(--color-d2) 7%, transparent)" }}>
      <span aria-hidden>💡</span>
      <span><span className="font-semibold text-text">Think of it like:</span> {children}</span>
    </div>
  );
}
/** A labelled sub-section with a one-line "why it matters" — used to break a dense objective into digestible blocks. */
function Block({ label, title, why, children }: { label: string; title: string; why: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line-soft bg-surface/30 p-4 sm:p-5">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="rounded-md px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: D2, backgroundColor: "color-mix(in oklab, var(--color-d2) 14%, transparent)" }}>{label}</span>
        <h3 className="text-base font-semibold text-text">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted"><span className="font-medium text-text">Why it matters:</span> {why}</p>
      {children}
    </div>
  );
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
          <Analogy>
            asking for directions. &ldquo;123 Main St&rdquo; (a <Mono>/24</Mono>) is more specific than &ldquo;that
            neighborhood&rdquo; (a <Mono>/16</Mono>), so the router follows the exact address. Administrative distance is
            like trusting your GPS over a stranger when the two give conflicting directions.
          </Analogy>
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
            ["NAT types (static / dynamic / PAT)", <><Term>Static NAT</Term> = a permanent 1:1 private↔public mapping (to reach an internal server from outside). <Term>Dynamic NAT</Term> = a pool of public IPs handed out as needed. <Term>PAT</Term> (NAT overload — what home routers do) = many private hosts share <em>one</em> public IP, kept apart by port numbers.</>],
            ["FHRP (VRRP / HSRP / GLBP)", <>Routers share one <Term>virtual IP</Term> as the gateway; if the active one dies, a standby takes over instantly — no client change. <Mono>VRRP</Mono> is the open standard; <Mono>HSRP</Mono>/<Mono>GLBP</Mono> are Cisco. Like two backup generators on one outlet: the standby kicks in and nobody notices.</>],
            ["Subinterfaces", <>One physical router port split into logical interfaces (one per VLAN) — &ldquo;router-on-a-stick&rdquo; inter-VLAN routing.</>],
            ["QoS & traffic shaping", <>Mark and prioritize traffic (voice/video over bulk downloads) and cap rates so latency-sensitive apps stay smooth.</>],
          ]} />
          <Analogy>
            an office switchboard. Everyone inside shares one public phone number, and the receptionist tracks
            extensions (port numbers) so each reply gets routed back to the right desk.
          </Analogy>
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
            Switches move frames <span className="text-text">within</span> a network. This objective is big, so take it in three
            blocks: carve one switch into separate networks (<span className="text-text">VLANs</span>), keep those networks
            loop-free (<span className="text-text">Spanning Tree</span>), then tune the physical ports
            (<span className="text-text">speed/duplex, MTU, LACP, PoE</span>).
          </P>

          <div className="space-y-5">
            {/* Block A — VLANs */}
            <Block label="A" title="VLANs & trunking" why={<>VLANs split one physical switch into several isolated networks (separate broadcast domains) — the foundation for keeping departments, voice, and guests apart.</>}>
              <Analogy>
                one office building split into departments with keycard doors. Same building (one switch), but HR can&apos;t
                wander into Finance without going through a controlled route (a router). A <Term>trunk</Term> is the elevator
                that carries people from every floor at once — each tagged with the floor they belong to.
              </Analogy>
              <DemoFrame title="VLANs, trunks & who can talk to whom" accent={D2}><VlanTrunkLab /></DemoFrame>
              <DefList items={[
                ["Access port vs trunk port", <>An <Term>access port</Term> carries exactly one VLAN to an endpoint. A <Term>trunk</Term> carries many VLANs between switches, tagging each frame with <Mono>802.1Q</Mono>.</>],
                ["VLAN IDs", <>The 802.1Q tag is 12 bits → <Mono>1–4094</Mono> usable (0 and 4095 are reserved). Every port starts in the default <Mono>VLAN 1</Mono>.</>],
                ["Native VLAN (exam favorite)", <>The one <em>untagged</em> VLAN on a trunk. It must match on both ends — if one side is native 1 and the other native 99, untagged frames land in the wrong VLAN: a connectivity bug and a <Term>VLAN-hopping</Term> security risk.</>],
                ["Voice VLAN", <>A phone port can carry two VLANs at once — an untagged <Term>data</Term> VLAN for a daisy-chained PC plus a tagged <Term>voice</Term> VLAN — so voice is separated and prioritized.</>],
              ]} />
              <Callout tone="exam" title="Inter-VLAN routing — why a switch alone isn't enough">
                VLANs are <em>separate broadcast domains</em>, so VLAN 10 can&apos;t reach VLAN 20 by switching — it needs a
                Layer 3 hop. Either <Term>router-on-a-stick</Term> (one trunk to a router, a <Mono>subinterface</Mono> per VLAN)
                or a <Term>Layer 3 switch</Term> using a <Term>switched virtual interface (SVI)</Term> — a virtual gateway IP for
                each VLAN, configured inside the switch itself.
              </Callout>
              <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
                <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Configure the switchports + fix inter-VLAN</span></div>
                <VlanPBQ />
              </div>
            </Block>

            {/* Block B — STP */}
            <Block label="B" title="Spanning Tree (STP / RSTP)" why={<>Two switches cabled in a loop flood frames forever — there&apos;s no TTL at Layer 2. STP blocks redundant links so a loop can&apos;t form, then re-opens them if a link fails.</>}>
              <Analogy>
                a road grid with backup roads. To stop cars looping forever, the network elects one main hub (the <Term>root
                bridge</Term>) and temporarily closes a redundant road (blocks a port) — held on standby to reopen the moment a
                main road fails.
              </Analogy>
              <DemoFrame title="Elect the root bridge" accent={D2}><StpVisualizer /></DemoFrame>
              <P>
                The <Term>root bridge</Term> is the switch with the lowest <Term>bridge ID</Term> — priority first (default
                <Mono>32768</Mono>), then lowest MAC as the tie-breaker. On any redundant link, the switch with the
                <em> worse</em> bridge ID loses and puts its end into <Mono>Blocking</Mono> — that&apos;s the port the demo marks
                with ✕.
              </P>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-line-soft bg-surface/40 p-3 text-sm">
                  <div className="mb-1 font-semibold text-text">Port states <span className="font-normal text-faint">— what it&apos;s doing</span></div>
                  <p className="leading-relaxed text-muted">Blocking → Listening → Learning → Forwarding. RSTP (802.1w) collapses these to Discarding / Learning / Forwarding for ~sub-second convergence vs classic STP&apos;s ~30–50 s.</p>
                </div>
                <div className="rounded-lg border border-line-soft bg-surface/40 p-3 text-sm">
                  <div className="mb-1 font-semibold text-text">Port roles <span className="font-normal text-faint">— its job in the tree</span></div>
                  <p className="leading-relaxed text-muted"><Term>Root port</Term> = best path toward the root. <Term>Designated port</Term> = the forwarding port on a segment. <Term>Blocked/alternate</Term> = the backup held down to break the loop.</p>
                </div>
              </div>
              <P>Three edge-port features everyone mixes up — keep them straight:</P>
              <div className="overflow-hidden rounded-lg border border-line-soft">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-2 text-xs text-faint"><tr><th className="px-3 py-2">Feature</th><th className="px-3 py-2">What it does</th><th className="px-3 py-2">Use on</th></tr></thead>
                  <tbody>
                    <tr className="border-t border-line-soft"><td className="px-3 py-2 font-semibold text-text">PortFast</td><td className="px-3 py-2 text-muted">Skips listening/learning so the port forwards instantly</td><td className="px-3 py-2 text-muted">Access ports (PCs, phones)</td></tr>
                    <tr className="border-t border-line-soft"><td className="px-3 py-2 font-semibold text-text">BPDU Guard</td><td className="px-3 py-2 text-muted">Err-disables a PortFast port the instant it receives a BPDU (rogue switch)</td><td className="px-3 py-2 text-muted">Access ports</td></tr>
                    <tr className="border-t border-line-soft"><td className="px-3 py-2 font-semibold text-text">Root Guard</td><td className="px-3 py-2 text-muted">Blocks a port if a downstream switch tries to become root</td><td className="px-3 py-2 text-muted">Ports toward other switches</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
                <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Find the root bridge &amp; the blocked port</span></div>
                <StpElectionPBQ />
              </div>
            </Block>

            {/* Block C — Interfaces & Power */}
            <Block label="C" title="Interface settings & PoE" why={<>With VLANs and STP correct, most remaining switch faults are physical-port settings: a duplex mismatch, an MTU mismatch, or an over-budget PoE switch.</>}>
              <DefList items={[
                ["Speed & duplex", <>Negotiated to <Mono>10 / 100 / 1000 / 10G</Mono> and half/full. Both ends must agree — a <Term>duplex mismatch</Term> (one full, one half, usually one side hard-set against an auto peer) causes late collisions, CRC errors, and crawling throughput. Set both ends the same (ideally both auto).</>],
                ["Link aggregation (LACP)", <>Bundle several physical links into one logical link for more bandwidth and redundancy if one fails.</>],
                ["MTU / jumbo frames", <>Default MTU is <Mono>1500</Mono> bytes; <Term>jumbo frames</Term> (~9000) boost storage/backup throughput but must be enabled end-to-end — one 1500-byte hop in the path breaks large transfers.</>],
              ]} />
              <P><Term>Power over Ethernet</Term> delivers power and data over one cable — but the switch has a finite power budget the connected devices must stay under:</P>
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
              <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d2) 30%, var(--color-line))" }}>
                <div className="mb-2 flex items-center gap-2"><PbqBadge /><span className="font-semibold text-text">Will the PoE budget hold?</span></div>
                <PoeBudgetPBQ />
              </div>
            </Block>
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
            Wireless networking connects devices with radio waves instead of cables — so every nearby access point shares the
            same airspace, and the whole game is picking a <span className="text-text">frequency band</span> and{" "}
            <span className="text-text">channel</span> that don&apos;t collide with the neighbors. Wi-Fi runs on{" "}
            <Term>2.4 GHz</Term> (farther reach, more interference, slower), <Term>5 GHz</Term> (faster, shorter range), and{" "}
            <Term>6 GHz</Term> (the newest band — lots of clean, uncrowded spectrum).
          </P>
          <P>
            Each Wi-Fi generation is really an <Mono>802.11</Mono> standard; the generation names are just the exam shortcut —{" "}
            <Mono>n</Mono> = Wi-Fi 4, <Mono>ac</Mono> = Wi-Fi 5, <Mono>ax</Mono> = Wi-Fi 6/6E, <Mono>be</Mono> = Wi-Fi 7.
            Know the standards:
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
          <Analogy>
            radio stations. Two stations broadcasting on frequencies too close together garble each other —
            channels 1, 6, and 11 are spaced far enough apart to stay crisp.
          </Analogy>
          <DemoFrame title="2.4 GHz channel overlap" accent={D2}><ChannelOverlapChart /></DemoFrame>
          <DefList items={[
            ["SSID / BSSID / ESSID", <>SSID = the network name; BSSID = a specific AP&apos;s radio MAC; ESSID = the same SSID shared across many APs for seamless roaming.</>],
            ["Channel width", <><Mono>20 / 40 / 80 / 160 MHz</Mono> — wider channels carry more speed but leave fewer non-overlapping options and pick up more interference. 2.4 GHz realistically sticks to 20 MHz.</>],
            ["Band steering", <>Nudges dual-band clients onto the less-congested band (usually 5 or 6 GHz) instead of camping on crowded 2.4 GHz.</>],
            ["Security: WPA2 vs WPA3", <>WPA2 encrypts with <Term>AES-CCMP</Term>; WPA3 uses <Term>AES-GCMP</Term> plus the <Term>SAE</Term> handshake (kills WPA2&apos;s offline password guessing). <Term>PSK</Term> = one shared password (home); <Term>Enterprise</Term> = per-user logins via 802.1X/RADIUS.</>],
            ["AP types", <>Autonomous APs are configured one-by-one; <Term>lightweight</Term> APs are managed centrally by a <Term>WLC</Term> (wireless LAN controller) over <Mono>CAPWAP</Mono> (the AP-to-controller protocol).</>],
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
            This objective is the physical side of a network install — where the equipment lives, how it&apos;s powered, and
            how the room is kept alive. Gear is concentrated in wiring rooms: the <Term>MDF</Term> is the building&apos;s main
            equipment room, and each floor or wing has an <Term>IDF</Term> wired back to it. Inside, everything mounts in racks
            measured in <Term>rack units (U)</Term>.
          </P>
          <DemoFrame title="Inside the rack" accent={D2}><RackDiagram /></DemoFrame>
          <DefList items={[
            ["Racks & rack units", <>Gear is <Mono>19″</Mono> wide and measured in <Term>rack units</Term> — <Mono>1U = 1.75″</Mono>, a full rack commonly <Mono>42U</Mono>. Plan U-height and depth before buying.</>],
            ["Power: UPS / PDU / generator", <>A <Term>UPS</Term> is battery backup for short outages + surge/sag protection (offline, line-interactive, or online/double-conversion); a <Term>PDU</Term> distributes power to each device in the rack; a <Term>generator</Term> covers long outages. Load math: <Mono>watts = volts × amps</Mono>, and supplies convert AC → DC.</>],
            ["Environmental ranges", <>Keep the room ~<Mono>64–81°F</Mono> (18–27°C) and <Mono>40–60%</Mono> humidity — too dry invites static discharge, too humid invites condensation/corrosion. Use clean-agent <Term>fire suppression</Term> (not water) over electronics.</>],
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
