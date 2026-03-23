import { useState, useEffect } from "react";

export function useScrollPosition({ref}) {
  const containerRef = ref;

  const handleClick = () => {
    if (containerRef.current) {
      console.log("ScrollTop actual:", containerRef.current.scrollTop);
      alert(containerRef.current.scrollTop);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Ver posición scroll</button>

      <div
        ref={containerRef}
        style={{
          height: "200px",
          overflowY: "auto",
          border: "1px solid #ccc",
          marginTop: "1rem",
        }}
      >
        {[...Array(50)].map((_, i) => (
          <p key={i}>Fila {i + 1}</p>
        ))}
      </div>
    </div>
  );
}
