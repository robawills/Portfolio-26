"use client";

import classNames from "classnames/bind";
import type { ReactNode } from "react";

import { Grid } from "@/components/Grid";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

import styles from "./AboutSection.module.scss";

const cx = classNames.bind(styles);

export interface AboutSectionProps {
  /** Small uppercase label rendered in the left grid column (e.g. "Bio", "Skills"). */
  signpost: string;
  /** Content rendered in the right grid column — paragraphs, lists, or any custom markup. */
  children: ReactNode;
  /** Extra class merged onto the outer `<section>`. */
  className?: string;
}

export const AboutSection = ({
  signpost,
  children,
  className,
}: AboutSectionProps) => {
  const animationRef = useInViewAnimation<HTMLElement>();

  return (
    <section className={cx("section", className)} ref={animationRef}>
      <Grid>
        <span className={cx("signpost", "u-signpost")}>{signpost}</span>
        <div className={cx("content")}>{children}</div>
      </Grid>
    </section>
  );
};

export default AboutSection;
