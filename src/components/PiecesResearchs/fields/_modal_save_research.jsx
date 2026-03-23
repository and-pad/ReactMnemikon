import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";


export const ModalSaveResearch = ({
  modalOpen,
  setModalOpen,
  confirmSave,
  modalState,
  serverMsg,
  _id
}) => {   
    const navigate = useNavigate();

  //  console.log("modalOpen",modalOpen);
  //  console.log("modalState",modalState);
  //  console.log("serverMsg",serverMsg);
const handleSuccessClose = () => {
  setModalOpen(false);
  navigate(`/mnemosine/piece_researchs`, { replace: true });
  //navigate(`/mnemosine/piece_researchs/actions/${_id}/edit`, { replace: true });
};
return(
<Dialog open={modalOpen} maxWidth="sm" fullWidth>

  {modalState === "confirm" && (
    <>
      <DialogTitle>Se detectaron cambios</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Deseas guardar los cambios realizados?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={confirmSave}>
          Guardar
        </Button>
      </DialogActions>
    </>
  )}

  {modalState === "saving" && (
    <>
      <DialogTitle>Guardando cambios</DialogTitle>
      <DialogContent sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Procesando información…
        </Typography>
      </DialogContent>
    </>
  )}

  {modalState === "success" && (
    <>
      <DialogTitle color="success.main">✔ Guardado exitoso</DialogTitle>
      <DialogContent>
        <Typography>{serverMsg}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleSuccessClose}
        >
          Continuar
        </Button>
      </DialogActions>
    </>
  )}

  {modalState === "error" && (
    <>
      <DialogTitle color="error.main">❌ Error</DialogTitle>
      <DialogContent>
        <Typography>{serverMsg}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={() => setModalOpen(false)}
        >
          Cerrar
        </Button>
      </DialogActions>
    </>
  )}

</Dialog>

)
};