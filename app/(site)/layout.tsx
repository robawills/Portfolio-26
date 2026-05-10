import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorProvider } from "@/context/Cursor";
import { HandPoseProvider } from "@/context/HandPose";
import { InViewAnimationProvider } from "@/context/InViewAnimation";
import "../globals.scss";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScroll>
      <InViewAnimationProvider>
        <CursorProvider>
          <HandPoseProvider>
            <Header />
            {children}
          </HandPoseProvider>
        </CursorProvider>
      </InViewAnimationProvider>
    </SmoothScroll>
  );
}
