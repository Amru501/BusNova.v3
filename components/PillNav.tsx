"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export type PillNavItem = {
  href: string;
  label: string;
  ariaLabel?: string;
  isButton?: boolean;
};

const PillNav = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  onLogout,
  initialLoadAnimation = true,
}: {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onLogout?: () => void;
  initialLoadAnimation?: boolean;
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<gsap.core.Timeline[]>([]);
  const activeTweenRefs = useRef<gsap.core.Tween[]>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  const linkItems = items.filter((item) => !item.isButton);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = (w * w) / 4 / h + h / 2;
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label as HTMLElement, { y: 0 });
        if (white) gsap.set(white as HTMLElement, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);

        if (label) {
          tl.to(label as HTMLElement, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        }

        if (white) {
          gsap.set(white as HTMLElement, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white as HTMLElement, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation) {
      const logoEl = logoRef.current;
      const navItems = navItemsRef.current;

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, {
          scale: 1,
          duration: 0.6,
          ease,
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, {
          width: "auto",
          duration: 0.6,
          ease,
        });
      }
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items.length, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    }) as gsap.core.Tween;
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    }) as gsap.core.Tween;
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: "top center",
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: "top center",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }
  };

  const isExternalLink = (href: string) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const cssVars: React.CSSProperties = {
    ["--base" as string]: baseColor,
    ["--pill-bg" as string]: pillColor,
    ["--hover-text" as string]: hoveredPillTextColor,
    ["--pill-text" as string]: resolvedPillTextColor,
    ["--nav-h" as string]: "42px",
    ["--logo" as string]: "36px",
    ["--pill-pad-x" as string]: "18px",
    ["--pill-gap" as string]: "3px",
  };

  const homeHref = linkItems[0]?.href ?? "#";

  return (
    <div className="absolute left-0 right-0 top-[1em] z-[1000] w-full px-0">
      <nav
        className={`box-border flex w-full items-center justify-between ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {/* Full-width pill-shaped container */}
        <div
          className="flex h-[42px] w-full items-center rounded-full p-[3px]"
          style={{
            background: "var(--base, #000)",
            gap: "var(--pill-gap)",
          }}
        >
          <Link
            href={homeHref}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={logoRef}
            className="inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{ background: "var(--base, #000)" }}
          >
            <img
              src={logo}
              alt={logoAlt}
              ref={logoImgRef}
              className="block size-full object-cover"
            />
          </Link>

          <div
            ref={navItemsRef}
            className="relative hidden flex-1 items-center md:flex"
            style={{ height: "var(--nav-h)", minWidth: 0 }}
          >
          <ul
            role="menubar"
            className="m-0 flex h-full w-full list-none items-stretch p-[3px]"
            style={{ gap: "var(--pill-gap)" }}
          >
            {items.map((item, i) => {
              const isButton = item.isButton;
              const circleIndex = isButton
                ? linkItems.length
                : linkItems.findIndex((l) => l.href === item.href && l.label === item.label);

              const pillStyle: React.CSSProperties = {
                background: "var(--pill-bg, #fff)",
                color: "var(--pill-text, var(--base, #000))",
                paddingLeft: "var(--pill-pad-x)",
                paddingRight: "var(--pill-pad-x)",
              };

              const circleRef = (el: HTMLSpanElement | null) => {
                if (circleIndex >= 0) circleRefs.current[circleIndex] = el;
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute bottom-0 left-1/2 z-[1] block rounded-full pointer-events-none"
                    style={{
                      background: "var(--base, #000)",
                      willChange: "transform",
                    }}
                    aria-hidden
                    ref={circleRef}
                  />
                  <span className="label-stack relative inline-block z-[2] leading-[1]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: "transform" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: "var(--hover-text, #fff)",
                        willChange: "transform, opacity",
                      }}
                      aria-hidden
                    >
                      {item.label}
                    </span>
                  </span>
                  {!isButton && activeHref === item.href && (
                    <span
                      className="absolute -bottom-[6px] left-1/2 z-[4] size-3 -translate-x-1/2 rounded-full"
                      style={{ background: "var(--base, #000)" }}
                      aria-hidden
                    />
                  )}
                </>
              );

              const basePillClasses =
                "relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full px-0 font-semibold uppercase leading-none tracking-[0.2px] whitespace-nowrap no-underline box-border text-[16px]";

              if (isButton) {
                return (
                  <li key="logout" role="none" className="flex h-full flex-1 min-w-0">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout?.();
                      }}
                      onMouseEnter={() => handleEnter(circleIndex)}
                      onMouseLeave={() => handleLeave(circleIndex)}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.label}
                    >
                      {PillContent}
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.href} role="none" className="flex h-full flex-1 min-w-0">
                  <Link
                    role="menuitem"
                    href={item.href}
                    className={basePillClasses}
                    style={pillStyle}
                    aria-label={item.ariaLabel ?? item.label}
                    onMouseEnter={() => handleEnter(circleIndex)}
                    onMouseLeave={() => handleLeave(circleIndex)}
                  >
                    {PillContent}
                  </Link>
                </li>
              );
            })}
          </ul>
          </div>
        </div>

        <button
          ref={hamburgerRef}
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="relative flex size-[42px] cursor-pointer flex-col items-center justify-center gap-1 rounded-full border-0 p-0 md:hidden"
          style={{
            background: "var(--base, #000)",
          }}
        >
          <span
            className="hamburger-line h-0.5 w-4 origin-center rounded transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: "var(--pill-bg, #fff)" }}
          />
          <span
            className="hamburger-line h-0.5 w-4 origin-center rounded transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: "var(--pill-bg, #fff)" }}
          />
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        className="absolute left-4 right-4 top-[3em] z-[998] origin-top rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] md:hidden"
        style={{
          ...cssVars,
          background: "var(--base, #f0f0f0)",
        }}
      >
        <ul className="m-0 flex list-none flex-col gap-[3px] p-[3px]">
          {items.map((item) => {
            const defaultStyle: React.CSSProperties = {
              background: "var(--pill-bg, #fff)",
              color: "var(--pill-text, #000)",
            };

            if (item.isButton) {
              return (
                <li key="logout">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="block w-full rounded-[50px] px-4 py-3 text-left text-[16px] font-medium transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-[var(--base)] hover:text-[var(--hover-text)]"
                    style={defaultStyle}
                  >
                    {item.label}
                  </button>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-[50px] px-4 py-3 text-[16px] font-medium transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                  style={defaultStyle}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
