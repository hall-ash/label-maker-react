import { Form, Button, FormGroup, Label as RSLabel, Input, FormText, InputGroupText, Container, Row, Col, InputGroup } from 'reactstrap';
import React, { useState } from "react";

// name, concentration, concentration_unit, aliquots=None, total_volume=None, aliquot_amts=None

const CalculatePage = () => {

  const concentrationUnit = 'mg/mL';
  const volumeUnit = 'mL';
  const aliquotMassUnit = 'mg';


  const [formData, setFormData] = useState({
    'concentration': '',
    'volume': '',
    'amounts': '',
  });

  const [result, setResult] = useState(null);


  const calculateAliquots = (concentration, volume, amounts) => {

    const totalMass = concentration * volume;
    const totalSum = amounts.reduce((a, b) => a + b, 0);
    const factor = Math.floor(totalMass / totalSum);
    let remaining_mgs = totalMass % totalSum;


    const aliquots = [];
    const result = Array(amounts.length).fill(factor);

    const minAmt = Math.min(...amounts);
    let i = 0;

    while (remaining_mgs > 0 && i < amounts.length) {
      if (remaining_mgs >= amounts[i]) {
        result[i] += 1;
        remaining_mgs -= amounts[i];
      }
      i += 1;
      if (i === amounts.length && remaining_mgs > minAmt) {
        for (let j = 0; j < amounts.length; j++) {
          let amt = amounts[amounts.length - 1 - j];
          if (remaining_mgs > amt) {
            result[j] += 1;
            remaining_mgs -= amt;
          }
        }
      }
    }

    const doRounding = (num) => num > 1 ? Math.round(num * 10) / 10 : Math.round(num * 1000) / 1000;
    const doFormatting = (num) => num > 1 ? num.toFixed(1) : (num * 1000).toFixed(0);

    for (let i = 0; i < amounts.length; i++) {
      const mass = amounts[i];
      const roundedVol = doRounding(mass / concentration);

      const volume = doFormatting(roundedVol);
      const volumeUnit = roundedVol > 1 ? 'mL' : 'µL';
      const number = result[i];

      aliquots.push({
        aliquottext: `${mass}${aliquotMassUnit}, ${volume}${volumeUnit}`,
        number,
      })
    }

    return { aliquots, remaining_mgs: doRounding(remaining_mgs) };
  }


  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCalculateClick = e => {
    e.preventDefault();

    const { concentration, volume, amounts } = formData;

    const numAmounts = amounts.split(' ').map(amount => Number(amount));

    setResult(calculateAliquots(concentration, volume, numAmounts));

    console.log('formData', formData);
  };


  const handleSubmit = e => {

  };



  const aliquotPElements = aliquots => {
    return aliquots.map(({ aliquottext, number }, idx) => {
      return <li key={idx}>{aliquottext} x {number}</li>;
    });
  };

  return (
    <Container className='col-md-7'>
    <h1 className='mt-3 mb-5 text-center'>Create Aliquots</h1>
    <Form onSubmit={handleSubmit}>
  
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
      
      <div className="d-flex justify-content-center m-5">
        <Button color="primary" type="button" onClick={handleCalculateClick}>{result ? 'Recalculate' : 'View Aliquots'}</Button>
      </div>
    </Form>
    
    { result &&
      <div>
        <h6>Aliquots:</h6>
        <ul>
          {aliquotPElements(result.aliquots)}
        </ul>
        <p>Remaining: {result.remaining_mgs}{result.remaining_mgs > 1 ? 'mg' : 'μg'}</p>
        <Button color="primary" type="submit">Use Aliquots</Button>
      </div>
    }
    
    </Container>
  );
}

export default CalculatePage;