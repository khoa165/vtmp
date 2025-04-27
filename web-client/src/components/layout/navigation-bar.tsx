import React, { Fragment, useState } from 'react';
import {
  Collapse,
  Navbar as BootstrapNavbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { useGate } from 'statsig-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const { value: show_experimental_features, isLoading } = useGate(
    'show_experimental_features'
  );

  return (
    <BootstrapNavbar expand="md" container>
      <NavbarBrand href="/">
        <img
          alt="Viet Tech logo"
          src="https://res.cloudinary.com/khoa165/image/upload/v1718192551/viettech/VTMP_logo.png"
          style={{
            height: 40,
            width: 40,
            marginRight: 15,
          }}
          className="inline"
        />
        Viet Tech Mentorship Program
      </NavbarBrand>
      <NavbarToggler onClick={toggle} color="white" />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar></Nav>
        <Nav className="ms-auto" navbar>
          <NavItem>
            <NavLink href="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/summary">Summary</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/people">People</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/resources">Resources</NavLink>
          </NavItem>
          {!isLoading && show_experimental_features && (
            <Fragment>
              <NavItem>
                <NavLink href="/projects">Projects</NavLink>
              </NavItem>
            </Fragment>
          )}
          <NavItem>
            <NavLink href="/stats">Stats</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </BootstrapNavbar>
  );
};
