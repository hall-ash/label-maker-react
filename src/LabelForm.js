// New work styling branch

import './LabelForm.css'
import React, { useState } from "react";
import LabelList from "./LabelList";
import LoadingSpinner from './LoadingSpinner';
import DownloadModal from './DownloadModal';
import { Form, Button, FormGroup, Label as RSLabel, Input, FormText, Row, Col } from 'reactstrap';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';
import SkipLabelsDropdown from "./SkipLabelsDropdown";
import { cleanSkipLabels, validateSkipLabels } from './inputValidation.js';


function LabelForm() {


  const labelTypeOptions = [
    "LCRY-1700", // / RNBW-2200, label size: 33mm x 13mm, 17 rows x 5 cols",
    "size 1",
    "size 2",
    "size 3",
  ];

  const uid = new ShortUniqueId({ length: 5 });


  const [fileReady, setFileReady] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [errorMsgs, setErrorMsgs] = useState({ 
    skipLabels: '', 
  });

  
  const [labels, setLabels] = useState([{
    id: uid.rnd(),
    labeltext: '',
    labelcount: 0,
    displayAliquots: false,
    aliquots: Array.from({ length: 1 }, () => ({ id: uid.rnd(), aliquottext: '', number: '' })),
  }]);


  const handleModalToggle = () => setIsModalOpen(!isModalOpen);
  const handleBorderToggle = () => setHasBorder(!hasBorder);
  

  const validate = (cleanedSkipLabels, formattedLabels) => {
    const newErrorMsgs = { 
      skipLabels: '',
      'labels': '', 
    };

    if (cleanedSkipLabels) {
      newErrorMsgs.skipLabels = validateSkipLabels(cleanedSkipLabels);
    }
    if (formattedLabels.length < 1) {
      newErrorMsgs.labels = 'Add labels to print.';
    }

    setErrorMsgs(newErrorMsgs);

    return Object.values(newErrorMsgs).every(msg => msg === '');
  };

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
      labelcount: 0,
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


    try {

      e.preventDefault();

      const { labelType, startLabel, skipLabels } = labelInfo;

      // remove all whitespace except newlines inside the string and replace consecutive newlines with single newline
      const cleanedSkipLabels = cleanSkipLabels(skipLabels);

      const formattedLabels = labels
        .filter(label => label.labeltext && label.labelcount)
        .map(({ labeltext, aliquots, labelcount, displayAliquots }) => ({
          name: labeltext.trim(),
          count: labelcount, 
          use_aliquots: displayAliquots,
          aliquots: aliquots
            .filter(aliquot => aliquot.number)
            .map(({ aliquottext, number }) => ({ text: aliquottext, number })),
      }));

      if (!validate(cleanedSkipLabels, formattedLabels)) return;

      setIsSubmitting(true);

      const savedSettings = localStorage.getItem('savedSettings');
      const savedSettingsJSON = savedSettings ? JSON.parse(savedSettings) : {};

      const formData = {
        'labels': formattedLabels,
        'sheet_type': labelType,
        'start_label': startLabel,
        'skip_labels': cleanedSkipLabels, 
        'border': savedSettingsJSON.hasBorder !== undefined ? savedSettingsJSON.hasBorder : false,
        'padding': savedSettingsJSON.padding !== undefined ? savedSettingsJSON.padding : 1.75,
        'font_size': savedSettingsJSON.fontSize !== undefined ? savedSettingsJSON.fontSize : 12,
        'file_name': savedSettingsJSON.fileName !== undefined ? savedSettingsJSON.fileName : 'labels',
      };

      console.log('formData', formData);

      setFileReady(false);

      const workapi = 'http://192.168.134.118:5000/api/generate_pdf'
      const curapi = 'http://192.168.4.112:5000/api/generate_pdf'
      const response = await axios.post(workapi, formData, {
        responseType: 'blob' // Important for handling binary data
      });

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      setFileReady(true);
      // Set the download link and open the modal
      setDownloadLink(url);
      setIsModalOpen(true);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
    
  };

  return (
    fileReady ?
    (<div className="label-form-container">
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
           
          </Row>
          <SkipLabelsDropdown 
            skipLabelsValue={labelInfo.skipLabels}
            skipLabelsErrorMsg={errorMsgs.skipLabels}
            onChange={handleLabelInfoChange} 
          />

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
          {errorMsgs.labels && <p className="error text-center">{errorMsgs.labels}</p>}
          <div className="form-submit-container">
            <Button color="primary" type="submit" disabled={isSubmitting}>Create Labels</Button>
          </div>
        </Form>
        <DownloadModal isOpen={isModalOpen} toggle={handleModalToggle} downloadLink={downloadLink} />
     
    </div>)
    : (
    <div className="loading-container">
    <LoadingSpinner/>
    </div>
    )
  );

}

export default LabelForm;
