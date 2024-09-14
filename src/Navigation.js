// import React from 'react';
// import { Link } from 'react-router-dom';


// function Navigation() {
//   return (
//     <nav>
//       <ul>
//         <li>
//           <Link to="/">Home</Link>
//         </li>
//         <li>
//           <Link to="/calculate">Calculate</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }

// export default Navigation;

import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import "./Navigation.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
  Button
} from 'reactstrap';
import SettingsModal from "./SettingsModal.js";

function Navigation(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div>
      <Navbar {...args} light expand="md">
        <NavbarBrand href="/">Label Maker</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/about">About</NavLink>
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