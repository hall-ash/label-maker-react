import React, { useState } from "react";
import { Input, InputGroup, FormFeedback } from 'reactstrap';
import { FaTrash } from 'react-icons/fa';
import { quantitySchema } from "./validationSchemas";
import './Aliquot.css';

const Aliquot = ({ aliquottext, number, remove, onChange }) => {
  const [errors, setErrors] = useState({
    number: '',
  });

  const handleChange = e => {  
    const { name, value } = e.target;
    onChange(e);

    if (name === 'number') {
      // Validate using Zod schema
      try {
        quantitySchema.parse(value);
        setErrors({ ...errors, number: '' });
      } catch (error) {
        setErrors({ ...errors, number: error.errors[0]?.message || 'Invalid value' });
      }
    }
  };

  return (
    <InputGroup className="mb-2">
      <Input
        type="number"
        name="number"
        value={number}
        onChange={handleChange}
        invalid={!!errors.number}
      />
      <FormFeedback>{errors.number}</FormFeedback>
      <FaTrash className="ml-2 text-danger" onClick={remove} style={{ cursor: 'pointer' }} />
    </InputGroup>
  );
};

export default Aliquot;
