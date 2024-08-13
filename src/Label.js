import './Sample.css'
import React from "react";
import Aliquot from "./Aliquot";
import CalculateAliquotsModal from './CalculateAliquotsModal';
import { Row, Col, Label as RSLabel, FormGroup, Input, Container, Button } from 'reactstrap';
import { FaPlusCircle } from 'react-icons/fa';

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

  // work on 
  const handleCalculateAliquotsClick = (aliquots) => setAliquots(id, aliquots);


  return (
    <Container className="mb-1 sample-container">
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