import { SimpleTreeView, TreeItem, TreeItemProps } from "@mui/x-tree-view";

import styles from "../../styles/file_tree.module.css";

import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import { TransitionProps } from "@mui/material/transitions";
import { useSpring, animated } from "@react-spring/web";

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      //   opacity: props.in ? 1 : 0,
      //   transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} timeout={0} />
    </animated.div>
  );
}

function generate_random_id(): String {
  let random_id: String = Math.random().toString(36).substring(2, 9);
  return random_id;
}

function CustomTreeItem(props: TreeItemProps) {
  return (
    <TreeItem
      {...props}
      itemId={generate_random_id()}
      slots={{ groupTransition: TransitionComponent }}
    />
  );
}

export default function FileTree({ styles }) {
  return (
    <SimpleTreeView
      sx={{
        "& .MuiTreeItem-label": {
          fontFamily: "BlinkMacSystemFont, sans-serif",
        },
      }}
    >
      <CustomTreeItem label="Advanced Deep Learning">
        <CustomTreeItem label="Papers" />
        <CustomTreeItem label="Websites" />
      </CustomTreeItem>
      <CustomTreeItem label="Advanced Rendering">
        <CustomTreeItem label="Papers" />
        <CustomTreeItem label="Books" />
      </CustomTreeItem>
      <CustomTreeItem label="GraPL">
        <CustomTreeItem label="Papers" />
        <CustomTreeItem label="Books" />
      </CustomTreeItem>
    </SimpleTreeView>
  );
}
