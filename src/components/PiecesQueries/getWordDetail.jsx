import React from "react";
import SETTINGS from "../Config/settings";

const DownloadDocument = ({ id, inv_num , accessToken }) => {
    const generate_doc_url = SETTINGS.URL_ADDRESS.server_api_commands + SETTINGS.URL_ADDRESS.generate_word;
    const handleDownload = async () => {
        const _id = id;
        //console.log(_id,"i_d")
        try{
            const response = await fetch(generate_doc_url, { // Ajusta la URL según tu configuración de Django
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // Ajusta para usar el token de autenticación si es necesario
                },
                body: JSON.stringify({ _id: _id })
            });
            if (!response.ok) {
                throw new Error('Error al descargar el documento');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pieza_${inv_num}.docx`; // Nombre del archivo que se descargará
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error){
            console.error("Error al descargar el documento",error);        
        }
    } 
    return (
        <div>
            <button className="btn btn-primary" onClick={handleDownload}>Descargar Dcocumento</button>
        </div>
    )
}

export default DownloadDocument;