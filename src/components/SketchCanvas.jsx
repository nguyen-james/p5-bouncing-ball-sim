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

    const p5Instance = createSketch(containerRef.current, paramsRef);
    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={containerRef} />;
}

