import { useData } from './PieceDetail';
//import langData from '../Languages/en/Lang';
import SETTINGS from '../Config/settings';
import moment from '../LocalTools/moment';
import 'moment/locale/es-mx'; // Importa el paquete de locales dentro de moment
import { Tooltip } from 'react-tooltip';
import { getTranslations, getActualLang } from '../Languages/i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CopyToClipboard, formatSize, formatCurrency, formatTimeAgo, fileTypes, mimeIcons, colorFile, ClipboardButton } from '../LocalTools/tools';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'; // Asegúrate de importar el ícono necesario
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const langData = getTranslations();

const DownloadButton = ({ key, document, module }) => {
  var fileUrl;
  if (module === "inventory") {
    fileUrl = SETTINGS.URL_ADDRESS.server_url + 'static/documents/app/public/inventario/documentos/' + document.file_name;
  }
  else if (module === 'research') {
    fileUrl = SETTINGS.URL_ADDRESS.server_url + 'static/documents/public/investigacion/documentos/' + document.file_name;
  }
  else if (module === "restoration") {
    //console.log('restoration');
    fileUrl = SETTINGS.URL_ADDRESS.server_url + 'static/documents/public/restauracion/documentos/' + document.file_name;
  }
  // const downloadLinkRef = useRef(null);
  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };
  //const file_type_name = fileTypes;

  const fileIcon = mimeIcons[document.mime_type] || faFileAlt; // Fallback icon
  const fileColor = colorFile[fileTypes[document.mime_type]];
  return (
    <div className={`card my-0 text-white bg-${fileColor}`}>
      <div className="card-body">
        <div className="row position-static">
          <div className="col-2 position-static">
            <button className="btn btn-link stretched-link text-white" onClick={handleDownload}>
              <FontAwesomeIcon icon={fileIcon} size="2x" />
            </button>
          </div>
          <div className="col-10 position-static">
            <div className="text-value">{document.name}</div>
            <div>
              Tamaño: {formatSize(document.size)} | Tipo: {fileTypes[document.mime_type]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Inventory = () => {

  const data = useData();
  //console.log('data', data);
  const item = data?.detail[0] ? data.detail[0] : null;

  moment.locale(getActualLang());

  const arrival_date_exists = item?.movements_info[0]?.arrival_date ? item.movements_info[0].arrival_date ? true : false : false;
  var FdateArrival;
  var FdateDeparture;

  if (arrival_date_exists) {
    const dateArrival = moment(item?.movements_info[0].arrival_date);
    FdateArrival = dateArrival.format('LL');
  } else {
    const dateDeparture = moment(item?.movements_info[0]?.departure_date ? item?.movements_info[0].departure_date : '0000-00-00');
    FdateDeparture = dateDeparture.format('LL');
  }
  //console.log("item",item);
  return (
    <>
      <ToastContainer />
      
      <div className="card card-body justify-content-end col-12 bg-gradient" style={{ backgroundColor: 'rgb(190,180,180)' }}>
        <p className="card col-5 mb-2 bg-color bg-gradient" style={{ backgroundColor: 'rgb(145,145,145)', margin: '0 auto' }}>
          {langData.pieceDetailMenu.inventory}
        </p>

        <div className="row justify-content-center ms-2 me-2">
          <div className="card ms-4 mb-1 me-4 col-12 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
            <div className="col-12 d-flex flex-column flex-md-row justify-content-md-between mb-1 mb-md-0 mx-md-2 mt-1 pb-1">
              <p className="mb-2 mb-md-0 mx-md-2">
                {langData.pieceDetailDescriptors.inventory.inventory_number} : {item?.inventory_number ? item.inventory_number : 'N/D'}
              </p>
              <p className="mb-2 mb-md-0 mx-md-2">
                {langData.pieceDetailDescriptors.inventory.catalog_number} : {item?.catalog_number ? item.catalog_number : 'N/D'}
              </p>
              <p className="mb-2 mb-md-0 mx-md-2">
                {langData.pieceDetailDescriptors.inventory.origin_number} : {item?.origin_number ? item.origin_number : 'N/D'}
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <p className="mb-1">
            <a className="btn btn-primary btn-sm col-12 bg-gradient" data-bs-toggle="collapse" href="#collapseDescription" role="button" aria-expanded="false" aria-controls="collapseDescription">
              {langData.pieceDetailDescriptors.inventory.description_origin}
            </a>
          </p>
          <div className={`collapse ${item?.description_origin ? 'show' : ''}  mt-0`} id="collapseDescription">

            <div className="form-floating mb-3" style={{ backgroundColor: 'rgb(190,190,190)' }}>
              <div className="card card-body pt-1 pb-1 mb-1 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.description_origin}: <i style={{ cursor: 'pointer' }} className="fa fa-copy me-2 text-primary " onClick={() => CopyToClipboard(item?.description_origin ? item.description_origin : 'N/D')}></i>
                </h6>
                <p className="card-text mb-0 pb-0" style={{ fontSize: '.90em' }}>{item?.description_origin ? item.description_origin : 'N/D'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <p className="mb-1">
            <a className="btn btn-primary btn-sm col-12 bg-gradient" data-bs-toggle="collapse" href="#collapseInventory" role="button" aria-expanded="false" aria-controls="collapseInventory">
              {langData.pieceDetailDescriptors.inventory.description_inventory}
            </a>
          </p>
          <div className={`collapse ${item?.description_inventory ? 'show' : ''}  mt-0`} id="collapseInventory">
            <div className="card card-body pt-1 pb-1 mb-1 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
              <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.description_inventory}: <i style={{ cursor: 'pointer' }} className="fa fa-copy me-2 text-primary" onClick={() => CopyToClipboard(item?.description_inventory ? item.description_inventory : 'N/D')}></i>
              </h6>
              <p className="card-text mb-0 pb-0" style={{ fontSize: '.90em' }}>{item?.description_inventory ? item.description_inventory : 'N/D'}</p>
            </div>
          </div>
        </div>

        <div className="row justify-content-start mb-2 mb-md-0 mx-md-2">
          <div className="card bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
            <div className="col-12 d-flex flex-column flex-md-row justify-content-md-end mb-2 mb-md-0 mx-md-2 mt-1">
              <span className="col-4 mb-2 mb-md-0 mx-md-2">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>
                  {langData.pieceDetailDescriptors.inventory.gender}:
                </h6>
                <p style={{ fontSize: '.90em' }}>{item?.genders_info.title ? item.genders_info.title : "N/D"}</p>
              </span>
              <span className="col-4 mb-2 mb-md-0 mx-md-2">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>
                  {langData.pieceDetailDescriptors.inventory.subgenders_info}:
                </h6>
                <p style={{ fontSize: '.90em' }}>{item?.subgenders_info.title ? item.subgenders_info.title : "N/D"}</p>
              </span>
              <span className="col-4 mb-2 mb-md-0 mx-md-2">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>
                  {langData.pieceDetailDescriptors.inventory.type_object_info}:
                </h6>
                <p style={{ fontSize: '.90em' }}>{item?.type_object_info.title ? item.type_object_info.title : "N/D"}</p>
              </span>
            </div>

            <div className="col-12 d-flex flex-column flex-md-row justify-content-md-end mb-2 mb-md-0 mx-md-2">
              <span className="mb-2 mb-md-0 mx-md-2 col-4">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>
                  {langData.pieceDetailDescriptors.inventory.set}:
                </h6>
                <p style={{ fontSize: '.90em' }}>{item?.set_id ? item.set_id : "N/D"}</p>
              </span>

              <span className="mb-2 mb-md-0 mx-md-2 col-4">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>
                  {langData.pieceDetailDescriptors.inventory.dominant_material_info}:
                </h6>
                <p style={{ fontSize: '.90em' }}>{item?.dominant_material_info.title ? item.dominant_material_info.title : "N/D"}</p>
              </span>
              <span className="mb-2 mb-md-0 mx-md-2 col-4">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>
                  {langData.pieceDetailDescriptors.inventory.tags}:
                </h6>
                <p style={{ fontSize: '.90em' }}>
                  {item?.tags ? item.tags.split(',').map((tag, index) => (
                    <span key={index} className="badge rounded-pill text-bg-info" style={{ textDecoration: 'none', height: '1.2em', paddingTop: '1px', marginRight: '5px' }}>
                      {tag.trim()}
                    </span>
                  )) : "N/D"}
                </p>
              </span>
            </div>

            <div className="col-12 d-flex flex-column flex-md-row justify-content-md-end mb-0 mb-md-0 mx-md-2">
              <span className=" mb-md-0 mx-md-2 col-4">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.appraisal}:</h6>
                <span style={{ fontSize: '.90em' }}>{item?.appraisalc_info ? formatCurrency(item.appraisalc_info[0].appraisal) : 'N/D'}
                  <span data-bs-toggle="modal" data-bs-target="#appraisalModal">

                    <i
                      data-tooltip-id="history-tooltip"
                      data-tooltip-content={langData.pieceDetailDescriptors.inventory.appraisal_history_tooltip}
                      data-tooltip-place="right"
                      className="fas fa-history"
                      style={{ cursor: 'pointer', color: 'rgb(0,80,250)', marginLeft: '5px', textDecoration: 'none', height: "25px", width: "25px" }}>
                    </i>
                    <Tooltip id="history-tooltip" />
                  </span>
                  <div className="modal fade" id="appraisalModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header bg-secondary bg-gradient">
                          <h5 className="modal-title" id="appraisalModalLabel">{langData.pieceDetailAppraisalModal.modalHeader}</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body bg-gradient" style={{ backgroundColor: 'rgb(180,180,180)' }}>
                          <table className='table ' >
                            <thead>
                              <tr>
                                <th scope="col">{langData.pieceDetailAppraisalModal.appraisal}</th>
                                <th scope="col">{langData.pieceDetailAppraisalModal.modified_by}</th>
                                <th scope="col">{langData.pieceDetailAppraisalModal.date}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item?.appraisalc_info ? (
                                item.appraisalc_info.map((appraisal, index) => (
                                  <tr key={index}>
                                    <td style={{ fontWeight: 'bold' }}>{formatCurrency(appraisal.appraisal)}</td>
                                    <td>{`${appraisal.user_info.username} «${appraisal.user_info.email}»`}</td>
                                    <td
                                      data-tooltip-id="dateModal-tooltip"
                                      data-tooltip-content={moment(appraisal.created_at).format('LL')}
                                      data-tooltip-place="right">
                                      {formatTimeAgo(moment(appraisal.created_at), getActualLang())}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="3">N/D</td>
                                </tr>
                              )}
                              <Tooltip id="dateModal-tooltip" />
                            </tbody>

                          </table>
                        </div>
                        <div className="modal-footer bg-secondary bg-gradient">
                          <button type="button" className="btn btn-primary bg-gradient" data-bs-dismiss="modal">{langData.pieceDetailAppraisalModal.close}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
              </span>

              
              <span className="mb-0 mb-md-0 mx-md-2 col-4">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.location_info}:</h6>
                <p style={{ fontSize: '.90em' }}>{item?.location_info ? item.location_info.name : 'N/D'}</p>
              </span>
              <span className="mb-0  mx-md-2 col-4">
                <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>
                  {langData.pieceDetailDescriptors.inventory.date_start_string}{arrival_date_exists ? langData.pieceDetailDescriptors.inventory.arrival_date : langData.pieceDetailDescriptors.inventory.departure_date}
                </h6>
                <p style={{ fontSize: '.90em' }}>{arrival_date_exists ? FdateArrival : FdateDeparture}</p>
              </span>
            </div>
            <div className='border border-primary mb-2 '>
              <div className='bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start' style={{ fontSize: '.90em', height: '20px' }}>
                {langData.pieceDetailDescriptors.inventory.measure_without.replace(/{}/g, item?.base_or_frame ? item.base_or_frame === "base" ? langData.pieceDetailDescriptors.inventory.base : langData.pieceDetailDescriptors.inventory.frame : "")}
              </div>
              <div className="d-flex p-2">
                <div className="flex-fill text-center">
                  <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.height}:</h6></div>
                  <div>{item?.height ? item.height : 'N/D'}</div>
                </div>
                <div className="flex-fill text-center">
                  <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.width}:</h6></div>
                  <div>{item?.width ? item.width : 'N/D'}</div>
                </div>
                <div className="flex-fill text-center">
                  <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.depth}:</h6></div>
                  <div>{item?.depth ? item.depth : 'N/D'}</div>
                </div>
                <div className="flex-fill text-center">
                  <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.diameter}:</h6></div>
                  <div>{item?.diameter ? item.diameter : 'N/D'}</div>
                </div>
              </div>
            </div>
            <div className='border border-primary mb-2'>
              <div className='bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start' style={{ fontSize: '.90em', height: '20px' }}>
                {langData.pieceDetailDescriptors.inventory.measure_with.replace(/{}/g, item?.base_or_frame ? item.base_or_frame === "base" ? langData.pieceDetailDescriptors.inventory.base : langData.pieceDetailDescriptors.inventory.frame : "")}
              </div>
              <div className="d-flex p-2">
                <div className="flex-fill text-center">
                  <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.height}:</h6></div>
                  <div>{item?.height_with_base ? item.height_with_base : 'N/D'}</div>
                </div>
                <div className="flex-fill text-center">
                  <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.width}:</h6></div>
                  <div>{item?.width_with_base ? item.width_with_base : 'N/D'}</div>
                </div>
                <div className="flex-fill text-center">
                  <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.depth}:</h6></div>
                  <div>{item?.depth_with_base ? item.depth_with_base : 'N/D'}</div>
                </div>
                <div className="flex-fill text-center">
                  <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.diameter}:</h6></div>
                  <div>{item?.diameter_with_base ? item.diameter_with_base : 'N/D'}</div>
                </div>
              </div>
            </div>
            <div className='border border-primary mb-2 '>
              <div className='bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start' style={{ fontSize: '.90em', height: '20px' }}>
                {langData.pieceDetailDescriptors.inventory.associated_documents}
              </div>

              <div className=' d-flex  align-items-center justify-content-start p-2'>

                {item?.documents_info ? (
                  item.documents_info.map((document, index) => (

                    /*document.module_info[0] === langData.pieceDetailMenu.inventory ?*/
                    document.module_info[0] === "inventory" ? (
                      <div className="flex-fill me-2 ">
                        <DownloadButton
                          key={index}
                          document={document}
                          module={"inventory"}
                        />
                      </div>
                    ) : null
                  ))
                ) : (
                  "N/D"
                )}
              </div>
            </div>
            <div className='border border-primary mb-2 '>
              <div className='bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start' style={{ fontSize: '.90em', height: '20px' }}>
                {langData.pieceDetailDescriptors.inventory.incidence}
              </div>

              <div className='p-2'>

                {item?.incidence ? item.incidence : "N/D"}
              </div>
            </div>

            <div style={{ fontSize: '.90em' }} className='mb-2 d-flex justify-content-around'>
              <div className="p-2">
                <div className="text-center">
                  {langData.pieceDetailDescriptors.inventory.created_by} <strong>{item?.created_by_piece_info ? item.created_by_piece_info.username : "N/D"}</strong>,                     <span data-tooltip-id="created-tooltip"
                    data-tooltip-content={item?.created_at ? moment(item.created_at).format('LL') : "N/D"}
                    data-tooltip-place="top"
                  >{item?.created_at ? formatTimeAgo(moment(item.created_at), getActualLang()) : "N/D"}</span>
                  <Tooltip id='created-tooltip' />
                </div>
              </div>

              <div className="p-2">
                <div className="text-center" >
                  {langData.pieceDetailDescriptors.inventory.updated_by} <strong>{item?.updated_by_piece_info ? item.updated_by_piece_info.username : "N/D"}</strong>,
                  <span data-tooltip-id="updated-tooltip"
                    data-tooltip-content={item?.updated_at ? moment(item.updated_at).format('LL') : "N/D"}
                    data-tooltip-place="top"
                  >{item?.updated_at ? formatTimeAgo(moment(item.updated_at), getActualLang()) : "N/D"}</span>
                  <Tooltip id='updated-tooltip' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export const Research = () => {
  const data = useData();
  const item = data?.detail ? data.detail[0] : null;
  moment.locale(getActualLang());
  return (
    <>
      <ToastContainer />


      <div className="card card-body justify-content-end col-12 bg-gradient mb-0 pb-1" style={{ backgroundColor: 'rgb(190,180,180)' }}>
        <p className="card col-5 mb-2 bg-color bg-gradient" style={{ backgroundColor: 'rgb(145,145,145)', margin: '0 auto' }}>
          {langData.pieceDetailMenu.research}
        </p>
        <div className="row justify-content-start mb-2 pb-2 mb-md-0 mx-md-2">
          <div className="card bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column mb-2 mb-md-0 mt-1">
                  <h6 style={{ fontSize: '.85em' }} className='mb-0'>{langData.pieceDetailDescriptors.research.title}:</h6>
                  <div style={{ fontSize: '.85em' }} className='mt-0 mb-0'>{item?.research_info[0] ? item.research_info[0].title : "N/D"}</div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column mb-2 mb-md-0 mt-1">
                  <h6 style={{ fontSize: '.85em' }} className='mb-0'>{langData.pieceDetailDescriptors.research.author_s_}:</h6>
                  <div style={{ fontSize: '.85em' }} className='mt-0 mb-0'>
                    {item?.research_info[0]?.authors_info?.map((author, index) => 
                      (<p key={index}>{author.title}</p>))}
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <h6 style={{ fontSize: '.85em' }} className='mb-0'>{langData.pieceDetailDescriptors.research.set}:</h6>
                <div style={{ fontSize: '.85em' }} className='mt-0 mb-0'>{item?.research_info[0]?.set_info?.[0]?.[0]?.title ?? "N/D"}
                </div>
              </div>
              <div className="col-6">
                <h6 style={{ fontSize: '.85em' }} className='mb-0'>{langData.pieceDetailDescriptors.research.involved_creation_info}:</h6>
                {/*console.log(item?.research_info[0]?.involved_creation_info)*/}

                <div style={{ fontSize: '.85em' }} className='mt-0 mb-0'>{item?.research_info[0]?.involved_creation_info?.[0]?.[0]?.title ?? "N/D"}
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-1 pe-0 ps-0 me-0 ms-0 w-100">
            <p className="mb-1">
              <a className="btn btn-primary btn-sm col-12 bg-gradient" data-bs-toggle="collapse" href="#collapseTechnique" role="button" aria-expanded="false" aria-controls="collapseTechnique">
                {langData.pieceDetailDescriptors.research.technique}
              </a>
            </p>
            <div className={`collapse ${item?.research_info[0]?.technique ? 'show' : ''}  mt-0`} id="collapseTechnique">

              <div className="form-floating" style={{ backgroundColor: 'rgb(190,190,190)' }}>
                <div className="card card-body pt-1 pb-1 mb-1 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
                  <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.technique}: <i style={{ cursor: 'pointer' }} className="fa fa-copy me-2 text-primary" onClick={() => CopyToClipboard(item?.research_info[0].technique ? item.research_info[0].technique : 'N/D')}></i>
                  </h6>
                  <p className="card-text mb-0 pb-0" style={{ fontSize: '.90em' }}>{item?.research_info[0]?.technique ? item.research_info[0].technique : 'N/D'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-1 pe-0 ps-0 me-0 ms-0">
            <p className="mb-1">
              <a className="btn btn-primary btn-sm col-12 bg-gradient" data-bs-toggle="collapse" href="#collapseMaterials" role="button" aria-expanded="false" aria-controls="collapseMaterials">
                {langData.pieceDetailDescriptors.research.materials}
              </a>
            </p>
            <div className={`collapse ${item?.research_info[0]?.materials ? 'show' : ''}  mt-0`} id="collapseMaterials">
              <div className="form-floating " style={{ backgroundColor: 'rgb(190,190,190)' }}>
                <div className="card card-body pt-1 pb-1 mb-1 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
                  <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.materials}: <i style={{ cursor: 'pointer' }} className="fa fa-copy me-2 text-primary" onClick={() => CopyToClipboard(item?.research_info[0].materials ? item.research_info[0].materials : 'N/D')}></i>
                  </h6>
                  <p className="card-text mb-0 pb-0" style={{ fontSize: '.90em' }}>{item?.research_info[0]?.materials ? item.research_info[0].materials : 'N/D'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column mb-2 mb-md-0 mt-1">
                  <h6 style={{ fontSize: '.85em' }} className='mb-0'>{langData.pieceDetailDescriptors.research.place_of_creation}:</h6>
                  <div style={{ fontSize: '.85em' }} className='mt-0 mb-0'>{item?.research_info[0]?.place_of_creation_info[0] ? item.research_info[0].place_of_creation_info[0].title : "N/D"}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column mb-2 mb-md-0 mt-1">
                  <h6 style={{ fontSize: '.85em' }} className='mb-0'>{langData.pieceDetailDescriptors.research.creation_date}:</h6>
                  <div style={{ fontSize: '.85em' }} className='mt-0 mb-0'>
                    {item?.research_info[0]?.creation_date ? item.research_info[0].creation_date : "N/D"}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4 mb-1">
              <div className="col-6">
                <h6 style={{ fontSize: '.85em' }} className='mb-0'>{langData.pieceDetailDescriptors.research.period}:</h6>
                <div style={{ fontSize: '.85em' }} className='mt-0 mb-0'>{item?.research_info[0]?.period_info[0]?.title ? item.research_info[0].period_info[0].title : "N/A"}
                </div>
              </div>
              <div className="col-6">
                <h6 style={{ fontSize: '.85em' }} className='mb-0'>{langData.pieceDetailDescriptors.research.keywords}:</h6>
                <div style={{ fontSize: '.85em' }} className='mt-0 mb-0'>{item?.research_info[0]?.keywords ? item.research_info[0].keywords : "N/D"}</div>
              </div>
            </div>
          </div>
          <div className='border border-primary mb-1 mt-2 ps-0 pe-0'>
            <div className='bg-primary text-white w-100 ps-0 pe-0' style={{ fontSize: '.90em', height: '20px' }}>
              {langData.pieceDetailDescriptors.research.provenance}
            </div>

            <div className="d-flex p-2">
              <div className="flex-fill text-center">
                <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.acquisition_form}:</h6></div>
                <div>{item?.research_info[0]?.acquisition_form ? item.research_info[0].acquisition_form : 'N/D'}</div>
              </div>
              <div className="flex-fill text-center">
                <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.acquisition_source}:</h6></div>
                <div>{item?.research_info[0]?.acquisition_source ? item.research_info[0].acquisition_source : 'N/D'}</div>
              </div>
              <div className="flex-fill text-center">
                <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.acquisition_date}:</h6></div>
                <div>{item?.research_info[0]?.acquisition_date ? item.research_info[0].acquisition_date : 'N/D'}</div>
              </div>
            </div>
          </div>
          <div className='border border-primary mb-2 mt-1 ps-0 pe-0'>
            <div className='bg-primary text-white w-100 ps-0 pe-0' style={{ fontSize: '.90em', height: '20px' }}>
              {langData.pieceDetailDescriptors.research.firm_description}
            </div>
            <div className="d-flex p-2">
              <div className="flex-fill text-center">

                <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.description}: <i style={{ cursor: 'pointer' }} className=" col-11 fa fa-copy me-2 text-primary" onClick={() => CopyToClipboard(item?.research_info[0].firm_description ? item.research_info[0].firm_description : 'N/D')}></i>
                </h6></div>
                <div className="col-1">{item?.research_info[0]?.firm ? item.research_info[0].firm ? langData.pieceDetailDescriptors.research.firm_yes : langData.pieceDetailDescriptors.research.firm_no : "N/D"}</div>
                <div>{item?.research_info[0]?.firm_description ? item.research_info[0].firm_description : 'N/D'}</div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-1 pe-0 ps-0 me-0 ms-0 w-100">
            <p className="mb-1">
              <a className="btn btn-primary btn-sm col-12 bg-gradient" data-bs-toggle="collapse" href="#collapseShort_description" role="button" aria-expanded="false" aria-controls="collapseShort_description">
                {langData.pieceDetailDescriptors.research.short_description}
              </a>
            </p>
            <div className={`collapse ${item?.research_info[0]?.short_description ? 'show' : ''}  mt-0`} id="collapseShort_description">

              <div className="form-floating" style={{ backgroundColor: 'rgb(190,190,190)' }}>
                <div className="card card-body pt-1 pb-1 mb-1 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
                  <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.short_description}: <i style={{ cursor: 'pointer' }} className="fa fa-copy me-2 text-primary" onClick={() => CopyToClipboard(item?.research_info[0].short_description ? item.research_info[0].short_description : 'N/D')}></i>
                  </h6>
                  <p className="card-text mb-0 pb-0" style={{ fontSize: '.90em' }}>{item?.research_info[0]?.short_description ? item.research_info[0].short_description : "N/D"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-1 pe-0 ps-0 me-0 ms-0 w-100">
            <p className="mb-1">
              <a className="btn btn-primary btn-sm col-12 bg-gradient" data-bs-toggle="collapse" href="#collapseFormal_description" role="button" aria-expanded="false" aria-controls="collapseFormal_description">
                {langData.pieceDetailDescriptors.research.formal_description}
              </a>
            </p>
            <div className={`collapse ${item?.research_info[0]?.formal_description ? 'show' : ''}  mt-0`} id="collapseFormal_description">

              <div className="form-floating" style={{ backgroundColor: 'rgb(190,190,190)' }}>
                <div className="card card-body pt-1 pb-1 mb-1 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
                  <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.formal_description}: <i style={{ cursor: 'pointer' }} className="fa fa-copy me-2 text-primary" onClick={() => CopyToClipboard(item?.research_info[0].formal_description ? item.research_info[0].formal_description : 'N/D')}></i>
                  </h6>
                  <p className="card-text mb-0 pb-0" style={{ fontSize: '.90em' }}>{item?.research_info[0]?.formal_description ? item.research_info[0].formal_description : 'N/D'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-1 pe-0 ps-0 me-0 ms-0 w-100">
            <p className="mb-1">
              <a className="btn btn-primary btn-sm col-12 bg-gradient" data-bs-toggle="collapse" href="#collapseObservation" role="button" aria-expanded="false" aria-controls="collapseObservation">
                {langData.pieceDetailDescriptors.research.observation}
              </a>
            </p>
            <div className={`collapse ${item?.research_info[0]?.observation ? 'show' : ''}  mt-0`} id="collapseObservation">
              <div className="form-floating" style={{ backgroundColor: 'rgb(190,190,190)' }}>
                <div className="card card-body pt-1 pb-1 mb-1 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
                  <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.observation}: <i style={{ cursor: 'pointer' }} className="fa fa-copy me-2 text-primary" onClick={() => CopyToClipboard(item?.research_info[0].observation ? item.research_info[0].observation : 'N/D')}></i>
                  </h6>
                  <p className="card-text mb-0 pb-0" style={{ fontSize: '.90em' }}>{item?.research_info[0]?.observation ? item.research_info[0].observation : 'N/D'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-1 pe-0 ps-0 me-0 ms-0 w-100">
            <p className="mb-1">
              <a className="btn btn-primary btn-sm col-12 bg-gradient" data-bs-toggle="collapse" href="#collapsePublications" role="button" aria-expanded="false" aria-controls="collapsePublications">
                {langData.pieceDetailDescriptors.research.publications}
              </a>
            </p>
            <div className={`collapse ${item?.research_info[0]?.publications ? 'show' : ''}  mt-0`} id="collapsePublications">

              <div className="form-floating" style={{ backgroundColor: 'rgb(190,190,190)' }}>
                <div className="card card-body pt-1 pb-1 mb-1 bg-gradient" style={{ backgroundColor: 'rgb(170,170,170)' }}>
                  <h6 className="card-title mb-0" style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.publications}: <i style={{ cursor: 'pointer' }} className="fa fa-copy me-2 text-primary" onClick={() => CopyToClipboard(item?.research_info[0].publications ? item.research_info[0].publications : 'N/D')}></i>
                  </h6>
                  <p className="card-text mb-0 pb-0" style={{ fontSize: '.90em' }}>{item?.research_info[0]?.publications ? item.research_info[0].publications : 'N/D'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className=' border border-primary mb-1 mt-2 ps-0 pe-0'>
            <div className='bg-primary text-white w-100 ps-0 pe-0' style={{ fontSize: '.90em', height: '20px' }}>
              {langData.pieceDetailDescriptors.research.foot_notes}
            </div>
            <div className="text-start p-2">
              {item?.research_info[0]?.footnotes_info?.map((footnote, index) => (
                <>
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <span className="nav-link disabled pl-0">
                        <b className="text-primary">{index + 1}</b>
                      </span>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id={`chicago-tab-fn-${index + 1}`} data-bs-toggle="tab" href={`#chicago-fn-${index + 1}`} role="tab" aria-controls={`chicago-fn-${index + 1}`} aria-selected="false">Chicago</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link active" id={`apa-tab-fn-${index + 1}`} data-bs-toggle="tab" href={`#apa-fn-${index + 1}`} role="tab" aria-controls={`apa-fn-${index + 1}`} aria-selected="true">APA</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id={`iso-690-tab-fn-${index + 1}`} data-bs-toggle="tab" href={`#iso-690-fn-${index + 1}`} role="tab" aria-controls={`iso-690-fn-${index + 1}`} aria-selected="false">ISO 690</a>
                    </li>
                  </ul>
                  <div className="tab-content mb-3">
                    <div className="tab-pane fade" id={`chicago-fn-${index + 1}`} role="tabpanel" aria-labelledby={`chicago-tab-fn-${index + 1}`}>
                      {footnote.author}, {footnote.article ? `"${footnote.article}"` : ''} {footnote.chapter ? `"${footnote.chapter}"` : ''}
                      <em>{footnote.title}</em>. {footnote.pages ? `${footnote.pages},` : ''} {footnote.city_country ? footnote.city_country : ''} {footnote.city_country && footnote.editorial ? ':' : ''}
                      {footnote.editorial ? `${footnote.editorial},` : ''} {footnote.vol_no ? `${footnote.vol_no},` : ''} {footnote.publication_date}.
                      <br /><em className="text-muted">{footnote.description}</em>
                    </div>
                    <div className="tab-pane fade show active" id={`apa-fn-${index + 1}`} role="tabpanel" aria-labelledby={`apa-tab-fn-${index + 1}`}>
                      {footnote.author} ({footnote.publication_date}). {footnote.article} {footnote.chapter} <em>{footnote.title}</em>. {footnote.city_country ? footnote.city_country : ''}
                      {footnote.city_country && footnote.editorial ? ':' : ''} {footnote.editorial} {footnote.vol_no ? `${footnote.vol_no},` : ''} {footnote.pages ? `${footnote.pages}.` : ''}
                      <br /><em className="text-muted">{footnote.description}</em>
                    </div>
                    <div className="tab-pane fade" id={`iso-690-fn-${index + 1}`} role="tabpanel" aria-labelledby={`iso-690-tab-fn-${index + 1}`}>
                      {footnote.author}, {footnote.article ? footnote.article : ''} {footnote.chapter ? footnote.chapter : ''}
                      <em>{footnote.title}</em>. {footnote.city_country ? footnote.city_country : ''} {footnote.city_country && footnote.editorial ? ':' : ''}
                      {footnote.editorial ? `${footnote.editorial},` : ''} {footnote.publication_date}. {footnote.vol_no ? `${footnote.vol_no},` : ''} {footnote.pages ? `${footnote.pages},` : ''}
                      <br /><em className="text-muted">{footnote.description}</em>
                    </div>
                  </div>
                </>
              )) ?? "N/D"}
            </div>
          </div>
          <div className=' border border-primary mb-1 mt-2 ps-0 pe-0'>
            <div className='bg-primary text-white w-100 ps-0 pe-0' style={{ fontSize: '.90em', height: '20px' }}>
              {langData.pieceDetailDescriptors.research.bibliography}
            </div>
            <div className="text-start p-2">
              {item?.research_info[0]?.bibliographies_info?.map((bibliography, index) => (
                <>
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <span className="nav-link disabled pl-0">
                        <b className="text-primary">{index + 1}</b>
                      </span>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id={`chicago-tab-fn-b${index + 1}`} data-bs-toggle="tab" href={`#chicago-fn-b${index + 1}`} role="tab" aria-controls={`chicago-fn-b${index + 1}`} aria-selected="false">Chicago</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link active" id={`apa-tab-fn-b${index + 1}`} data-bs-toggle="tab" href={`#apa-fn-b${index + 1}`} role="tab" aria-controls={`apa-fn-b${index + 1}`} aria-selected="true">APA</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id={`iso-690-tab-fn-b${index + 1}`} data-bs-toggle="tab" href={`#iso-690-fn-b${index + 1}`} role="tab" aria-controls={`iso-690-fn-b${index + 1}`} aria-selected="false">ISO 690</a>
                    </li>

                    <li className="nav-item ms-5">
                      <span className="nav-link disabled"><span className="badge bg-primary">{bibliography.reference_type_info[0] ? bibliography.reference_type_info[0] : 'Tipo de referencia no definido'}</span></span>
                    </li>

                  </ul>
                  <div className="tab-content mb-3">
                    <div className="tab-pane fade" id={`chicago-fn-b${index + 1}`} role="tabpanel" aria-labelledby={`chicago-tab-fn-b${index + 1}`}>
                      {bibliography.author}, {bibliography.article ? `"${bibliography.article}"` : ''} {bibliography.chapter ? `"${bibliography.chapter}"` : ''} {bibliography.editor ? `En ${bibliography.editor}` : ''}
                      <em>{bibliography.title}</em>. {bibliography.pages ? `${bibliography.pages},` : ''} {bibliography.city_country || ''} {bibliography.city_country && bibliography.editorial ? ':' : ''}
                      {bibliography.editorial ? `${bibliography.editorial},` : ''} {bibliography.vol_no ? `${bibliography.vol_no},` : ''} {bibliography.publication_date}. {bibliography.identifier} {bibliography.webpage || ''}
                    </div>
                    <div className="tab-pane fade show active" id={`apa-fn-b${index + 1}`} role="tabpanel" aria-labelledby={`apa-tab-fn-b${index + 1}`}>
                      {bibliography.author} ({bibliography.publication_date}). {bibliography.article} {bibliography.chapter} {bibliography.editor ? `En ${bibliography.editor}` : ''} <em>{bibliography.title}</em>. {bibliography.city_country || ''}
                      {bibliography.city_country && bibliography.editorial ? ':' : ''} {bibliography.editorial} {bibliography.vol_no ? `${bibliography.vol_no},` : ''} {bibliography.pages ? `${bibliography.pages}.` : ''} {bibliography.identifier}
                      {bibliography.webpage ? `Recuperado de ${bibliography.webpage}` : ''}
                    </div>
                    <div className="tab-pane fade" id={`iso-690-fn-b${index + 1}`} role="tabpanel" aria-labelledby={`iso-690-tab-fn-b${index + 1}`}>
                      {bibliography.author}, {bibliography.article || ''} {bibliography.chapter || ''} {bibliography.editor ? `En ${bibliography.editor}` : ''}
                      <em>{bibliography.title}</em>. {bibliography.city_country || ''} {bibliography.city_country && bibliography.editorial ? ':' : ''}
                      {bibliography.editorial ? `${bibliography.editorial},` : ''} {bibliography.publication_date}. {bibliography.vol_no ? `${bibliography.vol_no},` : ''} {bibliography.pages ? `${bibliography.pages},` : ''} {bibliography.identifier}
                      {bibliography.webpage ? `Disponible en: ${bibliography.webpage}` : ''}
                    </div>
                  </div>
                </>
              )) ?? "N/D"}
            </div>
          </div>
          <div className='border border-primary mb-2 '>

            <div className='bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start' style={{ fontSize: '.90em', height: '20px' }}>
              {langData.pieceDetailDescriptors.inventory.associated_documents}
            </div>

            <div className=' d-flex  align-items-center justify-content-start p-2'>
              
              {item?.documents_info ? (
                item.documents_info.map((document, index) => (
                  document.module_info[0] === 'research' ? (
                    <div className="flex-fill me-2 ">
                      <DownloadButton
                        key={index}
                        document={document}
                        module={'research'}
                      />
                    </div>) : null))) : ("N/D")}
            </div>
          </div>
          <div className='border border-primary mb-1 mt-2 ps-0 pe-0'>
            <div className='bg-primary text-white w-100 ps-0 pe-0' style={{ fontSize: '.90em', height: '20px' }}>
              {langData.pieceDetailDescriptors.research.card}
            </div>

            <div className="d-flex p-2">
              <div className="flex-fill text-center">
                <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.research.card}:</h6></div>
                <div>{item?.research_info[0] ? item.research_info[0].card : 'N/D'}</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: '.90em' }} className='mb-2 d-flex justify-content-around'>
            <div className="p-2">
              <div className="text-center">
                {langData.pieceDetailDescriptors.inventory.created_by} <strong>{item?.research_info[0] ? item.research_info[0].created_by_info[0] : "N/D"}</strong>,                     <span data-tooltip-id="created-tooltip"
                  data-tooltip-content={item?.research_info[0]?.created_at ? moment(item.research_info[0].created_at).format('LL') : "N/D"}
                  data-tooltip-place="top"
                >{item?.research_info[0]?.created_at ? formatTimeAgo(moment(item.research_info[0].created_at), getActualLang()) : "N/D"}</span>
                <Tooltip id='created-tooltip' />
              </div>
            </div>
            <div className="p-2">
              <div className="text-center" >
                {langData.pieceDetailDescriptors.inventory.updated_by} <strong>{item?.research_info[0] ? item.research_info[0].updated_by_info[0] : "N/D"}</strong>,                    <span data-tooltip-id="updated-tooltip"
                  data-tooltip-content={item?.research_info[0]?.updated_at ? moment(item.research_info[0].updated_at).format('LL') : "N/D"}
                  data-tooltip-place="top"
                >{item?.research_info[0]?.updated_at ? formatTimeAgo(moment(item.research_info[0].updated_at), getActualLang()) : "N/D"}</span>
                <Tooltip id='updated-tooltip' />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
