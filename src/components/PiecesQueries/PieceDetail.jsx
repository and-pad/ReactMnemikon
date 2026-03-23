import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import { Carousel } from 'react-bootstrap';
import SETTINGS from '../Config/settings';
import QrCodeGenerator from './qr';
//import langData from '../Languages/en/Lang';
import "./fileColors.css"
import "./details.css"
//import { getTranslations } from '../Languages/i18n';
import { getTranslations, getActualLang } from '../Languages/i18n';
import moment from '../LocalTools/moment';
import { formatTimeAgo } from '../LocalTools/tools';
import 'moment/locale/es-mx'; // Importa el paquete de locales dentro de moment
//import 'moment-precise-range-plugin';
import DownloadDocument from './getWordDetail';
import { Button } from '@mui/material';


const langData = getTranslations();

// Crea el contexto
const DataContext = createContext();

const IdInventory = 'inventoryImgModal';
const IdResearch = 'researchImgModal';
const IdRestoration = 'restorationImgModal';

const ModalPictures = ({ IDmodal, Pics }) => {

    const pathInventoryImagesFull = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_full_size;
    const pathResearchImagesFull = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.research_full_size;
    const pathRestorationImagesFull = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.restoration_full_size;

    var ImageModal;
    if (IDmodal === IdInventory) {
        ImageModal = pathInventoryImagesFull;
    } else if (IDmodal === IdResearch) {
        ImageModal = pathResearchImagesFull;
    } else if (IDmodal === IdRestoration) {
        ImageModal = pathRestorationImagesFull;
    };

    const handleDownload = async (fileName) => {
        console.log(fileName);
        var fileUrl;
        if (IDmodal === IdInventory) {
            fileUrl = pathInventoryImagesFull + fileName;
        } else if (IDmodal === IdResearch) {
            fileUrl = pathResearchImagesFull + fileName;
        }
        //console.log(fileUrl);
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };


    return (
        <>
            {/* Modal */}
            <div className="modal fade" id={IDmodal} tabIndex="-1" aria-labelledby={`${IDmodal}Label`} aria-hidden="true">
                <div className="modal-dialog modal-lg modal-fullscreen-md-down bg-secondary">
                    <div className="modal-content">
                        <div className="modal-body bg-secondary">
                            <button type="button" className="btn-close mt-1 me-1" data-bs-dismiss="modal" aria-label="Close"></button>
                            <div id={`carousel${IDmodal}Fade`} className="carousel slide carousel-fade">
                                <div className="carousel-inner">

                                    {Pics && Pics.length > 0 ? Pics.map((photo, index) => (
                                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={photo.file_name}>
                                            <img src={ImageModal + photo.file_name} className="d-block w-100 mt-3" alt="..." />

                                            {/* Línea divisoria */}
                                            <hr className="my-4" />

                                            {/* Contenedor para botón y detalles */}
                                            <div className="d-flex justify-content-between align-items-center">
                                                {/* Botón de descarga alineado a la derecha */}
                                                <button
                                                    className="btn btn-primary"

                                                    onClick={() => handleDownload(photo.file_name)}
                                                >
                                                    Descargar
                                                </button>

                                                {/* Contenedor para Fotógrafo y Fecha */}
                                                <div className="ms-3 text-end">
                                                    <div>Fotógrafo: <span>{photo.photographer}</span></div>
                                                    <div>Fecha: <span>{photo.date}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : <p>No hay imágenes disponibles.</p>}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${IDmodal}Fade`} data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel${IDmodal}Fade`} data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export const PieceDetail = ({ accessToken, refreshToken }) => {

    //moment.locale(getActualLang());

    const { _id } = useParams();
    const [Data, setData] = useState(null);
    const navigate = useNavigate();
    //const location = useLocation();    
    var imgurl;
    useEffect(() => {

        const fetchDetail = async () => {
            var data;
            //console.log('accesTokn', accessToken);
            try {
                const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/user_query/detail/${_id}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {                        
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json' // ← Esto es necesario

                    },
                    
                });

                data = await response.json();
                if (response.ok) {
                    setData(data);
                } else {
                    // Manejar errores de autenticación


                    return 'not authenticated';
                }
            } catch (error) {
                console.log('elerror', error);
                return 'not network';
                // Manejar errores de red
            }
            return null;
        };
        fetchDetail().then(res => {
            if (res === 'not authenticated' /*|| response === 'not network'*/) {
                console.log("no ahutorized", res);
                navigate(`/mnemosine/piece_queries/detail/${encodeURIComponent(_id)}/`);
            }
        });
        // console.log('location',location.state.from);
    }, [_id, accessToken, refreshToken, navigate]);

    const [inventory, setInventory] = useState([]);
    const [research, setResearch] = useState([]);
    const [restoration, setRestoration] = useState([]);
    const Photos = Data?.detail[0]?.photo_info?.map((photo, index) => {

        const photo_info = {
            file_name: photo.file_name,
            module_id: photo.module_id,
            description: photo.description,
            created_at: photo.photographed_at,
            photographer: photo.photographer
        }
        return photo_info;
    });

    useEffect(() => {
        // Inicializar listas locales
        const locInven = [];
        const locResearch = [];
        const locRest = [];

        const photos = Data?.detail[0]?.photo_info?.map((photo, index) => {

            const photo_info = {
                file_name: photo.file_name,
                module_id: photo.module_id,
                description: photo.description,
                created_at: photo.photographed_at,
                photographer: photo.photographer
            }
            return photo_info;
        });

        // Procesar los módulos y fotos
        Data?.modules.forEach((module) => {
            photos?.forEach((photo) => {
                
                    if (module.name === 'inventory' && module._id === photo.module_id) {
                        locInven.push(photo);
                    }                     
                    if ( (module.name === 'research') && (module._id === photo.module_id)) {
                        //console.log('research photo', photo);
                        locResearch.push(photo);
                    } 
                    if (module.name === 'restoration' && module._id === photo.module_id) {
                        locRest.push(photo);
                    }
                
            });
        });

        // Actualizar estado una vez después de procesar
        setInventory(locInven);
        setResearch(locResearch);
        setRestoration(locRest);
        // El array de dependencias
    }, [Data]); // El efecto se ejecutará solo cuando Data o Photos cambien
    if (Photos) {
        imgurl = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails + Photos[0].file_name;
        //console.log(imgurl);
    }
    // console.log(imgurl);
    const pathInventoryImagesThumbnail = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails;
    const pathResearchImagesThumbail = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.research_thumbnails;
    const pathRestorationImagesThumbnail = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.restoration_thumbnails;
    /*<DownloadDocument id={Data?.detail[0]?._id ? Data.detail[0]._id : null} inv_num={Data?.detail[0]?.inventory_number ? Data.detail[0]?.inventory_number : null} accessToken={accessToken} />
    <div className="col-2 mt-3 me-0">
                    <QrCodeGenerator Number={Data?.detail[0]?.inventory_number ? Data.detail[0].inventory_number : 'ND'} />
                </div>
    */
    return (
        <DataContext.Provider value={Data}>
            <div className="mt-0">
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'rgba(0, 100, 180, 0.612)' }}>

                    <div className="container-fluid">
                        <span className="navbar-brand text-dark" style={{ fontSize: '16px' }}>{langData.pieceDetailMenu.nameMenu}</span>
                        <Button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown2" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" >
                            <span className="navbar-toggler-icon"></span>
                        </Button>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown2">
                            <ul className="navbar-nav" style={{ fontSize: '15px' }}>
                                <li className="nav-item">
                                    <Link to="inventory" className="nav-link text-white" aria-current="page">{langData.pieceDetailMenu.inventory}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="research" className="nav-link text-white" aria-current="page">{langData.pieceDetailMenu.research}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="restoration" className="nav-link text-white" aria-current="page">{langData.pieceDetailMenu.restoration}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="movements" className="nav-link text-white" aria-current="page">{langData.pieceDetailMenu.movements}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            <div className="row d-flex mt-3">
                <div className="col-10 d-flex  "
                    style={{ marginBottom: "500px" }}>
                    <Outlet />
                </div>


                <div className="col-2">


                    <div className="card me-2 ms-0">
                        <QrCodeGenerator Number={Data?.detail[0]?.inventory_number ? Data.detail[0].inventory_number : 'ND'} />
                    </div>

                    <div className="card me-2 ms-0">
                        <div className="card-header d-flex justify-content-between align-items-center text-center" role="tab">
                            <div
                                className="d-flex justify-content-between align-items-center w-100" // Flex para centrar y expandir a toda la tarjeta
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseInventarioImagenes"
                                aria-expanded="true"
                            >
                                <strong className="link-like mx-auto"> {/* Usar mx-auto para centrar el texto */}
                                    {langData.pieceDetailImages.inventory.inventory_images}
                                </strong>
                                <div className="card-header-actions ms-2">
                                    <div
                                        className="card-header-action btn-minimize"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseInventarioImagenes"
                                        aria-expanded="true"
                                        rel="tooltip"
                                        title="Mostrar u ocultar"
                                    >
                                        <i className="bi bi-chevron-up"></i> {/* Icono de flecha hacia arriba */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="collapseInventarioImagenes" className="collapse show">
                            <div className="card-body py-2">
                                <Carousel fade interval={3000} indicators={false} controls={false}>
                                    {inventory && inventory.length > 0 ? (
                                        inventory.map((photo, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    src={`${pathInventoryImagesThumbnail}${photo.file_name}`}
                                                    className="d-block img-thumbnail mx-auto"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#${IdInventory}`}
                                                    alt={`Slide ${index}`}
                                                    style={{ maxHeight: '150px', objectFit: 'contain' }} // Opcional: ajustar tamaño de la imagen
                                                />
                                                <strong>{photo.description}</strong>
                                                <p>{formatTimeAgo(moment(photo.created_at), getActualLang())}</p>
                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <Carousel.Item>
                                            <p className="text-center">No hay imágenes disponibles.</p>
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                    <div className="card me-2 mt-2">
                        <div className="card-header d-flex justify-content-between align-items-center text-center" role="tab">
                            <div
                                className="d-flex justify-content-between align-items-center w-100" // Flex para centrar y expandir a toda la tarjeta
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseInvestigacionImagenes"
                                aria-expanded="true"
                            >
                                <strong className="link-like mx-auto"> {/* Usar mx-auto para centrar el texto */}
                                    {langData.pieceDetailImages.research.research_images}
                                </strong>
                                <div className="card-header-actions ms-2">
                                    <div
                                        className="card-header-action btn-minimize"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseInvestigacionImagenes"
                                        aria-expanded="true"
                                        rel="tooltip"
                                        title="Mostrar u ocultar"
                                    >
                                        <i className="bi bi-chevron-up"></i> {/* Icono de flecha hacia arriba */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="collapseInvestigacionImagenes" className="collapse show">
                            <div className="card-body py-2">
                                <Carousel fade interval={3000} indicators={false} controls={false}>
                                    {research && research.length > 0 ? (
                                        research.map((photo, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    src={`${pathResearchImagesThumbail}${photo.file_name}`}
                                                    className="d-block img-thumbnail mx-auto"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#${IdResearch}`}
                                                    alt={`Slide ${index}`}
                                                    style={{ maxHeight: '150px', objectFit: 'contain' }} // Opcional: ajustar tamaño de la imagen
                                                />
                                                <strong>{photo.description}</strong>

                                                <p>{formatTimeAgo(moment(photo.created_at), getActualLang())}</p>

                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <Carousel.Item>
                                            <p className="text-center">No hay imágenes disponibles.</p>
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                    <div className="card me-2 mt-2">
                        <div className="card-header d-flex justify-content-between align-items-center text-center" role="tab">
                            <div
                                className="d-flex justify-content-between align-items-center w-100" // Flex para centrar y expandir a toda la tarjeta
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseRestorationImagenes"
                                aria-expanded="true"
                            >
                                <strong className="link-like mx-auto"> {/* Usar mx-auto para centrar el texto */}
                                    {langData.pieceDetailImages.restoration.restoration_images}
                                </strong>
                                <div className="card-header-actions ms-2">
                                    <div
                                        className="card-header-action btn-minimize"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseRestorationImagenes"
                                        aria-expanded="true"
                                        rel="tooltip"
                                        title="Mostrar u ocultar"
                                    >
                                        <i className="bi bi-chevron-up"></i> {/* Icono de flecha hacia arriba */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="collapseRestorationImagenes" className="collapse show">
                            <div className="card-body py-2">
                                <Carousel fade interval={3000} indicators={false} controls={false}>
                                    {restoration && restoration.length > 0 ? (
                                        restoration.map((photo, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    src={`${pathRestorationImagesThumbnail}${photo.file_name}`}
                                                    className="d-block img-thumbnail mx-auto"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#${IdRestoration}`}
                                                    alt={`Slide ${index}`}
                                                    style={{ maxHeight: '150px', objectFit: 'contain' }} // Opcional: ajustar tamaño de la imagen
                                                />
                                                <strong>{photo.description}</strong>

                                                <p>{formatTimeAgo(moment(photo.created_at), getActualLang())}</p>

                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <Carousel.Item>
                                            <p className="text-center">No hay imágenes disponibles.</p>
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                            </div>
                        </div>

                    </div>

                    <DownloadDocument id={Data?.detail[0]?._id ? Data.detail[0]._id : null} inv_num={Data?.detail[0]?.inventory_number ? Data.detail[0]?.inventory_number : null} accessToken={accessToken} />
                </div>
                <ModalPictures IDmodal={IdInventory} Pics={inventory} />
                <ModalPictures IDmodal={IdResearch} Pics={research} />
                <ModalPictures IDmodal={IdRestoration} Pics={restoration} />
            </div>
        </DataContext.Provider>
    );
}
// <pre>{JSON.stringify(Data?.detail[0]?.photo_info ? Data.detail[0].photo_info.map((photo,index)=>{return photo.file_name}) : null, null, 2)}</pre>
export const useData = () => useContext(DataContext);