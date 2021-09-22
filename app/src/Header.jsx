import React, { useContext } from 'react';
import {NavLink as RRNavLink, withRouter} from "react-router-dom";
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from 'reactstrap';
import { LoginContext } from "./loginContext";

const Header = () => {
  const loginContext = useContext(LoginContext);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand>Gem Bankers United</NavbarBrand>
        <br />
        <Nav className="mr-auto" navbar>
          <NavItem isLoggedin={loginContext.isLoggedIn}>
            <NavLink tag={RRNavLink} exact to="/transaction-history" activeClassName="active">View Transaction
              History</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRNavLink} exact to="/transaction-create" activeClassName="active">Create
              Transaction</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={RRNavLink} exact to="/account-create" activeClassName="active">Create New Account</NavLink>
          </NavItem>
          {loginContext.isLoggedIn ?
            <NavItem right>
              <NavLink tag={RRNavLink} exact to="/logout" activeClassName="active">Logout</NavLink>
            </NavItem> :
            <NavItem className="nav navbar-nav navbar-right">
              <NavLink tag={RRNavLink} exact to="/login" activeClassName="active">Login</NavLink>
            </NavItem>
          }
        </Nav>
      </Navbar>
    </div>
  );
};

export default withRouter(Header);