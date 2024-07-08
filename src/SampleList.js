import './SampleList.css'
import React, { useState, useEffect } from "react";
import Sample from "./Sample";
import { Row, Col, Label, FormGroup, Button, Input, InputGroup, Container } from 'reactstrap';
import { FaTrash, FaGripHorizontal, FaPlusSquare } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';


function SampleList () {

  const [samples, setSamples] = useState([])

  // initialize 1 sample on component mount
  useEffect(() => {
    setSamples([{ id: uuidv4() }]);
  }, []);
  

  const addSample = evt => {
    const newSample = { id: uuidv4() };
    setSamples(samples => [...samples, newSample]);
  };
  


  const removeSample = id => {
    setSamples(samples => samples.filter(sample => sample.id !== id));
  };

  const sampleComponents = samples.map(({ id, aliquots }) => {
    return <Sample 
            id={id}
            key={id}
            aliquots={aliquots}
            removeSample={removeSample}
           /> 
  });


  return (
    <Container className='sample-list-container'>
      <Row>
        <Col className='flex-grow-1 sample-list-col'>
          { sampleComponents }
        </Col>
        <Col xs="1" className="d-flex flex-column justify-content-end">
          <FaPlusSquare onClick={addSample} style={{ cursor: 'pointer' }} />
        </Col>
      </Row>
    </Container>
  )

}

export default SampleList;