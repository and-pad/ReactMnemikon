import { useParams, Outlet } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";

import { fetchInventoryEdit, fetchNewInventory } from "./APICalls";
import {
  canCreateInventory,
  canEditInventory,
  InventoryPermissionFallback,
} from "./inventoryPermissions";
const DataContext = createContext();

export const InventoryAction = ({
  accessToken,
  refreshToken,
  permissions,
  action,
}) => {
  const { _id } = useParams();
  //const navigate = useNavigate();
  const [Data, setData] = useState();
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    if (action === "edit") {
      if (canEditInventory(permissions)) {
        fetchInventoryEdit(accessToken, refreshToken, _id)
          .then((data) => {
            setData({
                ...data,
                action:action,
                });
            setHasPermission(true);
          })
          .catch((error) => {
            console.error("Error inesperado", error);
          });
      } else {
        setHasPermission(false);
      }

    } else if (action === "new") {
        if (canCreateInventory(permissions)) {
          fetchNewInventory(accessToken, refreshToken, _id)
            .then((data) => {
              setData({
                ...data,
                action,
              });
              setHasPermission(true);
            })
            .catch((error) => {
              console.error("Error inesperado", error);
            });
        } else {
          setHasPermission(false);
        }
    }
  }, [_id, accessToken, refreshToken, action, permissions]);

  return (
    <DataContext.Provider value={Data}>
      <br />
     
      {hasPermission ? (
        <Outlet />
      ) : action === "new" ? (
        <InventoryPermissionFallback title="No tienes permiso para agregar piezas de inventario." />
      ) : (
        <InventoryPermissionFallback title="No tienes permiso para editar piezas de inventario." />
      )}
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
