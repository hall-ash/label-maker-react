import React, { useState } from "react";
import { Input, InputGroup, FormFeedback } from 'reactstrap';
import { FaTrash } from 'react-icons/fa';
import { quantitySchema } from "./validationSchemas";
import './Aliquot.css';

const Aliquot = ({ aliquottext, number, remove, onChange }) => {
  const [errors, setErrors] = useState({});
  const handleChange = e => {  
    const { name, value } = e.target;
    onChange(e);

    if (name === 'number') {
      const parsedAliquotNumber = quantitySchema.safeParse(value);

      if (!parsedAliquotNumber.success) {
        const errorMsg = parsedAliquotNumber.error.errors[0].message;
        setErrors(prev => ({ ...prev, number: errorMsg }));
      } else {
        setErrors(prev => ({ ...prev, number: null }));
      }
    }
  };

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
