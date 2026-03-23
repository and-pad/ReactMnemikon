import { useEffect, useState, useRef } from "react";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

//import GoogleFontLoader from 'react-google-font-loader';
import "../Datatables/datatable.css";
//import { createTheme } from 'react-data-table-component'
import Box from "@mui/material/Box"; // Para el contenedor estilizado
import Typography from "@mui/material/Typography"; // Para el texto
import { Button } from "@mui/material"; // Botón de Material UI
//import { DatatableBase } from "./datatableBase";
//import { } from "./columnDriver";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import {
  SearchBox,
  SelectColumn,
  filterSearch,
  //filterWithRestoration,
} from "./FilterComponents/Filter";

import Datatable from "react-data-table-component";
import { CircularIndeterminate } from "./to-delete_datatableBase";
import { ExpandableComponent } from "./DatatableComponents/datatableComponents";
import customStyles from "./datatableCustomCellStyle";
import { useMemo } from "react";
import { fetchData, formatData, ConstructElementsToHide } from "./dataHandler";
import { useSessionStorageState } from "./DatatableComponents/SessionStorage";
import { useNavigate } from "react-router-dom";
import { getTranslations } from "../Languages/i18n";

const langData = getTranslations();
//import { useNavigate } from "react-router-dom";
//

export const BaseDatatable = ({
  accessToken,
  refreshToken,
  module,
  title,
  permissions,
}) => {
  const [defColumns, setDefColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [filteredTableData, setFilteredTableData] = useState([]);

  const [defColumnsOut, setDefColumnsOut] = useState([]);
  const [size, setSize] = useState(null);
  const [dataQuery, setDataQuery] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [rm_accents, setRmAccents] = useState(false);
  const [upper_lower, setUpperLower] = useState(false);
  const [wordComplete, setWordComplete] = useState(false);

  const [checkboxSearchValues, setCheckboxSearchValues] = useState("");
  const [disableChecks, setdisbleChecks] = useState(true);
  const [theme, setTheme] = useState("custom-dark"); // Estado para el tema
  const [pending, setPending] = useState(true);
  const [page, setPage] = useState(1); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Filas por página
  const [selected, setSelected] = useState("all"); // Elementos seleccionados
  const [restorations, setRestorations] = useState([]);
  const [selectedResearchs, setSelectedResearchs] = useState([]);
  const [researchs, setResearchs] = useState([]);

  const handleSelection = (event, newValue) => {
    console.log("Clicked:", newValue);
    if (newValue !== null) {
      setSelected(newValue);
    }
  };
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "custom-light" ? "custom-dark" : "custom-light",
    );
  };

  //console.log("Module", module);
  useSessionStorageState([
    [`${module}filterText`, setFilterText],
    [`${module}rowsPerPage`, setRowsPerPage, Number],
    [`${module}page`, setPage, Number],
  ]);

  useEffect(() => {
    // --- Restaurar scroll al montar ---
    const savedScroll = sessionStorage.getItem(`${module}scrollY`);
    if (savedScroll) {
      const savedScrollY = Number(savedScroll) || 0;
      //console.log("Restaurando scroll a:", savedScrollY);
      setTimeout(() => {
        window.scrollTo({
          top: savedScrollY,
          behavior: "smooth", // también puedes usar "auto" (por defecto)
        });
      }, 2200); // ajusta el tiempo si hace falta
    }

    const handleClick = () => {
      sessionStorage.setItem(`${module}scrollY`, window.scrollY);
      //  document.removeEventListener("scroll", handleScroll);
      //console.log("Guardado en click:", window.scrollY);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  //var size;
  /***************************************************************************** */
  const timerIdRef = useRef();
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newSize = size;

      if (width >= 1463 && width < 2000) {
        newSize = 11;
      } else if (width >= 1249 && width < 1463) {
        newSize = 9;
      } else if (width >= 1040 && width < 1249) {
        newSize = 7;
      } else if (width >= 800 && width < 1040) {
        newSize = 6;
      } else if (width >= 600 && width < 800) {
        newSize = 5;
      } else if (width >= 550 && width < 600) {
        newSize = 4;
      } else if (width >= 300 && width < 550) {
        newSize = 3;
      }
      if (newSize !== size || size == null) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = setTimeout(() => {
          setSize(newSize);
        }, 2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timerIdRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [size, timerIdRef]);

  // var prop ;
  const [hasFetched, setHasFetched] = useState(false);

  const ReloadData = async () => {
    //await handleDeleteChache();
    setHasFetched(false);
    setPending(true);

    //setDataQuery([]);
  };
  useEffect(() => {
    const filtered = () => {
      return filterSearch(
        defColumns,
        tableData,
        filterText,
        rm_accents,
        upper_lower,
        wordComplete,
        checkboxSearchValues,
        disableChecks,
        selected,
        restorations,
        selectedResearchs,
        researchs,
      );
    };
    /*const WithRestoration = (tableData) => {
      return tableData.filter((item) => item.restoration_info === true);
    };*/

    if (!hasFetched) {
      const fetchDataAndFormat = async () => {
        try {
          let fetch;
          let first;
          if (dataQuery.length === 0 || pending) {
            fetch = await fetchData(accessToken, refreshToken);
            // console.log(fetch);
            setDataQuery(fetch);
            first = true;
            setPending(false);
          } else {
            fetch = dataQuery;
            first = false;
            setPending(false);
          }

          let arrayTabColOut;
          // const module = "Research"
          if (first) {
            arrayTabColOut = formatData(fetch, size, module, true, null, null);
            //setFilteredTableData(arrayTabColOut[0]);
          } else {
            arrayTabColOut = formatData(
              dataQuery,
              size,
              module,
              false,
              defColumns,
              tableData,
            );
          }

          // Guardar en estado local y actualizar referencias
          setTableData(arrayTabColOut[0]);
          setDefColumnsOut(arrayTabColOut[2]);
          setRestorations(arrayTabColOut[3]);
          setResearchs(arrayTabColOut[4]);
          // setArrayTabColOutState(arrayTabColOut); // Guardar en estado local

          // Actualizar almacenamiento local si es necesario
          const getdefColumn = localStorage.getItem("showColumnsInventory");
          if (getdefColumn === null || getdefColumn === "undefined") {
            //console.log('null');
            console.log("defColumns", arrayTabColOut[1]);
            setDefColumns(arrayTabColOut[1]);
            setDefColumnsOut(arrayTabColOut[2]);
            localStorage.setItem(
              "showColumnsInventory",
              JSON.stringify(arrayTabColOut[1]),
            );
          } else {
            //    console.log('not null');
            const savedColumns = JSON.parse(getdefColumn);
            const tdefColumn = arrayTabColOut[1];
            tdefColumn.forEach((column, index) => {
              column.show = savedColumns[index].show;
              if (!savedColumns[index].show) {
                column.omit = true;
              }
            });
            //console.log("defColumns", tdefColumn);
            setDefColumns(tdefColumn);
            const Cout = ConstructElementsToHide(tdefColumn, size);
            setDefColumnsOut(Cout);
          }
        } catch (error) {
          console.error("Error al procesar los datos:", error);
        }
      };

      fetchDataAndFormat();

      setHasFetched(true);
    }
    setFilteredTableData(filtered());

    // Inicializar checkboxValues con valores predeterminados
    // aqui podemos hacer un guardado de localstorage para traer los datos locales
    // de que columnas se muestran
    const Values = {};
    //const initialValuesSearch = {};
    defColumns.forEach((element) => {
      if (!element.show) {
        Values[element.id] = false;
        // initialValuesSearch[element.id] = false;
      } else {
        Values[element.id] = true;
        //initialValuesSearch[element.id] = false;
      }
    });
    setCheckboxValues(Values);
    // setCheckboxSearchValues(initialValuesSearch);
    //filtered();
    // Si cambian ciertas dependencias clave, reiniciar el estado
    return () => {
      // setHasFetched(false);
    };
  }, [
    accessToken,
    refreshToken,
    size,
    hasFetched,
    dataQuery,
    checkboxSearchValues,
    disableChecks,
    filterText,
    rm_accents,
    upper_lower,
    wordComplete,
    setTableData,
    setDefColumns,
    selected,
    selectedResearchs,
  ]);

  useEffect(() => {
    if (dataQuery.length > 0) {
      const arrayTabColOut = formatData(
        dataQuery,
        size,
        module,
        false,
        defColumns,
        tableData,
      );

      setTableData(arrayTabColOut[0]);
      setDefColumnsOut(arrayTabColOut[2]);
      // setArrayTabColOutState(arrayTabColOut); // Guardar en estado local

      // Actualizar almacenamiento local si es necesario
      const getdefColumn = localStorage.getItem("showColumnsInventory");
      if (getdefColumn === null || getdefColumn === "undefined") {
        //console.log('null');
        console.log("defColumns 2", arrayTabColOut[1]);
        setDefColumns(arrayTabColOut[1]);
        //setDefColumnsOut(arrayTabColOut[2]);
        localStorage.setItem(
          "showColumnsInventory",
          JSON.stringify(arrayTabColOut[1]),
        );
      } else {
        //    console.log('not null');
        const savedColumns = JSON.parse(getdefColumn);
        const tdefColumn = arrayTabColOut[1];
        tdefColumn.forEach((column, index) => {
          //console.log(savedColumns[index]);
          column.show = savedColumns[index].show;
          if (!savedColumns[index].show) {
            column.omit = true;
          }
        });
        //console.log("defColumns 2", tdefColumn);
        setDefColumns(tdefColumn);
        const Cout = ConstructElementsToHide(tdefColumn, size);
        setDefColumnsOut(Cout);
      }
    }
    // console.log("loop infinito");
  }, [checkboxValues]);

  /*****************************************************************************
   *****************************************************************************/
  const propsColumns = {
    defColumnsOut,
  };
  /******************************************************************************** */
  // Función para manejar el cambio de las checkboses de seacrh
  //
  const handleSearchboxChange = (id) => {
    // console.log('id', id);
    setCheckboxSearchValues((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    // console.log(checkboxSearchValues[id]);
  };
  const navigate = useNavigate();
  const handleNewInventory = () => {
    navigate("/mnemosine/inventory_queries/actions/add/new");
  };
  const handlePending = () => {
    navigate("/mnemosine/inventory_queries/actions/pending/list");
  };

  const subHeaderComponentMemo = useMemo(() => {
    /******************************************************************************** */
    // Función para manejar el cambio en el orden de las columnas
    // Objeto para almacenar el nuevo orden

    var hideConstructor = [];
    const handleSelectColumnChange = (id) => {
      //console.log("idS", id);
      setCheckboxValues((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
      // console.log(checkboxValues[id]);
      const index = defColumns.findIndex((column) => column.id === id);
      var updatedColumns;
      if (index !== -1) {
        //console.log('dfCol', defColumns[index]);
        updatedColumns = [...defColumns];
        updatedColumns[index].show = !updatedColumns[index].show;
        if (updatedColumns[index].show === false) {
          updatedColumns[index].omit = true;
        } else {
          updatedColumns[index].omit = false;
        }
        //console.log('opdCol', updatedColumns[index]);
        updatedColumns.forEach((column) => {
          if (column.show) {
            hideConstructor.push(column);
          }
        });
        setDefColumns(updatedColumns);
        setDefColumnsOut([]);
        //esto es necesario para guardar el selector que es una funcion, como cadena
        localStorage.setItem(
          "showColumnsInventory",
          JSON.stringify(updatedColumns),
        );
      }

      var out;

      if (hideConstructor.length >= size) {
        let quitElements = hideConstructor.length - size;
        quitElements = (quitElements + 1) * -1;
        // const dentro = hideConstructor.slice(0, size); // Elementos dentro del tamaño
        out = hideConstructor.slice(quitElements, -1); // Elementos que están fuera del tamaño

        out.forEach((element) => {
          const id = element.id;
          const correspondingElement = updatedColumns.find(
            (item) => item.id === id,
          );
          if (correspondingElement) {
            correspondingElement.omit = true;
          }
          setDefColumns(updatedColumns);
          setDefColumnsOut(out);
          localStorage.setItem(
            "showColumnsInventory",
            JSON.stringify(updatedColumns),
          );
        });
      }
    };

    const handleSelection = (event, newValue) => {
      //console.log("Clicked:", newValue);
      if (newValue !== null) {
        setSelected(newValue);
      }
    };

    return (
      <div className="container-fluid">
        {/* Fila de botones centrada */}

        {module === "Restoration" && (
          <div className="row mb-2 mt-2">
            <div className="col d-flex justify-content-center">
              <ToggleButtonGroup
                value={selected}
                exclusive
                onChange={handleSelection}
                sx={{
                  border: "none",
                  borderRadius: "12px", // esquinas redondeadas
                  overflow: "hidden", // recorta esquinas redondeadas
                  //boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // sombra base
                }}
              >
                {/* Azul */}
                <ToggleButton
                  value="all"
                  disableRipple
                  sx={{
                    textTransform: "none",
                    minHeight: "auto", // lo hace compacto
                    fontSize: "0.8rem", // letra más pequeña
                    padding: "2px 10px", // menos alto, solo lo justo
                    borderRadius: 0,
                    color: "black",
                    backgroundColor: "#bbdefb",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                      color: "white",
                      boxShadow: "0 3px 8px #1565c0",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#1976d2",
                      color: "white",
                      boxShadow: "0 3px 8px #1976d2",
                    },
                  }}
                >
                  Ver todo
                </ToggleButton>

                {/* Morado */}
                <ToggleButton
                  value="with"
                  disableRipple
                  sx={{
                    textTransform: "none",
                    minHeight: "auto",
                    fontSize: "0.8rem",
                    padding: "2px 10px",
                    borderRadius: 0,
                    color: "black",
                    backgroundColor: "#e1bee7",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#7b1fa2",
                      color: "white",
                      boxShadow: "0 3px 8px #7b1fa2",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#8e24aa",
                      color: "white",
                      boxShadow: "0 3px 8px #8e24aa",
                    },
                  }}
                >
                  Ver con restauración
                </ToggleButton>

                {/* Gris */}
                <ToggleButton
                  value="without"
                  disableRipple
                  sx={{
                    textTransform: "none",
                    minHeight: "auto",
                    fontSize: "0.8rem",
                    padding: "2px 10px",
                    borderRadius: 0,
                    color: "black",
                    backgroundColor: "#bbff93d0",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#50b827ff",
                      color: "white",
                      boxShadow: "0 3px 8px #56ff5fff",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#50b827ff",
                      color: "white",
                      boxShadow: "0 3px 8px #418b33ff",
                    },
                  }}
                >
                  Ver sin restauración
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        )}

        {/* Fila de SearchBox y SelectColumn */}
        <div className="row justify-content-center">
          <div className="col-6 mb-2  text-start">
            <SearchBox
              placeholder={langData.dataTablesSearch.place_holder}
              columns={defColumns}
              onFilter={(event) => {
                setFilterText(event.target.value);
                sessionStorage.setItem(
                  `${module}filterText`,
                  event.target.value,
                );
              }}
              filterText={filterText}
              checkboxSearchValues={checkboxSearchValues}
              handleCheckboxChange={handleSearchboxChange}
              setRmAccents={setRmAccents}
              setUpperLower={setUpperLower}
              disableChecks={disableChecks}
              setdisbleChecks={setdisbleChecks}
              setWordComplete={setWordComplete}
            />
          </div>
          <div className="col-6 mb-2 mt-4">
            <SelectColumn
              columns={defColumns}
              handleChange={handleSelectColumnChange}
              checkboxValues={checkboxValues}
            />
          </div>
        </div>
      </div>
    );
  }, [
    filterText,
    checkboxValues,
    checkboxSearchValues,
    disableChecks,
    defColumns,
    size,
    module,
    selected,
  ]);

  const handleSelectionResearch = (event, newValue) => {
  //  console.log("Clicked:", newValue);
    if (newValue !== null) {
      setSelectedResearchs(newValue);
    }
  };

  return (
    <div className="container-fluid  mt-3">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        padding={1}
        borderBottom="1px solid #ccc"
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          {title}
        </Typography>
        {/*<Button
          sx={{ textTransform: "none" }}
          variant="contained"
          color="primary"
          onClick={ReloadData}
        >
          Recargar tabla
        </Button>*/}

        {/* Fila de botones centrada */}

        {module === "Research" && (
          <div className="row mb-2 mt-2">
            <div className="col d-flex justify-content-center">
              <ToggleButtonGroup
                value={selectedResearchs}
                exclusive
                onChange={handleSelectionResearch}
                sx={{
                  border: "none",
                  borderRadius: "12px", // esquinas redondeadas
                  overflow: "hidden", // recorta esquinas redondeadas
                  //boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // sombra base
                }}
              >
                {/* Azul */}
                <ToggleButton
                  value="all"
                  disableRipple
                  sx={{
                    textTransform: "none",
                    minHeight: "auto", // lo hace compacto
                    fontSize: "0.8rem", // letra más pequeña
                    padding: "2px 10px", // menos alto, solo lo justo
                    borderRadius: 0,
                    color: "black",
                    backgroundColor: "#bbdefb",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                      color: "white",
                      boxShadow: "0 3px 8px #1565c0",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#1976d2",
                      color: "white",
                      boxShadow: "0 3px 8px #1976d2",
                    },
                  }}
                >
                  Ver todo
                </ToggleButton>

                {/* Morado */}
                <ToggleButton
                  value="with"
                  disableRipple
                  sx={{
                    textTransform: "none",
                    minHeight: "auto",
                    fontSize: "0.8rem",
                    padding: "2px 10px",
                    borderRadius: 0,
                    color: "black",
                    backgroundColor: "#e1bee7",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#7b1fa2",
                      color: "white",
                      boxShadow: "0 3px 8px #7b1fa2",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#8e24aa",
                      color: "white",
                      boxShadow: "0 3px 8px #8e24aa",
                    },
                  }}
                >
                  Ver con investigación
                </ToggleButton>

                {/* Gris */}
                <ToggleButton
                  value="without"
                  disableRipple
                  sx={{
                    textTransform: "none",
                    minHeight: "auto",
                    fontSize: "0.8rem",
                    padding: "2px 10px",
                    borderRadius: 0,
                    color: "black",
                    backgroundColor: "#bbff93d0",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#50b827ff",
                      color: "white",
                      boxShadow: "0 3px 8px #56ff5fff",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#50b827ff",
                      color: "white",
                      boxShadow: "0 3px 8px #418b33ff",
                    },
                  }}
                >
                  Ver sin investigación
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        )}

        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          color="primary"
          onClick={toggleTheme}
        >
          Tema
        </Button>

        {module === "Inventory" && (
          <>
            <Button
              sx={{ textTransform: "none" }}
              variant="contained"
              color="secondary"
              onClick={() => handlePending()}
            >
              Piezas pendientes
            </Button>
            <Button
              sx={{ textTransform: "none" }}
              variant="contained"
              color="secondary"
              onClick={() => handleNewInventory()}
            >
              + Agregar
            </Button>
          </>
        )}
      </Box>
{/* NOTE:
// react-data-table-component legacy workaround
// Required to prevent styled-components props warnings
// Kept intentionally for stability and time-to-market*/}
      <StyleSheetManager shouldForwardProp={isPropValid}>
        <Datatable
          // style={{ width: "100vw" }}
          className=""
          columns={defColumns}
          data={filteredTableData.slice(
            (page - 1) * rowsPerPage,
            page * rowsPerPage,
          )} // 👈 aquí el corte
          pagination
          paginationComponentOptions={{
            rowsPerPageText: "Filas por página:",
            rangeSeparatorText: "de",
          }}
          paginationServer
          paginationTotalRows={filteredTableData.length}
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={[10, 20, 30, 50]} // ✅ pon aquí los que quieras
          paginationDefaultPage={page}
          onChangePage={(page) => {
            setPage(page);
            sessionStorage.setItem(`${module}page`, page);
          }}
          onChangeRowsPerPage={(newPerPage, page) => {
            setRowsPerPage(newPerPage);
            console.log("newPerPage", newPerPage);
            setPage(page);
            sessionStorage.setItem(`${module}rowsPerPage`, newPerPage);
            sessionStorage.setItem(`${module}page`, page);
          }}
          dense
          responsive
          // onColumnOrderChange={handleColumnOrderChange}
          striped
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          //subHeaderComponentProps={ }

          progressPending={pending}
          progressComponent={<CircularIndeterminate />}
          noDataComponent={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100px",
                color: "gray",
              }}
            >
              <InventoryTwoToneIcon sx={{ fontSize: 48, marginBottom: 1 }} />
              <Typography variant="body1">
                No hay registros para mostrar
              </Typography>
            </Box>
          }
          highlightOnHover
          expandableRows
          expandableRowsComponent={ExpandableComponent}
          expandableRowsComponentProps={propsColumns}
          customStyles={customStyles}
          theme={theme}
        />
      </StyleSheetManager>
    </div>
  );
};
