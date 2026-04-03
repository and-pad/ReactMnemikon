import { MovementFormPage } from "./MovementForm";

export const NewMovement = ({ accessToken, refreshToken }) => (
  <MovementFormPage
    accessToken={accessToken}
    refreshToken={refreshToken}
    mode="create"
  />
);
