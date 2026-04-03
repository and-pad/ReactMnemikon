import { useParams } from "react-router-dom";
import { MovementFormPage } from "./MovementForm";

export const EditMovement = ({ accessToken, refreshToken }) => {
  const { id } = useParams();

  return (
    <MovementFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="edit"
      movementId={id}
    />
  );
};
