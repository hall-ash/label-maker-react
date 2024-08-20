import React from "react";
import { Row, Col, Input, InputGroup } from 'reactstrap';
import { FaTrash } from 'react-icons/fa';

function Aliquot({ id, aliquottext, number, remove, onChange }) {

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
            style={{ flexGrow: 5 }}
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
          onChange={handleChange}
        />
      </Col>
      <Col xs="1" className="d-flex align-items-center justify-content-center">
        <FaTrash onClick={remove} style={{ cursor: 'pointer' }} />
      </Col>
    </Row>
  );
}

export default Aliquot;