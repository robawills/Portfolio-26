"use client";

import classNames from "classnames/bind";
import type { ReactNode } from "react";

import { Grid } from "@/components/Grid";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

import styles from "./AboutSection.module.scss";

const cx = classNames.bind(styles);

export interface AboutSectionProps {
  signpost: string;
  children: ReactNode;
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
