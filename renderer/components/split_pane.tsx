"use client";

import { React, useState, useEffect, useRef } from "react";

import styles from "../styles/split_pane.module.css";

interface SplitPaneProps {
  className: string;
  minSize: number;
  defaultSize: number;
  children: React.ReactNode[];
}

const VerticalSplitPane: React.FunctionComponent<SplitPaneProps> = ({
  className,
  minSize,
  defaultSize,
  children,
}) => {
  const [paneSize, setPaneSize] = useState(defaultSize);
  const separatorXPosition = useRef(null);

  const onMouseDown = (e) => {
    separatorXPosition.current = e.clientX;
  };

  const onMouseMove = (e) => {
    if (!separatorXPosition.current) {
      return;
    }
    const newTopHeight = paneSize + e.clientX - separatorXPosition.current;
    separatorXPosition.current = e.clientX;
    setPaneSize(newTopHeight);
  };

  const onMouseUp = () => {
    separatorXPosition.current = null;
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <div className={className}>
      <div style={{ height: "100%", width: `${paneSize}px` }}>
        {children[0]}
      </div>
      <div className={styles.divider} onMouseDown={onMouseDown}></div>
      <div style={{ height: "100%", width: `calc(100% - ${paneSize}px)` }}>
        {children[1]}
      </div>
    </div>
  );
};

export default VerticalSplitPane;
