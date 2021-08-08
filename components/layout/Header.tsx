import { AppBar, IconButton, makeStyles, Toolbar } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { useDrawerContext } from "./Sidebar";

export default function Header() {
  const classes = useStyles();
  const { toggleDrawer } = useDrawerContext();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <Menu />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
