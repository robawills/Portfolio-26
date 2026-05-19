import classNames from "classnames/bind";

import styles from "./ClientMarquee.module.scss";

const cx = classNames.bind(styles);

export interface ClientMarqueeProps {
  /** Client / brand names rendered in the scrolling marquee. Duplicated internally for a seamless loop. */
  clients: string[];
  /** Extra class merged onto the outer `<section>`. */
  className?: string;
}

export const ClientMarquee = ({ clients, className }: ClientMarqueeProps) => {
  if (!clients.length) return null;

  return (
    <section className={cx("clientMarquee", className)} aria-label="Clients">
      <div className={cx("viewport")}>
        <ul className={cx("track", "u-d2")}>
          {clients.map((name) => (
            <li key={name} className={cx("item")}>
              {name}
            </li>
          ))}
          {clients.map((name) => (
            <li key={`dup-${name}`} className={cx("item")} aria-hidden="true">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClientMarquee;