export const Restoration = () => {
  const data = useData();
  moment.locale(getActualLang());
  const item = data?.detail[0] ? data.detail[0] : null;
  return (
    <>
      <ToastContainer />

      <div className="card card-body justify-content-end col-12 bg-gradient mb-0 pb-1" style={{ backgroundColor: 'rgb(190,180,180)' }}>
        <p className="card col-5 mb-2 bg-color bg-gradient" style={{ backgroundColor: 'rgb(145,145,145)', margin: '0 auto' }}>
          {langData.pieceDetailMenu.restoration}
        </p>
        <div className="row justify-content-start mb-2 pb-2 mb-md-0 mx-md-2">

          {item?.restorations_info?.map((restorations, index) => (
            
              <div key={index} className="card bg-gradient pb-2 mb-1" style={{ backgroundColor: 'rgb(170,190,170)' }}>
                <a className="btn btn-primary btn-sm col-12 bg-gradient mt-2" data-bs-toggle="collapse" href={`#collapseResearch${index}`} role="button" aria-expanded="false" aria-controls={`collapseResearch${index}`}>
                  {moment(restorations.treatment_date).format('LL')}
                </a>
                <div className='collapse pb-2' id={`collapseResearch${index}`}>
                  <div className="card card-body mt-1" style={{ backgroundColor: 'rgb(180,180,180)' }}>
                    <div className="d-flex align-items-center">
                      <ClipboardButton
                        btLabel={langData.pieceDetailDescriptors.restoration.preliminary_examination}
                        btId={`preliminary${index}`}
                        btText={restorations?.preliminary_examination ? restorations.preliminary_examination : "N/D"}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      {restorations?.preliminary_examination ? restorations.preliminary_examination : "N/D"}
                    </div>

                    <div className="d-flex align-items-center">
                      <ClipboardButton
                        btLabel={langData.pieceDetailDescriptors.restoration.laboratory_analysis}
                        btId={`laboratory${index}`}
                        btText={restorations?.laboratory_analysis ? restorations.laboratory_analysis : "N/D"}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      {restorations?.laboratory_analysis ? restorations.laboratory_analysis : "N/D"}
                    </div>

                    <div className="d-flex align-items-center">
                      <ClipboardButton
                        btLabel={langData.pieceDetailDescriptors.restoration.proposal_of_treatment}
                        btId={`proposal${index}`}
                        btText={restorations?.proposal_of_treatment ? restorations.proposal_of_treatment : "N/D"}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      {restorations?.proposal_of_treatment ? restorations.proposal_of_treatment : "N/D"}
                    </div>

                    <div className="d-flex align-items-center">
                      <ClipboardButton
                        btLabel={langData.pieceDetailDescriptors.restoration.results}
                        btId={`results${index}`}
                        btText={restorations?.results ? restorations.results : "N/D"}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      {restorations?.results ? restorations.results : "N/D"}
                    </div>

                    <div className="d-flex align-items-center">
                      <ClipboardButton
                        btLabel={langData.pieceDetailDescriptors.restoration.observations}
                        btId={`observations${index}`}
                        btText={restorations?.observations ? restorations.observations : "N/D"}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      {restorations?.observations ? restorations.observations : "N/D"}
                    </div>

                  </div>
                  <div className="d-flex justify-content-evenly flex-wrap">
                    <div className="d-flex flex-column align-items-center me-2">
                      <ClipboardButton
                        btLabel={langData.pieceDetailDescriptors.restoration.treatment_date}
                        btId={`treatmentDate${index}`}
                        btText={restorations?.treatment_date ? moment(restorations.treatment_date).format('LL') : "N/D"}
                      />
                      <div>
                        {restorations?.treatment_date ? moment(restorations.treatment_date).format('LL') : "N/D"}
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-center me-2">
                      <ClipboardButton
                        btLabel={langData.pieceDetailDescriptors.restoration.responsible_restorer}
                        btId={`responsible${index}`}
                        btText={restorations?.responsible_info?.title ? restorations.responsible_info.title : "N/D"}
                      />
                      <div>
                        {restorations?.responsible_info?.title ? restorations.responsible_info.title : "N/D"}
                      </div>
                    </div>
                  </div>
                  <div className='border border-primary mb-2 '>
                    <div className='bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start' style={{ fontSize: '.90em', height: '20px' }}>
                      {langData.pieceDetailDescriptors.inventory.measure_without.replace(/{}/g, restorations?.base_or_frame ? restorations.base_or_frame === "base" ? langData.pieceDetailDescriptors.inventory.base : langData.pieceDetailDescriptors.inventory.frame : "")}
                    </div>
                    <div className="d-flex p-2">
                      <div className="flex-fill text-center">
                        <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.height}:</h6></div>
                        <div>{restorations?.height ? restorations.height : 'N/D'}</div>
                      </div>
                      <div className="flex-fill text-center">
                        <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.width}:</h6></div>
                        <div>{restorations?.width ? restorations.width : 'N/D'}</div>
                      </div>
                      <div className="flex-fill text-center">
                        <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.depth}:</h6></div>
                        <div>{restorations?.depth ? restorations.depth : 'N/D'}</div>
                      </div>
                      <div className="flex-fill text-center">
                        <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.diameter}:</h6></div>
                        <div>{restorations?.diameter ? restorations.diameter : 'N/D'}</div>
                      </div>
                    </div>
                  </div>
                  <div className='border border-primary mb-2'>
                    <div className='bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start' style={{ fontSize: '.90em', height: '20px' }}>
                      {langData.pieceDetailDescriptors.inventory.measure_with.replace(/{}/g, restorations?.base_or_frame ? restorations.base_or_frame === "base" ? langData.pieceDetailDescriptors.inventory.base : langData.pieceDetailDescriptors.inventory.frame : "")}
                    </div>
                    <div className="d-flex p-2">
                      <div className="flex-fill text-center">
                        <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.height}:</h6></div>
                        <div>{restorations?.height_with_base ? restorations.height_with_base : 'N/D'}</div>
                      </div>
                      <div className="flex-fill text-center">
                        <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.width}:</h6></div>
                        <div>{restorations?.width_with_base ? restorations.width_with_base : 'N/D'}</div>
                      </div>
                      <div className="flex-fill text-center">
                        <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.depth}:</h6></div>
                        <div>{restorations?.depth_with_base ? restorations.depth_with_base : 'N/D'}</div>
                      </div>

                      <div className="flex-fill text-center">
                        <div><h6 style={{ fontSize: '.85em' }}>{langData.pieceDetailDescriptors.inventory.diameter}:</h6></div>
                        <div>{restorations?.diameter_with_base ? restorations.diameter_with_base : 'N/D'}</div>
                      </div>
                    </div>
                  </div>
                  <div className='border border-primary mb-2 '>
                    <div className='bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start' style={{ fontSize: '.90em', height: '20px' }}>
                      {langData.pieceDetailDescriptors.restoration.associated_documents}
                    </div>

                    <div className='d-flex align-items-center justify-content-start p-2'>
                      {console.log(item.documents_info)}
                      {item?.documents_info ? (
                        item.documents_info.map((document, indexD) => (
                          restorations.documents_ids && restorations.documents_ids.includes(document._id) ? (
                            
                            <div className="flex-fill me-2" key={indexD}>
                              
                              <DownloadButton
                                document={document}
                                module={'restoration'}
                              />
                            </div>
                          ) : null
                        ))
                      ) : (
                        "N/D"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            
          )) ?? ""}
        </div>
      </div>

      {/*modules?.map((module, index) => (
        <pre>{JSON.stringify(module, null, 2)}</pre>
      )) ?? ""*/}
    </>
  );
};

