//import { Select } from "@mui/material";
import SETTINGS from "../Config/settings";
import { getActualLang, getTranslations } from "../Languages/i18n";
import moment from "../LocalTools/moment";
import { useNavigate } from "react-router-dom";
/*import "moment/locale/fr";  
import "moment/locale/es";
import "moment/locale/en-gb";*/


const langData = getTranslations();
//console.log(getActualLang());
/*if (getActualLang() === "en") {
  moment.locale("en");
}*/

switch (getActualLang()){

  case "en":
    moment.locale("en");
    break;
  case "es":
    moment.locale("es-mx");
    break;
  case "fr":
    import("moment/locale/fr");
    moment.locale("fr-ca");
    break;
  default:
    moment.locale("es-mx");
    break;

} 

//moment.locale(getActualLang());

const editRestorationClick = ({ _ids, navigate }) => {
  //path="piece_restorations/actions/:_id/edit-select/restoration/:restoration_id/edit"
  navigate(`/mnemosine/piece_restorations/actions/${encodeURIComponent(_ids[1])}/edit-select/restoration/${encodeURIComponent(_ids[0])}/edit`);
};  

const CustomCell = ({row, column}) => {
  let value = row[column]
 // console.log("customCell",row);
  return <div>{value}</div>

}
export const SelectActions = ({ row }) => {
  const navigate = useNavigate();
  const _ids = row["_ids"];
  return (
        <>
            <div className="d-flex justify-content-around">
                <button className="btn btn-sm btn-primary" onClick={() => editRestorationClick({ _ids, navigate })}>
                    <i className="fas fa-edit"></i>
                </button>
                <button className="btn btn-sm btn-danger">
                    <i className="fas fa-trash-alt"></i>
                </button>
                <button className="btn btn-sm btn-info">
                    <i className="fas fa-history"></i>
                </button>
            </div>
        </>
    )
};



export const columnsSelector = [
  {
    id: "_ids",
    name: "Ids",
    selector: (row) => row["_ids"],
    omit: true,
  },
  {
    id: "Date_treatment",
    name: langData.edit_selectDatatable.treatment_date,
    selector: (row) => row["treatment_date"],

    sortable: true,
  },
  {
    id: "Preliminary_examination",
    name: langData.edit_selectDatatable.preliminary_examination,
    selector: (row) => row["preliminary_examination"],    
    sortable: true,
    cell: row => <CustomCell row={row} column="preliminary_examination"/>,
  },
  {
    id: "Photo",
    name: langData.edit_selectDatatable.photo,
    selector: (row) => row["photo"],
    cell: (row) => row["photo"] && row["photo"].length > 0 ? 
    ( <div>
      {console.log("photo",row["photo"])}
      <img src={SETTINGS.URL_ADDRESS.server_url + 
                SETTINGS.URL_ADDRESS.restoration_thumbnails +
                row["photo"][0]["file_name"]} alt="photo" width="100px" height="100px"
      />
    </div>
    )  
    : 
    null
  },

  {
    id: "Actions",
    name: langData.edit_selectDatatable.actions,
    selector: (row) => row["actions"],
    cell: (row) => <SelectActions row={row} />,
  },
];

export const structureData = (restoration) => {
  return {
    _ids: [restoration["_id"], restoration["piece_id"]],
    treatment_date: moment( restoration["treatment_date"]).format("LL"),
    preliminary_examination: restoration["preliminary_examination"],
    photo: restoration["photo_info"],
    actions: null,
  };
};

