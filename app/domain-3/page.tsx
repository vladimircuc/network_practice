import { domainBySlug } from "@/lib/domains";
import DomainHeader from "@/components/DomainHeader";
import ComingSoon from "@/components/ComingSoon";

const domain = domainBySlug("domain-3")!;

export const metadata = { title: `${domain.name} · Network+ Prep` };

export default function Page() {
  return (
    <>
      <DomainHeader domain={domain} />
      <ComingSoon domain={domain} />
    </>
  );
}
