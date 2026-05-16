import classNames from "classnames/bind";

import styles from "./SkipLink.module.scss";

const cx = classNames.bind(styles);

interface SkipLinkProps {
  href?: string;
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
