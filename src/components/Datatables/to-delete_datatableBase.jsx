import Datatable from "react-data-table-component";
import { Box, CircularProgress, Typography } from "@mui/material";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import  customStyles  from "./datatableCustomCellStyle";
import { useState } from "react";
import { ExpandableComponent } from "./DatatableComponents/datatableComponents";
import { useSessionStorageState } from "./DatatableComponents/SessionStorage";
import { useEffect, useMemo } from "react";
import "../Datatables/datatable.css";
import {
  SearchBox,
  SelectColumn,
  filterSearch,
} from "./FilterComponents/Filter";
import { formatData, fetchData, ConstructElementsToHide } from "./dataHandler"; // Importamos fetchData
import { getTranslations } from "../Languages/i18n";
const langData = getTranslations();

export function CircularIndeterminate() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%", // Abarca todo el ancho
        height: "30vh", // Abarca toda la altura de la pantalla
        //backgroundColor: '#f0f0f0', // Fondo gris claro
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Apilamos el CircularProgress y el texto
          alignItems: "center", // Centramos horizontalmente
          justifyContent: "center", // Centramos verticalmente dentro del cuadro
          backgroundColor: "#ffffff", // Fondo blanco del cuadro
          padding: "2rem", // Espaciado interno generoso
          borderRadius: "12px", // Bordes redondeados
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Sombra suave
          minWidth: "200px", // Ancho mínimo para el cuadro
        }}
      >
        <CircularProgress color="primary" size="5rem" />
        <Box
          sx={{
            marginTop: "1rem", // Espacio entre el ícono y el texto
            color: "#333", // Color oscuro para contraste
            fontSize: "1.2rem", // Tamaño del texto
            fontWeight: "500", // Peso de fuente para mayor legibilidad
            textAlign: "center", // Asegura que el texto esté centrado
          }}
        >
          Cargando...
        </Box>
      </Box>
    </Box>
  );
}

