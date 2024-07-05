import React, { useState } from "react";
import Sample from "./Sample";
import { Form, Button, FormGroup, Label, Input, Container, FormText } from 'reactstrap';

function LabelForm() {
  return (
  
      <Form>
        <FormGroup>
          <Label for="labelType">
            Label Type
          </Label>
          <Input
            id="labelType"
            name="labelType"
            type="select"
          >
            <option>
              size 1
            </option>
            <option>
              size 2
            </option>
            <option>
              size 3
            </option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="skipLabels">
            Skip Labels
          </Label>
            <Input
            id="skipLabels"
            name="skipLabels"
            type="textarea"
          />
        </FormGroup>
        <FormGroup>
          <Label for="labelFile">
            Label Names
          </Label>
          <Input
            id="labelFile"
            name="labelFile"
            type="file"
          />
          <FormText>
            Upload an excel or csv file to create labels.
          </FormText>
        </FormGroup>
        <Sample />
        <div className="d-flex justify-content-center m-5">
          <Button color="primary">Create Labels</Button>
        </div>
      </Form>

  )
}

export default LabelForm;