import { React, useState, useRef, useEffect, use } from "react";
import { FaArrowUp, FaArrowDown, FaPlus, FaP } from "react-icons/fa6";
import styles from "../styles/document_list.module.css";

import { objectMapToArray, mapKeys } from "../utils";
import { ReedsDocument, formatField } from "../document";

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

const allColumns = [
  { key: "ENTRYTYPE", label: "Document Type" },
  { key: "title", label: "Title" },
  { key: "author", label: "Author" },
  { key: "year", label: "Year" },
  { key: "journal", label: "Journal" },
  { key: "volume", label: "Volume" },
  { key: "pages", label: "Pages" },
  { key: "doi", label: "DOI" },
  { key: "url", label: "URL" },
  { key: "addedDate", label: "Date Added" },
];
const allColumnKeys = allColumns.map((column) => column.key);
const allColumnLabels = allColumns.map((column) => column.label);

const keyToLabel = (key) => {
  const idx = allColumnKeys.indexOf(key);
  if (idx === -1) {
    return null;
  }
  return allColumns[idx].label;
};

const labelToKey = (label) => {
  return allColumns[allColumnLabels.indexOf(label)].key;
};

const DocumentListItem: React.FunctionComponent = ({
  document,
  selection_handler,
  selected_document_id,
  activeColumns,
  columnWidths,
}) => {
  let selected_class =
    selected_document_id === document.id ? styles.selected : null;

  let totalWidth = activeColumns.length + 100;
  activeColumns.forEach((column) => {
    totalWidth += columnWidths[column];
  });

  return (
    <div
      className={`${styles.listItem} ${selected_class}`}
      onMouseDown={() => selection_handler(document.id)}
      style={{ width: totalWidth }}
    >
      {activeColumns.map((column, index) => (
        <div
          key={index}
          className={`${styles.column}`}
          style={{ flexBasis: columnWidths[column] }}
        >
          {column === "addedDate"
            ? formatField(column, document[column])
            : formatField(column, document.bibtex[column])}
        </div>
      ))}
    </div>
  );
};

const DocumentListHeader: React.FunctionComponent = ({
  activeColumns,
  setActiveColumns,
  columnWidths,
  setColumnWidths,
  onDividerMouseDown,
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
}) => {
  const [colIndexForModification, setColIndexForModification] = useState(null);
  let totalWidth = activeColumns.length + 100;
  activeColumns.forEach((column) => {
    totalWidth += columnWidths[column];
  });

  const clickHandler = (e, column) => {
    if (e.button === 0) {
      if (column === sortKey) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortKey(column);
        setSortOrder("asc");
      }
    }
  };

  const columnRightClickHandler = (e, columnKey, columnIndex) => {
    e.preventDefault();
    setColIndexForModification(columnIndex);
    const { show } = useContextMenu({ id: "header_column_context_menu" });
    show({ event: e });
  };

  const replaceColumn = (columnIndex, newColumnKey) => {
    if (sortKey === activeColumns[columnIndex]) {
      setSortKey(newColumnKey);
    }
    let newActiveColumns = [...activeColumns];
    newActiveColumns[columnIndex] = newColumnKey;
    setActiveColumns(newActiveColumns);
  };

  const removeColumn = (columnIndex) => {
    if (sortKey === activeColumns[columnIndex]) {
      setSortKey(null);
    }
    let newActiveColumns = [...activeColumns];
    newActiveColumns.splice(columnIndex, 1);
    setActiveColumns(newActiveColumns);
  };

  const addColumn = (columnKey) => {
    let newActiveColumns = [...activeColumns];
    newActiveColumns.push(columnKey);
    setActiveColumns(newActiveColumns);
  };

  const addButtonClickHandler = (e) => {
    const { show } = useContextMenu({ id: "add_column_context_menu" });
    show({ event: e });
  };

  return (
    <div className={styles.header} style={{ width: totalWidth }}>
      {activeColumns.map((column, index) => (
        <div
          key={index}
          className={`${styles.column}`}
          style={{ flexBasis: columnWidths[column] }}
          onMouseDown={(e) => clickHandler(e, column)}
          onContextMenu={(e) => columnRightClickHandler(e, column, index)}
        >
          <div>
            <span>
              {allColumnLabels[allColumnKeys.indexOf(column)]}{" "}
              {sortKey === column ? (
                sortOrder === "desc" ? (
                  <FaArrowDown className={styles.sortOrder} />
                ) : (
                  <FaArrowUp className={styles.sortOrder} />
                )
              ) : null}
            </span>
          </div>
          <div
            className={`${styles.divider}`}
            onMouseDown={(e) => onDividerMouseDown(e, index)}
          ></div>
        </div>
      ))}
      <div
        className={`${styles.addColumn} ${styles.column}`}
        onClick={addButtonClickHandler}
      >
        <FaPlus />
      </div>
      <Menu id={"header_column_context_menu"}>
        <Submenu label="Sort by Column">
          <Item
            onClick={() => {
              setSortKey(activeColumns[colIndexForModification]);
              setSortOrder("asc");
            }}
          >
            Ascending
          </Item>
          <Item
            onClick={() => {
              setSortKey(activeColumns[colIndexForModification]);
              setSortOrder("desc");
            }}
          >
            Descending
          </Item>
        </Submenu>
        <Separator />
        <Submenu label="Replace Column with">
          {allColumns.map((column, index) => (
            <Item
              key={index}
              onClick={() => replaceColumn(colIndexForModification, column.key)}
            >
              {column.label}
            </Item>
          ))}
        </Submenu>
        <Separator />
        <Item
          onClick={() => removeColumn(colIndexForModification)}
          className={styles.contextOptionDestruct}
        >
          Remove Column "{keyToLabel(activeColumns[colIndexForModification])}"
        </Item>
      </Menu>
      <Menu id="add_column_context_menu">
        {allColumns.map((column, index) => (
          <Item key={index} onClick={() => addColumn(column.key)}>
            {column.label}
          </Item>
        ))}
      </Menu>
    </div>
  );
};

