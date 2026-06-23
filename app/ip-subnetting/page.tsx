import type { ReactNode } from "react";
import { Container, Section, SectionTitle, Callout, DemoFrame, Term, Mono, Advanced } from "@/components/ui";
import QuestionCard from "@/components/QuestionCard";
import HomeNetwork from "@/components/subnet/HomeNetwork";
import IpAnatomy from "@/components/subnet/IpAnatomy";
import BinaryOctetTrainer from "@/components/subnet/BinaryOctetTrainer";
import MaskHighlighter from "@/components/subnet/MaskHighlighter";
import SameNetworkChecker from "@/components/subnet/SameNetworkChecker";
import CidrSlider from "@/components/subnet/CidrSlider";
import SubnetSplitter from "@/components/subnet/SubnetSplitter";
import MagicNumberWalkthrough from "@/components/subnet/MagicNumberWalkthrough";
import IpClassifier from "@/components/subnet/IpClassifier";
import SubnetPractice from "@/components/subnet/SubnetPractice";
import SubnetVisualizer from "@/components/subnet/SubnetVisualizer";
import SubnetDesignPBQ from "@/components/subnet/SubnetDesignPBQ";

const LAB = "var(--color-lab)";

export const metadata = { title: "IP & Subnetting (plain English) · Network+ Prep" };

