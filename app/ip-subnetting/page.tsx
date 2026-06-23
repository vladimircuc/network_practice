import type { ReactNode } from "react";
import { Container, Section, SectionTitle, Callout, DemoFrame, Term, Mono } from "@/components/ui";
import QuestionCard from "@/components/QuestionCard";
import IpAnatomy from "@/components/subnet/IpAnatomy";
import BinaryOctetTrainer from "@/components/subnet/BinaryOctetTrainer";
import CidrSlider from "@/components/subnet/CidrSlider";
import SubnetVisualizer from "@/components/subnet/SubnetVisualizer";
import SubnetSplitter from "@/components/subnet/SubnetSplitter";
import MagicNumberWalkthrough from "@/components/subnet/MagicNumberWalkthrough";
import IpClassifier from "@/components/subnet/IpClassifier";
import SubnetPractice from "@/components/subnet/SubnetPractice";
import SubnetDesignPBQ from "@/components/subnet/SubnetDesignPBQ";

const LAB = "var(--color-lab)";

export const metadata = { title: "IP & Subnetting (from scratch) · Network+ Prep" };

const CHAPTERS = [
  { id: "ch-ip", n: 0, t: "What an IP address is" },
  { id: "ch-binary", n: 1, t: "Binary, from zero" },
  { id: "ch-mask", n: 2, t: "The mask & the slash" },
  { id: "ch-derive", n: 3, t: "The four numbers" },
  { id: "ch-slice", n: 4, t: "Slicing networks" },
  { id: "ch-ranges", n: 5, t: "Special ranges" },
  { id: "ch-practice", n: 6, t: "Practice" },
  { id: "ch-exam", n: 7, t: "Exam-style" },
];

function Messer({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-text"
    >
      <span style={{ color: LAB }}>▶</span> Messer: {children}
    </a>
  );
}

