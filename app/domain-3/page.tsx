import type { ReactNode } from "react";
import { domainBySlug } from "@/lib/domains";
import { DNS_RECORDS, DR_SITES, DR_METRICS } from "@/lib/domain3";
import DomainHeader from "@/components/DomainHeader";
import { Container, Section, SectionTitle, Callout, DemoFrame, Term, Mono } from "@/components/ui";
import QuestionCard from "@/components/QuestionCard";
import DoraAnimation from "@/components/domain3/DoraAnimation";
import DnsResolution from "@/components/domain3/DnsResolution";
import RtoRpoTimeline from "@/components/domain3/RtoRpoTimeline";
import SyslogSeverity from "@/components/domain3/SyslogSeverity";
import SnmpPollTrap from "@/components/domain3/SnmpPollTrap";
import AccessMethods from "@/components/domain3/AccessMethods";
import DhcpScopePBQ from "@/components/domain3/DhcpScopePBQ";
import DnsRecordsPBQ from "@/components/domain3/DnsRecordsPBQ";
import SyslogSeverityPBQ from "@/components/domain3/SyslogSeverityPBQ";
import DrObjectivesPBQ from "@/components/domain3/DrObjectivesPBQ";
import AccessMethodPBQ from "@/components/domain3/AccessMethodPBQ";

const domain = domainBySlug("domain-3")!;
const D3 = "var(--color-d3)";
const MESSER = "https://www.professormesser.com/network-plus/n10-009/n10-009-video/";

export const metadata = { title: `${domain.name} · Network+ Prep` };

function Messer({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <a href={`${MESSER}${slug}/`} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-text">
      <span style={{ color: D3 }}>▶</span> Messer: {children}
    </a>
  );
}
function P({ children }: { children: ReactNode }) { return <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>; }
function DefList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="my-3 space-y-2">
      {items.map(([t, d]) => (
        <div key={t} className="rounded-lg border border-line-soft bg-surface/40 px-3 py-2 text-sm">
          <dt className="font-semibold text-text">{t}</dt><dd className="mt-0.5 leading-relaxed text-muted">{d}</dd>
        </div>
      ))}
    </dl>
  );
}
function Analogy({ children }: { children: ReactNode }) {
  return (
    <div className="my-3 flex gap-2.5 rounded-lg border px-3 py-2.5 text-sm leading-relaxed text-muted"
      style={{ borderColor: "color-mix(in oklab, var(--color-d3) 30%, transparent)", backgroundColor: "color-mix(in oklab, var(--color-d3) 7%, transparent)" }}>
      <span aria-hidden>💡</span><span><span className="font-semibold text-text">Think of it like:</span> {children}</span>
    </div>
  );
}
function PbqBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--color-d3) 30%, var(--color-line))" }}>
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: D3, backgroundColor: "color-mix(in oklab, var(--color-d3) 16%, transparent)" }}>PBQ</span>
        <span className="font-semibold text-text">{title}</span>
      </div>
      {children}
    </div>
  );
}

