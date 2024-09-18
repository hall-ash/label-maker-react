import './CalculateAliquotsModal.css';
import React, { useState } from 'react';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label as RSLabel, Input, InputGroupText, Row, Col, InputGroup } from 'reactstrap';
import calculateAliquots from './calculateAliquots.js';
import { z } from 'zod';

const CalculateAliquotsModal = ({ handleCalculateAliquotsClick }) => {

  const concentrationUnit = 'mg/mL';
  const volumeUnit = 'mL';
  const aliquotMassUnit = 'mg';

  const [formData, setFormData] = useState({
    'concentration': '',
    'volume': '',
    'amounts': '',
  });

  const [modal, setModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState({ 
    'concentration': '',
    'volume': '',
    'amounts': '', 
  }); 

  const toggle = () => setModal(!modal);


  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const parseAmounts = input => {
    const amounts = input.match(/\d+(\.\d+)?/g);
    return amounts ? amounts.map(Number) : [];
  };


  

  const parseData = () => {

    const amountsSchema = z
    .string() // Input is expected to be a string
    .transform(amountsStr => {
      const amounts = amountsStr.match(/\d+(\.\d+)?/g); // Extract numbers from the string
      return amounts ? amounts.map(Number) : []; // Convert to an array of numbers
    })
    .array(z.number()) // The transformed value should be an array of numbers
    .nonempty('Enter at least one amount in mg'); // Ensure at least one number is present


    const positiveNumericSchema = z.string({
      required_error: "Enter a value",  // Error message if the input is empty
    }).transform(value => {
      // Convert the string to a number remote 
      const number = parseFloat(value);
      // Check if the converted number is actually a number and is finite
      if (isNaN(number) || !isFinite(number)) {
        throw new Error("The input must be a valid number"); // Validation error for invalid numbers
      }
      return number;
    }).positive('The number must be positive');

    const calculateAliquotsModalSchema = z.object({
      'concentration': positiveNumericSchema,
      'volume': positiveNumericSchema,
      'amounts': amountsSchema,
    });
    
    const parsedData = calculateAliquotsModalSchema.safeParse(formData)

    if (parsedData.error) {
      const issueMsgs = parsedData.error.issues.reduce((msgs, issue) => {
        const { path: inputs, message } = issue;
        msgs[inputs[0]] = message;
        return msgs;
      }, {});
      setErrorMsgs(issueMsgs);
    } else {
      setErrorMsgs({ concentration: '', volume: '', amounts: '' });
    }

    return parsedData;
  }

  const handleSubmit = e => {
    e.preventDefault();

    setIsSubmitting(true);

    const { concentration, volume, amounts } = formData;

    // const numAmounts = parseAmounts(amounts);

    const parsedData = parseData(formData);

    if (parsedData.success) {
      const transformedAmounts = parsedData.data.amounts;
      const aliquots = calculateAliquots(formData.concentration, formData.volume, transformedAmounts, concentrationUnit, volumeUnit, aliquotMassUnit);

      handleCalculateAliquotsClick(aliquots);
      toggle();
    }
    
    // if (validate(numAmounts)) {
    //   const aliquots = calculateAliquots(concentration, volume, numAmounts, concentrationUnit, volumeUnit, aliquotMassUnit);

    //   handleCalculateAliquotsClick(aliquots);

      
    // }
    setIsSubmitting(false);
    
  };


  return (
    <div className="button-div">
      <Button onClick={toggle} outline color="secondary" className="calculate-aliquots-btn">
        Calculate Aliquots
      </Button>
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Calculate Aliquots</ModalHeader>
        <ModalBody>
          <Form>
  
            <Row>
              <Col>
                <RSLabel for="concentration">Concentration</RSLabel>
              </Col>
              <Col className="mb-2">
                <InputGroup>
                <Input
                  id="concentration"
                  name="concentration"
                  type="number"
                  value={formData.concentration}
                  onChange={handleInputChange}
                />
        
                <InputGroupText>
                  {concentrationUnit}
                </InputGroupText>
                </InputGroup>
                {errorMsgs.concentration && <p className="error">{errorMsgs.concentration}</p>}
              </Col>
            </Row>
            <Row>
              <Col>
                <RSLabel for="volume">Total Volume</RSLabel>
              </Col>
              <Col>
                <InputGroup>
                <Input
                  id="volume"
                  name="volume"
                  type="number"
                  value={formData.volume}
                  onChange={handleInputChange}
                />
                <InputGroupText>
                  {volumeUnit}
                </InputGroupText>
                </InputGroup>
                {errorMsgs.volume && <p className="error">{errorMsgs.volume}</p>}
                </Col>
            </Row>
            <FormGroup className="mt-2">
              <RSLabel for="amounts">Aliquot Amounts in {aliquotMassUnit}</RSLabel>
              <Input
                id="amounts"
                name="amounts"
                type="text"
                value={formData.amounts}
                onChange={handleInputChange}
              />
              {errorMsgs.amounts && <p className="error">{errorMsgs.amounts}</p>}
            </FormGroup>
        
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
            Calculate
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );

};

export default CalculateAliquotsModal;
