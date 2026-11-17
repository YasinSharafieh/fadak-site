"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function CenteredScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const center = node?.querySelector<HTMLElement>("[data-center]");
    if (!node || !center) return;
    const place = () => {
      const nodeRect = node.getBoundingClientRect();
      const centerRect = center.getBoundingClientRect();
      const delta = centerRect.left + centerRect.width / 2 - (nodeRect.left + nodeRect.width / 2);
      if (Math.abs(delta) > 2) node.scrollBy({ left: delta });
    };
    place();
    const timer = window.setTimeout(place, 60);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className="media-wrap">
      {children}
    </div>
  );
}
