import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import constate from "constate";
import Link from "next/link";
import { pagesPath } from "../../lib/$path";

function useDrawer() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (open: boolean) => (event: React.MouseEvent) => {
    setOpen(open);
  };
  return { open, toggleDrawer };
}
export const [DrawerProvider, useDrawerContext] = constate(useDrawer);

const RecursiveListItem = ({ path }: Record<string, any>) => {
  const classes = useStyles();

  return (
    <>
      {Object.keys(path).map((key) => {
        if (key === "$url") {
          const pathObj = path[key]();
          return (
            <>
              <Link key={pathObj.pathname} href={pathObj} passHref>
                <ListItem button component="a" className={classes.list}>
                  <ListItemText primary={pathObj.pathname} />
                </ListItem>
              </Link>
            </>
          );
        }
        return <RecursiveListItem key={key} path={path[key]} />;
      })}
    </>
  );
};
export default function Sidebar() {
  const { open, toggleDrawer } = useDrawerContext();

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      <List onClick={toggleDrawer(false)}>
        <RecursiveListItem path={pagesPath} />
      </List>
    </Drawer>
  );
}

const useStyles = makeStyles({
  list: {
    paddingRight: 50,
  },
});
