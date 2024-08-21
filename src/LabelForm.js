import './LabelForm.css'
import React, { useState } from "react";
import LabelList from "./LabelList";
import DownloadModal from './DownloadModal';
import { Form, Button, FormGroup, Label as RSLabel, Input, FormText, Row, Col } from 'reactstrap';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';


function LabelForm() {


  const labelTypeOptions = [
    "LCRY-1700", // / RNBW-2200, label size: 33mm x 13mm, 17 rows x 5 cols",
    "size 1",
    "size 2",
    "size 3",
  ];

  const uid = new ShortUniqueId({ length: 5 });


  const [labelInfo, setLabelInfo] = useState(
    {
      'labelType': labelTypeOptions[0], // use the first option as default
      'startLabel': '',
      'skipLabels': '',
      'labelFile': '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasBorder, setHasBorder] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  
  const [labels, setLabels] = useState([{
    id: uid.rnd(),
    labeltext: '',
    labelcount: 0,
    displayAliquots: false,
    aliquots: Array.from({ length: 1 }, () => ({ id: uid.rnd(), aliquottext: '', number: '' })),
  }]);


  const handleModalToggle = () => setIsModalOpen(!isModalOpen);
  const handleBorderToggle = () => setHasBorder(!hasBorder);
  


  const handleLabelInfoChange = e => {
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
      displayAliquots: false,
      count: 0,
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


  const handleSubmit = async (e) => {
    e.preventDefault();


    const formattedLabels = labels
      .filter(label => label.labeltext)
      .map(({ labeltext, aliquots, labelcount, displayAliquots }) => ({
        name: labeltext.trim(),
        count: labelcount, 
        use_aliquots: displayAliquots,
        aliquots: aliquots
          .filter(aliquot => aliquot.number)
          .map(({ aliquottext, number }) => ({ text: aliquottext, number })),
    }));


    const { labelType, startLabel, skipLabels } = labelInfo;

    const formData = {
      'labels': formattedLabels,
      'sheet_type': labelType,
      'start_label': startLabel,
      'skip_labels': skipLabels,
      'border': hasBorder,
    };

    console.log('formData', formData)


    try {
      const response = await axios.post('http://localhost:5000/api/generate_pdf', formData, {
        responseType: 'blob' // Important for handling binary data
      });

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Set the download link and open the modal
      setDownloadLink(url);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
    
  };



  // return (
  //   <div>
  //   <Form onSubmit={handleSubmit}>
  //     <FormGroup>
  //       <RSLabel for="labelType">Label Type</RSLabel>
  //       <Input
  //         id="labelType"
  //         name="labelType"
  //         type="select"
  //         value={labelInfo.labelType}
  //         onChange={handleLabelInfoChange}
  //       >
  //         {labelTypeOptions.map((labelType, i) => <option key={i}>{labelType}</option>)}
  //       </Input>
  //     </FormGroup>
  //     <Row className="row-cols-lg-auto g-3 align-items-end mb-3">
  //       <Col>
  //         <RSLabel for="startLabel">Start On Label:</RSLabel>
  //       </Col>
  //       <Col>
  //         <Input
  //           id="startLabel"
  //           name="startLabel"
  //           type="text"
  //           value={labelInfo.startLabel}
  //           onChange={handleLabelInfoChange}
  //           />
  //       </Col>
  //       <Col>
  //       <FormGroup check>
  //          <RSLabel check>
  //             Add Border 
  //           </RSLabel>
  //         <Input 
  //             type="checkbox" 
  //             id = "border"
  //             name="border"
  //             value={hasBorder}
  //             onChange={handleBorderToggle}
  //         />
  //           {' '}
           
  //         </FormGroup>
  //       </Col>
  //     </Row>
  //     <FormGroup >
  //       <RSLabel for="skipLabels">Skip Labels</RSLabel>
  //       <Input
  //         id="skipLabels"
  //         name="skipLabels"
  //         type="textarea"
  //         placeholder={`1: A1-D4, E17${String.fromCharCode(10)}2: B2-D5`}
  //         value={labelInfo.skipLabels}
  //         onChange={handleLabelInfoChange}
  //       />
  //     </FormGroup>
  //     <FormGroup>
  //       <RSLabel for="labelFile">Label File</RSLabel>
  //       <Input
  //         id="labelFile"
  //         name="labelFile"
  //         type="file"
  //         value={labelInfo.labelFile}
  //         onChange={handleLabelInfoChange}
  //       />
  //       <FormText>Upload an excel or csv file to create labels.</FormText>
  //     </FormGroup>
  //     <LabelList 
  //       labels={labels} 
  //       addLabel={addLabel}
  //       removeLabel={removeLabel}
  //       addAliquot={addAliquot}
  //       removeAliquot={removeAliquot}
  //       onChange={handleLabelChange}
  //       setLabelAliquots={setLabelAliquots}
  //     />
  //     <div className="d-flex justify-content-center m-5">
  //       <Button color="primary" type="submit">Create Labels</Button>
  //     </div>
  
  //   </Form>
  //     <DownloadModal isOpen={isModalOpen} toggle={handleModalToggle} downloadLink={downloadLink} />
  //   </div>
  // );

  return (
    <div className="label-form-container">
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3">
          <RSLabel for="labelType" className="form-label">Label Type</RSLabel>
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
        <Row className="row-cols-lg-auto g-3 align-items-end mb-4">
          <Col>
            <RSLabel for="startLabel" className="form-label">Start On Label:</RSLabel>
          </Col>
          <Col>
            <Input
              id="startLabel"
              name="startLabel"
              type="text"
              value={labelInfo.startLabel}
              onChange={handleLabelInfoChange}
              className="form-input form-input-narrow"
            />
          </Col>
          <Col>
            <FormGroup check className="d-flex align-items-center form-check-group">
              <RSLabel check className="form-check-label">
                Add Border
              </RSLabel>
              <Input 
                type="checkbox" 
                id="border"
                name="border"
                checked={hasBorder} // Changed to checked
                onChange={handleBorderToggle}
                className="form-check-input"
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup className="mb-3">
          <RSLabel for="skipLabels" className="form-label">Skip Labels</RSLabel>
          <Input
            id="skipLabels"
            name="skipLabels"
            type="textarea"
            placeholder={`1: A1-D4, E17${String.fromCharCode(10)}2: B2-D5`}
            value={labelInfo.skipLabels}
            onChange={handleLabelInfoChange}
            className="form-textarea"
          />
        </FormGroup>
        <FormGroup className="mb-3">
          <RSLabel for="labelFile" className="form-label">Label File</RSLabel>
          <Input
            id="labelFile"
            name="labelFile"
            type="file"
            onChange={handleLabelInfoChange}
            className="form-file"
          />
          <FormText className="form-text-info">Upload an excel or csv file to create labels.</FormText>
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
        <div className="form-submit-container">
          <Button color="primary" type="submit">Create Labels</Button>
        </div>
      </Form>
      <DownloadModal isOpen={isModalOpen} toggle={handleModalToggle} downloadLink={downloadLink} />
    </div>
  );

}

export default LabelForm;
