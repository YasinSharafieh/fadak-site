"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function settle(el: HTMLElement) {
  const done = (event?: AnimationEvent) => {
    if (event && event.target !== el) return;
    el.removeEventListener("animationend", done);
    if (el.dataset.motionState === "in") el.dataset.motionState = "shown";
  };
  el.addEventListener("animationend", done);
  window.setTimeout(() => done(), 1700);
}

function arm(el: HTMLElement, arrive: boolean) {
  if (el.dataset.motionReady === "1") return;
  el.dataset.motionReady = "1";
  const rect = el.getBoundingClientRect();
  const below = rect.top >= window.innerHeight - 8;
  if (!below && !arrive) {
    el.dataset.motionState = "shown";
    return;
  }
  if (!below) {
    el.dataset.motionState = "in";
    settle(el);
    return;
  }
  el.dataset.motionState = "wait";
}

/**
 * هر بخش موقع اسکرول، و محتوای تازه‌رسیده‌اش موقع لود، یک‌بار وارد می‌شود.
 * رنگ، چیدمان، حالت شب و قطعه‌های ثابت دست نمی‌خورند.
 */
export default function ScrollStage() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    const scopes = [document.querySelector("main"), document.querySelector("footer")].filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
    if (!scopes.length) return;

    const waiting = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.dataset.motionState !== "wait") continue;
          el.dataset.motionState = "in";
          waiting.delete(el);
          io.unobserve(el);
          settle(el);
        }
      },
      { rootMargin: "0px 0px 80px 0px", threshold: 0.01 },
    );

    function reveal(el: HTMLElement, arrive: boolean) {
      arm(el, arrive);
      if (el.dataset.motionState === "wait") {
        waiting.add(el);
        io.observe(el);
      }
    }

    function staggerChild(parent: HTMLElement, child: HTMLElement, arrive: boolean) {
      if (child.dataset.motionReady === "1") return;
      const variant = parent.getAttribute("data-motion-stagger") || "rise";
      const index = Math.max(0, [...parent.children].indexOf(child));
      child.dataset.motion = variant;
      child.style.setProperty("--motion-delay", `${Math.min(index, 8) * 70}ms`);
      reveal(child, arrive);
    }

    function scan(root: ParentNode, arrive: boolean) {
      if (arrive && root instanceof HTMLElement && root.parentElement?.hasAttribute("data-motion-stagger")) {
        staggerChild(root.parentElement, root, true);
      }

      const parents = root instanceof HTMLElement && root.hasAttribute("data-motion-stagger")
        ? [root]
        : [...root.querySelectorAll<HTMLElement>("[data-motion-stagger]")];
      for (const parent of parents) {
        for (const child of parent.children) {
          if (child instanceof HTMLElement) staggerChild(parent, child, arrive);
        }
      }

      const marked = [
        ...(root instanceof HTMLElement && root.hasAttribute("data-motion") && !root.hasAttribute("data-motion-stagger") ? [root] : []),
        ...root.querySelectorAll<HTMLElement>("[data-motion]:not([data-motion-stagger])"),
      ];
      for (const el of marked) reveal(el, arrive);
    }

    const releaseVisible = () => {
      for (const el of [...waiting]) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight + 40) {
          el.dataset.motionState = "in";
          waiting.delete(el);
          io.unobserve(el);
          settle(el);
        }
      }
    };
    window.addEventListener("scroll", releaseVisible, { passive: true });
    window.addEventListener("resize", releaseVisible);

    for (const scope of scopes) scan(scope, false);
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement) scan(node, true);
        }
      }
    });
    for (const scope of scopes) mo.observe(scope, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", releaseVisible);
      window.removeEventListener("resize", releaseVisible);
      for (const el of waiting) {
        delete el.dataset.motionReady;
        if (el.dataset.motionState === "wait") el.dataset.motionState = "shown";
      }
    };
  }, [pathname]);

  return null;
}
