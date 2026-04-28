import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const STORAGE_KEY = "movements_catalogs_theme";

const themes = {
  gray: {
    pageBg: "#d8dde3",
    cardBg: "#e7ebef",
    cardBorder: "#b4bcc6",
    headerBg: "#6d7782",
    headerText: "#f8fafc",
    toolbarBg: "#cfd5dc",
    tableBg: "#f0f2f5",
    rowOdd: "#e3e7ec",
    rowEven: "#eef1f4",
    text: "#22303c",
    border: "#bcc5cf",
    actionButton: "contained",
  },
  white: {
    pageBg: "#f5f5f5",
    cardBg: "#ffffff",
    cardBorder: "#d8d8d8",
    headerBg: "#f3f4f6",
    headerText: "#1f2937",
    toolbarBg: "#fafafa",
    tableBg: "#ffffff",
    rowOdd: "#ffffff",
    rowEven: "#f8fafc",
    text: "#202938",
    border: "#e2e8f0",
    actionButton: "outlined",
  },
};

export const CatalogTable = ({
  title,
  search,
  onSearchChange,
  onSearchSubmit,
  createLabel,
  onCreate,
  canCreate = false,
  errorMsg = "",
  loading = false,
  emptyMessage,
  columns,
  rows,
}) => {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === "undefined") return "gray";
    return window.localStorage.getItem(STORAGE_KEY) || "gray";
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil((rows?.length || 0) / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, rows, rowsPerPage]);

  const theme = themes[themeMode] || themes.gray;

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return (rows || []).slice(start, start + rowsPerPage);
  }, [page, rows, rowsPerPage]);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 2,
        backgroundColor: theme.pageBg,
        borderRadius: 2,
      }}
    >
      <Paper
        elevation={themeMode === "gray" ? 6 : 2}
        sx={{
          padding: 3,
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          color: theme.text,
        }}
      >
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Typography variant="h5" sx={{ color: theme.text, fontWeight: 700 }}>
              {title}
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <ButtonGroup size="small" variant="outlined">
                <Button
                  variant={themeMode === "gray" ? "contained" : "outlined"}
                  onClick={() => setThemeMode("gray")}
                >
                  Gris
                </Button>
                <Button
                  variant={themeMode === "white" ? "contained" : "outlined"}
                  onClick={() => setThemeMode("white")}
                >
                  Blanco
                </Button>
              </ButtonGroup>
              <TextField
                label="Buscar"
                value={search}
                size="small"
                onChange={(event) => onSearchChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onSearchSubmit(search);
                  }
                }}
                sx={{
                  minWidth: { xs: "100%", md: 220 },
                  backgroundColor: theme.tableBg,
                }}
              />
              <Button
                variant={theme.actionButton}
                onClick={() => {
                  setPage(0);
                  onSearchSubmit(search);
                }}
              >
                Buscar
              </Button>
              {canCreate ? (
                <Button variant="contained" onClick={onCreate}>
                  {createLabel}
                </Button>
              ) : null}
            </Stack>
          </Stack>

          {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

          {loading ? (
            <Typography sx={{ color: theme.text }}>Cargando...</Typography>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                overflow: "hidden",
                backgroundColor: theme.toolbarBg,
                borderColor: theme.border,
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: theme.headerBg,
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                          sx={{
                            color: theme.headerText,
                            fontWeight: 700,
                            borderBottom: `1px solid ${theme.border}`,
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRows.length ? (
                      paginatedRows.map((row, index) => (
                        <TableRow
                          key={row._id || row.id || `${title}-${index}`}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? theme.rowEven : theme.rowOdd,
                          }}
                        >
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align || "left"}
                              sx={{
                                color: theme.text,
                                borderBottom: `1px solid ${theme.border}`,
                              }}
                            >
                              {column.render(row)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          align="center"
                          sx={{ color: theme.text }}
                        >
                          {emptyMessage}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por pagina"
                sx={{
                  color: theme.text,
                  borderTop: `1px solid ${theme.border}`,
                  backgroundColor: theme.toolbarBg,
                }}
              />
            </Paper>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};
