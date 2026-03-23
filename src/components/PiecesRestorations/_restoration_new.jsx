

import { InventoryFields } from "./fields/_inventory_fields";
import { RestorationFields } from "./fields/_restoration_fields";
//import { ImagesField } from "./fields/_image_fields";
import { NewImagesField } from "./fields/_new_images_fields";
//import { DocumentsField } from "./fields/_documents_fields";
import { NewDocumentsField } from "./fields/_new_documents_fields";
//import { useEffect, useState } from "react";

//const langData = getTranslations();

export const RestorationNew = ({
  formDataRestoration,
  setFormDataRestoration,
  catalogResponsible,
  //photos,  
  //setPhotos,
  PicsNew,
  setPicsNew,
  //changedPics,
  //setChangedPics,
  //Documents,
  //setDocuments,
  //actualDocs,
  DocumentsNew,
  setDocumentsNew,  

}) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormDataRestoration((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <>
      <InventoryFields
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
      />
      <RestorationFields
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
        setFormDataRestoration={setFormDataRestoration}
        catalogResponsible={catalogResponsible}
      />
      
      <NewImagesField PicsNew={PicsNew} setPicsNew={setPicsNew}/>      

      <NewDocumentsField DocumentsNew={DocumentsNew} setDocumentsNew={setDocumentsNew}/>
      
    </>
  );
};
