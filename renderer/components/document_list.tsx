import { React, useState } from "react";
import styles from "../styles/document_list.module.css";

interface DocumentListProps {
  documents: any;
  selection_handler: (id: string) => void;
}

const DocumentList: React.FunctionComponent<DocumentListProps> = ({
  documents,
  selection_handler,
}) => {
  return (
    <div className={styles.document_list}>
      {documents.map((doc) => {
        return (
          <div
            key={doc.id}
            className={styles.document_item}
            onClick={() => selection_handler(doc.id)}
          >
            {doc.title}
          </div>
        );
      })}
    </div>
  );
};

export default DocumentList;
