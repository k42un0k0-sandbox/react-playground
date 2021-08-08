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

function useDrawer() {
  const [open, setOpen] = useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        "key" in event &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };
  return { open, toggleDrawer };
}
export const [DrawerProvider, useDrawerContext] = constate(useDrawer);

export default function Sidebar() {
  const classes = useStyles();
  const { open, toggleDrawer } = useDrawerContext();
  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {[
          "state-management/constate",
          "state-management/jotai",
          "state-management/zustand",
          "portal-modal",
        ].map((text, index) => (
          <Link key={text} href={"/" + text} passHref>
            <ListItem button component="a">
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
}

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});
