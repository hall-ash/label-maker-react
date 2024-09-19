import './CalculateAliquotsModal.css';
import React, { useState } from 'react';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label as RSLabel, Input, InputGroupText, Row, Col, InputGroup } from 'reactstrap';
import calculateAliquots from './calculateAliquots.js';
import { calculateAliquotsModalSchema, parseData } from './validationSchemas.js';

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
  const [errors, setErrors] = useState({}); 

  const toggle = () => setModal(!modal);


  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [name]: value, };
      parseData(updatedFormData, calculateAliquotsModalSchema, errors, setErrors);
      return updatedFormData;
    })
  };


  const handleSubmit = e => {
    e.preventDefault();

    const returnParsedData = true;
    const parsedData = parseData(formData, calculateAliquotsModalSchema, errors, setErrors, returnParsedData);

    if (parsedData.success) {
      const transformedAmounts = parsedData.data.amounts;
      const aliquots = calculateAliquots(formData.concentration, formData.volume, transformedAmounts, concentrationUnit, volumeUnit, aliquotMassUnit);

      handleCalculateAliquotsClick(aliquots);
      toggle();
    }
    
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
                {errors.concentration && <small className="text-danger">{errors.concentration}</small>}
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
                {errors.volume && <small className="text-danger">{errors.volume}</small>}
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
              {errors.amounts && <small className="text-danger">{errors.amounts}</small>}
            </FormGroup>
        
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
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
