import { Paper, TextField  } from "@mui/material";
export const Field =({formData, handleInputChange, ID, Label}) => {

const isDate = 
  ID.toLowerCase().includes("date") ||
  ID.toLowerCase().includes("admitted");

  // Normaliza fechas tipo "1982-09-06 00:00:00" → "1982-09-06"
  const normalizeDate = (str) => {
    if (!str) return "";
    return str.split("T")[0].split(" ")[0];
  };

  const rawValue = formData?.[ID] || "";
  const value = isDate ? normalizeDate(rawValue) : rawValue;

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
            minRows={1}
            maxRows={200}
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
                marginTop: -0.2,
              },
            }}
          />
        </div>
      </Paper>
    </div>
  );

};