const CHAPTERS = [
  { id: "ch-net", n: 0, t: "Networks & hosts" },
  { id: "ch-num", n: 1, t: "The numbers" },
  { id: "ch-mask", n: 2, t: "The subnet mask" },
  { id: "ch-same", n: 3, t: "Same network?" },
  { id: "ch-subnet", n: 4, t: "Why we subnet" },
  { id: "ch-special", n: 5, t: "Special addresses" },
  { id: "ch-practice", n: 6, t: "Practice" },
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
          IP addresses &amp; subnetting, <span style={{ color: LAB }}>in plain English</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          We start with the simple idea — what a network and a device actually are — using one
          analogy the whole way: <Term>a street of houses</Term>. No binary required to follow
          the main path. The deeper hand-math lives in clearly marked{" "}
          <span className="font-semibold text-text">&ldquo;Go deeper&rdquo;</span> boxes you can open
          only if you want them.
        </p>

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

      {/* 0 — networks & hosts */}
      <Section id="ch-net">
        <SectionTitle kicker="Chapter 0" accent={LAB}>First: what is a network? What is a host?</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          Think of a <Term>network</Term> as a <span className="text-text">street</span>, and each
          <Term> host</Term> as a <span className="text-text">house</span> on it. Your home Wi-Fi is one
          street; your phone, laptop, and TV are houses on that street. They can talk to each other
          directly because they live on the same street. An <Term>IP address</Term> is simply the full
          address of one house — and it has two parts: <span style={{ color: "var(--color-d1)" }}>which
          street</span> (the network) and <span style={{ color: "var(--color-good)" }}>which house</span>{" "}
          (the host). Click around:
        </p>
        <DemoFrame title="Your home network" accent={LAB}>
          <HomeNetwork />
        </DemoFrame>
        <Callout tone="tip" title="The one idea everything builds on">
          Every IP address answers two questions: <span className="text-text">which network</span> am I on,
          and <span className="text-text">which device</span> am I? That is it.
        </Callout>
      </Section>

      {/* 1 — the numbers */}
      <Section id="ch-num">
        <SectionTitle kicker="Chapter 1" accent={LAB}>The numbers behind an address</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          An IP address is four numbers, each from 0 to 255 (like <Mono>192.168.1.42</Mono>). Each number
          is called an <Term>octet</Term>. Why 0–255? Because under the hood a computer stores each octet
          as 8 on/off switches (<Term>bits</Term>). You will rarely do this by hand — but seeing it once
          makes the rest make sense.
        </p>
        <DemoFrame title="One address → 4 octets → 32 bits" accent={LAB}>
          <IpAnatomy />
        </DemoFrame>
        <DemoFrame title="How a single number is built from 8 switches" caption="Try Practice mode to hit a target number." accent={LAB}>
          <BinaryOctetTrainer />
        </DemoFrame>
        <div><Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/binary-math-n10-009/">Binary Math</Messer></div>
      </Section>

      {/* 2 — the subnet mask */}
      <Section id="ch-mask">
        <SectionTitle kicker="Chapter 2" accent={LAB}>The subnet mask: which part is the street?</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          The address has a street part and a house part — but where is the dividing line? That is the
          <Term> subnet mask&apos;s</Term> only job: it points out which numbers are the network and which
          are the device. The easy masks are made of <Mono>255</Mono>s and <Mono>0</Mono>s:
          a <Mono>255</Mono> means <span style={{ color: "var(--color-d1)" }}>&ldquo;this number is the
          network&rdquo;</span>, a <Mono>0</Mono> means{" "}
          <span style={{ color: "var(--color-good)" }}>&ldquo;this number is the device&rdquo;</span>. So{" "}
          <Mono>255.255.255.0</Mono> says &ldquo;the first three numbers are the street, the last is the
          house.&rdquo;
        </p>
        <DemoFrame title="Mask = a highlighter over the address" accent={LAB}>
          <MaskHighlighter />
        </DemoFrame>
        <Callout tone="info" title="What about the slash, like /24?">
          <Mono>/24</Mono> is just shorthand for the same thing: it counts how many bits are network.
          <Mono>255.255.255.0</Mono> locks the first 3 octets (3 × 8 = 24 bits) = <Mono>/24</Mono>. So
          <Mono>/16</Mono> = <Mono>255.255.0.0</Mono>, and <Mono>/8</Mono> = <Mono>255.0.0.0</Mono>.
        </Callout>
        <Advanced title="Go deeper — masks smaller than a whole octet (/25, /26…)">
          <p className="mb-3 text-sm leading-relaxed text-muted">
            Sometimes the split lands in the middle of an octet (like <Mono>/26</Mono>). Then the mask
            number is not a clean 255 or 0 — it is something like 192 or 224. This is where the bits matter.
            Drag the slider to see the line move one bit at a time. You do <span className="text-text">not</span>{" "}
            need this for the main idea — it is here when you are ready.
          </p>
          <CidrSlider />
          <div className="mt-3"><Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/ipv4-subnet-masks-n10-009/">IPv4 Subnet Masks</Messer></div>
        </Advanced>
      </Section>

      {/* 3 — same network? */}
      <Section id="ch-same">
        <SectionTitle kicker="Chapter 3" accent={LAB}>Are two devices on the same network?</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          This is the question that actually matters day to day. If two devices are on the{" "}
          <span className="text-text">same street</span> (their network parts match), they talk directly.
          If they are on <span className="text-text">different streets</span>, the message has to go
          through a <Term>router</Term> — think of it as the post office that moves mail between streets.
          To check, you just compare the network parts:
        </p>
        <DemoFrame title="Same network, or different?" caption="Change B's third or fourth number and watch the verdict flip." accent={LAB}>
          <SameNetworkChecker />
        </DemoFrame>
      </Section>

      {/* 4 — why we subnet */}
      <Section id="ch-subnet">
        <SectionTitle kicker="Chapter 4" accent={LAB}>Why split a network into &ldquo;subnets&rdquo;?</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          One giant street with thousands of houses is messy and unsafe. <Term>Subnetting</Term> means
          chopping one network into smaller ones — like dividing a long street into several shorter
          streets, or a building into floors. It keeps groups separate (guests vs. staff), improves
          security, and stops one area&apos;s noise from flooding everyone. Here is a /24 being sliced:
        </p>
        <DemoFrame title="Slicing one network into smaller ones" accent={LAB}>
          <SubnetSplitter />
        </DemoFrame>
        <Callout tone="info" title="For the exam, you mostly need the idea">
          Know <span className="text-text">why</span> we subnet and roughly how the blocks divide. The
          fast hand-calculation below is a bonus skill — useful, but not the heart of it.
        </Callout>
        <Advanced title="Go deeper — the fast hand-method (magic number)">
          <p className="mb-3 text-sm leading-relaxed text-muted">
            When you need to find a subnet by hand, the <Term>magic-number</Term> trick is the quickest
            way. Step through a real example:
          </p>
          <MagicNumberWalkthrough />
          <div className="mt-3 flex flex-wrap gap-2">
            <Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/magic-number-subnetting-n10-009/">Magic Number Subnetting</Messer>
            <Messer href="https://www.professormesser.com/network-plus/n10-009/n10-009-video/seven-second-subnetting-n10-009/">Seven-Second Subnetting</Messer>
          </div>
        </Advanced>
      </Section>

      {/* 5 — special addresses */}
      <Section id="ch-special">
        <SectionTitle kicker="Chapter 5" accent={LAB}>Addresses worth recognizing on sight</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          A few ranges are special and show up constantly. <Term>Private</Term> addresses
          (<Mono>10.x</Mono>, <Mono>172.16–31.x</Mono>, <Mono>192.168.x</Mono>) are used inside homes and
          offices and are reused everywhere — that is why your home IP is almost always{" "}
          <Mono>192.168.something</Mono>. <Term>APIPA</Term> (<Mono>169.254.x</Mono>) is the address a
          device gives itself when it cannot reach DHCP — basically a &ldquo;something is broken&rdquo;
          sign. <Term>Loopback</Term> (<Mono>127.0.0.1</Mono>) means &ldquo;myself.&rdquo; Drill them:
        </p>
        <DemoFrame title="Classify the IP" accent={LAB}>
          <IpClassifier />
        </DemoFrame>
      </Section>

      {/* 6 — practice */}
      <Section id="ch-practice">
        <SectionTitle kicker="Chapter 6" accent={LAB}>Practice</SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          Start on <span className="text-text">Easy</span> (the split stays in the last number) and build a
          streak before switching to Harder. Repetition is what makes this automatic.
        </p>
        <DemoFrame title="Practice generator" caption="Press Enter to check. Build a streak." accent={LAB}>
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
        <Advanced title="Go deeper — full calculator & an exam-style design question">
          <p className="mb-3 text-sm leading-relaxed text-muted">
            A reference calculator (with the binary view) and a performance-based-style design task, for
            when you want the full picture:
          </p>
          <div className="mb-4"><SubnetVisualizer /></div>
          <SubnetDesignPBQ />
        </Advanced>
      </Section>

      {/* explain-it-back questions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text">Explain it back</h2>
          <p className="text-sm text-muted">Plain-English checks — answer out loud first.</p>
        </div>
        <div className="space-y-3">
          <QuestionCard
            id="ip-q1" objective="1.7" accent={LAB} number={1}
            question={<>In your own words, what is the difference between a <b className="text-text">network</b> and a <b className="text-text">host</b>? Give a home Wi-Fi example.</>}
            answer={<>A network is the group devices share (the street / your Wi-Fi). A host is one device on it (a house / your phone or laptop).</>}
            listenFor="The two-part idea: network = the shared group, host = one specific device."
          />
          <QuestionCard
            id="ip-q2" objective="1.7" accent={LAB} number={2}
            question={<>An IP address has two parts. What are they, and what does the <b className="text-text">subnet mask</b> tell you?</>}
            answer={<>The network part and the host part. The mask marks where the network ends and the host begins — its 255s are network, its 0s are host.</>}
            listenFor="Network part + host part; the mask is the dividing line (255 = network, 0 = host)."
          />
          <QuestionCard
            id="ip-q3" objective="1.7" accent={LAB} number={3}
            question={<>Using mask <Mono>255.255.255.0</Mono>, what is the network part and host part of <Mono>10.20.30.40</Mono>?</>}
            answer={<>Network part = 10.20.30 (the three 255s). Host part = 40 (the 0). Same as saying it is the 10.20.30.0 network.</>}
            listenFor="First three numbers = network, last number = host."
          />
          <QuestionCard
            id="ip-q4" objective="1.7" accent={LAB} number={4}
            question={<>With a <Mono>/24</Mono> mask, are <Mono>192.168.1.10</Mono> and <Mono>192.168.1.200</Mono> on the same network? What about <Mono>192.168.1.10</Mono> and <Mono>192.168.2.10</Mono>?</>}
            answer={<>First pair: yes — both are on 192.168.1, so they talk directly. Second pair: no — 192.168.1 vs 192.168.2 are different networks, so traffic goes through a router.</>}
            listenFor="Compare the network parts; different network → needs a router."
          />
          <QuestionCard
            id="ip-q5" objective="1.7" accent={LAB} number={5}
            question={<>Name a <b className="text-text">private</b> address range and explain why home devices use private IPs.</>}
            answer={<>10.x, 172.16–31.x, or 192.168.x. They are reused inside networks and not routable on the internet, so the router translates them to one public IP (NAT) to reach the outside.</>}
            listenFor="Any one private range, plus the idea that private = internal/reused, not public-facing."
          />
          <QuestionCard
            id="ip-q6" objective="1.7" accent={LAB} number={6}
            question={<>Why would a company split one big network into several <b className="text-text">subnets</b>?</>}
            answer={<>To organize and separate groups (e.g. guests vs. staff), improve security by isolating them, and keep one area&apos;s broadcast traffic from flooding everyone.</>}
            listenFor="Any of: organization, security/segmentation, performance / smaller broadcast areas."
          />
        </div>
      </section>
    </Container>
  );
}
