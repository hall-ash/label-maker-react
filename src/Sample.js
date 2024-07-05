import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Aliquot from "./Aliquot";
import { Row, Col, Label, FormGroup, Button, Input, Container } from 'reactstrap';

function Sample({ aliquots=[1, 2, 3], hasAddSampleButton }) {

  const lastAliquotIdx = aliquots.length - 1;
  const aliquotComponents = aliquots.map((aliquot, idx) => {
    return <Aliquot hasAddAliquotButton={idx === lastAliquotIdx}/>
  });

  return (
    <div className="mb-2">
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
      {aliquotComponents}
      { hasAddSampleButton && 
        <Button className="mt-2">Add Sample</Button>
      }
    </div>
  )
}

export default Sample;