import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchRestorationEditSelect } from "./APICalls";
import { SelectDatatable } from "./edit-selectDatatable";
//const DataContext = createContext();

export const RestorationEditSelect = ({ accessToken, refreshToken }) => {
  const { _id } = useParams();
 // const navigate = useNavigate();
  const [Data, setData] = useState();

  // const [Documents, setDocuments] = useState();

  useEffect(() => {
    fetchRestorationEditSelect(accessToken, refreshToken, _id)
      .then((data) => {
        //console.log(data,"datarecien")
        setData(data);
      })
      .catch((error) => {
        console.error("Error inesperado", error);
      });
  }, [_id, accessToken, refreshToken ]);

  /*const handleEdit = ({ navigate, restoration }) => {
    console.log("restoration", restoration["_id"]);
    navigate(
      `/mnemosine/piece_restorations/actions/${encodeURIComponent(
        _id
      )}/edit-select/restoration/${encodeURIComponent(restoration["_id"])}/edit`
    );
  };*/

  return (
    <>
    <SelectDatatable 
    restorations={Data ? Data["restorations"] : []}
    _id={_id}
     
     
     />
      
      <br />
    </>
  );
};

//export const useDataRestoration = () => useContext(DataContext);
