import React, { useEffect, useRef } from "react";
import { createSketch } from "../animations/sketch";

export default function SketchCanvas({
  gravity,
  ballSize,
  paused,
  hasTrail,
  duplicate,
  resetToken,
}) {
  const containerRef = useRef(null);
  const p5Ref = useRef(null);
  const paramsRef = useRef({
    gravity,
    ballSize,
    paused,
    hasTrail,
    duplicate,
    resetToken,
  });

  useEffect(() => {
    paramsRef.current = {
      gravity,
      ballSize,
      paused,
      hasTrail,
      duplicate,
      resetToken,
    };
  }, [gravity, ballSize, paused, hasTrail, duplicate, resetToken]);

  useEffect(() => {
    if (!containerRef.current) return;

    // StrictMode can mount effects twice in development.
    // Ensure we never keep more than one canvas instance.
    if (p5Ref.current) {
      p5Ref.current.remove();
      p5Ref.current = null;
    }

    p5Ref.current = createSketch(containerRef.current, paramsRef);

  }, []);

  return <div ref={containerRef} />;
}