const DocumentList: React.FunctionComponent = ({
  documents,
  selection_handler,
  selected_document_id,
}) => {
  let [sortKey, setSortKey] = useState("title");
  let [sortOrder, setSortOrder] = useState("asc");
  let [activeColumns, setActiveColumns] = useState([
    "title",
    "author",
    "year",
    "ENTRYTYPE",
  ]);
  let [columnWidths, setColumnWidths] = useState(
    mapKeys(allColumnKeys, () => 200)
  );
  const dividerXPosition = useRef(null);
  let [activeDividerIndex, setActiveDividerIndex] = useState(null);

  const onDividerMouseDown = (e, dividerIndex) => {
    dividerXPosition.current = e.clientX;
    setActiveDividerIndex(dividerIndex);
  };

  const onDocumentMouseMove = (e) => {
    if (!dividerXPosition.current) {
      return;
    }
    let columnKey = activeColumns[activeDividerIndex];
    let currentWidth = columnWidths[columnKey];
    const newWidth = currentWidth + e.clientX - dividerXPosition.current;
    dividerXPosition.current = e.clientX;
    let newColumnWidths = { ...columnWidths };
    newColumnWidths[columnKey] = newWidth;
    setColumnWidths(newColumnWidths);
  };

  const onDocumentMouseUp = () => {
    dividerXPosition.current = null;
  };

  useEffect(() => {
    document.addEventListener("mousemove", onDocumentMouseMove);
    document.addEventListener("mouseup", onDocumentMouseUp);
    return () => {
      document.removeEventListener("mousemove", onDocumentMouseMove);
      document.removeEventListener("mouseup", onDocumentMouseUp);
    };
  });

  const sortedDocuments = objectMapToArray(documents, (doc) => doc).sort(
    (a, b) => {
      let documentA = new ReedsDocument().from_json(a);
      let documentB = new ReedsDocument().from_json(b);
      let aValue = documentA.get(sortKey);
      let bValue = documentB.get(sortKey);
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    }
  );

  return (
    <div className={styles.document_list}>
      <DocumentListHeader
        activeColumns={activeColumns}
        setActiveColumns={setActiveColumns}
        columnWidths={columnWidths}
        setColumnWidths={setColumnWidths}
        onDividerMouseDown={onDividerMouseDown}
        sortKey={sortKey}
        sortOrder={sortOrder}
        setSortKey={setSortKey}
        setSortOrder={setSortOrder}
      />
      {sortedDocuments.map((doc, index) => (
        <DocumentListItem
          key={index}
          document={doc}
          activeColumns={activeColumns}
          columnWidths={columnWidths}
          selected_document_id={selected_document_id}
          selection_handler={selection_handler}
        />
      ))}
    </div>
  );
};

export default DocumentList;
