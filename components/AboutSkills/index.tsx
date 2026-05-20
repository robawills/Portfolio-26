import classNames from "classnames/bind";

import { AboutSection } from "@/components/AboutSection";

import styles from "./AboutSkills.module.scss";

const cx = classNames.bind(styles);

export interface AboutSkillsProps {
  /** Skill names rendered in a responsive grid. */
  skills: string[];
  /** Extra class merged onto the underlying `<section>`. */
  className?: string;
}

export const AboutSkills = ({ skills, className }: AboutSkillsProps) => {
  if (skills.length === 0) return null;

  return (
    <AboutSection signpost="Skills" className={className}>
      <ul className={cx("list", "u-body")}>
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </AboutSection>
  );
};

export default AboutSkills;
