import './Label.css';
import React from "react";
import Aliquot from "./Aliquot";
import CalculateAliquotsModal from './CalculateAliquotsModal';
import { Row, Col, Label as RSLabel, FormGroup, Input, Container, Button } from 'reactstrap';
import { FaPlusSquare, FaTimes } from 'react-icons/fa';

import './Label.css';

function Label({ id, labeltext, labelCount, aliquots, removeLabel, addAliquot, removeAliquot, onChange, setAliquots, displayAliquots }) {
  const aliquotComponents = aliquots.map(({ id: aliquotId, aliquottext, number }) => (
    <Aliquot
      id={aliquotId}
      key={aliquotId}
      aliquottext={aliquottext}
      number={number}
      remove={() => removeAliquot(id, aliquotId)}
      onChange={(e) => onChange(e, id, aliquotId)}
    />
  ));

  const handleChange = e => onChange(e, id);
  const handleClick = () => addAliquot(id);
  const handleCalculateAliquotsClick = (aliquots) => setAliquots(id, aliquots);
  const handleRemoveLabel = () => removeLabel(id);
  const toggleShowAliquots = () => {
    handleChange({ target: { name: "displayAliquots", checked: !displayAliquots, value: !displayAliquots } });
  };

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
                type="number"
                value={labelCount}
                onChange={handleChange}
                min="0"
                bsSize="sm"
                className="label-count-input"
              />
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
          <Row className="mt-1">
            <Col xs="8">
              <div>{aliquotComponents}</div>
            </Col>
            <Col className="d-grid" style={{ gridTemplateColumns: '1' }}>
              <FaPlusSquare className="add-aliquot-btn" onClick={handleClick} style={{ cursor: 'pointer' }} />
            </Col> 
          </Row>
        </div>
      )}
    </Container>
  );
}

export default Label;
