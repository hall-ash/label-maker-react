import '../styles/CalculateAliquotsModal.css';
import React, { useState } from 'react';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label as RSLabel, Input, InputGroupText, Row, Col, InputGroup } from 'reactstrap';
import calculateAliquots from '../utils/calculateAliquots';
import { calculateAliquotsModalSchema } from '../utils/validationSchemas';
import ReactHookFormInput from './ReactHookFormInput';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

const CalculateAliquotsModal = ({ handleCalculateAliquotsClick }) => {

  const concentrationUnit = 'mg/mL';
  const volumeUnit = 'mL';
  const aliquotMassUnit = 'mg';

  // const [formData, setFormData] = useState();

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, clearErrors } = useForm({
    defaultValues: {
      'concentration': '',
      'volume': '',
      'amounts': '',
    },
    resolver: zodResolver(calculateAliquotsModalSchema),
    mode: 'onTouched',
  });

  const onSubmit = data => {
    const { concentration, volume, amounts } = data;
    console.log('data', data);
    const aliquots = calculateAliquots(concentration, volume, amounts, concentrationUnit, volumeUnit, aliquotMassUnit);
    handleCalculateAliquotsClick(aliquots);
    toggle();
  }

  // const handleSubmit = e => {
  //   e.preventDefault();

  //   if (!Object.keys(errors).length) {
      
  //     const { concentration, volume } = formData;
  //     const { transformedAmounts } = transformedData;
  //     const aliquots = calculateAliquots(concentration, volume, transformedAmounts, concentrationUnit, volumeUnit, aliquotMassUnit);

  //     handleCalculateAliquotsClick(aliquots);
  //     toggle();
  //   }
    
  // };

  // const [transformedData, setTransformedData] = useState({
  //   'transformedAmounts': '',
  // });

  const [modal, setModal] = useState(false);
  // const [errors, setErrors] = useState({}); 

  const toggle = () => setModal(!modal);

  const handleCancel = () => {
    toggle();
    reset();
  }


  // const handleInputChange = e => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });

  //   const parsedData = calculateAliquotsModalSchema.safeParse(formData);
  //   const newErrors = parsedData.success ? {} : parsedData.error.format();
  //   setErrors(prev => ({ ...prev, ...newErrors }));
  //   setFormData(prevFormData => {
  //     const updatedFormData = { ...prevFormData, [name]: value, };

  //     const parsedData = calculateAliquotsModalSchema.safeParse(updatedFormData);
  //     setTransformedData(prev => ({ ...prev, transformedAmounts: parsedData.data.amounts }));
  //     setErrors(getErrors(parsedData.error));
  //     return updatedFormData;
  //   })
  // };


 


  return (
    <div className="button-div">
      <Button onClick={toggle} outline color="secondary" className="calculate-aliquots-btn">
        Calculate Aliquots
      </Button>
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={handleCancel}>Calculate Aliquots</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col>
                <RSLabel for="concentration">Concentration</RSLabel>
              </Col>
              <Col className="mb-2">
                <InputGroup>
                <ReactHookFormInput
                  label="concentration"
                  control={control}
                  errors={errors}
                  inputGroupText={concentrationUnit}
                />
                </InputGroup>
               
              </Col>
            </Row>
            <Row>
              <Col>
                <RSLabel for="volume">Total Volume</RSLabel>
              </Col>
              <Col>
                <InputGroup>

                 <ReactHookFormInput
                  label="volume"
                  control={control}
                  errors={errors}
                  inputGroupText={volumeUnit}
                />
                </InputGroup>
               
                </Col>
            </Row>
            <FormGroup className="mt-2">
              <RSLabel for="amounts">Aliquot Amounts in {aliquotMassUnit}</RSLabel>
              <ReactHookFormInput
                  label="amounts"
                  control={control}
                  errors={errors}
                />
              
            </FormGroup>
        
          </Form>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            Calculate
          </Button>{' '}
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );

};

export default CalculateAliquotsModal;
