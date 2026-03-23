import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
//import langData from '../../Languages/en/Lang';

import { getTranslations } from "../../Languages/i18n";
const langData = getTranslations();

/*
str.normalize("NFD"): Esta parte de la función normaliza la cadena de texto a su forma de descomposición (NFD). Esto significa que la función descompone los caracteres en su forma base y diacríticos. Por ejemplo, el caracter "á" se descompone en "a" y el diacrítico "´".
replace(/[\u0300-\u0302\u0304-\u036f]/g, (match) => { ... }): Esta parte de la función busca y reemplaza los diacríticos en la cadena de texto. La expresión regular /[\u0300-\u0302\u0304-\u036f]/g busca los siguientes diacríticos:
\u0300-\u0302: Busca los diacríticos "grave" (à, è, ì, ò, ù) y "agudo" (á, é, í, ó, ú).
\u0304-\u036f: Busca los diacríticos "circunflejo" (â, ê, î, ô, û) y otros diacríticos menos comunes.
*/
const removeAccents = (str) => {
  //tabla de caracteres con acentos a cambiar
  const accents = {
    "á": "a",
    "é": "e",
    "í": "i",
    "ó": "o",
    "ú": "u",
    "Á": "A",
    "É": "E",
    "Í": "I",
    "Ó": "O",
    "Ú": "U",
    "à": "a",
    "è": "e",
    "ì": "i",
    "ò": "o",
    "ù": "u",
    "À": "A",
    "È": "E",
    "Ì": "I",
    "Ò": "O",
    "Ù": "U",
    "â": "a",
    "ê": "e",
    "î": "i",
    "ô": "o",
    "û": "u",
    "Â": "A",
    "Ê": "E",
    "Î": "I",
    "Ô": "O",
    "Û": "U",
    /*'ã': 'a', 'õ': 'o', 'ñ': 'n',
    'Ã': 'A', 'Õ': 'O', 'Ñ': 'N'*/
  };
  //aqui con expresion regular reemplazamos los acentos, los codigos son los de la tabla

  return str
    .normalize("NFD")
    .replace(/[\u0300-\u0302\u0304-\u036f]/g, (match) => {
      return accents[match] || "";
    });
};

/*
const removeAccents = (str) => {    
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
*/
export const filterWithRestoration = (Data) => {
  return Data.filter((item) => item.restoration_info === true);
};

export const filterWithoutRestoration = (Data) => {
  return Data.filter((item) => item.restoration_info === false);
};

export const filterSearch = (
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
) => {
  let filteredItems = [...tableData]; // clonamos siempre
//  console.log("filteredItems", filteredItems);
  // 1. Filtrado por restauración

  // antes de los filtros
  const restorationsMap = new Map(restorations.map((r) => [r._id, r]));

  // dentro del filtro
  if (selected === "with") {
    filteredItems = filteredItems.filter((item) => {
      const res = restorationsMap.get(item._id[0]);
      return res?.restoration_info === true;
    });
  } else if (selected === "without") {
    filteredItems = filteredItems.filter((item) => {
      const res = restorationsMap.get(item._id[0]);
      return res?.restoration_info === false;
    });
  }

  // 1. Filtrado por investigación
  const researchsMap = new Map(researchs.map((r) => [r._id, r]));
//console.log("selectedResearchs", selectedResearchs);
  if (selectedResearchs === "with") {
    filteredItems = filteredItems.filter((item) => {
    
      const res = researchsMap.get(item._id[0]);
      return res?.research_info === true;
    });
  } else if (selectedResearchs === "without") {
  
    filteredItems = filteredItems.filter((item) => {
      const res = researchsMap.get(item._id[0]);
      return res?.research_info === false;
    });
  }

  // si es "all" simplemente no se filtra nada aquí

  // 2. Selección de columnas
  let itemsToFilter;
  if (!disableChecks) {
    itemsToFilter = defColumns
      .filter((item) => item.show && checkboxSearchValues[item.id])
      .map((item) => item.id);
  } else {
    itemsToFilter = defColumns
      .filter((item) => item.show)
      .filter(
        (item) =>
          item.id !== "actions_inventory" &&
          item.id !== "actions_research" &&
          item.id !== "actions_restoration" &&
          item.id !== "photo_thumb_info"
      )
      .map((item) => item.id);
  }

  // 3. Filtrado por texto
  if (filterText !== "") {
    let handlefilterText = filterText;
    filteredItems = filteredItems.filter((item) => {
      return itemsToFilter.some((column) => {
        let columnValue = String(item[column] ?? ""); // aseguramos que no sea undefined
        if (rm_accents) {
          columnValue = removeAccents(columnValue);
          handlefilterText = removeAccents(filterText);
        }
        if (!upper_lower) {
          columnValue = columnValue.toLowerCase();
        }
        if (wordComplete) {
          const searchPattern = new RegExp(
            `(?:^|[^\\p{L}])${handlefilterText}(?:$|[^\\p{L}])`,
            !upper_lower ? "iu" : "u"
          );
          return searchPattern.test(columnValue);
        }
        return columnValue.includes(
          upper_lower ? handlefilterText : handlefilterText.toLowerCase()
        );
      });
    });
  }

  return filteredItems;
};

