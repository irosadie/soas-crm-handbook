"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** Connect a revision step back to submission, including after responsive reflow. */
export default function DocsReturnLoop({
  children,
  fromId,
  toId,
  label,
  enabled = true,
}: {
  children: ReactNode;
  fromId: string;
  toId: string;
  label: string;
  enabled?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markerId = useId();
  const [path, setPath] = useState("");

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;

    const updatePath = () => {
      // Resolve within this loop each time: React can replace a node with the same ID.
      const from = root.querySelector<HTMLElement>(`#${CSS.escape(fromId)}`);
      const to = root.querySelector<HTMLElement>(`#${CSS.escape(toId)}`);
      if (!from || !to) {
        setPath("");
        return;
      }
      const bounds = root.getBoundingClientRect();
      const start = from.getBoundingClientRect();
      const end = to.getBoundingClientRect();
      if (!start.width || !start.height || !end.width || !end.height) {
        setPath("");
        return;
      }
      const startX = start.left - bounds.left;
      const startY = start.top - bounds.top + start.height / 2;
      const endX = end.left - bounds.left;
      const endY = end.top - bounds.top + end.height / 2;
      setPath(`M ${startX} ${startY} H 8 V ${endY} H ${endX}`);
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePath);
    };
    const observer = new ResizeObserver(scheduleUpdate);
    const observeCurrentNodes = () => {
      observer.disconnect();
      observer.observe(root);
      for (const id of [fromId, toId]) {
        const node = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
        if (node) observer.observe(node);
      }
      scheduleUpdate();
    };
    const mutations = new MutationObserver(observeCurrentNodes);
    mutations.observe(root, { childList: true, subtree: true, characterData: true });
    observeCurrentNodes();
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [fromId, toId, enabled]);

  if (!enabled) return <>{children}</>;

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
