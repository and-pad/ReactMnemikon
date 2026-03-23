import { useParams, Outlet } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";

import { fetchInventoryEdit, fetchNewInventory } from "./APICalls";
const DataContext = createContext();

const HasntPermission = () => {
  return (
    <div>
      <h1> No tienes permiso para editar</h1>
    </div>
  );
};

export const InventoryAction = ({
  accessToken,
  refreshToken,
  permissions,
  action,
}) => {
  const { _id } = useParams();
  //const navigate = useNavigate();
  const [Data, setData] = useState();
  const [Documents, setDocuments] = useState();
  const [hasPermission, setHasPermission] = useState(true);
 // const [Action, setAction] = useState(action);
  useEffect(() => {
    if (action === "edit") {

      if (permissions.includes("editar_inventario")) {
        fetchInventoryEdit(accessToken, refreshToken, _id)
          .then((data) => {
            console.log(data,"datarecien")
            setData({
                ...data,
                action:action,
                });
            console.log({...data,
                action:action,
            },"datadespues")
           // setAction(action);
            setDocuments(data["documents"]);
            setHasPermission(true);
          })
          .catch((error) => {
            console.error("Error inesperado", error);
          });
      } else {
        setHasPermission(false);
      }

    } else if (action === "new") {

        if (permissions.includes("agregar_inventario")) {
          fetchNewInventory(accessToken, refreshToken, _id)
            .then((data) => {
              //console.log(data,"datarecien")
              
         setData({
                ...data,
                action,
                });
              //setAction(action);
              //setDocuments(data["documents"]);
              setHasPermission(true);
            })
            .catch((error) => {
              console.error("Error inesperado", error);
            });
        } else {
          setHasPermission(false);
        }
    }
  }, [_id, accessToken, refreshToken]);

  return (
    <DataContext.Provider value={Data}>
      <br />
     
      {hasPermission ? <Outlet /> : <HasntPermission />}
    </DataContext.Provider>
  );
};

/* {Documents?.map((document) => {
        return document.file_name;
      })}*/

/*const DataNewContext = createContext();/*

/*
export const NewInventory = ({ accessToken, refreshToken, permissions }) => {
  //const { _id } = useParams();
  //const navigate = useNavigate();
  const [Data, setData] = useState();
  const [hasPermission, setHasPeEditInventoryrmission] = useState(true);

  useEffect(() => {
    if (permissions.includes("agregar_inventario")) {
      fetchNewInventory(accessToken, refreshToken, _id)
        .then((data) => {
          //console.log(data,"datarecien")
          /* setData(data); 
        setDocuments(data["documents"]);
        setHasPermission(true);*/
 /*       })
        .catch((error) => {
          console.error("Error inesperado", error);
        });
    } else {
      setHasPermission(false);
    }
  }, [_id, accessToken, refreshToken]);

  return (
    <DataNewContext.Provider value={Data}>
      <br />

      {hasPermission ? <Outlet /> : <HasntPermission />}
    </DataNewContext.Provider>
  );
};
*/
//export const useNewData = () => useContext(DataNewContext);
export const useData = () => useContext(DataContext);
