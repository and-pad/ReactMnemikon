import { useParams,  Outlet } from "react-router-dom";
import { createContext, useContext,useState ,useEffect} from "react";
import { fetchResearchEdit } from "./APICalls";
const DataContext = createContext();
export const ResearchEdit = ({ accessToken, refreshToken }) => {

    const { _id } = useParams();
    //const navigate = useNavigate();
    const [Data, setData] = useState();
    
    
    //const [Documents, setDocuments] = useState();
    useEffect(()=>{
        fetchResearchEdit(accessToken,refreshToken, _id)
    .then(data =>{
        //console.log(data,"datarecien")
        setData(data); 
        
    })
    .catch(error =>{
        console.error("Error inesperado", error);
    });

    },[_id, accessToken, refreshToken]);    
    
    return (
        <DataContext.Provider value={Data}>
            
            <br/>
            
        
            <Outlet />
        </DataContext.Provider>
    );
}
export const useDataResearch = () => useContext(DataContext);   
    