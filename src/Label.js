import './Label.css';
import React from "react";
import Aliquot from "./Aliquot";
import CalculateAliquotsModal from './CalculateAliquotsModal';
import { Row, Col, Label as RSLabel, FormGroup, Input, Container, Button } from 'reactstrap';
import { FaPlusSquare, FaTimes } from 'react-icons/fa';

function Label({ id, labeltext, labelCount, aliquots, removeLabel, addAliquot, removeAliquot, onChange, setAliquots, displayAliquots }) {
  
  const aliquotComponents = aliquots.map(({ id: aliquotId, aliquottext, number }) => (
    <Aliquot
      id={aliquotId}
      key={aliquotId}
      aliquottext={aliquottext}
      number={number}
      remove={() => removeAliquot(id, aliquotId)}
      onChange={(e) => onChange(e, id, aliquotId)}
    />
  ));

  const handleChange = e => onChange(e, id);
  const handleClick = () => addAliquot(id);
  const handleCalculateAliquotsClick = (aliquots) => setAliquots(id, aliquots);
  const handleRemoveLabel = () => removeLabel(id);
  const toggleShowAliquots = (e, id) => {
    handleChange({ target: { name: "displayAliquots", checked: !displayAliquots, value: !displayAliquots } }, id);
  };


  // return (
  //   <Container className="mb-1 label-container" style={{ position: 'relative' }}>
  //     <div style={{ position: 'absolute', top: 10, right: 10 }}>
  //       <FaTimes onClick={handleRemoveLabel} style={{ cursor: 'pointer', color: 'black' }} />
  //     </div>
  //     <Row className="mt-1">
  //       <FormGroup>
  //         <RSLabel for="labeltext" className="label-title">Label Text</RSLabel>
  //         <Input
  //           id="labeltext"
  //           name="labeltext"
  //           type="textarea"
  //           value={labeltext}
  //           onChange={handleChange}
  //         />
  //       </FormGroup>
  //     </Row>
  //     <Row>
  //     { !displayAliquots && 
  //       <Col xs="3">
  //         <FormGroup className="d-inline-flex">
  //           <RSLabel className="me-2" style={{ fontSize: '12px' }} for="labelcount">Label Count</RSLabel>
  //           <Input
  //             id="labelcount"
  //             name="labelcount"
  //             type="number"
  //             value={labelCount}
  //             onChange={handleChange}
  //             min="0"
  //             bsSize="sm"
  //           />
  //           </FormGroup>
  //       </Col>
  //     }
  //       <Col className='ml-auto'>
  //         <Button size="sm" onClick={toggleShowAliquots}>{displayAliquots ? "Remove" : "Add"} Aliquots</Button>
  //       </Col>
  //     </Row>
  //     { displayAliquots &&
  //     <div>
  //       <Row className="mt-1 align-items-center">
  //         <Col>
  //           <RSLabel className="aliquots-title">Aliquots</RSLabel>
  //         </Col>
  //         <Col>
  //           <CalculateAliquotsModal
  //             handleCalculateAliquotsClick={handleCalculateAliquotsClick}
  //           />
  //         </Col>
  //       </Row>

  //       <Row className="mt-1">
  //         <Col className="d-grid" style={{ gridTemplateColumns: '1fr auto' }}>
  //           <div>{aliquotComponents}</div>
  //           <FaPlusSquare className="add-aliquot-btn" onClick={handleClick} style={{ cursor: 'pointer', color: 'gray', alignSelf: 'end' }} />
  //         </Col> 
  //       </Row>
  //     </div>
  //     }
  //   </Container>
  // );

  return (
    <Container className="label-container">
      <div className="remove-label-icon">
        <FaTimes onClick={handleRemoveLabel} />
      </div>
      <Row className="mt-1">
        <FormGroup className="w-100">
          <RSLabel for="labeltext" className="label-title">Label Text</RSLabel>
          <Input
            id="labeltext"
            name="labeltext"
            type="textarea"
            value={labeltext}
            onChange={handleChange}
          />
        </FormGroup>
      </Row>
      <Row className="mt-1 label-count-and-add-aliquots-container ">
        {!displayAliquots && (
          <Col xs="4">
            <FormGroup className="label-count-container">
              <RSLabel className="label-count" for="labelcount">Label Count</RSLabel>
              <Input
                id="labelcount"
                name="labelcount"
                type="number"
                value={labelCount}
                onChange={handleChange}
                min="0"
                bsSize="sm"
                className="label-count-input"
              />
            </FormGroup>
          </Col>
        )}
        <Col className="text-end">
          <Button color="primary" size="sm" onClick={toggleShowAliquots}>
            {displayAliquots ? "Remove Aliquots" : "Add Aliquots"}
          </Button>
        </Col>
      </Row>
      {displayAliquots && (
        <div>
          <Row className="mt-3 align-items-center">
            <Col>
              <RSLabel className="aliquots-title">Aliquots</RSLabel>
            </Col>
            <Col className="text-end">
              <CalculateAliquotsModal handleCalculateAliquotsClick={handleCalculateAliquotsClick} />
            </Col>
          </Row>
          {/* <Row className="mt-2">
            <Col className="d-flex justify-content-between align-items-start">
              <div className="w-100">{aliquotComponents}</div>
              <FaPlusSquare
                className="add-aliquot-btn"
                onClick={handleClick}
              />
            </Col>
          </Row> */}
          <Row className="mt-1">
          <Col xs="8">
            <div>{aliquotComponents}</div>
          </Col>
          <Col className="d-grid" style={{ gridTemplateColumns: '1' }}>
           <FaPlusSquare className="add-aliquot-btn" onClick={handleClick} style={{ cursor: 'pointer', color: 'gray', alignSelf: 'end' }} />
          </Col> 
    </Row>
        </div>
      )}
    </Container>
  );

}

export default Label;
