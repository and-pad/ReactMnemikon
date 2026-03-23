const ServerName =  "http://192.168.3.73/"; // 
//const ServerName =  "https://and-pad.duckdns.org/"; 

const SETTINGS = {
    URL_ADDRESS: {
        server_url: ServerName, //images documents and files
        server_api_commands:"http://192.168.3.73:8000/", 
//        server_api_commands: ServerName + 'api/',//
        generate_word: 'authenticated/user_query/detail/word/',

        inventory_thumbnails: 'static/documents/public/inventario/fotosThumbnails/',
        inventory_full_size: 'static/documents/public/inventario/fotos/',
        research_thumbnails: 'static/documents/public/investigacion/fotosThumbnails/',
        research_full_size: 'static/documents/public/investigacion/fotos/',
        
        restoration_thumbnails:'static/documents/public/restauracion/fotosThumbnails/',
        restoration_full_size:'static/documents/public/restauracion/fotos/',
        //static/images/temporary_uploads/
        temporary_upload_documents: 'static/images/temporary_uploads/',
        inventory_documents:'static/documents/public/inventario/documentos/',
        research_documents:'static/documents/public/investigacion/documentos/',
        restoration_documents:'static/documents/public/restauracion/documentos/',

            },

};

export default SETTINGS;