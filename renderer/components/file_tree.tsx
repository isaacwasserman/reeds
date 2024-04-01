"use client";

import { React, useEffect, useState } from "react";
import { objectMapToArray, objectFilter } from "../utils";
import styles from "../styles/file_tree.module.css";

import { GoChevronRight, GoChevronDown } from "react-icons/go";

interface TreeSectionProps {
  label: string;
  children?: React.ReactNode;
  selection_handler?: (id: number) => void;
  selected_item_id?: number;
}
const TreeSection: React.FunctionComponent<TreeSectionProps> = ({
  label,
  children,
  selection_handler,
  selected_item_id,
}) => {
  return (
    <div className={styles.tree_section}>
      <span
        className={styles.section_label}
        onMouseDown={() => selection_handler(null)}
      >
        {label}
      </span>
      <div className={styles.section_child_container}>{children}</div>
    </div>
  );
};

interface TreeItemProps {
  label: string;
  child_ids?: React.ReactNode;
  folders?: any;
  depth?: number;
  selection_handler?: (id: number) => void;
  selected_item_id?: number;
  id?: number;
}
const TreeItem: React.FunctionComponent<TreeItemProps> = ({
  label,
  child_ids,
  folders,
  depth,
  selection_handler,
  selected_item_id,
  id,
}) => {
  let is_open: boolean;
  let set_is_open: React.Dispatch<React.SetStateAction<boolean>>;
  [is_open, set_is_open] = useState(false);

  const handle_toggle_open = () => {
    set_is_open(!is_open);
  };

  const handle_select_item = () => {
    selection_handler(id);
  };

  const is_selected = () => {
    return selected_item_id === id;
  };

  let open_class = is_open ? styles.open : styles.closed;
  let icon = is_open ? <GoChevronDown /> : <GoChevronRight />;
  icon = child_ids.length > 0 ? icon : null;
  let selected_class = is_selected() ? styles.selected : null;

  return (
    <div className={`${styles.tree_item} ${open_class} ${selected_class}`}>
      <span className={styles.label} onClick={handle_select_item}>
        {[...Array(depth)].map((v, i) => (
          <span className={styles.indent} key={i} />
        ))}
        <span className={styles.indent}></span>
        <span className={styles.icon} onClick={handle_toggle_open}>
          {icon}
        </span>
        <span className={styles.text}>{label}</span>
      </span>
      <div className={styles.child_container}>
        {objectMapToArray(
          objectFilter(folders, (folder) => folder.parent == id),
          (folder) => (
            <TreeItem
              key={`${folder.id}`}
              id={`${folder.id}`}
              label={folder.name}
              folders={folders}
              child_ids={folder.children}
              depth={depth + 1}
              selection_handler={selection_handler}
              selected_item_id={selected_item_id}
            />
          )
        )}
      </div>
    </div>
  );
};

interface FileTreeProps {
  folders?: any;
  selected_item_id?: number;
  selection_handler?: (id: number) => void;
}
const FileTree: React.FunctionComponent<FileTreeProps> = ({
  folders,
  selected_item_id,
  selection_handler,
}) => {
  let folder_ids = Object.keys(folders);
  return (
    <TreeSection
      label={"Library"}
      selection_handler={selection_handler}
      selected_item_id={selected_item_id}
    >
      {objectMapToArray(
        objectFilter(folders, (folder) => folder.parent == null),
        (folder) => (
          <TreeItem
            key={`${folder.id}`}
            id={`${folder.id}`}
            label={folder.name}
            folders={folders}
            child_ids={folder.children}
            depth={0}
            selection_handler={selection_handler}
            selected_item_id={selected_item_id}
          />
        )
      )}
    </TreeSection>
  );
};

export default FileTree;
