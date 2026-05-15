import { useParams,  Outlet } from "react-router-dom";
import { createContext, useContext,useState ,useEffect} from "react";
import { fetchResearchEdit } from "./APICalls";
import {
    canCreateResearch,
    canEditResearch,
    canOpenResearchEditor,
    ResearchPermissionFallback,
} from "./researchPermissions";
const DataContext = createContext();
export const ResearchEdit = ({ accessToken, refreshToken, permissions }) => {

    const { _id } = useParams();
    const [Data, setData] = useState();
    const [permissionError, setPermissionError] = useState("");

    useEffect(()=>{
        if (!canOpenResearchEditor(permissions)) {
            setPermissionError("No tienes permiso para abrir el editor de investigación.");
            return;
        }

        fetchResearchEdit(accessToken,refreshToken, _id)
    .then(data =>{
        if (data?.ok === false) {
            setPermissionError(data?.message || "No tienes permiso para abrir el editor de investigación.");
            return;
        }

        const hasExistingResearch = Boolean(data?.research_data?._id);
        const canAccessExisting = hasExistingResearch && canEditResearch(permissions);
        const canAccessNew = !hasExistingResearch && (canCreateResearch(permissions) || canEditResearch(permissions));

        if (!canAccessExisting && !canAccessNew) {
            setPermissionError(
                hasExistingResearch
                    ? "No tienes permiso para editar investigaciones."
                    : "No tienes permiso para crear investigaciones."
            );
            return;
        }

        setPermissionError("");
        setData(data); 
        
    })
    .catch(error =>{
        console.error("Error inesperado", error);
    });

    },[_id, accessToken, refreshToken, permissions]);    
    
    return (
        <DataContext.Provider value={Data}>
            
            <br/>
            
            {permissionError ? (
                <ResearchPermissionFallback title={permissionError} />
            ) : (
                <Outlet />
            )}
        </DataContext.Provider>
    );
}
export const useDataResearch = () => useContext(DataContext);   
    