export const SearchBox = ({
  placeholder,
  columns,
  onFilter,
  filterText,
  checkboxSearchValues,
  handleCheckboxChange,
  setRmAccents,
  setUpperLower,
  disableChecks,
  setdisbleChecks,
  setWordComplete,
}) => {
  //const [searchText, setSearchText] = useState('');
  const [checks, setChecks] = useState([]);

  useEffect(() => {
    const checksList = columns.map((element, index) => {
      const ishecked = checkboxSearchValues[element.id];
      //  console.log('is', ishecked);
      if (
        element.show &&
        element.id !== "photo_thumb_info" &&
        element.id !== "actions_restoration" &&
        element.id !== "actions_inventory" &&
        element.id !== "actions_research"
      ) {
        return (
          <div key={index} className="form-check form-check-inline  mb-0 mt-0 ">
            <input
              className="form-check-input mt-2 ms-0  me-0"
              type="checkbox"
              id={element.id}
              value=""
              style={{ width: ".7em", height: ".8em" }}
              onChange={() => handleCheckboxChange(element.id)}
              checked={ishecked}
              disabled={disableChecks}
            />
            <label
              style={{ fontFamily: "Asap Condensed", fontSize: "1em" }}
              className="form-check-label ps-1 ms-1 mb-0 mt-0 "
              htmlFor={element.id}
            >
              {element.name}
            </label>
          </div>
        );
      } else {
        return null;
      }
    });
    setChecks(checksList);
  }, [columns, checkboxSearchValues, disableChecks, handleCheckboxChange]);

  // Calculando el número de elementos en cada columna
  const countElements = checks.filter((check) => check !== null).length;
  let numPerColumn = Math.floor(countElements / 2);
  const modP = countElements % 2;

  if (modP !== 0) {
    numPerColumn += modP;
  }
  // Dividiendo la lista de checks en dos sublistas
  const checksFirstColumn = checks.slice(0, numPerColumn);
  const checksSecondColumn = checks.slice(numPerColumn);

  return (
    <>
      <div className="d-flex align-items-center ">
        <div className="mb-3 mt-3">
          <input
            style={{ fontFamily: "Asap Condensed", height: "1.6em" }}
            type="text"
            className="form-control "
            onChange={onFilter}
            id="search"
            placeholder={placeholder}
            value={filterText}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary pb-4 pt-0 ms-2 me-3"
          style={{ fontFamily: "Asap Condensed", height: "1.6em" }}
          data-bs-toggle="collapse"
          data-bs-target="#AdvancedSearch"
        >
          {langData.dataTablesSearch.advanced_search}
        </button>
      </div>
      <div id="AdvancedSearch" className="collapse">
        <div
          className="card p-3"
          style={{
            borderRadius: "5px",
            color: "whitesmoke",
            background: "#8F8F8F",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Nuevo recuadro arriba de los primeros checks */}
          <div
            className="d-flex justify-content-between "
            style={{
              color: "whitesmoke",
              background: "#daebff",
              borderRadius: "5px",
            }}
          >
            <div
              className="d-flex ms-1"
              style={{
                fontFamily: "Asap Condensed",
                fontSize: ".9em",
                flex: "1",
              }}
            >
              <div
                style={{ background: "#5e5e5e", borderRadius: "4px" }}
                className="form-check form-switch ms-1 mt-1 ps-5 pe-2"
                data-tooltip-id="selection-tooltip"
                data-tooltip-content={
                  langData.dataTablesSearch.tooltip_selection
                }
                data-tooltip-place="top"
              >
                <Tooltip id="selection-tooltip" />
                <input
                  style={{ width: "1.8em" }}
                  className="form-check-input mt-1 "
                  type="checkbox"
                  id="flexSwitchCheckDefault1"
                  onChange={() => setdisbleChecks((prevState) => !prevState)}
                />
                <label
                  className="form-check-label "
                  htmlFor="flexSwitchCheckDefault1"
                >
                  {langData.dataTablesSearch.search_by_selection}
                </label>
              </div>

              <div
                style={{ background: "#5e5e5e", borderRadius: "4px" }}
                className="form-check form-switch ms-1 mt-1 ps-5 pe-2"
                data-tooltip-id="accents-tooltip"
                data-tooltip-content={langData.dataTablesSearch.tooltip_accents}
                data-tooltip-place="top"
              >
                <Tooltip id="accents-tooltip" />
                <input
                  style={{ width: "1.8em" }}
                  className="form-check-input mt-1 "
                  type="checkbox"
                  id="flexSwitchCheckDefault1"
                  onChange={() => setRmAccents((prevState) => !prevState)}
                />
                <label
                  className="form-check-label "
                  htmlFor="flexSwitchCheckDefault1"
                >
                  áa
                </label>
              </div>

              <div
                style={{ background: "#5e5e5e", borderRadius: "4px" }}
                className="form-check form-switch ms-1 mt-1 ps-5 pe-2"
                data-tooltip-id="upper-tooltip"
                data-tooltip-content={
                  langData.dataTablesSearch.tooltip_upper_lower
                }
                data-tooltip-place="top"
              >
                <Tooltip id="upper-tooltip" />
                <input
                  style={{ width: "1.8em" }}
                  className="form-check-input mt-1"
                  type="checkbox"
                  id="flexSwitchCheckDefault2"
                  onChange={() => setUpperLower((prevState) => !prevState)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckDefault2"
                >
                  Aa
                </label>
              </div>

              <div
                style={{ background: "#5e5e5e", borderRadius: "4px" }}
                className="form-check form-switch ms-1 mt-1 ps-5 pe-2"
                data-tooltip-id="whole-tooltip"
                data-tooltip-content={
                  langData.dataTablesSearch.tooltip_whole_word
                }
                data-tooltip-place="top"
              >
                <Tooltip id="whole-tooltip" />
                <input
                  style={{ width: "1.8em" }}
                  className="form-check-input mt-1"
                  type="checkbox"
                  id="flexSwitchCheckDefault2"
                  onChange={() => setWordComplete((prevState) => !prevState)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckDefault2"
                >
                  Palabra
                </label>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap">
            <div className="d-flex flex-column" style={{ flex: "1" }}>
              {checksFirstColumn}
            </div>
            <div className="d-flex flex-column" style={{ flex: "1" }}>
              {checksSecondColumn}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const SelectColumn = ({ handleChange, columns, checkboxValues }) => {
  var countElements = 0;
  const checks = columns.map((element, index) => {
    const isChecked = checkboxValues[element.id] || false;
    //console.log("element", element);
    if (
      element.name !== "_id" &&
      element.id !== "photo_thumb_info" &&
      element.id !== "actions_restoration" &&
      element.id !== "actions_inventory" &&
      element.id !== "actions_research"
    ) {
      if (!element.show) {
        countElements += 1;
        return (
          <div key={index} className="form-check form-check-inline mb-0 mt-0">
            <input
              className="form-check-input mt-2"
              type="checkbox"
              id={element.id}
              onChange={() => handleChange(element.id)}
              value={false}
              checked={isChecked}
              style={{ width: ".7em", height: ".8em" }}
            />
            <label
              className="form-check-label"
              htmlFor={element.id}
              style={{ fontFamily: "Asap Condensed", fontSize: "1em" }}
            >
              {element.name}
            </label>
          </div>
        );
      } /*if (element.show)*/ else {
        countElements += 1;
        return (
          <div key={index} className="form-check form-check-inline mb-0 mt-0">
            <input
              className="mt-2 form-check-input "
              type="checkbox"
              id={element.id}
              value={true}
              checked={isChecked}
              onChange={() => handleChange(element.id)}
              style={{ width: ".7em", height: ".8em" }}
            />
            <label
              className="form-check-label "
              htmlFor={element.id + "_idS"}
              style={{ fontFamily: "Asap Condensed", fontSize: "1em" }}
            >
              {element.name}
            </label>
          </div>
        );
      }
    }
    return null;
  });

  let numPerColumn = Math.floor(countElements / 2);
  const modP = countElements % 2;
  //console.log('Mod', modP);
  if (modP !== 0) {
    numPerColumn += modP;
    //console.log(numPerColumn);
  }
  const checksFirstColumn = checks.slice(0, numPerColumn);
  const checksSecondColumn = checks.slice(numPerColumn);

  return (
    <>
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary pb-4 pt-0 mb-3 ms-2 me-3"
          style={{ fontFamily: "Asap Condensed", height: "1.6em" }}
          data-bs-toggle="collapse"
          data-bs-target="#SelectColumn"
        >
          {langData.dataTablesSearch.select_columns}
        </button>
      </div>
      <div className="text-start">
        <div id="SelectColumn" className="collapse">
          <div
            className="card p-3"
            style={{
              borderRadius: "5px",
              color: "whitesmoke",
              background: "#8F8F8F",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div className="d-flex flex-wrap">
              <div className="d-flex flex-column" style={{ flex: "1" }}>
                {checksFirstColumn}
              </div>
              <div className="d-flex flex-column" style={{ flex: "1" }}>
                {checksSecondColumn}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
