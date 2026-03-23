
import { TextField, Paper } from "@mui/material";

export const Field =({formDataRestoration, handleInputChange, ID, Label}) => {
   // Detecta si el campo es fecha por nombre (treatment_date, created_date, etc.)
  const isDate = ID.toLowerCase().includes("date");

  // Normaliza fechas tipo "1982-09-06 00:00:00" → "1982-09-06"
  const normalizeDate = (str) => {
    if (!str) return "";
    return str.split("T")[0].split(" ")[0];
  };

  const rawValue = formDataRestoration?.[ID] || "";
  const value = isDate ? normalizeDate(rawValue) : rawValue;

  // Si es fecha, retorna un input tipo calendario
  if (isDate) {
    return (
      <div className="row">
        <Paper elevation={6} sx={{ p: 1, mb: 1, mr: 1 }}>
          <TextField
            id={ID}
            label={Label}
            type="date"
            fullWidth
            size="small"
            value={value}
            onChange={handleInputChange}
            slotProps={{
              inputLabel: { shrink: true }, // reemplazo de InputLabelProps
            }}
          />
        </Paper>
      </div>
    );
  }

  // Si no es fecha → retorna el textfield multiline como antes
  return (
    <div className="row">
      <Paper
        elevation={6}
        sx={{
          paddingLeft: 1,
          paddingRight: 1,
          paddingBottom: 0,
          paddingTop: 1,
          marginRight: 1,
          marginBottom: 1,
        }}
      >
        <div className="mb-2">
          <TextField
            id={ID}
            variant="outlined"
            fullWidth
            label={Label}
            multiline
            size="small"
            rows={1}
            value={value}
            onChange={(e) => {
              handleInputChange(e);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#6c757d",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
              },
              "& textarea": {
                resize: "none",
                overflow: "hidden",
                marginBottom: -0.3,
                marginTop: -0.4,
              },
            }}
          />
        </div>
      </Paper>
    </div>
  );
};