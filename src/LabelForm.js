import './LabelForm.css'
import React, { useState, useEffect } from "react";
import LabelList from "./LabelList";
import { Form, Button, FormGroup, Label as RSLabel, Input, FormText, Row, Col } from 'reactstrap';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';

function LabelForm() {

  const [newStartLabelChecked, setNewStartLabelChecked] = useState(false);

  const toggleNewStartLabelCheck = () => setNewStartLabelChecked(!newStartLabelChecked);

  const [output, setOutput] = useState(null);

  const labelTypeOptions = [
    "LCRY-1700", // / RNBW-2200, label size: 33mm x 13mm, 17 rows x 5 cols",
    "size 1",
    "size 2",
    "size 3",
  ];

  const uid = new ShortUniqueId({ length: 5 });

  const [newStartLabel, setNewStartLabel] = useState(localStorage.getItem("newStartLabel"));


  const [labelInfo, setLabelInfo] = useState(
    {
      'labelType': labelTypeOptions[0], // use the first option as default
      'startLabel': '',
      'skipLabels': '',
      'labelFile': '',
  });

  const [labels, setLabels] = useState([{
    id: uid.rnd(),
    labeltext: '',
    aliquots: Array.from({ length: 3 }, () => ({ id: uid.rnd(), aliquottext: '', number: '' })),
  }]);


  useEffect(() => {
    localStorage.setItem("newStartLabel", JSON.stringify(newStartLabel));
  }, [newStartLabel]);

  

  const handleLabelInfoChange = (e, labelId, aliquotId) => {
    const { name, value } = e.target;

    setLabelInfo({
      ...labelInfo,
      [name]: value,
    })
  };

  const handleLabelChange = (e, labelId, aliquotId) => {
      const { name, value } = e.target;

      setLabels(labels.map(label => {
        if (label.id === labelId) {
          if (aliquotId) {
            return {
              ...label,
              aliquots: label.aliquots.map(aliquot => 
                  aliquot.id === aliquotId ? { ...aliquot, [name]: value } : aliquot
              )
            };
          } else {
            return { ...label, [name]: value };
          }
        }
        return label;
      }));
  };

  const addLabel = () => {
    const newLabel = { 
      id: uid.rnd(),
      labeltext: '',
      aliquots: Array.from({ length: 1 }, () => ({ id: uid.rnd(), aliquottext: '', number: '' })),
    };

    setLabels([...labels, newLabel]);
  };

  const removeLabel = labelId => {
    setLabels(labels.filter(label => label.id !== labelId));
  };

  const addAliquot = labelId => {
    const newAliquot = {
      id: uid.rnd(),
      aliquottext: '',
      number: '',
    };
    setLabels(labels.map(label => 
      label.id === labelId
        ? { ...label, aliquots: [...label.aliquots, newAliquot] }
        : label
      ));
  };

  const removeAliquot = (labelId, aliquotId) => {
    setLabels(labels.map(label => 
        label.id === labelId 
          ? { ...label, aliquots: label.aliquots.filter(aliquot => aliquot.id !== aliquotId) }
          : label
      ));
  };






  const setLabelAliquots = (labelId, aliquots) => {

    const calculatedAliquots = aliquots.map(aliquot => ({...aliquot, id: uid.rnd() }));
    setLabels(labels.map(label => 
      label.id === labelId
        ? { ...label, aliquots: calculatedAliquots }
        : label
    ));

  };


//   const setLabelAliquots = (labelId, aliquots) => {
//     const calculatedAliquots = aliquots.map(aliquot => ({ ...aliquot, id: uid.rnd() }));
//     setLabels(labels.map(label => 
//       label.id === labelId
//         ? { ...label, aliquots: calculatedAliquots }
//         : label
//     ));
// };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // calculate newStartLabel 

    // strip ids from labels and aliquots and remove labels or aliquots with no text
   
    
    const strippedLabels = labels
      .filter(label => label.labeltext)
      .map(({ labeltext, aliquots }) => ({
        name: labeltext,
        aliquots: aliquots
          .filter(aliquot => aliquot.aliquottext && aliquot.number)
          .map(({ aliquottext, number }) => ({ text: aliquottext, number })),
    }));


    const formData = { ...labelInfo, 'labels': strippedLabels };

    try {
      const response = await axios.post('http://localhost:5000/api/generate_pdf', {
        input: formData,
      });

      setOutput(response.data);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
    
  };



  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <RSLabel for="labelType">Label Type</RSLabel>
        <Input
          id="labelType"
          name="labelType"
          type="select"
          value={labelInfo.labelType}
          onChange={handleLabelInfoChange}
        >
          {labelTypeOptions.map((labelType, i) => <option key={i}>{labelType}</option>)}
        </Input>
      </FormGroup>
      <Row className="row-cols-lg-auto g-3 align-items-end mb-3">
        <Col>
          <RSLabel for="startLabel">Start On Label:</RSLabel>
        </Col>
        <Col>
          <Input
            id="startLabel"
            name="startLabel"
            type="text"
            value={labelInfo.startLabel}
            onChange={handleLabelInfoChange}
            />
        </Col>
        
        {
        null
        && 
        <Col>
          <Input
            id="checkbox2"
            type="checkbox"
          />
          {' '}
          <RSLabel check>
            Start from label {newStartLabel}
          </RSLabel>
        </Col>
      }
        
      </Row>
      <FormGroup>
        <RSLabel for="skipLabels">Skip Labels</RSLabel>
        <Input
          id="skipLabels"
          name="skipLabels"
          type="textarea"
          placeholder={`1: A1-D4, E17${String.fromCharCode(10)}2: B2-D5`}
          value={labelInfo.skipLabels}
          onChange={handleLabelInfoChange}
        />
      </FormGroup>
      <FormGroup>
        <RSLabel for="labelFile">Label File</RSLabel>
        <Input
          id="labelFile"
          name="labelFile"
          type="file"
          value={labelInfo.labelFile}
          onChange={handleLabelInfoChange}
        />
        <FormText>Upload an excel or csv file to create labels.</FormText>
      </FormGroup>
      <LabelList 
        labels={labels} 
        addLabel={addLabel}
        removeLabel={removeLabel}
        addAliquot={addAliquot}
        removeAliquot={removeAliquot}
        onChange={handleLabelChange}
        setLabelAliquots={setLabelAliquots}
      />
      <div className="d-flex justify-content-center m-5">
        <Button color="primary" type="submit">Create Labels</Button>
      </div>
      {output && <div>Response: {JSON.stringify(output)}</div>}
    </Form>
  );
}

export default LabelForm;
