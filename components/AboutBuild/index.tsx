"use client";

import classNames from "classnames/bind";

import { Grid } from "@/components/Grid";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

import styles from "./AboutBuild.module.scss";

const cx = classNames.bind(styles);

const DEFAULT_SIGNPOST = "About";
const DEFAULT_DESCRIPTION =
  "Built with Next.js 16 + React 19 (React Compiler enabled), TypeScript end to end. Content lives in Sanity, queried with GROQ; smooth scrolling via Lenis, page motion via GSAP, 3D balloon hand via Three.js + React Three Fiber. Styling is SCSS modules layered on a single design-token system designed in Figma. The component library is documented in Storybook and covered by Jest + React Testing Library — every component ships with stories and tests, so the design system stays trustworthy as it grows.";

export interface AboutBuildProps {
  /** Small uppercase label above the description (e.g. "About", "Stack"). Defaults to "About". */
  signpost?: string;
  /** Paragraph describing the project / tech stack. Falls back to a default site-build blurb when omitted. */
  description?: string;
  /** Optional list of skill chips rendered after the description. */
  skills?: string[];
  /** Optional list of expertise chips rendered after the skills list. */
  expertise?: string[];
  /** Extra class merged onto the outer `<section>`. */
  className?: string;
}

interface TagListProps {
  label: string;
  items: string[];
}

const TagList = ({ label, items }: TagListProps) => (
  <div className={cx("tagList")}>
    <span className={cx("tagListLabel", "u-signpostSmall")}>{label}</span>
    <ul className={cx("tagListItems", "u-bodySmall")}>
      {items.map((item) => (
        <li key={item} className={cx("tagListItem")}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export const AboutBuild = ({
  signpost = DEFAULT_SIGNPOST,
  description = DEFAULT_DESCRIPTION,
  skills,
  expertise,
  className,
}: AboutBuildProps) => {
  const animationRef = useInViewAnimation<HTMLElement>();
  const safeSkills = skills ?? [];
  const safeExpertise = expertise ?? [];

  return (
    <section className={cx("aboutBuild", className)} ref={animationRef}>
      <Grid>
        <span className={cx("signpost", "u-signpost")}>{signpost}</span>
        <div className={cx("content")}>
          <p className={cx("description", "u-body")}>{description}</p>
          {safeSkills.length > 0 && (
            <TagList label="Skills" items={safeSkills} />
          )}
          {safeExpertise.length > 0 && (
            <TagList label="Expertise" items={safeExpertise} />
          )}
        </div>
      </Grid>
    </section>
  );
};

export default AboutBuild;
