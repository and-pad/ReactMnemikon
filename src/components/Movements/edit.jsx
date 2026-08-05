import { useParams } from "react-router";
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
