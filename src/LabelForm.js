import './LabelForm.css'
import React, { useState } from "react";
import LabelList from "./LabelList";
import LoadingSpinner from './LoadingSpinner';
import DownloadModal from './DownloadModal';
import { Form, Button, FormGroup, Label as RSLabel, Input, Row, Col } from 'reactstrap';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';
import SkipLabelsDropdown from "./SkipLabelsDropdown";
import { labelFormSchema, getErrors } from './validationSchemas.js';


const LabelForm = () => {

  const labelTypeOptions = [
    "LCRY-1700", // / RNBW-2200, label size: 33mm x 13mm, 17 rows x 5 cols",
    "size 1",
    "size 2",
    "size 3",
  ];

  const uid = new ShortUniqueId({ length: 5 });

  const [fileReady, setFileReady] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(
  {
    labelType: labelTypeOptions[0],
    startLabel: '',
    skipLabels: '',
    labels: [{
      id: uid.rnd(),
      labeltext: '',
      labelcount: '',
      displayAliquots: false,
      aliquots: Array.from({ length: 1 }, () => ({ id: uid.rnd(), aliquottext: '', number: '' })),
    }],
  });

  const [transformedData, setTransformedData] = useState({
    transformedLabels: '',
    transformedSkipLabels: '',
    transformedFileName: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [errors, setErrors] = useState({});

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const handleBlur = () => {
    console.log('labels', Array.isArray(formData.labels));
    console.log('formData', formData);
    const parsedData = labelFormSchema.safeParse(formData);

    
    setErrors(getErrors(parsedData.error));
    console.log("errors", errors);
  };

  const handleChange = (e, labelId, aliquotId) => {
    const { name, value } = e.target;

      // Handle changes within labels and their aliquots
      setFormData(prev => {
        const updated = (labelId || aliquotId) ? 
        ({
          ...prev,
          labels: prev.labels.map(label => {
            if (label.id === labelId) {
              if (aliquotId) {
                return {
                  ...label,
                  aliquots: label.aliquots.map(aliquot =>
                    aliquot.id === aliquotId ? { ...aliquot, [name]: value } : aliquot
                  ),
                };
              }
              return { ...label, [name]: value };
            }
            return label;
          }),
        })
        : ({
          ...prev,
          [name]: value,
        });

        // const parsedData = labelFormSchema.safeParse(updated);

        // if (parsedData.data) {

        //   const keyMapping = {
        //     labels: 'transformedLabels',
        //     skipLabels: 'transformedSkipLabels',
        //     fileName: 'transformedFileName',
        //   };

        //   const updatedTransformedData = Object.entries(parsedData.data).reduce((acc, [key, value]) => {
            
        //     if (key in keyMapping) {
        //       acc[keyMapping[key]] = value;
        //     }
        //     return acc;
        //   }, {});

        //   setTransformedData(prev => ({...prev, ...updatedTransformedData}));
        // };

        // const newErrors = Object.entries(updated).reduce((acc, [input, value]) => {
        //   if (value === "") {
        //     acc[input] = "";
        //   }
        //   return acc;
        // }, {});

        // setErrors(prev => ({ ...prev, ...newErrors }));

        return updated;
    });


  
    
  };

  const addLabel = () => {
    const newLabel = { 
      id: uid.rnd(),
      labeltext: '',
      displayAliquots: false,
      labelcount: '',
      aliquots: Array.from({ length: 1 }, () => ({ id: uid.rnd(), aliquottext: '', number: '' })),
    };

    setFormData(prev => ({
      ...prev,
      labels: [...prev.labels, newLabel]
    }));

  };

  const removeLabel = labelId => {

    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label.id !== labelId)
    }));
  };

  const addAliquot = labelId => {
    const newAliquot = {
      id: uid.rnd(),
      aliquottext: '',
      number: '',
    };

    setFormData(prev => ({
      ...prev,
      labels: prev.labels.map(label => 
        label.id === labelId
        ? { ...label, aliquots: [...label.aliquots, newAliquot] }
        : label
    )}));

  };

  const removeAliquot = (labelId, aliquotId) => {

    setFormData(prev => ({
      ...prev,
      labels: prev.labels.map(label =>
        label.id === labelId
        ? { ...label, aliquots: label.aliquots.filter(aliquot => aliquot.id !== aliquotId) }
        : label
      )
    }));
  };



  const setLabelAliquots = (labelId, aliquots) => {

    const calculatedAliquots = aliquots.map(aliquot => ({...aliquot, id: uid.rnd() }));

    setFormData(prev => ({
      ...prev,
      labels: prev.labels.map(label =>
        label.id === labelId
        ? { ...label, aliquots: calculatedAliquots }
        : label
      )
    }));
  };


  const handleSubmit = async (e) => {


    try {

      e.preventDefault();

      const {
        hasBorder = false,
        padding = 1.75,
        fontSize = 12,
        fileName = 'labels'
      } = JSON.parse(localStorage.getItem('settings')) || {};

      const parsedData = labelFormSchema.safeParse(formData);
      if (!parsedData.success) {
        setErrors(getErrors(parsedData.error));
        return;
      };

      setIsSubmitting(true);


      const validatedFormData = {
        labels: parsedData.data.labels, //formattedLabels
        'sheet_type': formData.labelType,
        'start_label': formData.startLabel,
        'skip_labels': parsedData.data.skipLabels, // cleanedSkipLabels, 
        'border': hasBorder,
        padding,
        'font_size': fontSize,
        'file_name': parsedData.data.fileName,
      };

      console.log('formData', validatedFormData);

      setFileReady(false);

      const atWork = true;
      const api = atWork ? 'http://192.168.134.118:5000/api/generate_pdf' : 'http://192.168.4.112:5000/api/generate_pdf';
      const response = await axios.post(api, formData, {
        responseType: 'blob', // Important for handling binary data
        timeout: 10000, // timeout after 10 seconds
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
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
        // display error to user
      }
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
              value={formData.labelType}
              onChange={handleChange}
              onBlur={handleBlur}
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
                value={formData.startLabel}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input form-input-narrow"
              />
              {errors.startLabel && <small className="text-danger">{errors.startLabel}</small>}
            </Col>
           
          </Row>
          <SkipLabelsDropdown 
            skipLabelsValue={formData.skipLabels}
            skipLabelsErrorMsg={errors.skipLabels}
            onChange={handleChange} 
            onBlur={handleBlur}
          />
    
          <LabelList 
            labels={formData.labels} 
            addLabel={addLabel}
            removeLabel={removeLabel}
            addAliquot={addAliquot}
            removeAliquot={removeAliquot}
            onChange={handleChange}
            onBlur={handleBlur}
            setLabelAliquots={setLabelAliquots}
            labelErrors={errors.labels}
          />
          {errors.labels && <small className="text-danger">{errors.labels}</small>}
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
