//import langData from '../Languages/en/Lang';
import SETTINGS from "../Config/settings";
import { useNavigate } from 'react-router-dom';

import { getTranslations } from '../Languages/i18n';
const langData = getTranslations();


const CustomCell = ({ row, column }) => {
    const value = row[column];
    
    let text;

    /*if (column === 'publications'){
        console.log("value", typeof value);
    }*/

    if (typeof value === "string" && value.length > 100 ){
        text =  value.substring(0, 100) + "..." 
        console.log(text);
    }

    else if (value && value[0] && typeof value[0] === "string" && value[0].length > 100 ){
        

       text =  value[0].substring(0, 100) + "..." 
      // console.log(text);
    }   
    else{
        text = value;
    } 

    return (
        <div>
            <div style={{ textAlign: "justify" }}>
                <p className="col text-wrap">
                    {text}
                </p>
            </div>
        </div>
    );
};


const CustomTag = ({ row, column }) => {
    const textColumn = row[column];
    let Arrayelements;
    if (textColumn !== undefined) {
        Arrayelements = textColumn.split(",");
    }//
    else { Arrayelements = [] };
    return (
        <div className="mt-2">
            {Arrayelements.map((element, index) => (
                <div key={`${element}-${index}`}>
                    <div style={{ textDecoration: 'none', height: '1.2em', paddingTop: '1px', backgroundColor: '#1e80e1' }} className="badge rounded-pill text-dark ">{element}</div>
                    <div style={{ height: '.2em' }}></div>
                </div>
            ))}
        </div>
    );
};

const detailClick = ({ row, navigate }) => {
    navigate(`/mnemosine/piece_queries/detail/${encodeURIComponent(row._id[0])}/inventory`);
};

// `/piece_queries/detail / ${ encodeURIComponent(Row) }`

const CustomPhoto = ({ row, column, /*onDetailClick*/ }) => {
    //   const navigatess = useNavigate();
    //  const history = useHistory();    
    const fileName = row[column];
    const AddrImgName = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails + fileName;
   
    const navigate = useNavigate();


    return (
        <>
            <div className="position-relative d-inline-block" style={{ width: '110px' }}>

                <div className="position-absolute top-0 end-0 rounded" style={{ backgroundColor: 'rgba(210, 210, 210, .7)', marginTop: '4px', marginRight: '4px', cursor: 'pointer' }} onClick={() => detailClick({ row, navigate })} >
                    <i className='fas fa-eye' style={{ fontSize: '10px', border: '1px solid #fff', borderRadius: '50%', padding: '2px', margin: '2px', color: 'blue' }}></i>
                </div>

                <div key={fileName + column} className="text-center frameThmb" style={{ width: "100px" }}>
                    <img alt="Thumbnail" src={AddrImgName} />
                </div>
            </div>
        </>
    );
}

const editInventoryClick = ({_id, navigate}) => {
    navigate(`/mnemosine/inventory_queries/actions/${encodeURIComponent(_id[0])}/edit`)
}


const InventoryActions = ({ row, column }) => {
   
    const _id = row._id;
    const navigate = useNavigate();
    
    return (
        <>
            <div className="d-flex justify-content-around">
                <button className="btn btn-sm btn-primary" onClick={() => editInventoryClick({ _id, navigate })}>
                    <i className="fas fa-edit"></i>
                </button>
                
                <button className="btn btn-sm btn-danger">
                    <i className="fas fa-trash-alt"></i>
                </button>
                {/*<button className="btn btn-sm btn-info">
                    <i className="fas fa-history"></i>
                </button>*/}
            </div>
        </>
    )

};

const editResearchClick = ({_id, navigate}) => {
    navigate(`/mnemosine/piece_researchs/actions/${encodeURIComponent(_id[0])}/edit`)
};

const editRestorationClick = ({_id, navigate}) => {
    navigate(`/mnemosine/piece_restorations/actions/${encodeURIComponent(_id[0])}/edit-select`)
};
const ResearchActions = ({ row, column }) => {
    const _id = row._id;
    const navigate = useNavigate();
    return (
        <>
            <div className="d-flex ">
                <button className="btn btn-sm btn-primary me-1" onClick={() => { editResearchClick({ _id, navigate })}}>
                    <i className="fas fa-edit"></i>
                </button>
                <button className="btn btn-sm btn-danger me-1">
                    <i className="fas fa-trash-alt"></i>
                </button>
                <button className="btn btn-sm btn-info me-2">
                    <i className="fas fa-history"></i>
                </button>
            </div>
        </>
    )
};