export const DatatableBase = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  Module,
  theme,
  accessToken,
  refreshToken,
  size,
}) => {
  const [pending, setPending] = useState(true);
  const [defColumnsOut, setDefColumnsOut] = useState([]);
  const [checkboxSearchValues, setCheckboxSearchValues] = useState("");
  const [defColumns, setDefColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [filteredTableData, setFilteredTableData] = useState([]);
  const [dataQuery, setDataQuery] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [rm_accents, setRmAccents] = useState(false);
  const [upper_lower, setUpperLower] = useState(false);
  const [wordComplete, setWordComplete] = useState(false);

  //const [checkboxSearchValues, setCheckboxSearchValues] = useState("");
  const [disableChecks, setdisbleChecks] = useState(true);

  const [hasFetched, setHasFetched] = useState(false);
  /**
   * The function `toggleTheme` toggles between a custom light and dark theme.
   */

console.log("Module",Module);
    useSessionStorageState([
    [`${Module}filterText`, setFilterText],
    [`${Module}rowsPerPage`, setRowsPerPage, Number],
    [`${Module}page`, setPage, Number],
  ]);


useEffect(() => {
    // --- Restaurar scroll al montar ---
    const savedScroll = sessionStorage.getItem(`${Module}scrollY`);
    if (savedScroll) {
        const savedScrollY = Number(savedScroll) || 0;
        console.log("Restaurando scroll a:", savedScrollY);
      setTimeout(() => {
        window.scrollTo({
        top: savedScrollY,
        behavior: "smooth", // también puedes usar "auto" (por defecto)
});
      }, 3800); // ajusta el tiempo si hace falta
    }


    

 const handleClick = () => {
    sessionStorage.setItem(`${Module}scrollY`, window.scrollY);
  //  document.removeEventListener("scroll", handleScroll);
    console.log("Guardado en click:", window.scrollY);
  };

  document.addEventListener("click", handleClick);

  return () => {
    document.removeEventListener("click", handleClick);
    
  };

  }, []);

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
        disableChecks
      );
    };
    if (!hasFetched) {
      const fetchDataAndFormat = async () => {
        try {
          let fetch;
          let first;
          if (dataQuery.length === 0) {
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
          const module = Module;
          if (first) {
            arrayTabColOut = formatData(
              fetch,
              size,
              true,
              //onDetailClick,
              module
            );
            setFilteredTableData(arrayTabColOut[0]);
          } else {
            //console.log("defColumns", defColumns);
            arrayTabColOut = formatData(
              dataQuery,
              size,
              false,
              //onDetailClick,
              defColumns,
              tableData,
              module
            );
          }
          //console.log('arrayTabColOut Table data', arrayTabColOut[0][0]);
          // Guardar en estado local y actualizar referencias
          setTableData(arrayTabColOut[0]);
          //console.log('arrayTabColOut Columns Names', arrayTabColOut[2]);
          setDefColumnsOut(arrayTabColOut[2]);
          // setArrayTabColOutState(arrayTabColOut); // Guardar en estado local

          // Actualizar almacenamiento local si es necesario
          const getdefColumn = localStorage.getItem("showColumns");
          if (getdefColumn === null || getdefColumn === "undefined") {
            //console.log('null');
            setDefColumns(arrayTabColOut[1]);
            setDefColumnsOut(arrayTabColOut[2]);
            localStorage.setItem(
              "showColumns",
              JSON.stringify(arrayTabColOut[1])
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
      setHasFetched(false);
    };
  }, [
    accessToken,
    refreshToken,
    size,
    setHasFetched,
    dataQuery,
    //onDetailClick,
    checkboxSearchValues,
    disableChecks,
    filterText,
    rm_accents,
    upper_lower,
    wordComplete,
    setTableData,
    setDefColumns /*setPending*/,
  ]);
  // Estado local para almacenar arrayTabColOut
  // Puedes acceder a arrayTabColOutState donde lo necesites en el componente

  /*****************************************************************************
   *****************************************************************************/
  const propsColumns = {
    defColumnsOut,
  };

  const handleSearchboxChange = (id) => {
    // console.log('id', id);
    setCheckboxSearchValues((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    // console.log(checkboxSearchValues[id]);
  };

  const subHeaderComponentMemo = useMemo(() => {
    /******************************************************************************** */
    // Función para manejar el cambio en el orden de las columnas
    // Objeto para almacenar el nuevo orden

    var hideConstructor = [];
    const handleSelectColumnChange = (id) => {
      //console.log('idS', id);
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
        console.log("updated columns", updatedColumns);
        setDefColumnsOut([]);
        //esto es necesario para guardar el selector que es una funcion, como cadena
        localStorage.setItem("showColumns", JSON.stringify(updatedColumns));
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
            (item) => item.id === id
          );
          if (correspondingElement) {
            correspondingElement.omit = true;
          }
          setDefColumns(updatedColumns);
          setDefColumnsOut(out);
          localStorage.setItem("showColumns", JSON.stringify(updatedColumns));
        });
      }
    };

    return (
      <div className="container-fluid ">
        <div className="row justify-content-center">
          <div className="col-6 mb-2 mt-2 text-start">
            <SearchBox
              placeholder={langData.dataTablesSearch.place_holder}
              columns={defColumns}
              onFilter={(event) => {
                setFilterText(event.target.value);
                sessionStorage.setItem(`${Module}filterText`, event.target.value);
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
          <div className="col-6 mb-2 mt-4 ">
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
    Module
  ]);

  return (
    <Datatable
      // style={{ width: "100vw" }}
      className=""
      columns={defColumns}
      data={filteredTableData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
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
        sessionStorage.setItem(`${Module}page`, page);
      }}
      onChangeRowsPerPage={(newPerPage, page) => {
        setRowsPerPage( newPerPage );
        console.log('newPerPage', newPerPage);
        setPage(page);
        sessionStorage.setItem(`${Module}rowsPerPage`, newPerPage);
        sessionStorage.setItem(`${Module}page`, page);
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
          <Typography variant="body1">No hay registros para mostrar</Typography>
        </Box>
      }
      highlightOnHover
      expandableRows
      expandableRowsComponent={ExpandableComponent}
      expandableRowsComponentProps={propsColumns}
      customStyles={customStyles}
      theme={theme}
    />
  );
};
