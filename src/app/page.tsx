import { Banner, Nav } from "~/components/landing/Nav";
import { Hero } from "~/components/landing/Hero";
import { TemplateGallery } from "~/components/landing/TemplateGallery";
import { Steps } from "~/components/landing/Steps";
import { CommunityWall } from "~/components/landing/CommunityWall";
import { Footer } from "~/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      {/* <Banner /> */}
      <Nav />
      <main>
        <Hero />
        <TemplateGallery />
        <Steps />
        <CommunityWall />
      </main>
      <Footer />
    </>
  );
}
