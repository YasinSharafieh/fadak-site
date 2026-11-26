"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function MediaScroller({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, more: false });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      setEdges({
        top: node.scrollTop > 6,
        more: node.scrollTop + node.clientHeight < node.scrollHeight - 6,
      });
    };
    update();
    node.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => {
      node.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`media-links-frame${edges.top ? " has-top" : ""}${edges.more ? " has-more" : ""}`}>
      <div ref={ref} className="media-links" role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
