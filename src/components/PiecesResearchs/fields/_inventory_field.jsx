import { Paper, TextField } from "@mui/material";

export const InventoryField = ({
  label,
  value,
  setFormDataResearch,
  fieldName,
  //formDataResearch,
  //langData,
}) => {
  return (
    <>
        <Paper
            elevation={6}
            sx={{
              paddingLeft: 1,
              paddingRight: 1,
              paddingBottom: 0,
              paddingTop: 1,
              marginLeft: 1,
              marginRight: 1,
              marginBottom: 1,
            }}
          >
            <div className="mb-2">
              <TextField
                fullWidth
                variant="outlined"
                label={
                  label
                }
                multiline
                size="small"
                rows={2}
                value={value}
                onChange={(e) => {
                  setFormDataResearch((prevData) => ({
                    ...prevData,
                    [fieldName]: e.target.value,
                  }));
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#6c757d", // Color gris para el label
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                  },
                  "& textarea": {
                    resize: "both", // Permite redimensionar
                    overflow: "auto", // Asegura que se pueda desplazar si es necesario
                  },
                }}
              />
            </div>
          </Paper>
    </>
  );
};