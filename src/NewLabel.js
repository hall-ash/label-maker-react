import './Sample.css';
import React from "react";
import Aliquot from "./Aliquot";
import CalculateAliquotsModal from './CalculateAliquotsModal';
import { Row, Col, Label as RSLabel, FormGroup, Input, Container } from 'reactstrap';
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa';

function Label({ id, labeltext, aliquots, removeLabel, addAliquot, removeAliquot, onChange, setAliquots }) {
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

  return (
    <Container className="mb-1 sample-container" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <FaTimesCircle onClick={handleRemoveLabel} style={{ cursor: 'pointer', color: 'red' }} />
      </div>
      <Row className="mt-1">
        <FormGroup>
          <RSLabel for="mainText">Label Text</RSLabel>
          <Input
            id="labeltext"
            name="labeltext"
            type="textarea"
            value={labeltext}
            onChange={handleChange}
          />
        </FormGroup>
      </Row>
      <Row className="mt-1">
        <RSLabel>Aliquots</RSLabel>
        <Col>
          {aliquotComponents}
        </Col>
        <Col xs="1" className="d-flex align-items-end">
          <Row>
            <FaPlusCircle onClick={handleClick} style={{ cursor: 'pointer', color: 'blue' }} className="mb-2" />
            <CalculateAliquotsModal handleCalculateAliquotsClick={handleCalculateAliquotsClick} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Label;
