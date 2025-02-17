import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import "../styles/Navigation.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import SettingsModal from "./SettingsModal.js";

function Navigation(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div>
      <Navbar {...args} light expand="md">
        <NavbarBrand href="/">μ</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <Link className="nav-link" to="/">Home</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/about">About</Link>
            </NavItem>
            <NavItem>
              <Button color="link" onClick={toggleModal} className="settings-btn"><FaCog /></Button>
              <SettingsModal isOpen={isModalOpen} toggle={toggleModal}/>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Navigation;