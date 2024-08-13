import React, { useState } from 'react';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label as RSLabel, Input, FormText, InputGroupText, Row, Col, InputGroup } from 'reactstrap';
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

  const toggle = () => setModal(!modal);


  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const { concentration, volume, amounts } = formData;

    const numAmounts = amounts.split(' ').map(amount => Number(amount));

    const aliquots = calculateAliquots(concentration, volume, numAmounts, concentrationUnit, volumeUnit, aliquotMassUnit);

    handleCalculateAliquotsClick(aliquots);

    toggle();
  };



  return (
    <div>
      <Button color="primary" onClick={toggle}>
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
