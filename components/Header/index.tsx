"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames/bind";
import gsap from "gsap";

import { Grid } from "@/components/Grid";
import { SkipLink } from "@/components/SkipLink";
import { useHandPose, type HandPose } from "@/context/HandPose";
import headerData from "@/data/header.json";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

const POSE_REVERT_MS = 3000;

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const poseRevertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const { setPose } = useHandPose();
  const { links, tagline } = headerData;

  useEffect(() => {
    return () => {
      if (poseRevertTimeoutRef.current) {
        clearTimeout(poseRevertTimeoutRef.current);
      }
    };
  }, []);

  const handlePoseEnter = (pose: HandPose) => () => {
    if (poseRevertTimeoutRef.current) {
      clearTimeout(poseRevertTimeoutRef.current);
      poseRevertTimeoutRef.current = null;
    }
    setPose(pose);
  };

  const handlePoseLeave = () => {
    poseRevertTimeoutRef.current = setTimeout(() => {
      setPose("default");
    }, POSE_REVERT_MS);
  };

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const descEl = descriptionRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fadeDuration = reduced ? 0 : 0.3;

    let lastY = window.scrollY;
    let headerOffset = 0;
    let descAtTop = window.scrollY < 1;

    gsap.set(headerEl, { y: 0 });
    if (descEl && !descAtTop) {
      gsap.set(descEl, { autoAlpha: 0, height: 0 });
    }
    setScrolled(window.scrollY > headerEl.offsetHeight);

    const handleScroll = () => {
      const headerHeight = headerEl.offsetHeight;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      if (open || y <= 0) {
        headerOffset = 0;
      } else {
        // Cap is monotonic so the offset can't shrink mid-scroll just because
        // the header itself shrank (e.g. tagline description fading out).
        const cap = Math.max(headerHeight, headerOffset);
        headerOffset = Math.max(0, Math.min(cap, headerOffset + delta));
      }

      gsap.set(headerEl, { y: -headerOffset });
      setScrolled(y > headerHeight);

      if (descEl) {
        const atTop = y < 1;
        if (atTop !== descAtTop) {
          descAtTop = atTop;
          gsap.to(descEl, {
            autoAlpha: atTop ? 1 : 0,
            height: atTop ? "auto" : 0,
            duration: fadeDuration,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={cx("header", { scrolled })}>
      <SkipLink />
      <Grid as="div" className={cx("desktop")}>
        <Link
          href={links[0].href}
          prefetch={false}
          className={cx("link", "u-uiLabel", "u-strong", "work")}
          onMouseEnter={handlePoseEnter("horns")}
          onMouseLeave={handlePoseLeave}
        >
          {links[0].label}
        </Link>
        <Link
          href={links[1].href}
          prefetch={false}
          className={cx("link", "u-uiLabel", "u-strong", "about")}
          onMouseEnter={handlePoseEnter("peace")}
          onMouseLeave={handlePoseLeave}
        >
          {links[1].label}
        </Link>
        <div className={cx("tagline")}>
          <p className={cx("taglineTitle", "u-uiLabel", "u-strong")}>
            {tagline.title}
          </p>
          <div ref={descriptionRef} className={cx("taglineDescriptionWrapper")}>
            <p className={cx("taglineDescription", "u-uiLabel")}>
              {tagline.description}
            </p>
          </div>
        </div>
        <Link
          href={links[2].href}
          prefetch={false}
          className={cx("link", "u-uiLabel", "u-strong", "contact")}
          onMouseEnter={handlePoseEnter("phone")}
          onMouseLeave={handlePoseLeave}
        >
          {links[2].label}
        </Link>
      </Grid>

      <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={open ? "header-mobile-menu" : undefined}
          onClick={() => setOpen((prev) => !prev)}
          className={cx("menuToggle", { open })}
        >
          <span className={cx("line", "lineTop")} aria-hidden="true" />
          <span className={cx("line", "lineBottom")} aria-hidden="true" />
        </button>
        <Dialog.Portal>
          <Dialog.Overlay className={cx("overlay")} />
          <Dialog.Content
            id="header-mobile-menu"
            className={cx("drawer")}
            aria-describedby={undefined}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <Dialog.Title className={cx("srOnly")}>Menu</Dialog.Title>
            <nav className={cx("drawerNav")}>
              <ul className={cx("drawerList")}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className={cx("drawerLink")}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className={cx("drawerTagline")}>
                <p className={cx("taglineTitle")}>{tagline.title}</p>
                <p className={cx("taglineDescription")}>
                  {tagline.description}
                </p>
              </div>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
};

export default Header;