const RestorationActions = ({ row, column }) => {
    const _id = row._id;
    const navigate = useNavigate();
    return (
        <>
            <div className="d-flex ">
                <button className="btn btn-sm btn-primary me-1" onClick={() => { editRestorationClick({ _id, navigate })}}>
                    <i className="fas fa-edit"></i>
                </button>
                <button className="btn btn-sm btn-danger me-1">
                    <i className="fas fa-trash-alt"></i>
                </button>
                <button className="btn btn-sm btn-info me-2">
                    <i className="fas fa-history"></i>
                </button>
            </div>
        </>
    )
};

export const applyLogicToInventoryColumn = (columnName, columnProps /*onDetailClick*/) => {
    // Aplica la lógica según el nombre de la columna
    switch (columnName) {

        /************************************************/
        /************************************************/
        /*****Columnas para modulo Consultas-Queries*****/
        case "inventory_number":

            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.inventory_number,
                reorder: true,
                show: true,
                //width: '110px',
                //minWidth: '90px',
                // Otras propiedades específicas de "inventory_number" aquí
            };
        case "catalog_number":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.catalog_number,
                reorder: true,
                show: true,
                // Otras propiedades específicas de "catalog_number" aquí
            };
        case "origin_number":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.origin_number,
                reorder: true,
                show: true,
                // Otras propiedades específicas de "origin_number" aquí
            };
        case "genders_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.genders_info,
                reorder: true,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "genders_info" aquí
            };
        case "subgenders_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.subgenders_info,
                reorder: true,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "subgenders_info" aquí
            };
        case "type_object_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.type_object_info,
                reorder: true,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "type_object_info" aquí
            };
        case "dominant_material_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.dominant_material_info,
                reorder: true,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "dominant_material_info" aquí
            };
        case "location_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.location_info,
                reorder: true,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "location_info" aquí
            };
        case "tags":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.tags,
                reorder: true,
                show: true,
                cell: row => <CustomTag row={row} column={columnName} />,
                // Otras propiedades específicas de "tags" aquí
            };
        case "description_origin":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.description_origin,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "description_origin" aquí
            };
        case "description_inventory":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.description_inventory,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "description_inventory" aquí
            };
        case "title":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.title,
                // Otras propiedades específicas de "title" aquí
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
            };
        case "authors_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.authors_info,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "authors_info" aquí
            };
        case "keywords":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.keywords,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "keywords" aquí
            };
        case "technique":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.technique,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "technique" aquí
            };
        case "materials":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.materials,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "materials" aquí
            };
        case "acquisition_form":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.acquisition_form,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "acquisition_form" aquí
            };
        case "acquisition_source":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.acquisition_source,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "acquisition_source" aquí
            };
        case "acquisition_date":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.acquisition_date,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "acquisition_date" aquí
            };
        case "firm_description":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.firm_description,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "firm_description" aquí
            };
        case "short_description":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.short_description,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "short_description" aquí
            };
        case "formal_description":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.formal_description,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "formal_description" aquí
            };
        case "observation":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.observation,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "observation" aquí
            };
        case "publications":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.publications,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "publications" aquí
            };
        case "card":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.card,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "card" aquí
            };
        case "involved_creation_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.involved_creation_info,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "involved_creation_info" aquí
            };
        case "period_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.period_info,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "period_info" aquí
            };
        case "measure_with":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.measure_with,
                sortable: false,
                show: true,
                // Otras propiedades específicas de "measure_with" aquí                
                cell: row => <CustomCell row={row} column={columnName} />,
            };
        case "measure_without":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.measure_without,
                sortable: false,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "measure_without" aquí
            };
        case "photo_thumb_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.photo_thumb_info,
                sortable: false,
                show: true,
                // maxWidth: '125px',
                cell: row => <CustomPhoto row={row} column={columnName} /*onDetailClick={onDetailClick}*/ />,
                // Otras propiedades específicas de "measure_without" aquí
            };

        case "_id":
            return {
                ...columnProps,
                name: '_id',
                sortable: false,
                show: false,
                omit: false,
            };
        /***********************************************************************************/
        /***********************************************************************************/
        /***********************************************************************************/
        // En el caso de Inventario-Inventory se toma todo lo anterior, solo se agrega una columna

        case "actions_inventory":
           
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.actions,
                sortable: false,
                show: true,
                cell: row => <InventoryActions row={row} column={columnName} />,
            };

        case "actions_research":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.actions,
                sortable: false,
                show: true,
                cell: row => <ResearchActions row={row} column={columnName} />,
                width: '125px',
                
            };

        case "actions_restoration":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.actions,
                sortable: false,
                show: true,
                cell: row => <RestorationActions row={row} column={columnName} />,
                width: '125px',
                
            };            
        /***********************************************************************************/
        /***********************************************************************************/
        /***********************************************************************************/

        // Continúa agregando más casos según sea necesario para otras columnas
        default:
            return columnProps; // Mantén las propiedades predeterminadas si no hay lógica específica
    }
};