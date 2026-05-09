"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import classNames from "classnames/bind";

import { Button, ButtonType } from "@/components/Button";
import { CustomCursor } from "@/components/CustomCursor";
import { Icon, IconName } from "@/components/Icon";
import { Image } from "@/components/Image";
import breakpoints from "@/constants/breakpoints";
import type { ResponsiveFocalPoint } from "@/utils/focal-point";
import styles from "./ProjectCard.module.scss";

const cx = classNames.bind(styles);

export interface ProjectCardLink {
  label: string;
  href?: string;
}

export interface ProjectCardImage {
  src: string;
  alt: string;
  focalPoint?: ResponsiveFocalPoint;
}

export interface ProjectCardProps {
  image: ProjectCardImage;
  mobileImage?: ProjectCardImage;
  href: string;
  title: string;
  description: string;
  tags?: string[];
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
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setContainer(cardRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

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
        <CustomCursor icon={IconName.ARROW_UP}>
          <Link
            href={href}
            className={cx("imageLink")}
            aria-label={`View ${title}`}
          >
            <div className={cx("imageWrap")}>
              {mobileImage && (
                <Image
                  className={cx("image", "imageMobile")}
                  src={mobileImage.src}
                  alt={mobileImage.alt}
                  fill
                  sizes={`(max-width: ${breakpoints.s}px) 100vw, 1px`}
                  focalPoint={mobileImage.focalPoint}
                />
              )}
              <Image
                className={cx("image", { imageDesktop: !!mobileImage })}
                src={image.src}
                alt={image.alt}
                fill
                sizes={`(max-width: ${breakpoints.s}px) 1px, (max-width: ${breakpoints.m}px) 90vw, (max-width: ${breakpoints.oversize}px) 80vw, 1540px`}
                focalPoint={image.focalPoint}
              />
            </div>
          </Link>
        </CustomCursor>

        <Dialog.Trigger asChild>
          <button
            type="button"
            className={cx("trigger", "u-signpost", { hidden: open })}
          >
            <span className={cx("triggerLabel")}>{title}</span>
            <span className={cx("triggerIndicator")} aria-hidden="true">
              <Icon name={IconName.PLUS} className={cx("triggerIcon")} />
            </span>
          </button>
        </Dialog.Trigger>

        {container && (
          <Dialog.Portal container={container} forceMount>
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
                aria-hidden={!open}
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
                    fullWidth
                    small
                  />
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </article>
    </Dialog.Root>
  );
};

export default ProjectCard;
