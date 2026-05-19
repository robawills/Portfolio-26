import classNames from "classnames/bind";

import styles from "./SkipLink.module.scss";

const cx = classNames.bind(styles);

interface SkipLinkProps {
  /** Target fragment / URL the link jumps to. Defaults to `"#main-content"`. */
  href?: string;
  /** Visible link text (also the accessible name). Defaults to `"Skip to main content"`. */
  label?: string;
}

export const SkipLink = ({
  href = "#main-content",
  label = "Skip to main content",
}: SkipLinkProps) => (
  <a href={href} className={cx("skipLink", "u-uiLabel", "u-strong")}>
    {label}
  </a>
);

export default SkipLink;
