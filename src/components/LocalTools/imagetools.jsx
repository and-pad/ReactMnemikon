import SETTINGS from "../Config/settings";
export const ModalPictures = ({ IDmodal, picFileName = null, ObjectImg = null }) => {
  let ImageModal;

  if (ObjectImg === null) {
    ImageModal =
      SETTINGS.URL_ADDRESS.server_url +
      SETTINGS.URL_ADDRESS.research_full_size +
      picFileName;
  } else {
    ImageModal = ObjectImg;
  }

  return (
    <div
      className="modal fade"
      id={IDmodal}
      tabIndex="-1"
      aria-labelledby={`${IDmodal}Label`}
    >
      <div className="modal-dialog modal-lg modal-fullscreen-md-down bg-secondary">
        <div className="modal-content">
          <div className="modal-body bg-secondary">
            <button
              type="button"
              className="btn-close mt-1 me-1"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div
              id={`carousel${IDmodal}Fade`}
              className="carousel slide carousel-fade"
            >
              <div className="carousel-inner">
                <img
                  src={ImageModal}
                  className="d-block w-100 mt-3"
                  alt="..."
                />
                <hr className="my-4" />
                {/* Otros detalles */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
