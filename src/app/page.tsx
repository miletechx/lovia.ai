import { AgeGate } from "@/components/ui/age-gate";
import { FeaturedCharacters } from "@/components/home/featured-characters";
import { Hero } from "@/components/home/hero";
import { PremiumStrip } from "@/components/home/premium-strip";
import { WhyLovia } from "@/components/home/why-lovia";

export default function Home() {
  return (
    <>
      <AgeGate />
      <Hero />
      <FeaturedCharacters />
      <PremiumStrip />
      <WhyLovia />
    </>
  );
}
