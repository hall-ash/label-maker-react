import './Label.css';
import React, { useState } from "react";
import Aliquot from "./Aliquot";
import CalculateAliquotsModal from './CalculateAliquotsModal';
import { Row, Col, Label as RSLabel, FormGroup, Input, Container, Button } from 'reactstrap';
import { FaPlusSquare, FaTimes } from 'react-icons/fa';
import { nonnegativeNumberInputSchema } from './validationSchemas';
import { Controller } from 'react-hook-form';
import './Label.css';

const Label = ({ control, index, removeLabel, addAliquot, removeAliquot, setAliquots, errors, displayAliquots }) => {
  const handleCalculateAliquotsClick = (aliquots) => setAliquots(index, aliquots);
  const toggleShowAliquots = () => {
    control.setValue(`labels[${index}].displayAliquots`, !displayAliquots);
  };

  return (
    <Container className="label-container">
      <div className="remove-label-icon">
        <FaTimes onClick={() => removeLabel(index)} />
      </div>
      <Row className="mt-1">
        <FormGroup className="w-100">
          <RSLabel for={`labels[${index}].labeltext`} className="label-title">Label Text</RSLabel>
          <Controller
            name={`labels[${index}].labeltext`}
            control={control}
            render={({ field }) => (
              <Input
                id={`labels[${index}].labeltext`}
                type="textarea"
                {...field}
              />
            )}
          />
        </FormGroup>
      </Row>
      <Row className="mt-1 label-count-and-add-aliquots-container">
        {!displayAliquots && (
          <Col xs="4">
            <FormGroup className="label-count-container">
              <RSLabel className="label-count" for={`labels[${index}].labelcount`}>Label Count</RSLabel>
              <Controller
                name={`labels[${index}].labelcount`}
                control={control}
                render={({ field }) => (
                  <Input
                    id={`labels[${index}].labelcount`}
                    type="number"
                    {...field}
                    min="0"
                    bsSize="sm"
                    className="label-count-input"
                  />
                )}
              />
              {errors?.labels?.[index]?.labelcount && <small className="text-danger">{errors.labels[index].labelcount.message}</small>}
            </FormGroup>
          </Col>
        )}
        <Col className="text-end">
          <Button color="primary" size="sm" onClick={toggleShowAliquots}>
            {displayAliquots ? "Remove Aliquots" : "Add Aliquots"}
          </Button>
        </Col>
      </Row>
      {displayAliquots && (
        <div>
          <Row className="mt-3 align-items-center">
            <Col>
              <RSLabel className="aliquots-title">Aliquots</RSLabel>
            </Col>
            <Col className="text-end">
              <CalculateAliquotsModal handleCalculateAliquotsClick={handleCalculateAliquotsClick} />
            </Col>
          </Row>
          <div className="aliquots-container">
            <Controller
              name={`labels[${index}].aliquots`}
              control={control}
              render={({ field }) =>
                field.value.map((aliquot, aliquotIndex) => (
                  <Aliquot
                    key={aliquot.id}
                    control={control}
                    labelIndex={index}
                    aliquotIndex={aliquotIndex}
                    remove={() => removeAliquot(index, aliquotIndex)}
                    errors={errors?.labels?.[index]?.aliquots?.[aliquotIndex]}
                  />
                ))
              }
            />
            <FaPlusSquare className="add-aliquot-btn" onClick={() => addAliquot(index)} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      )}
    </Container>
  );
};


export default Label;
