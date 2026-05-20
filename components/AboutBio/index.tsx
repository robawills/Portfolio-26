import classNames from "classnames/bind";

import { AboutSection } from "@/components/AboutSection";

import styles from "./AboutBio.module.scss";

const cx = classNames.bind(styles);

export interface AboutBioProps {
  /** Bio copy from Sanity. Blank lines split it into paragraphs. */
  bio: string;
  /** Extra class merged onto the underlying `<section>`. */
  className?: string;
}

function splitParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export const AboutBio = ({ bio, className }: AboutBioProps) => {
  const paragraphs = splitParagraphs(bio);

  if (paragraphs.length === 0) return null;

  return (
    <AboutSection signpost="Bio" className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={cx("copy", "u-body")}>
          {paragraph}
        </p>
      ))}
    </AboutSection>
  );
};

export default AboutBio;