export const Movements = () => {
  const data = useData();
  moment.locale(getActualLang());
  const item = data?.detail[0] ? data.detail[0] : null;
  return (
    <>

      <div className="card card-body justify-content-end col-12 bg-gradient ps-5 pe-5 pb-3" style={{ backgroundColor: 'rgb(190,180,180)' }}>
        <p className="card col-5 mb-2 bg-color bg-gradient" style={{ backgroundColor: 'rgb(145,145,145)', margin: '0 auto' }}>
          {langData.pieceDetailMenu.movements}
        </p>

        <table className="table table-striped m-0">
          <thead>
            <tr>
              <th>{langData.pieceDetailMovements.headerTableMovements.departure_date}</th>
              <th>{langData.pieceDetailMovements.headerTableMovements.arrival_date}</th>
              <th>{langData.pieceDetailMovements.headerTableMovements.institution}</th>
              <th>{langData.pieceDetailMovements.headerTableMovements.location_exhibition}</th>
              <th>{langData.pieceDetailMovements.headerTableMovements.venue}</th>
            </tr>
          </thead>
          <tbody>

            {item?.all_movements_info.map((movement) => {
              let arrivalDate = ''; // Valor predeterminado

              if (movement.arrival_information && movement.arrival_information.length > 0) {
                for (let index2 = 0; index2 < movement.arrival_information.length; index2++) {
                  const arrival_info = movement.arrival_information[index2];
                  if (
                    (Array.isArray(arrival_info.pieces) && arrival_info.pieces.includes(item._id)) ||
                    item._id === arrival_info.pieces
                  ) {
                    arrivalDate = arrival_info?.arrival_date ? moment(arrival_info.arrival_date).format('LL') : "N/D";
                    break;
                  }
                }
              } else if (movement.arrival_date) {
                arrivalDate = moment(movement.arrival_date).format('LL');
              }
              return (
                <tr key={movement._id}>
                  <td>{movement.departure_date ? moment(movement.departure_date).format('LL') : 'N/D'}</td>
                  <td>{arrivalDate}</td>
                  <td>{movement?.institutions_info.map((name, index) => (
                    <span key={index}>{name} </span>
                  ))}</td>
                  <td>{movement.location_info ? movement.location_info : 'N/D'}</td>
                  <td>{movement.venues_info ? movement.venues_info : 'N/D'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
     

    </>

  );
  //<pre>{JSON.stringify(item, null, 2)}</pre> // <pre>{JSON.stringify(item, null, 2)}</pre>
};