export default function IpSubnettingLab() {
  return (
    <Container className="space-y-12">
      {/* hero */}
      <section className="space-y-4">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ color: LAB, backgroundColor: "color-mix(in oklab, var(--color-lab) 14%, transparent)" }}
        >
          <span className="font-mono">/</span> Deep dive · maps to objective 1.7
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          IP addressing &amp; subnetting — <span style={{ color: LAB }}>from scratch</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          The numbers, the slashes, the masks, the host counts — all of it, built up one layer
          at a time. Every idea here has a widget you can poke at. The goal is not to memorize
          formulas; it is to <span className="font-semibold text-text">see the pattern until
          it becomes automatic</span>. Work top to bottom, then live in the Practice section.
        </p>

        {/* chapter index */}
        <div className="flex flex-wrap gap-2 pt-2">
          {CHAPTERS.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/50 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-text"
            >
              <span className="font-mono font-bold" style={{ color: LAB }}>{c.n}</span>
              {c.t}
            </a>
          ))}
        </div>
      </section>

      {/* 0 — what an IP is */}
      <Section id="ch-ip">
        <SectionTitle kicker="Chapter 0" accent={LAB}>What an IP address actually is</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          An IP address is just a device&apos;s address on a network — like a street address tells
          the mail where to go. IPv4 writes it as four numbers (<Mono>192.168.1.10</Mono>), but the
          computer only sees <Term>32 ones and zeros</Term>. Those four numbers are just a
          human-friendly way to write the bits. Tap through a few:
        </p>
        <DemoFrame title="One address → 4 octets → 32 bits" accent={LAB}>
          <IpAnatomy />
        </DemoFrame>
      </Section>

      {/* 1 — binary */}
      <Section id="ch-binary">
        <SectionTitle kicker="Chapter 1" accent={LAB}>Binary, from zero</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          Each octet is 8 bits. Every bit is a switch with a <Term>place value</Term>:
          128, 64, 32, 16, 8, 4, 2, 1. Turn switches on and add up their values — that is the
          decimal number. All eight on = 255; all off = 0. That is the whole reason an octet
          only goes 0–255. Flip bits until this feels obvious, then try Practice mode.
        </p>
        <DemoFrame title="Binary octet trainer" caption="Explore freely, then switch to Practice to hit a target number." accent={LAB}>
          <BinaryOctetTrainer />
        </DemoFrame>
        <div className="mt-3"><Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/binary-math-n10-009/">Binary Math</Messer></div>
      </Section>

      {/* 2 — mask & slash */}
      <Section id="ch-mask">
        <SectionTitle kicker="Chapter 2" accent={LAB}>The subnet mask &amp; the slash (/)</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          Every address splits into two parts: the <Term>network</Term> part (which network you are
          on) and the <Term>host</Term> part (which device). The <Term>subnet mask</Term> marks the
          split — its <Mono>1</Mono> bits are network, its <Mono>0</Mono> bits are host. The slash,
          like <Mono>/24</Mono>, is just shorthand for <span className="font-semibold text-text">how
          many network bits there are</span>. Drag the slider and watch the bits change color:
        </p>
        <DemoFrame title="Drag the slash: /0 → /32" accent={LAB}>
          <CidrSlider />
        </DemoFrame>
        <Callout tone="tip" title="The one sentence to remember">
          The slash is a <span className="text-text">count of network bits</span>. More network bits
          = more, smaller subnets. Fewer = fewer, bigger subnets. Network bits + host bits always = 32.
        </Callout>
        <div className="flex flex-wrap gap-2">
          <Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/ipv4-subnet-masks-n10-009/">IPv4 Subnet Masks</Messer>
          <Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/ipv4-addressing-n10-009/">IPv4 Addressing</Messer>
        </div>
      </Section>

      {/* 3 — the four numbers */}
      <Section id="ch-derive">
        <SectionTitle kicker="Chapter 3" accent={LAB}>The four numbers you can derive</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          Once you know the mask, four facts fall out of any address. Set <Term>all host bits to 0</Term> →
          the <Term>network address</Term> (the name of the subnet). Set <Term>all host bits to 1</Term> →
          the <Term>broadcast address</Term> (the last one, talks to everyone). Everything between them
          is usable — the <Term>first host</Term> is network + 1, the <Term>last host</Term> is broadcast − 1.
          Usable count is <Mono>2ⁿ − 2</Mono> (we lose the network and broadcast). Change the IP and slash
          and watch all four move:
        </p>
        <DemoFrame title="Subnet visualizer" caption="The binary panel shows exactly where the network/broadcast come from." accent={LAB}>
          <SubnetVisualizer />
        </DemoFrame>
        <Callout tone="warn" title="Why minus two?">
          The network address and broadcast address can never be assigned to a device, so usable hosts
          is always <span className="text-text">2ⁿ − 2</span>. A /24 has 256 addresses → 254 usable.
        </Callout>
        <div className="mt-1"><Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/calculating-ipv4-subnets-and-hosts-n10-009/">Calculating Subnets &amp; Hosts</Messer></div>
      </Section>

      {/* 4 — slicing */}
      <Section id="ch-slice">
        <SectionTitle kicker="Chapter 4" accent={LAB}>Subnetting = slicing a network into smaller ones</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          Subnetting is splitting one big network into several smaller, equal blocks — like dividing an
          office building into floors. You <Term>borrow host bits</Term> to make subnets: borrow 1 bit → 2
          subnets, 2 bits → 4, 3 bits → 8 (it is <Mono>2ˢ</Mono>). Take a /24 and slice it below:
        </p>
        <DemoFrame title="Subnet splitter" caption="Each slice is one subnet. Watch how the block size sets where each one starts." accent={LAB}>
          <SubnetSplitter />
        </DemoFrame>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          The fast way to find <span className="text-text">which</span> subnet an address belongs to is the
          <Term> magic-number / block-size method</Term>: block size = <Mono>256 − the interesting mask octet</Mono>,
          then count by that block. Step through it:
        </p>
        <DemoFrame title="Magic-number method — step by step" accent={LAB}>
          <MagicNumberWalkthrough />
        </DemoFrame>
        <div className="flex flex-wrap gap-2">
          <Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/magic-number-subnetting-n10-009/">Magic Number Subnetting</Messer>
          <Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/seven-second-subnetting-n10-009/">Seven-Second Subnetting</Messer>
        </div>
      </Section>

      {/* 5 — special ranges */}
      <Section id="ch-ranges">
        <SectionTitle kicker="Chapter 5" accent={LAB}>Special address ranges</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          Some ranges are reserved and you must recognize them on sight: <Term>private</Term> (10.0.0.0/8,
          172.16–31, 192.168.0.0/16 — used inside networks, not routable on the internet),
          <Term> APIPA</Term> (169.254.0.0/16 — self-assigned when DHCP fails),
          and <Term>loopback</Term> (127.0.0.0/8 — the device talking to itself). Everything else is public.
          Drill it:
        </p>
        <DemoFrame title="Classify the IP" accent={LAB}>
          <IpClassifier />
        </DemoFrame>
      </Section>

      {/* 6 — practice */}
      <Section id="ch-practice">
        <SectionTitle kicker="Chapter 6" accent={LAB}>Practice until it is automatic</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          This is the rep machine. Random network, solve all five values, check, repeat. This is where
          subnetting actually sticks — aim for a streak, then speed.
        </p>
        <DemoFrame title="Subnetting practice generator" caption="Press Enter to check. Build a streak." accent={LAB}>
          <SubnetPractice />
        </DemoFrame>
        <Callout tone="info" title="More free reps (open in a new tab)">
          <div className="flex flex-wrap gap-2 pt-1">
            <a className="underline underline-offset-2 hover:text-text" href="https://subnetipv4.com/" target="_blank" rel="noopener noreferrer">subnetipv4.com</a>
            <span>·</span>
            <a className="underline underline-offset-2 hover:text-text" href="https://www.subnetting.net/Start.aspx" target="_blank" rel="noopener noreferrer">subnetting.net game</a>
            <span>·</span>
            <a className="underline underline-offset-2 hover:text-text" href="https://www.examcompass.com/comptia-network-plus-certification-exam-n10-009-subnetting-quiz" target="_blank" rel="noopener noreferrer">ExamCompass subnetting quiz</a>
          </div>
        </Callout>
      </Section>

      {/* 7 — exam-style */}
      <Section id="ch-exam">
        <SectionTitle kicker="Chapter 7" accent={LAB}>Exam-style design question</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          PBQs phrase subnetting as a design task: given a block and a requirement, pick the prefix and
          read off the details. Same math, scenario wrapper.
        </p>
        <DemoFrame title="Subnet-design PBQ" caption="Submit to see the worked solution. New scenario each round." accent={LAB}>
          <SubnetDesignPBQ />
        </DemoFrame>
      </Section>

      {/* explain-it-back questions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text">Explain it back</h2>
          <p className="text-sm text-muted">Answer out loud first — these are the verbal checks for the live session.</p>
        </div>
        <div className="space-y-3">
          <QuestionCard
            id="ip-q1" objective="1.7" accent={LAB} number={1}
            question={<>Convert <Mono>10101100</Mono> to decimal — and walk me through how you got it.</>}
            answer={<>172. The on-bits are at place values 128 + 32 + 8 + 4 = 172.</>}
            listenFor="Are they using the 128-64-32-16-8-4-2-1 place values and adding only the on-bits?"
          />
          <QuestionCard
            id="ip-q2" objective="1.7" accent={LAB} number={2}
            question={<>What does <Mono>/27</Mono> mean, and what subnet mask is that in dotted decimal?</>}
            answer={<>/27 = 27 network bits (5 host bits). Mask = 255.255.255.224.</>}
            listenFor="‘Count of network bits’ — and 224 in the last octet (the 256−32 block)."
          />
          <QuestionCard
            id="ip-q3" objective="1.7" accent={LAB} number={3}
            question={<>For <Mono>192.168.1.0/26</Mono>, how many usable hosts, and why do we subtract two?</>}
            answer={<>62 usable. /26 = 6 host bits → 2⁶ = 64 addresses, minus the network and broadcast = 62.</>}
            listenFor="The minus-2 reason: the network address and broadcast address cannot be assigned to a device."
          />
          <QuestionCard
            id="ip-q4" objective="1.7" accent={LAB} number={4}
            question={<>You have a <Mono>/24</Mono> and need <Mono>/27</Mono> subnets. How many subnets, and how many usable hosts each?</>}
            answer={<>Borrowing 3 bits (24→27) → 2³ = 8 subnets, each /27 = 30 usable hosts (block size 32, −2).</>}
            listenFor="8 subnets and 30 hosts; bonus if they say block size 32."
          />
          <QuestionCard
            id="ip-q5" objective="1.7" accent={LAB} number={5}
            question={<>Walk me through finding the network address of <Mono>172.16.70.0/20</Mono> using the magic number.</>}
            answer={<>/20 → interesting octet is the 3rd (mask 255.255.240.0). Block = 256 − 240 = 16. Count by 16: 0,16,…,64,80. 70 lands in the 64 block → network 172.16.64.0, broadcast 172.16.79.255.</>}
            listenFor="Block size 16, and that 70 falls into the 64–79 block."
          />
        </div>
      </section>
    </Container>
  );
}
