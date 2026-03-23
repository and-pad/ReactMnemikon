//import { Navigate } from 'react-router-dom';
import { DatatableUserInventory } from '../Datatables/DatatablesInventory';//Componente 
import { DatatableUserQuery } from '../Datatables/DatatablesQuery';
// Datatable de Consultas


export function PiecesQueries({ accessToken, refreshToken,  module, permissions }) {

    if (module === "Query") {
        return (
            <>
                <div className="PiecesQueries-container">
                    <DatatableUserQuery accessToken={accessToken} refreshToken={refreshToken} permissions={permissions} module={module} title={"Consultas"} />
                </div>
            </>
        );
    }
    else if (module === "Inventory") {
        return (
            <>
                <div className="PiecesQueries-container">
                    <DatatableUserInventory accessToken={accessToken} refreshToken={refreshToken} permissions={permissions} module={module} title={"Inventario"}/*onDetailClick={handleDetailClick} */ />
                </div>
            </>
        );
    }
    return null;
}