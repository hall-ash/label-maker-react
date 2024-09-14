import './CalculateAliquotsModal.css';
import React, { useState } from 'react';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label as RSLabel, Input, InputGroupText, Row, Col, InputGroup } from 'reactstrap';
import calculateAliquots from './calculateAliquots.js';

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

  const validate = (parsedAmounts) => {
    const newErrorMsgs = {
      'concentration': '',
      'volume': '',
      'amounts': '',
    };

    if (!formData.concentration) {
      newErrorMsgs.concentration = 'concentration is required';
    }
    if (!formData.volume) {
      newErrorMsgs.volume = 'volume is required';
    }
    if (!formData.amounts) {
      newErrorMsgs.amounts = 'input required';
    }
    if (formData.amounts && parsedAmounts.length === 0) {
      newErrorMsgs.amounts = 'invalid input';
    }

    setErrorMsgs(newErrorMsgs);

    return Object.values(newErrorMsgs).every(errorMsg => errorMsg === '');
  }

  const handleSubmit = e => {
    e.preventDefault();

    setIsSubmitting(true);

    const { concentration, volume, amounts } = formData;

    const numAmounts = parseAmounts(amounts);

    if (validate(numAmounts)) {
      const aliquots = calculateAliquots(concentration, volume, numAmounts, concentrationUnit, volumeUnit, aliquotMassUnit);

      handleCalculateAliquotsClick(aliquots);

      toggle();
    }
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
