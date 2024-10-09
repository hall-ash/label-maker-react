import React, { useState } from "react";
import { Input, InputGroup, FormFeedback, Label as RSLabel } from 'reactstrap';
import { FaTrash } from 'react-icons/fa';
import './Aliquot.css';
import { Controller } from 'react-hook-form';
import { nonnegativeNumberInputSchema } from './validationSchemas';

const Aliquot = ({ control, labelIndex, aliquotIndex, remove, errors }) => {
  return (
    <div className="aliquot-input-container">
      <InputGroup>
        <RSLabel for={`labels[${labelIndex}].aliquots[${aliquotIndex}].aliquottext`} className="label-title">Aliquot Text</RSLabel>
        <Controller
          name={`labels[${labelIndex}].aliquots[${aliquotIndex}].aliquottext`}
          control={control}
          render={({ field }) => (
            <Input
              id={`labels[${labelIndex}].aliquots[${aliquotIndex}].aliquottext`}
              type="text"
              {...field}
              bsSize="sm"
              className="aliquot-text-input"
            />
          )}
        />
      </InputGroup>
      <InputGroup>
        <RSLabel for={`labels[${labelIndex}].aliquots[${aliquotIndex}].number`} className="label-title">Aliquot Number</RSLabel>
        <Controller
          name={`labels[${labelIndex}].aliquots[${aliquotIndex}].number`}
          control={control}
          render={({ field }) => (
            <Input
              id={`labels[${labelIndex}].aliquots[${aliquotIndex}].number`}
              type="number"
              {...field}
              step="1"
              min="0"
              bsSize="sm"
              className="aliquot-number-input"
              invalid={!!errors}
            />
          )}
        />
        {errors && <FormFeedback>{errors.message}</FormFeedback>}
      </InputGroup>

      <FaTrash onClick={remove} className="trash-icon" />
    </div>
  );
};


export default Aliquot;
