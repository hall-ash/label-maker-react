import React from "react";
import { Input, InputGroup } from 'reactstrap';
import { FaTrash } from 'react-icons/fa';
import './Aliquot.css';

function Aliquot({ aliquottext, number, remove, onChange }) {
  const handleChange = e => onChange(e);

  return (
    <div className="aliquot-input-container">
        <InputGroup>
          <Input
            id="aliquottext"
            name="aliquottext"
            placeholder="text"
            value={aliquottext}
            onChange={handleChange}
            type="text"
            bsSize="sm"
            className="aliquot-text-input"
          />
        </InputGroup>
  
        <Input
          id="number"
          name="number"
          type="number"
          placeholder="number"
          value={number}
          step="1"
          min="0"
          bsSize="sm"
          className="aliquot-number-input"
          onChange={handleChange}
        />
  
        <FaTrash onClick={remove} className="trash-icon" />
     
    </div>
  );
}

export default Aliquot;
