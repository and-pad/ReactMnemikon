import { Paper, TextField } from "@mui/material";

export const AppraisalField = ({ formData, handleInputChange, langData }) => {
  return (
    <>
      {/*<label htmlFor="appraisal" className="form-label">
              {/*langData.pieceDetailDescriptors.inventory.appraisal*/}
      {/*      </label>*/}

      <Paper
        elevation={6}
        sx={{
          paddingLeft: 1,
          paddingRight: 1,
          paddingBottom: 1,
          paddingTop: 1,
          marginRight: -1,
          marginLeft: -1,
          marginBottom: 1,
          marginTop: 2,
        }}
      >
        <TextField
          type="number"          
          id="appraisal"
          value={formData?.appraisal ? formData?.appraisal : ""}
          fullWidth
          size="small"
          label={langData.pieceDetailDescriptors.inventory.appraisal}
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
      </Paper>
    </>
  );
};
