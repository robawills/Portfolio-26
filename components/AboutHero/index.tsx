"use client";

import classNames from "classnames/bind";

import { Grid } from "@/components/Grid";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

import styles from "./AboutHero.module.scss";

const cx = classNames.bind(styles);

export interface AboutHeroProps {
  title: string;
  className?: string;
}

export const AboutHero = ({ title, className }: AboutHeroProps) => {
  const animationRef = useInViewAnimation<HTMLElement>();

  return (
    <section className={cx("aboutHero", className)} ref={animationRef}>
      <Grid>
        <h1 className={cx("title", "u-h1")}>{title}</h1>
      </Grid>
    </section>
  );
};

export default AboutHero;