const JUMP = [["obj-3-1", "3.1 Docs"], ["obj-3-2", "3.2 Monitoring"], ["obj-3-3", "3.3 DR"], ["obj-3-4", "3.4 Services"], ["obj-3-5", "3.5 Access"]];

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

        {/* 3.1 DOCS (clean - lighter) */}
        <Section id="obj-3-1">
          <SectionTitle objective="3.1" accent={D3} kicker="Network Operations">Processes &amp; documentation</SectionTitle>
          <Callout tone="tip" title="You already nailed this one">
            3.1 was one of your two clean objectives — so here&apos;s a tight refresher rather than a deep dive.
          </Callout>
          <DefList items={[
            ["Physical vs logical diagrams", <>A <Term>physical</Term> diagram shows the actual cabling, racks, and ports; a <Term>logical</Term> one shows IP subnets, VLANs, and traffic flow.</>],
            ["IPAM & asset inventory", <>IP Address Management tracks which addresses are used where; an asset inventory tracks the devices themselves (model, serial, location, lifecycle).</>],
            ["Change & configuration management", <>Changes go through review/approval (so nothing breaks silently); configuration management keeps known-good <Term>baselines</Term> and backups you can roll back to.</>],
            ["Life-cycle: EOL / EOS", <>End-of-Life = no more sales; End-of-Support = no more patches — a security risk you must plan to replace.</>],
            ["Policies", <>AUP (acceptable use), BYOD, password, and SLAs set the rules and the expected service levels.</>],
          ]} />
          <div className="flex flex-wrap gap-2">
            <Messer slug="network-documentation-n10-009">Network Documentation</Messer>
            <Messer slug="configuration-management-n10-009">Configuration Management</Messer>
          </div>
        </Section>

        {/* 3.2 MONITORING */}
        <Section id="obj-3-2">
          <SectionTitle objective="3.2" accent={D3}>Network monitoring</SectionTitle>
          <P>You can&apos;t fix what you can&apos;t see. Two pillars: <Term>SNMP</Term> for device metrics and <Term>syslog</Term> for event messages — usually funneled into a <Term>SIEM</Term> for correlation and alerting.</P>
          <Analogy>a hospital. Syslog severity is triage: a <span className="text-text">0 (Emergency)</span> is a code blue, a <span className="text-text">7 (Debug)</span> is a routine chart note — and confusingly, the <em>lower</em> number is the bigger emergency.</Analogy>
          <DemoFrame title="Syslog severity 0–7" accent={D3}><SyslogSeverity /></DemoFrame>
          <DemoFrame title="SNMP: polling vs traps" accent={D3}><SnmpPollTrap /></DemoFrame>
          <DefList items={[
            ["SNMP internals (MIB / OID / versions)", <>A <Term>MIB</Term> is the device&apos;s database of stats; each value has an <Term>OID</Term> (a numbered object identifier path). <Mono>v1</Mono>/<Mono>v2c</Mono> authenticate with a plaintext <Term>community string</Term> (often <Mono>public</Mono>/<Mono>private</Mono>); <Mono>v3</Mono> adds usernames, authentication, and encryption — always prefer v3.</>],
            ["SIEM", <>Collects logs from everywhere, correlates them, and alerts on patterns (e.g. many failed logins across hosts).</>],
            ["Flow data vs packet capture", <>Flow (NetFlow / sFlow / IPFIX) summarizes <em>who talked to whom, how much</em>; a packet capture records the actual bytes for deep analysis.</>],
            ["Port mirroring (SPAN)", <>Copies traffic from one switch port to another so a sniffer/IDS can watch it without being in-line.</>],
            ["Baselines & anomaly alerts", <>Record &ldquo;normal&rdquo; first; then alert when metrics drift from that baseline.</>],
          ]} />
          <PbqBox title="Triage the logs"><SyslogSeverityPBQ /></PbqBox>
          <div className="flex flex-wrap gap-2">
            <Messer slug="snmp-n10-009">SNMP</Messer>
            <Messer slug="logs-and-monitoring-n10-009">Logs &amp; Monitoring</Messer>
          </div>
        </Section>

        {/* 3.3 DR */}
        <Section id="obj-3-3">
          <SectionTitle objective="3.3" accent={D3}>Disaster recovery</SectionTitle>
          <P>DR planning is built on two numbers — how much data you can lose (<Term>RPO</Term>) and how long you can be down (<Term>RTO</Term>) — and the recovery site you pay for to hit them.</P>
          <Analogy>RPO is how many pages of your diary you can afford to lose since your last copy; RTO is how fast you must reopen the shop after it closes.</Analogy>
          <DemoFrame title="RPO vs RTO" accent={D3}><RtoRpoTimeline /></DemoFrame>
          <Analogy>a recovery site is a spare car: <span className="text-text">hot</span> = idling in the driveway (drive off instantly), <span className="text-text">warm</span> = parked in the garage (needs fuel and a minute), <span className="text-text">cold</span> = still at the dealership (days to acquire).</Analogy>
          <div className="overflow-hidden rounded-lg border border-line-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-faint"><tr><th className="px-3 py-2">Site</th><th className="px-3 py-2">Recovery</th><th className="px-3 py-2">Cost</th><th className="px-3 py-2">What it is</th></tr></thead>
              <tbody>
                {DR_SITES.map((s) => (
                  <tr key={s.name} className="border-t border-line-soft">
                    <td className="px-3 py-2 font-semibold text-text">{s.name}</td>
                    <td className="px-3 py-2 font-mono" style={{ color: D3 }}>{s.recovery}</td>
                    <td className="px-3 py-2 font-mono text-muted">{s.cost}</td>
                    <td className="px-3 py-2 text-muted">{s.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DefList items={DR_METRICS.map((m) => [`${m.abbr} — ${m.name}`, <>{m.meaning}</>] as [string, ReactNode])} />
          <Callout tone="info" title="Backup types">
            <span className="text-text">Full</span> = everything (slow, simple restore). <span className="text-text">Incremental</span> = only what changed since the last backup (fast backup, slower restore). <span className="text-text">Differential</span> = everything since the last full. The <span className="text-text">3-2-1 rule</span>: 3 copies, 2 media, 1 offsite.
          </Callout>
          <DefList items={[
            ["Active-passive vs active-active", <><Term>Active-passive</Term>: one device handles traffic while a synced standby waits to take over on failure. <Term>Active-active</Term>: both run and share the load — more capacity, but more complex to manage.</>],
            ["Testing the plan", <>A <Term>tabletop exercise</Term> talks a simulated disaster through on paper; <Term>validation tests</Term> actually exercise the failover — ideally without touching production.</>],
          ]} />
          <PbqBox title="Set the recovery objectives"><DrObjectivesPBQ /></PbqBox>
          <div className="flex flex-wrap gap-2">
            <Messer slug="disaster-recovery-n10-009">Disaster Recovery</Messer>
            <Messer slug="network-redundancy-n10-009">Network Redundancy</Messer>
          </div>
        </Section>

        {/* 3.4 SERVICES */}
        <Section id="obj-3-4">
          <SectionTitle objective="3.4" accent={D3}>IPv4 &amp; IPv6 services</SectionTitle>
          <P>The services that make a network usable: <Term>DHCP</Term> hands out addresses, <Term>DNS</Term> turns names into addresses, and <Term>NTP</Term> keeps clocks in sync.</P>
          <Analogy>DHCP is a hotel front desk handing out room numbers — your <Term>lease</Term> is your stay, a <Term>reservation</Term> is &ldquo;always give me room 50,&rdquo; and an <Term>exclusion</Term> is rooms kept for staff. DNS is directory assistance: you give a name, it gives back the number.</Analogy>
          <DemoFrame title="DHCP: the DORA exchange" accent={D3}><DoraAnimation /></DemoFrame>
          <DefList items={[
            ["Scope, pool, lease", <>The <Term>scope</Term> is the range a server hands out; the <Term>lease</Term> is how long a client keeps its address before renewing.</>],
            ["Reservation vs exclusion", <>A <Term>reservation</Term> ties an address to a device&apos;s MAC; an <Term>exclusion</Term> holds addresses back from the pool (for static gear).</>],
            ["Relay / IP helper", <>DHCP Discover is a broadcast routers don&apos;t forward — an <Term>IP helper</Term> on the router relays it to a DHCP server on another subnet.</>],
            ["Lease renewal (T1 / T2)", <>A client renews at <Mono>T1</Mono> = 50% of the lease (to its own server); if that fails it broadcasts to <em>any</em> server at <Mono>T2</Mono> = 87.5%.</>],
          ]} />
          <DemoFrame title="DNS: how a name resolves" accent={D3}><DnsResolution /></DemoFrame>
          <div className="overflow-hidden rounded-lg border border-line-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-faint"><tr><th className="px-3 py-2">Record</th><th className="px-3 py-2">Purpose</th><th className="px-3 py-2">Example</th></tr></thead>
              <tbody>
                {DNS_RECORDS.map((r) => (
                  <tr key={r.type} className="border-t border-line-soft">
                    <td className="px-3 py-2 font-mono font-bold" style={{ color: D3 }}>{r.type}</td>
                    <td className="px-3 py-2 text-muted">{r.purpose}</td>
                    <td className="px-3 py-2 font-mono text-xs text-faint">{r.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>Two more DNS things the exam tests — how a name resolves, and how DNS is secured:</P>
          <DefList items={[
            ["Recursive vs authoritative", <>A <Term>recursive resolver</Term> does the legwork (root → TLD → authoritative) and caches the answer; the <Term>authoritative</Term> server holds the real records (the demo above walks this). <Term>Forward</Term> lookup = name→IP; <Term>reverse</Term> = IP→name (PTR).</>],
            ["Encrypted DNS: DoT / DoH", <><Term>DoT</Term> = DNS over TLS on <Mono>tcp/853</Mono>; <Term>DoH</Term> = DNS over HTTPS on <Mono>tcp/443</Mono> (looks like ordinary web traffic). Both hide the plaintext <Mono>udp/53</Mono> lookups.</>],
            ["DNSSEC", <>Digitally signs DNS records so a forged or spoofed answer is detected — integrity, not encryption.</>],
          ]} />
          <P>And the services that keep time and auto-address IPv6:</P>
          <DefList items={[
            ["NTP & stratum", <><Term>NTP</Term> syncs clocks on <Mono>udp/123</Mono>. <Term>Stratum</Term> = distance from the reference clock: stratum 0 is the atomic/GPS source, 1 is directly attached, higher is further away. <Term>NTS</Term> adds authentication so the time source can be trusted. Accurate time is critical for logs, certificates, and Kerberos.</>],
            ["PTP", <><Term>Precision Time Protocol</Term> (IEEE 1588) is hardware-based and sub-microsecond — for finance and industrial gear where NTP&apos;s milliseconds aren&apos;t precise enough.</>],
            ["IPv6 autoconfig: SLAAC", <>IPv6 hosts self-assign with <Term>SLAAC</Term> using <Term>NDP</Term> (Router Solicitation/Advertisement) — no DHCP needed — then run <Term>DAD</Term> (Duplicate Address Detection) to confirm the address is unique.</>],
          ]} />
          <div className="space-y-4">
            <PbqBox title="Size & fix the DHCP scope"><DhcpScopePBQ /></PbqBox>
            <PbqBox title="Pick the right DNS records"><DnsRecordsPBQ /></PbqBox>
          </div>
          <div className="flex flex-wrap gap-2">
            <Messer slug="configuring-dhcp-n10-009">Configuring DHCP</Messer>
            <Messer slug="dns-records-n10-009">DNS Records</Messer>
            <Messer slug="time-protocols-n10-009">Time Protocols</Messer>
          </div>
        </Section>

        {/* 3.5 ACCESS */}
        <Section id="obj-3-5">
          <SectionTitle objective="3.5" accent={D3}>Access &amp; management methods</SectionTitle>
          <P>How you reach gear to manage it — and how that path is secured — matters as much as the config itself.</P>
          <Analogy>out-of-band management is the building&apos;s maintenance entrance: when the front doors (production network) are jammed, you can still get in. A <Term>jump box</Term> is a guarded lobby everyone must pass through to reach the secure floor.</Analogy>
          <DemoFrame title="In-band vs out-of-band · full vs split tunnel" accent={D3}><AccessMethods /></DemoFrame>
          <DefList items={[
            ["In-band vs out-of-band", <>In-band manages over the normal network (SSH to its IP); out-of-band uses a separate path (console, dedicated mgmt port, cellular) that survives an outage.</>],
            ["VPN types", <><Term>Site-to-site</Term> links whole offices always-on; <Term>client-to-site</Term> (remote access) is for individual users; <Term>clientless</Term> runs in a browser over TLS.</>],
            ["Remote CLI & GUI tools", <>Prefer <Term>SSH</Term> (encrypted, <Mono>tcp/22</Mono>) over <Term>Telnet</Term> (cleartext, <Mono>23</Mono>) for a command line. For a remote desktop use <Term>RDP</Term> (Windows, <Mono>3389</Mono>) or <Term>VNC</Term> (cross-platform, the RFB protocol). A <Term>console</Term> (serial/USB) is the always-available last resort.</>],
            ["Jump box & API management", <>A <Term>jump box / bastion</Term> is the single hardened, audited entry point into a protected segment. At scale, config is increasingly pushed through <Term>REST APIs</Term> instead of logging into each device by hand.</>],
          ]} />
          <PbqBox title="Choose the access method"><AccessMethodPBQ /></PbqBox>
          <div className="flex flex-wrap gap-2">
            <Messer slug="vpns-n10-009">VPNs</Messer>
            <Messer slug="remote-access-n10-009">Remote Access</Messer>
          </div>
        </Section>

        {/* open questions */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-text">Open questions</h2>
            <p className="text-sm text-muted">Answer cold, then reveal. Score each red / amber / green.</p>
          </div>
          <div className="space-y-3">
            <QuestionCard id="d3-q1" objective="3.1" accent={D3} number={1}
              question={<>Physical vs logical network diagram — what does each show?</>}
              answer={<>Physical = the real cabling, racks, devices, and ports. Logical = the IP subnets, VLANs, and how traffic flows — independent of where cables run.</>}
              listenFor="Cabling/hardware vs subnets/VLANs/flow." />
            <QuestionCard id="d3-q2" objective="3.1" accent={D3} number={2}
              question={<>Why have a formal change-management process?</>}
              answer={<>So changes are reviewed, approved, documented, and reversible — preventing unplanned outages and giving you a known-good baseline to roll back to.</>}
              listenFor="Review/approval, documentation, rollback / avoid breakage." />
            <QuestionCard id="d3-q3" objective="3.2" accent={D3} number={3}
              question={<>SNMP polling vs traps — what&apos;s the difference?</>}
              answer={<>Polling: the manager asks devices for stats on a schedule. Traps: a device pushes an alert the instant an event happens. Polling for routine metrics, traps for immediate problems.</>}
              listenFor="Manager-pull-scheduled vs device-push-on-event." />
            <QuestionCard id="d3-q4" objective="3.2" accent={D3} number={4}
              question={<>Syslog severity runs 0–7 — which end is most urgent, and what are the extremes?</>}
              answer={<>Lower is more urgent: 0 = Emergency (system unusable), 7 = Debug (verbose noise).</>}
              listenFor="Lower = worse; 0 Emergency, 7 Debug." />
            <QuestionCard id="d3-q5" objective="3.2" accent={D3} number={5}
              question={<>What is a SIEM, and what does port mirroring (SPAN) do?</>}
              answer={<>A SIEM aggregates and correlates logs from many sources and alerts on patterns. Port mirroring copies a port&apos;s traffic to another port so a sniffer or IDS can analyze it out-of-line.</>}
              listenFor="SIEM = log correlation/alerting; SPAN = copy traffic for monitoring." />
            <QuestionCard id="d3-q6" objective="3.3" accent={D3} number={6}
              question={<>RPO vs RTO — what does each define?</>}
              answer={<>RPO = the maximum data you can lose (how far back to the last backup) — it drives backup frequency. RTO = the maximum downtime you can tolerate (how fast you must be back up).</>}
              listenFor="RPO = data loss/backup frequency; RTO = downtime/recovery speed." />
            <QuestionCard id="d3-q7" objective="3.3" accent={D3} number={7}
              question={<>Hot vs warm vs cold site?</>}
              answer={<>Hot = fully running replica, near-instant failover, most expensive. Warm = hardware ready, restore recent data, hours. Cold = empty space, ship in gear and restore, days, cheapest.</>}
              listenFor="Recovery speed and cost trade-off across the three." />
            <QuestionCard id="d3-q8" objective="3.3" accent={D3} number={8}
              question={<>What do MTTR and MTBF measure?</>}
              answer={<>MTTR = mean time to repair (how long to fix a failure). MTBF = mean time between failures (how long it runs before failing — reliability).</>}
              listenFor="Repair time vs uptime-between-failures." />
            <QuestionCard id="d3-q9" objective="3.4" accent={D3} number={9}
              question={<>Walk me through the DHCP DORA exchange.</>}
              answer={<>Discover (client broadcasts looking for a server) → Offer (server offers an address) → Request (client asks for that one) → Acknowledge (server confirms and records the lease).</>}
              listenFor="The four steps in order and who sends each." />
            <QuestionCard id="d3-q10" objective="3.4" accent={D3} number={10}
              question={<>Why do remote-subnet clients need a DHCP relay / IP helper?</>}
              answer={<>DHCP Discover is a broadcast, and routers don&apos;t forward broadcasts. An IP helper on the router relays the request to a DHCP server on another subnet.</>}
              listenFor="Broadcasts don&apos;t cross routers; relay forwards to the server." />
            <QuestionCard id="d3-q11" objective="3.4" accent={D3} number={11}
              question={<>A record vs CNAME vs MX?</>}
              answer={<>A = name → IPv4. CNAME = an alias pointing one name to another name. MX = the mail server for a domain (with a priority).</>}
              listenFor="Address vs alias vs mail." />
            <QuestionCard id="d3-q12" objective="3.4" accent={D3} number={12}
              question={<>Recursive resolver vs authoritative server?</>}
              answer={<>A recursive resolver does the legwork (asking root → TLD → authoritative) and caches the result. The authoritative server actually holds the records for the domain.</>}
              listenFor="Does-the-lookup-for-you vs holds-the-real-answer." />
            <QuestionCard id="d3-q13" objective="3.4" accent={D3} number={13}
              question={<>What does NTP do and why does accurate time matter?</>}
              answer={<>NTP synchronizes clocks across devices. Accurate time is critical for correlating logs, validating certificates, and Kerberos authentication.</>}
              listenFor="Time sync; logs/certs/Kerberos depend on it." />
            <QuestionCard id="d3-q14" objective="3.5" accent={D3} number={14}
              question={<>In-band vs out-of-band management?</>}
              answer={<>In-band manages over the production network (e.g. SSH to the device&apos;s IP). Out-of-band uses a separate path (console, dedicated mgmt port, cellular) that still works when the network is down.</>}
              listenFor="Same network vs separate path that survives an outage." />
            <QuestionCard id="d3-q15" objective="3.5" accent={D3} number={15}
              question={<>Site-to-site vs client-to-site VPN?</>}
              answer={<>Site-to-site connects whole networks (office to office) always-on. Client-to-site (remote access) connects an individual user's device into the network.</>}
              listenFor="Network-to-network vs single user." />
            <QuestionCard id="d3-q16" objective="3.5" accent={D3} number={16}
              question={<>Full tunnel vs split tunnel?</>}
              answer={<>Full tunnel sends all traffic through the VPN (secure, inspectable, slower). Split tunnel sends only corporate traffic through the VPN and the rest directly out (faster, less protected).</>}
              listenFor="All traffic vs only-corporate; security vs performance." />
            <QuestionCard id="d3-q17" objective="3.5" accent={D3} number={17}
              question={<>Why use a jump box (bastion host)?</>}
              answer={<>It&apos;s a single hardened, logged entry point into a protected segment — instead of exposing many servers, everyone connects through the one audited box.</>}
              listenFor="Single audited choke point into a secure segment." />
          </div>
        </section>
      </Container>
    </>
  );
}
