import React, { useState, useEffect } from "react";
import { Row, Col, Input, InputGroup } from 'reactstrap';
import { FaTrash, FaGripHorizontal } from 'react-icons/fa';

function Aliquot({ id, remove, onUpdate }) {
  

  const handleDelete = () => remove(id);

  const initialState = {
    volume: '',
    volumeUnit: 'mL',
    number: '',
  };

  const [state, setState] = useState(initialState)

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    const newState = {
      ...state,
      [name]: value,
    };

    setState(newState);

    // Pass the updated state to the parent
    onUpdate(id, newState);

  };

  return (
  <Row className="g-2 mb-1 align-items-center">
    <Col xs="auto" className="d-flex align-items-center justify-content-center">
      <FaGripHorizontal style={{ cursor: 'grab' }}/>
    </Col>
    <Col xs="5">
      <InputGroup>
        <Input
          id="volume"
          name="volume"
          placeholder="volume"
          value={state.volume}
          onChange={handleInputChange}
          type="number"
          step="0.001"
          min="0"
          bsSize="sm"
          style={{ flexGrow: 5 }}
        />
         <Input
          id="volumeUnit"
          name="volumeUnit"
          value={state.volumeUnit}
          onChange={handleInputChange}
          type="select"
          bsSize="sm"
          style={{ flexGrow: 1 }}
        >
          <option>
            mL
          </option>
          <option>
            uL
          </option>
          <option>
            L
          </option>
        </Input>
      </InputGroup>
    </Col>
    <Col xs="4">
      <Input
        id="number"
        name="number"
        placeholder="number"
        value={state.number}
        onChange={handleInputChange}
        step="1"
        min="0"
        bsSize="sm"
      />
    </Col>
    <Col xs="1" className="d-flex align-items-center justify-content-center">
      <FaTrash onClick={handleDelete} style={{ cursor: 'pointer' }} />
    </Col>
    
  </Row>
  )
}

export default Aliquot;