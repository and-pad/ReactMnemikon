import React from "react";
import { MovementDatatable } from "../Datatables/MovementDatatable/Datatable";

export const MovementsManage = ({ accessToken, refreshToken, permissions }) => {
  return (
    <div className="PiecesResearchs-container">
      <MovementDatatable
        accessToken={accessToken}
        refreshToken={refreshToken}
        permissions={permissions}
      />
    </div>
  );
};
