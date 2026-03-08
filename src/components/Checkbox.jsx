import React from 'react'

export default function Checkbox({ description, variable, setVariable }) {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        checked={variable}
        onChange={(e) => setVariable(e.target.checked)}
      />
      {description}
    </label>
  );
}
