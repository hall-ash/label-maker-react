import './Label.css';
import React, { useState } from "react";
import Aliquot from "./Aliquot";
import CalculateAliquotsModal from './CalculateAliquotsModal';
import { Row, Col, Label as RSLabel, FormGroup, Input, Container, Button } from 'reactstrap';
import { FaPlusSquare, FaTimes } from 'react-icons/fa';
import { nonnegativeNumberInputSchema } from './validationSchemas';
import './Label.css';

function Label({ id, labeltext, labelCount, aliquots, removeLabel, addAliquot, removeAliquot, onChange, setAliquots, displayAliquots, labelErrors }) {
  const aliquotComponents = aliquots.map(({ id: aliquotId, aliquottext, number }) => (
    <Aliquot
      id={aliquotId}
      key={aliquotId}
      aliquottext={aliquottext}
      number={number}
      remove={() => removeAliquot(id, aliquotId)}
      onChange={(e) => onChange(e, id, aliquotId)}
      error={labelErrors.aliquots[aliquotId]}
    />
  ));

  const handleChange = e => onChange(e, id);
  const handleClick = () => addAliquot(id);
  const handleCalculateAliquotsClick = (aliquots) => setAliquots(id, aliquots);
  const handleRemoveLabel = () => removeLabel(id);
  const toggleShowAliquots = () => {
    handleChange({ target: { name: "displayAliquots", checked: !displayAliquots, value: !displayAliquots } });
  };

  // const [errors, setErrors] = useState({ labelcount: '' });

  // const handleBlur = () => {
  //   const parsedLabelCount = nonnegativeNumberInputSchema.safeParse(labelCount);

  //   setErrors(prev => ({ ...prev, labelcount: parsedLabelCount.error }));
  // };

  return (
    <Container className="label-container">
      <div className="remove-label-icon">
        <FaTimes onClick={handleRemoveLabel} />
      </div>
      <Row className="mt-1">
        <FormGroup className="w-100">
          <RSLabel for="labeltext" className="label-title">Label Text</RSLabel>
          <Input
            id="labeltext"
            name="labeltext"
            type="textarea"
            value={labeltext}
            onChange={handleChange}
          />
        </FormGroup>
      </Row>
      <Row className="mt-1 label-count-and-add-aliquots-container">
        {!displayAliquots && (
          <Col xs="4">
            <FormGroup className="label-count-container">
              <RSLabel className="label-count" for="labelcount">Label Count</RSLabel>
              <Input
                id="labelcount"
                name="labelcount"
                type="text"
                value={labelCount}
                onChange={handleChange}
                bsSize="sm"
                className="label-count-input"
              />
              {labelErrors.labelcount && <small className="text-danger">{labelErrors.labelcount}</small>}
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
            <div className="aliquots-column">
              {aliquotComponents}
            </div>
            <div className="add-aliquot-btn-column">
              <FaPlusSquare className="add-aliquot-btn" onClick={handleClick} style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Label;
