//const ServerName =  "http://10.10.0.2/"; //
const ServerName =  "https://192.168.1.70/"; //
/*const ServerName =
  typeof window !== "undefined"
    ? `${window.location.origin}/`
    : "https://mnemikon.duckdns.org/";*/

const SETTINGS = {
    URL_ADDRESS: {
        server_url: ServerName, //images documents and files
        //server_api_commands:"/api/", 
        server_api_commands: 'http://localhost:8000/',//
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
