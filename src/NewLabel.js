import './Label.css';
import React from "react";
import Aliquot from "./Aliquot";
import CalculateAliquotsModal from './CalculateAliquotsModal';
import { Row, Col, Label as RSLabel, FormGroup, Input, Container, Button } from 'reactstrap';
import { FaPlusSquare, FaTimes } from 'react-icons/fa';

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
    <Container className="mb-1 label-container" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <FaTimes onClick={handleRemoveLabel} style={{ cursor: 'pointer', color: 'black' }} />
      </div>
      <Row className="mt-1">
        <FormGroup>
          <RSLabel for="mainText" className="label-title">Label Text</RSLabel>
          <Input
            id="labeltext"
            name="labeltext"
            type="textarea"
            value={labeltext}
            onChange={handleChange}
          />
        </FormGroup>
      </Row>
      <Row className="mt-1 align-items-center">
        <Col>
          <RSLabel className="aliquots-title">Aliquots</RSLabel>
        </Col>
        <Col>
          <CalculateAliquotsModal
            handleCalculateAliquotsClick={handleCalculateAliquotsClick}
          />
        </Col>
      </Row>
      {/* <Row className="mt-1">
        <Col>
          {aliquotComponents}
          <div style={{ position: 'absolute', bottom: 30, right: 15 }}>
            <FaPlusSquare onClick={handleClick} style={{ cursor: 'pointer', color: 'gray' }} />
          </div>
        </Col>
        
      </Row> */}
      <Row className="mt-1">
  <Col className="d-grid" style={{ gridTemplateColumns: '1fr auto' }}>
    <div>{aliquotComponents}</div>
    <FaPlusSquare className="add-aliquot-btn" onClick={handleClick} style={{ cursor: 'pointer', color: 'gray', alignSelf: 'end' }} />
  </Col> 
</Row>

    </Container>
  );
}

export default Label;
