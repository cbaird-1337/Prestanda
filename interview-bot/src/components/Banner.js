import React from "react";
import { Link } from "react-router-dom";
import { createStyles, Header, Group, Center, Container, rem } from "@mantine/core";
import { AccountContext } from "./auth/Account";
import logo from "../pages/elements/images/Prestanda-Logo-Transparent.png";

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

  logo: {
    display: "block",
    height: rem(30), // Adjust the logo height
    marginLeft: rem(5),
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
          <img src={logo} alt="Prestanda Logo" className={classes.logo} />
          <Group spacing={5} style={{ marginLeft: "auto" }}>
            <Link to="/accountpage" className={classes.link}>
              Account
            </Link>
            <Link to="/interviewhistorypage" className={classes.link}>
              Interview History
            </Link>
            <Link to="/featurerequestspage" className={classes.link}>
              Feature Requests
            </Link>
            <Link to="/billingpage" className={classes.link}>
              Billing
            </Link>
            <Link to="/supportpage" className={classes.link}>
              Support
            </Link>
            <a href="/" className={classes.link} onClick={handleLogoutClick}>
              Logout
            </a>
          </Group>
        </div>
    </Header>
  );
}

export default Banner;
