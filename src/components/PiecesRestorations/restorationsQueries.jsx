import React from 'react';
import { DatatableUserRestoration } from '../Datatables/DatatablesRestoration';//Componente Datatable de Consultas


export  function RestorationsQueries({ accessToken, refreshToken, permissions, module,title}) {

    
    return (       
            <>
                <div className="PiecesResearchs-container">
                    <DatatableUserRestoration 
                        accessToken={accessToken}
                        refreshToken={refreshToken} 
                        permissions={permissions} 
                        module={module}
                        title={title}
                          />
                </div>
            </>        
    )
}

