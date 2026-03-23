import { useState } from "react";
import { Button, Collapse } from "@mui/material";

const PiecesCell = ({ value }) => {
  const [open, setOpen] = useState(false);

  if (!value) return null;

  // 🔥 convertir string → array limpio
  const items = value.split(",").map(item => item.trim());

  const maxVisible = 5;
  const visibleItems = open ? items : items.slice(0, maxVisible);

  return (
    <div style={{ maxWidth: "180px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {visibleItems.map((item, index) => (
          <span
            key={index}
            style={{
              background: "#0f2aa3",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px"
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {items.length > maxVisible && (
        <>
          <Collapse in={open}>
            {/* ya están renderizados arriba, esto solo controla animación */}
          </Collapse>

          <Button
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ mt: 1, textTransform: "none", color: "#d2d2d3" }}
          >
            {open ? "Ocultar" : `Ver más (${items.length - maxVisible})`}
          </Button>
        </>
      )}
    </div>
  );
};

export default PiecesCell;