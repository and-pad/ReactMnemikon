import moment from "../LocalTools/moment";
import 'moment/locale/es-mx'; // Importa el paquete de locales dentro de moment

import { useEffect, useState } from "react";
import { API_RequestPendingList , API_SendNewApprovralDecision } from "./APICalls";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Box,
} from "@mui/material";
import { Button } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import  Grid from "@mui/material/Grid";

import { Card, CardMedia, CardContent } from "@mui/material";
import { formatSize } from "../LocalTools/tools";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import SETTINGS from "../Config/settings";
const IMAGE_BASE_URL =
  SETTINGS.URL_ADDRESS.server_url +
  SETTINGS.URL_ADDRESS.temporary_upload_documents;


const NEW_PIECE_FIELDS = [
  { key: "inventory_number", label: "No. Inventario" },
  { key: "origin_number", label: "No. Origen" },
  { key: "catalog_number", label: "No. Catálogo" },
  { key: "description_origin", label: "Descripción (origen)" },
  { key: "description_inventory", label: "Descripción (inventario)" },
  { key: "gender_id", label: "Género", nested: "title" },
  { key: "subgender_id", label: "Subgénero", nested: "title" },
  { key: "type_object_id", label: "Tipo de objeto", nested: "title" },
  { key: "dominant_material_id", label: "Material dominante", nested: "title" },
  { key: "tags", label: "Tags" },
  { key: "appraisal", label: "Avalúo" },
  { key: "admitted_at", label: "Fecha de ingreso"},
  { key: "incidence", label: "Incidencias" },
  { key: "height", label: "Altura" },
  { key: "width", label: "Ancho" },
  { key: "depth", label: "Profundidad" },
  { key: "diameter", label: "Diámetro" },
  { key: "height_with_base", label: "Altura con base" },
  { key: "width_with_base", label: "Ancho con base" },
  { key: "depth_with_base", label: "Profundidad con base" },
  { key: "diameter_with_base", label: "Diámetro con base" },
];
export const ApprovRejectNew = ({ accessToken, refreshToken, permissions }) => {
  const [Data, setData] = useState();

  useEffect(() => {
    console.log("accessToken:", accessToken);
    API_RequestPendingList({ accessToken, refreshToken })
      .then((data) => {
        console.log(data,"datarecien");
        setData(data);
      })
      .catch((error) => {
        console.error("Error inesperado", error);
      });
  }, []);
  const NewPieceTable = ({ piece }) => (
    <Table size="small">
      <TableBody>
        {NEW_PIECE_FIELDS.map(({ key, label, nested }) => {
          const rawValue = nested ? piece?.[key]?.[nested] : piece?.[key];

          //if (rawValue === null || rawValue === undefined || rawValue === "")
          // return null;

          return (
            <TableRow key={key} hover>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  width: "35%",
                  borderBottom: "1px solid #979797",
                }}
              >
                {label}
              </TableCell>

              <TableCell sx={{ borderBottom: "1px solid #979797" }}>
                {renderValue(key, rawValue)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
  const renderValue = (key, value) => {
    if (value === null || value === undefined || value === "") return null;

    // Tags → chips
    if (key === "tags" && typeof value === "string") {
      return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {value
            .split(",")
            .filter(Boolean)
            .map((tag, i) => (
              <Chip
                key={i}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: "secondary.main",
                  color: "secondary.contrastText",
                }}
              />
            ))}
        </Box>
      );
    }

    return value;
  };

  const NewPicsGallery = ({ pics }) => {
    if (!pics || pics.length === 0) return null;

    return (
      <>
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          Fotografías
        </Typography>

        <Grid container spacing={2}>
          {pics.map((pic, i) => (
            <Grid xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`${IMAGE_BASE_URL}${pic.file_name}`}
                  alt={pic.description || "Fotografía"}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {pic.description || "Sin descripción"}
                  </Typography>

                  <Typography variant="caption" display="block">
                    📸 {pic.photographer}
                  </Typography>

                  <Typography variant="caption" display="block">
                    📅 {pic.photographed_at}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  const NewDocsList = ({ docs }) => {
    if (!docs || docs.length === 0) return null;

    return (
      <>
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          Documentos
        </Typography>

        <List dense>
          {docs.map((doc, i) => {
            const isPdf = doc.mime_type === "application/pdf";
            const Icon = isPdf ? PictureAsPdfIcon : InsertDriveFileIcon;

            return (
              <ListItem key={i}>
                <ListItemIcon>
                  <Icon color={isPdf ? "error" : "action"} />
                </ListItemIcon>

                <ListItemText
                  primary={doc.name}
                  secondary={formatSize(doc.size)}
                />

                <Link
                  href={`${IMAGE_BASE_URL}${doc.file_name}`}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                >
                  Abrir
                </Link>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  };

  const handleApprove = async (itemId, approved) => {

    console.log("Aprobar:", itemId);
    const response = await API_SendNewApprovralDecision({ accessToken, refreshToken, itemId, approved });
    console.log("Respuesta de aprobación/rechazo:", response);
    // TODO: llamar API approve
  };

  return (
    <div>
      <div className="container bg-secondary border border-primary rounded p-3">
        {Data &&
          Data.map((item, index) => (
            <Accordion key={item._id} sx={{  backgroundColor: "#d8d8d8", mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600 }}>
                  #{index + 1} — Inventario: {item.new_piece?.inventory_number} Fecha de requerimiento:{" "}
                   {moment(item.created_at).format("DD [de] MMMM [de] YYYY, HH:mm")}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <NewPieceTable piece={item.new_piece} />
                <NewPicsGallery pics={item.new_pics} />
                <NewDocsList docs={item.new_docs} />

                {/* Acciones */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 4,
                    pt: 2,
                    justifyContent: "flex-end",
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleApprove(item._id, true)}
                  >
                    Aprobar
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleApprove(item._id, false)}
                  >
                    Rechazar
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    </div>
  );
};
