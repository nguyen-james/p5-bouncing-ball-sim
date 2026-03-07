import React, { useState } from 'react'

export default function HomePage() {
    const [gravity, setGravity] = useState(1);
    const [paused, setPaused] = useState(true);
    const [hasTrail, setHasTrail] = useState(false);
    const [duplicate, setDuplicate] = useState(false);
    const [colors, setColors] = useState(["red"]);

  return (
    <div>
        HomePage
    </div>
  )
}
