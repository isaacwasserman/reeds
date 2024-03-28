import { React, useState } from "react";
import styles from "../styles/file_tree.module.css";

import { GoChevronRight, GoChevronDown } from "react-icons/go";

interface TreeSectionProps {
  label: string;
  children?: React.ReactNode;
}
const TreeSection: React.FunctionComponent<TreeSectionProps> = ({
  label,
  children,
}) => {
  return (
    <div className={styles.tree_section}>
      <span className={styles.section_label}>{label}</span>
      <div className={styles.section_child_container}>{children}</div>
    </div>
  );
};

interface TreeItemProps {
  label: string;
  child_items?: React.ReactNode;
  depth?: number;
  selection_handler?: (id: number) => void;
  selected_item_id?: number;
  id?: number;
}
const TreeItem: React.FunctionComponent<TreeItemProps> = ({
  label,
  child_items,
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
  icon = child_items.length > 0 ? icon : null;
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
        {child_items.map((item, index) => (
          <TreeItem
            key={`${item.id}`}
            id={`${item.id}`}
            label={item.label}
            child_items={item.children}
            depth={depth + 1}
            selection_handler={selection_handler}
            selected_item_id={selected_item_id}
          />
        ))}
      </div>
    </div>
  );
};

interface FileTreeProps {
  tree_items: any;
  selected_item_id?: number;
  selection_handler?: (id: number) => void;
}

const FileTree: React.FunctionComponent<TreeSectionProps> = ({
  tree_items,
  selected_item_id,
  selection_handler,
}) => {
  return (
    <TreeSection label={"Library"}>
      {tree_items.map((item, index) => (
        <TreeItem
          key={`${item.id}`}
          id={`${item.id}`}
          label={item.label}
          child_items={item.children}
          depth={0}
          selection_handler={selection_handler}
          selected_item_id={selected_item_id}
        />
      ))}
    </TreeSection>
  );
};

export default FileTree;
