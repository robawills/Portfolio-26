import classNames from "classnames/bind";

import { AboutSection } from "@/components/AboutSection";

import styles from "./AboutClients.module.scss";

const cx = classNames.bind(styles);

export interface AboutClientsProps {
  /** Brand names rendered as a separator-delimited inline list. */
  clients: string[];
  /** Signpost label shown alongside the list. */
  signpost?: string;
  /** Extra class merged onto the underlying `<section>`. */
  className?: string;
}

export const AboutClients = ({
  clients,
  signpost = "Brands I've worked with",
  className,
}: AboutClientsProps) => {
  if (clients.length === 0) return null;

  return (
    <AboutSection signpost={signpost} className={className}>
      <ul className={cx("list", "u-body")}>
        {clients.map((client) => (
          <li key={client} className={cx("item")}>
            {client}
          </li>
        ))}
      </ul>
    </AboutSection>
  );
};

export default AboutClients;
