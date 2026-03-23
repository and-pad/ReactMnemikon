
import { Switch, FormControlLabel } from "@mui/material";


export const SwitchBaseFrameField = ({formData, handleInputChange, ID, langData}) => {
    return (

      <div id = {ID} className="row mb-3">
  <div className="col d-flex align-items-center gap-3">
    {/* Label fijo */}
    <span className="fw-bold">
      {langData.pieceDetailDescriptors.inventory.base_or_frame}
    </span>

    <FormControlLabel
      control={
        <Switch
          checked={formData?.base_or_frame === "frame"}
          onChange={(e) =>
            handleInputChange({
              target: {
                id: "base_or_frame",
                value: e.target.checked ? "frame" : "base",
              },
            })
          }
        />
      }
      label={
        formData?.base_or_frame === "frame"
          ? langData.pieceDetailDescriptors.inventory.frame
          : langData.pieceDetailDescriptors.inventory.base
      }
    />
  </div>
</div>


    )
}