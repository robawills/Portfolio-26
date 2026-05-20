import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RouteScrollReset } from "@/components/RouteScrollReset";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorProvider } from "@/context/Cursor";
import { HandPoseProvider } from "@/context/HandPose";
import { InViewAnimationProvider } from "@/context/InViewAnimation";
import "@/styles/global.scss";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScroll>
      <RouteScrollReset />
      <InViewAnimationProvider>
        <CursorProvider>
          <HandPoseProvider>
            <Header />
            {children}
            <Footer />
          </HandPoseProvider>
        </CursorProvider>
      </InViewAnimationProvider>
    </SmoothScroll>
  );
}
