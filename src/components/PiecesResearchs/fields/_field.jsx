import { Paper, TextField } from "@mui/material";
export const Field = ({ formDataResearch, handleInputChange, ID, Label }) => {
  const value = formDataResearch?.[ID] || "";
  return (
    <>
      <Paper
        elevation={6}
        sx={{
          padding: 1,

          marginRight: 1,
          marginBottom: 1.5,
        }}
      >
        <div className="">
          <TextField
            id={ID}
            variant="outlined"
            fullWidth
            label={Label}
            multiline
            minRows={1}
            maxRows={200}
            size="small"
            value={value}
            onChange={(e) => {
              handleInputChange(e);
              // Ajusta la altura del textarea:
              //e.target.style.height = "auto";
              //e.target.style.height = e.target.scrollHeight + "px";
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#6c757d", // Label en gris
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
              },
              "& textarea": {
                resize: "none", // Evita redimensionar manualmente
                overflow: "hidden", // Sin barra de desplazamiento
              },
            }}
          />
        </div>
      </Paper>
    </>
  );
};
