"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** Connect a revision step back to submission, including after responsive reflow. */
export default function DocsReturnLoop({
  children,
  fromId,
  toId,
  label,
}: {
  children: ReactNode;
  fromId: string;
  toId: string;
  label: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markerId = useId();
  const [path, setPath] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    if (!root || !from || !to) return;

    const observer = new ResizeObserver(() => {
      const bounds = root.getBoundingClientRect();
      const start = from.getBoundingClientRect();
      const end = to.getBoundingClientRect();
      const startX = start.left - bounds.left;
      const startY = start.top - bounds.top + start.height / 2;
      const endX = end.left - bounds.left;
      const endY = end.top - bounds.top + end.height / 2;
      setPath(`M ${startX} ${startY} H 8 V ${endY} H ${endX}`);
    });
    for (const element of [root, from, to]) observer.observe(element);
    return () => observer.disconnect();
  }, [fromId, toId]);

  return (
    <div className="df-return-loop" ref={rootRef}>
      {children}
      <svg className="df-return-connector" role="img" aria-label={label}>
        <title>{label}</title>
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        {path ? <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" markerEnd={`url(#${markerId})`} /> : null}
      </svg>
    </div>
  );
}
