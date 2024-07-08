import './LabelForm.css'
import React, { useState } from "react";
import Sample from "./Sample";
import { Form, Button, FormGroup, Label, Input, FormText } from 'reactstrap';

function LabelForm() {
  const [labelType, setLabelType] = useState('');
  const [skipLabels, setSkipLabels] = useState('');
  const [labelFile, setLabelFile] = useState(null);

  const [sampleState, setSampleState] = useState({});

  const handleSampleUpdate = (sampleData) => {

    setSampleState({...sampleState, sampleData})
  }


  const handleLabelTypeChange = (e) => {
    setLabelType(e.target.value);
  };

  const handleSkipLabelsChange = (e) => {
    setSkipLabels(e.target.value);
  };

  const handleLabelFileChange = (e) => {
    setLabelFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gather all necessary data for submission
    const formData = {
      labelType,
      skipLabels,
      labelFile,
      ...sampleState,
    };

    console.log('Form Data: ',  formData)  
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="labelType">Label Type</Label>
        <Input
          id="labelType"
          name="labelType"
          type="select"
          value={labelType}
          onChange={handleLabelTypeChange}
        >
          <option>size 1</option>
          <option>size 2</option>
          <option>size 3</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="skipLabels">Skip Labels</Label>
        <Input
          id="skipLabels"
          name="skipLabels"
          type="textarea"
          value={skipLabels}
          onChange={handleSkipLabelsChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="labelFile">Label Names</Label>
        <Input
          id="labelFile"
          name="labelFile"
          type="file"
          onChange={handleLabelFileChange}
        />
        <FormText>Upload an excel or csv file to create labels.</FormText>
      </FormGroup>
      <Sample onUpdate={handleSampleUpdate}/>
      <div className="d-flex justify-content-center m-5">
        <Button color="primary" type="submit">Create Labels</Button>
      </div>
    </Form>
  );
}

export default LabelForm;
