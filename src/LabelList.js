import './SampleList.css'
import React from "react";
import Label from "./NewLabel";
import calculateAliquots from "./CalculatePage";
import { Row, Col, Container, Button } from 'reactstrap';
import { FaPlusSquare } from 'react-icons/fa';

function LabelList ({ labels, addLabel, removeLabel, addAliquot, removeAliquot, onChange, setLabelAliquots }) {
  
  const labelComponents = labels.map(({ id, labeltext, aliquots }) => (
    <Label 
      id={id}
      key={id}
      labeltext={labeltext}
      aliquots={aliquots}
      removeLabel={removeLabel}
      addAliquot={addAliquot}
      removeAliquot={removeAliquot}
      onChange={onChange}
      setAliquots={setLabelAliquots}
    /> 
  ));




  return (
    <div>
      
      {labelComponents}

      <Button className="mt-2 mx-2" size="sm" outline color="primary" type="button" onClick={addLabel}>Add Label</Button>
    </div>
  );
}

export default LabelList;


// return (
//     <Container className='sample-list-container'>
//       <Row>
//         <Col className='flex-grow-1 sample-list-col'>
//           {labelComponents}
//         </Col>
//         <Col xs="1" className="d-flex flex-column justify-content-end">
//           <FaPlusSquare onClick={addLabel} style={{ cursor: 'pointer' }} />
//         </Col>
//       </Row>
//     </Container>
//   );