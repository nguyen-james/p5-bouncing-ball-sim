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

    const container = containerRef.current;
    if (!container) return;

    // Remove previous instance if one exists, then recreate.
    if (p5Ref.current) {
      p5Ref.current.remove();
      p5Ref.current = null;
    }

    // Full DOM cleanup before (re)mount.
    container.innerHTML = "";

    // Create new p5 instance.
    p5Ref.current = createSketch(container, paramsRef);

    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} />;
}