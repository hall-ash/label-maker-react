import React, { useState } from "react";
import { Input, InputGroup, FormFeedback } from 'reactstrap';
import { FaTrash } from 'react-icons/fa';
import './Aliquot.css';

function Aliquot({ aliquottext, number, remove, onChange, errors }) {
  // const [errors, setErrors] = useState({ number: '' });
  const handleChange = e => onChange(e);

  // const handleBlur = () => {
  //   const parsedAliquotNumber = aliquotSchema.safeParse(number);
  //   setErrors(prev => ({ ...prev, number: parsedAliquotNumber.number }));
  // };

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
        <InputGroup>
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
            invalid={errors.number}
          />
          <FormFeedback>
            {errors.number}
          </FormFeedback>
        </InputGroup>

        <FaTrash onClick={remove} className="trash-icon" />
     
    </div>
  );
}

export default Aliquot;
