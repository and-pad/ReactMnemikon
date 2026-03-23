import { Typography } from "@mui/material";

export const InventoryModifications = ({
  inventoryModifications,
  inventory_fields,
  langData,
}) => {
  return (
    <>
      <div
        className="card border-primary pt-1 "
        style={{ background: " #abaa" }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#0d6efd",
            fontWeight: "bold",
            textAlign: "center",
            padding: "2px 0", // Reduce padding arriba y abajo
          }}
        >
          {langData.pieceDetailDescriptors.research.inventory_fields}
        </Typography>
        <Typography
          variant="h7"
          sx={{
            color: "#0d6efd",
            fontWeight: "bold",
            textAlign: "center",
            padding: "2px 0", // Reduce padding arriba y abajo
          }}
        >
          {"Tiene modificaciones por aprobar"}
        </Typography>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>
                {langData.pieceDetailDescriptors.inventory_in_research.field}
              </th>
              <th>
                {
                  langData.pieceDetailDescriptors.inventory_in_research
                    .actual_value
                }
              </th>
              <th>
                {
                  langData.pieceDetailDescriptors.inventory_in_research
                    .tochange_value
                }
              </th>
            </tr>
          </thead>
          <tbody>
            {inventory_fields?.map((field) => {
              const label =
                langData.pieceDetailDescriptors.inventory_in_research[field] ||
                field;
              const modification = inventoryModifications[0][field] || {};
              const formatValue = (value) => {
                if (typeof value === "object" && value !== null) {
                  return value.title ?? JSON.stringify(value);
                } else if (value === null) {
                  return null;
                }
                return value ?? false;
              };

              const oldFormatted = formatValue(modification?.oldValue);
              const newFormatted = formatValue(modification?.newValue);
              // Mostrar solo si alguno de los dos tiene cambios
              if (oldFormatted === false && newFormatted === false) {
                return null;
              }
              return (
                <tr key={field}>
                  <td>
                    <strong>{label}</strong>
                  </td>
                  <td>{oldFormatted}</td>
                  <td>{newFormatted}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
