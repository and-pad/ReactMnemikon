import { Field } from "./_field";
import { getTranslations } from "../../Languages/i18n";
import { SwitchBaseFrameField } from "./_switch_baseframe_field";

const langData = getTranslations();

export const InventoryFields = ({ formDataRestoration, handleInputChange }) => {
  return (
    <div
      className="card border-primary pb-3 pt-4 ps-4 pe-4 mb-2"
      style={{ background: " #abaa" }}
    >
      <div className="row">
          <SwitchBaseFrameField
            formData={formDataRestoration}
            handleInputChange={handleInputChange}
            ID={"base_or_frame"}
            langData={langData}
          />
        </div>
      <div className="row">
        
        <div className="col me-2">          
          <Field
            formDataRestoration={formDataRestoration || []}
            handleInputChange={handleInputChange}
            ID={"height"}
            Label={langData.pieceRestorationEdit.height}
          />
        </div>
        <div className="col me-2">
          <Field
            formDataRestoration={formDataRestoration || []}
            handleInputChange={handleInputChange}
            ID={"width"}
            Label={langData.pieceRestorationEdit.width}
          />
        </div>
        <div className="col me-2">
          <Field
            formDataRestoration={formDataRestoration || []}
            handleInputChange={handleInputChange}
            ID={"depth"}
            Label={langData.pieceRestorationEdit.depth}
          />
        </div>
        <div className="col">
          <Field
            formDataRestoration={formDataRestoration || []}
            handleInputChange={handleInputChange}
            ID={"diameter"}
            Label={langData.pieceRestorationEdit.diameter}
          />
        </div>
      </div>



      <div className="row">

        <div className="col me-2">
          <Field
            formDataRestoration={formDataRestoration || []}
            handleInputChange={handleInputChange}
            ID={"height_with_base"}
            Label={langData.pieceRestorationEdit.height_with_base}
          />
        </div>
        <div className="col me-2">
          <Field
            formDataRestoration={formDataRestoration || []}
            handleInputChange={handleInputChange}
            ID={"width_with_base"}
            Label={langData.pieceRestorationEdit.width_with_base}
          />
        </div>
        <div className="col me-2">
          <Field
            formDataRestoration={formDataRestoration || []}
            handleInputChange={handleInputChange}
            ID={"depth_with_base"}
            Label={langData.pieceRestorationEdit.depth_with_base}
          />
        </div>
        <div className="col">
          <Field
            formDataRestoration={formDataRestoration || []}
            handleInputChange={handleInputChange}
            ID={"diameter_with_base"}
            Label={langData.pieceRestorationEdit.diameter_with_base}
          />
        </div>


      </div>


    </div>
  );
};
