import React, { Component } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { Navbar, NavbarToggler, NavbarBrand, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import Auth from './Auth/Auth';

const auth = new Auth();

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.collapseNavbar = this.collapseNavbar.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log('header props ', this.props);
  }

  toggle() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  collapseNavbar() {
    const { isOpen } = this.state;
    if (isOpen) {
      this.setState({ isOpen: false });
    }
  }

  login() {
    auth.login();
  }

  logout() {
    auth.logout();
  }

  render() {
    console.log('header load');
    const { isOpen } = this.state;

    let list;
    const loggedIn = (
      <Navbar dark className="my-navbar" expand="md">
        <NavbarBrand tag={RouterNavLink} className="my-navbarbrand" to="/Home">
          PuppySpy
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink tag={RouterNavLink} to="/Logout" activeClassName="active" onClick={this.logout}>
                Log Out
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RouterNavLink} to="/Profile" activeClassName="active" onClick={this.collapseNavbar}>
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RouterNavLink} to="/ViewCam" activeClassName="active" onClick={this.collapseNavbar}>
                View Streams
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RouterNavLink} to="/SetCam" activeClassName="active" onClick={this.collapseNavbar}>
                Manage Streams
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RouterNavLink} to="/Tech" activeClassName="active" onClick={this.collapseNavbar}>
                Tech
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );

    const loggedOut = (
      <Navbar dark className="my-navbar">
        <NavbarBrand className="my-navbarbrand" href="/Home">
          PuppySpy
        </NavbarBrand>
        <Nav navbar className="mr-auto">
          <NavItem>
            <NavLink tag={Link} to="/Callback" onClick={this.login}>
              Log In
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );

    if (!auth.isAuthenticated()) {
      list = loggedOut;
    } else {
      list = loggedIn;
    }

    return <div id="nav">{list}</div>;
  }
}

export default Header;
