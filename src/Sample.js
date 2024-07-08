import './Sample.css'
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';
import Aliquot from "./Aliquot";
import { Row, Col, Label, FormGroup, Input, InputGroup, Container } from 'reactstrap';
import { FaPlusCircle } from 'react-icons/fa';

function Sample({ onUpdate }) {

  const uid = new ShortUniqueId({ length: 3 });

  const initialState = {
    sampleName: '',
    concentration: '',
    concentrationUnit: 'mg/mL',
  };



  const [state, setState] = useState(initialState);
  const [aliquots, setAliquots] = useState([])


  useEffect(() => {
    const initialAliquots = Array.from({ length: 3 }, () => ({ id: uid.rnd() }));
    setAliquots(initialAliquots);
    onUpdate({ ...state, aliquots: initialAliquots });
  }, []);

  const removeAliquot = id => {
    const newAliquots = aliquots.filter(aliquot => aliquot.id !== id);
    setAliquots(newAliquots);
    onUpdate({ ...state, aliquots: newAliquots });
  };

  const addAliquot = () => {
    const newAliquot = { id: uuidv4() };
    const newAliquots = [...aliquots, newAliquot];
    setAliquots(newAliquots);
    onUpdate({ ...state, aliquots: newAliquots });
  };

  const updateAliquots = (id, data) => {
    const newAliquots = aliquots.map(aliquot =>
      aliquot.id === id ? { ...aliquot, ...data } : aliquot
    );
    setAliquots(newAliquots);
    onUpdate({ ...state, aliquots: newAliquots });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newState = {
      ...state,
      [name]: value,
    };

    setState(newState);

    onUpdate({ ...newState, aliquots });
  };

  const aliquotComponents = aliquots.map(aliquot => (
    <Aliquot
      id={aliquot.id}
      key={aliquot.id}
      remove={removeAliquot}
      onUpdate={updateAliquots}
    />
  ));


  return (
    <Container className="mb-4 sample-container">
      <Row>
        <FormGroup>
          <Label for="sampleName">
            Sample Name
          </Label>
          <Input
            id="sampleName"
            name="sampleName"
            type="textarea"
            value={state.sampleName}
            onChange={handleInputChange}
          />
        </FormGroup>
      </Row>
      <Row className="concentration-row">
        <FormGroup>
          <Label for="concentration">
              Concentration
            </Label>
          <InputGroup>
          
            <Input
              id="concentration"
              name="concentration"
              placeholder="concentration"
              type="number"
              step="0.001"
              min="0"
              bsSize="sm"
              style={{ flexGrow: 4 }}
              value={state.concentration}
              onChange={handleInputChange}
            />
            <Input
              id="concentrationUnit"
              name="concentrationUnit"
              type="select"
              bsSize="sm"
              style={{ flexGrow: 2 }}
              value={state.concentrationUnit}
              onChange={handleInputChange}
            >
              <option>
                mg/mL
              </option>
              <option>
                ug/mL
              </option>
              <option>
                g/mL
              </option>
              <option>
                mg/L
              </option>
              <option>
                g/L
              </option>
            </Input>
          </InputGroup>
        </FormGroup>
      </Row>
      <Row>
      <Label >
              Aliquots
            </Label>
        <Col>
          {aliquotComponents}
        </Col>
        <Col xs="1" className="d-flex align-items-end">
          <Row>
            <FaPlusCircle onClick={addAliquot} style={{ cursor: 'pointer', color: 'blue' }} className="mb-2" />
          </Row>
        </Col>
        
  
      </Row>

    </Container>
  )
}

export default Sample;