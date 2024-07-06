import './Sample.css'
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Aliquot from "./Aliquot";
import { Row, Col, Label, FormGroup, Button, Input, InputGroup, Container } from 'reactstrap';

function Sample({ id, aliquots=[1, 2, 3] }) {

  const lastAliquotIdx = aliquots.length - 1;
  // Add key prop
  const aliquotComponents = aliquots.map((aliquot, idx) => {
    return <Aliquot hasAddAliquotButton={idx === lastAliquotIdx}/>
  });

  return (
    <Container className="mb-4 sample-container">
      <Row>
        <Col>
        <Row>
          <Col xs="6">
            <FormGroup>
              <Label for="sampleName">
                Sample Name
              </Label>
              <Input
                id="sampleName"
                name="sampleName"
                type="textarea"
              />
            </FormGroup>
          </Col>
          <Col xs="6">
            <FormGroup>
              <Label for="concentration">
                  Concentration
                </Label>
              <InputGroup>
              
                <Input
                  id="concentration"
                  name="concentration"
                  type="number"
                  step="0.001"
                  min="0"
                  bsSize="sm"
                  style={{ flexGrow: 4 }}
                />
                <Input
                  id="concentrationUnit"
                  name="concentrationUnit"
                  type="select"
                  bsSize="sm"
                  style={{ flexGrow: 2 }}
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
          </Col>
          </Row>
          {aliquotComponents}
        </Col>
      </Row>

    </Container>
  )
}

export default Sample;