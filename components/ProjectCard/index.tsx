"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import classNames from "classnames/bind";

import { Button, ButtonType } from "@/components/Button";
import { CustomCursor } from "@/components/CustomCursor";
import { Icon, IconName } from "@/components/Icon";
import { Image } from "@/components/Image";
import breakpoints from "@/constants/breakpoints";
import type { ResponsiveFocalPoint } from "@/utils/focal-point";
import styles from "./ProjectCard.module.scss";

gsap.registerPlugin(SplitText, ScrollTrigger);

// useLayoutEffect on the client so GSAP can hide the text before paint;
// useEffect during SSR so React doesn't log the layout-effect warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const cx = classNames.bind(styles);

export interface ProjectCardLink {
  /** Visible link text. */
  label: string;
  /** Destination URL. Omit to render as plain text (e.g. "Coming soon"). */
  href?: string;
}

export interface ProjectCardImage {
  /** Image source URL. */
  src: string;
  /** Alt text describing the image for assistive tech. */
  alt: string;
  /** Where to anchor the image when cropped. Single value or per-breakpoint object. */
  focalPoint?: ResponsiveFocalPoint;
}

export interface ProjectCardProps {
  /** Primary (desktop / fallback) cover image. */
  image: ProjectCardImage;
  /** Optional portrait variant shown below the small breakpoint. */
  mobileImage?: ProjectCardImage;
  /** Internal route this card links to (e.g. `/projects/kyan`). */
  href: string;
  /** Project title — shown in the trigger pill and modal panel heading. */
  title: string;
  /** Short project description shown inside the panel. */
  description: string;
  /** Skill / category chips rendered in the panel's tags column. */
  tags?: string[];
  /** External links (site, repo, etc.) shown in the panel's links column. */
  links?: ProjectCardLink[];
}

export const ProjectCard = ({
  image,
  mobileImage,
  href,
  title,
  description,
  tags,
  links,
}: ProjectCardProps) => {
  const safeTags = tags ?? [];
  const safeLinks = links ?? [];

  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const triggerLabelRef = useRef<HTMLSpanElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Reveal the trigger label word-by-word from behind a mask the first time
  // the LABEL itself scrolls into view. Triggering on the card top fired the
  // tween before the label was actually visible (the label sits at the bottom
  // of an 85vh-tall card), so the user only saw frames that had already played.
  useIsomorphicLayoutEffect(() => {
    const labelEl = triggerLabelRef.current;
    if (!labelEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const split = new SplitText(labelEl, {
      type: "words",
      mask: "words",
      aria: "none",
    });
    gsap.set(split.words, { yPercent: 100 });

    const tween = gsap.to(split.words, {
      yPercent: 0,
      duration: 0.7,
      stagger: 0.05,
      ease: "power3.out",
      paused: true,
      scrollTrigger: {
        trigger: labelEl,
        start: "top bottom-=10%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [title]);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    if (!open) return;
    if (
      typeof window !== "undefined" &&
      !window.matchMedia(`(min-width: ${breakpoints.s}px)`).matches
    ) {
      return;
    }
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), 300);
  };

  // Clear any pending timer when the panel becomes closed (manual close, etc.).
  useEffect(() => {
    if (!open) cancelClose();
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <article ref={cardRef} className={cx("card")}>
        <CustomCursor icon={IconName.ARROW_OUT}>
          <Link
            href={href}
            className={cx("imageLink")}
            aria-label={`View ${title}`}
          >
            <div className={cx("imageWrap")} data-card-fade-target>
              {mobileImage && (
                <div className={cx("imageSlot", "imageMobile")}>
                  <Image
                    className={cx("image")}
                    src={mobileImage.src}
                    alt={mobileImage.alt}
                    fill
                    sizes={`(max-width: ${breakpoints.s}px) 100vw, 1px`}
                    focalPoint={mobileImage.focalPoint}
                  />
                </div>
              )}
              <div className={cx("imageSlot", { imageDesktop: !!mobileImage })}>
                <Image
                  className={cx("image")}
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={`(max-width: ${breakpoints.s}px) 1px, (max-width: ${breakpoints.m}px) 90vw, (max-width: ${breakpoints.oversize}px) 80vw, 1540px`}
                  focalPoint={image.focalPoint}
                />
              </div>
            </div>
          </Link>
        </CustomCursor>

        <Dialog.Trigger asChild>
          <button
            type="button"
            className={cx("trigger", "u-signpost", { hidden: open })}
          >
            <span ref={triggerLabelRef} className={cx("triggerLabel")}>
              {title}
            </span>
            <span className={cx("triggerIndicator")} aria-hidden="true">
              <Icon name={IconName.PLUS} className={cx("triggerIcon")} />
            </span>
          </button>
        </Dialog.Trigger>

        <Dialog.Content
          forceMount
          asChild
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
              <div
                className={cx("panel")}
                inert={!open}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              >
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className={cx("closeButton")}
                    aria-label="Close project details"
                  >
                    <Icon name={IconName.PLUS} className={cx("closeIcon")} />
                  </button>
                </Dialog.Close>
                <Dialog.Title asChild>
                  <h2 className={cx("panelTitle", "u-h5")}>{title}</h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p className={cx("panelDescription", "u-bodySmall")}>
                    {description}
                  </p>
                </Dialog.Description>
                {(safeTags.length > 0 || safeLinks.length > 0) && (
                  <div className={cx("meta")}>
                    {safeTags.length > 0 && (
                      <div className={cx("metaSection")}>
                        <h3 className={cx("metaHeading", "u-signpostSmall")}>
                          Tags
                        </h3>
                        <ul className={cx("metaList")}>
                          {safeTags.map((tag) => (
                            <li key={tag} className={cx("metaItem")}>
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {safeLinks.length > 0 && (
                      <div className={cx("metaSection")}>
                        <h3 className={cx("metaHeading", "u-signpostSmall")}>
                          Links
                        </h3>
                        <ul className={cx("metaList")}>
                          {safeLinks.map((link) => (
                            <li key={link.label} className={cx("metaItem")}>
                              {link.href ? (
                                <a
                                  href={link.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={cx("u-textLink")}
                                >
                                  {link.label}
                                </a>
                              ) : (
                                link.label
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <div className={cx("viewProject")}>
                  <Button
                    href={href}
                    type={ButtonType.PRIMARY}
                    label="View project"
                    ariaLabel={`View ${title}`}
                    fullWidth
                    small
                  />
                </div>
              </div>
            </Dialog.Content>
      </article>
    </Dialog.Root>
  );
};

export default ProjectCard;
