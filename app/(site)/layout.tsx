import { InViewAnimationProvider } from "@/context/InViewAnimation";
import "../globals.scss";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <InViewAnimationProvider>{children}</InViewAnimationProvider>;
}
