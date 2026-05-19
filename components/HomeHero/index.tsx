"use client";

import classNames from "classnames/bind";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useLayoutEffect, useRef } from "react";

import { Grid } from "@/components/Grid";
import { Hand3D } from "@/components/Hand3D";

import styles from "./HomeHero.module.scss";

const cx = classNames.bind(styles);

gsap.registerPlugin(SplitText);

// useLayoutEffect on the client (so GSAP can hide the text before paint),
// useEffect during SSR (so React doesn't log the layout-effect warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface HomeHeroProps {
  /** Headline shown above the description. Animated in line-by-line on first view. */
  title: string;
  /** Supporting paragraph under the headline. Animated in line-by-line. */
  description: string;
  /** Extra class merged onto the outer `<section>`. */
  className?: string;
}

export const HomeHero = ({ title, description, className }: HomeHeroProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const titleEl = titleRef.current;
    const descEl = descriptionRef.current;
    if (!titleEl || !descEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Split each block into lines and wrap each line in an overflow-hidden mask.
    const splitTitle = new SplitText(titleEl, {
      type: "lines",
      mask: "lines",
      linesClass: "homeHeroLine",
    });
    const splitDesc = new SplitText(descEl, {
      type: "lines",
      mask: "lines",
      linesClass: "homeHeroLine",
    });

    // Hide all lines synchronously so they don't paint at their natural
    // position before the observer fires.
    gsap.set([...splitTitle.lines, ...splitDesc.lines], { yPercent: 100 });

    let tl: gsap.core.Timeline | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          tl = gsap.timeline({
            defaults: { ease: "power3.out", duration: 0.9 },
          });
          tl.to(splitTitle.lines, { yPercent: 0, stagger: 0.08 }).to(
            splitDesc.lines,
            { yPercent: 0, stagger: 0.06 },
            "-=0.5",
          );
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(titleEl);

    return () => {
      observer.disconnect();
      tl?.kill();
      splitTitle.revert();
      splitDesc.revert();
    };
  }, [title, description]);

  return (
    <Grid as="section" className={cx("homeHero", className)}>
      <Hand3D className={cx("hand")} />
      <div className={cx("wrapper")}>
        <h1
          ref={titleRef}
          className={cx("title", "u-h3", "u-strong")}
        >
          {title}
        </h1>
        <p ref={descriptionRef} className={cx("description", "u-h5")}>
          {description}
        </p>
      </div>
    </Grid>
  );
};

export default HomeHero;
