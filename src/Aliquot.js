import React from "react";
import { Row, Col, Input, InputGroup } from 'reactstrap';
import { FaTrash } from 'react-icons/fa';
import './Aliquot.css';

function Aliquot({ aliquottext, number, remove, onChange }) {
  const handleChange = e => onChange(e);

  return (
    <Row className="g-2 mb-1 align-items-center">
      <Col xs="6">
        <InputGroup>
          <Input
            id="aliquottext"
            name="aliquottext"
            placeholder="text"
            value={aliquottext}
            onChange={handleChange}
            type="text"
            bsSize="sm"
            className="aliquot-input"
          />
        </InputGroup>
      </Col>
      <Col xs="3">
        <Input
          id="number"
          name="number"
          type="number"
          placeholder="number"
          value={number}
          step="1"
          min="0"
          bsSize="sm"
          className="aliquot-number"
          onChange={handleChange}
        />
      </Col>
      <Col xs="1" className="d-flex align-items-center justify-content-center">
        <FaTrash onClick={remove} className="trash-icon" />
      </Col>
    </Row>
  );
}

export default Aliquot;
