import React from "react";
import { Link } from "react-router-dom";
import { createStyles, Header, Group, Center, Container, rem } from "@mantine/core";
import { AccountContext } from "./auth/Account";

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background,
    borderBottom: 0,
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    zIndex: 1000, 
  },

  inner: {
    height: rem(56),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background || "",
        0.1
      ),
    },
  },
}));

function Banner() {
  const { logout } = React.useContext(AccountContext);
  const { classes } = useStyles();

  const handleLogoutClick = (event) => {
    event.preventDefault();
    console.log("Logout button clicked");
    logout(() => {
      console.log("Logout callback executed");
      // Add any necessary actions upon logout here
    });
  };

  return (
    <Header height={56} className={classes.header}>
        <div className={classes.inner}>
          {/* Add your logo here */}
          <Group spacing={5}>
            <Link to="/account" className={classes.link}>
              Account
            </Link>
            <Link to="/interview-history" className={classes.link}>
              Interview History
            </Link>
            <a href="/pricing" className={classes.link}>
              Pricing
            </a>
            <a href="/support" className={classes.link}>
              Support
            </a>
            <a href="/" className={classes.link} onClick={handleLogoutClick}>
              Logout
            </a>
          </Group>
        </div>
    </Header>
  );
}

export default Banner;
