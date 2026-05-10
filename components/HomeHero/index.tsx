import classNames from "classnames/bind";

import { Grid } from "@/components/Grid";
import { Hand3D } from "@/components/Hand3D";

import styles from "./HomeHero.module.scss";

const cx = classNames.bind(styles);

export interface HomeHeroProps {
  title: string;
  description: string;
  className?: string;
}

export const HomeHero = ({ title, description, className }: HomeHeroProps) => (
  <Grid as="section" className={cx("homeHero", className)}>
    <Hand3D className={cx("hand")} />
    <div className={cx("wrapper")}>
      <h1 className={cx("title", "u-h2", "u-strong")}>{title}</h1>
      <p className={cx("u-h4")}>{description}</p>
    </div>
  </Grid>
);

export default HomeHero;
