import '../styles/LabelForm.css'
import React, { useState } from "react";
import LabelList from "./LabelList";
import LoadingSpinner from './LoadingSpinner';
import DownloadModal from './DownloadModal';
import { Form, FormFeedback, Button, FormGroup, Label as RSLabel, Input, Row, Col } from 'reactstrap';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';
import SkipLabelsDropdown from "./SkipLabelsDropdown";
import { labelFormSchema, startLabelSchema, skipLabelsSchema } from '../utils/validationSchemas';
import { defaultSettings, labelSheetTypes } from '../defaultSettings';
import SubmissionAlertModal from './SubmissionAlertModal';


const LabelForm = () => {

  const uid = new ShortUniqueId({ length: 5 });
  const [waitingForApi, setWaitingForApi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [errors, setErrors] = useState({
    'startLabel': false,
    'skipLabels': false,
    'labels': false,
    'labelType': false,
  });
  const [submissionAlertModalOpen, setSubmissionAlertModalOpen] = useState(false);

  const [formData, setFormData] = useState(
  {
    labelType: labelSheetTypes[0],
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

  
  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === 'startLabel' || name === 'skipLabels') {
      const schema = name === 'startLabel' ? startLabelSchema : skipLabelsSchema;
      const parsedData = schema.safeParse(value);
      if (!parsedData.success) {
        const newError = parsedData.error.format();
        setErrors(prev => ({ ...prev, [name]: newError }));
        
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } 
  }

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

      setIsSubmitting(true);

      const parsedData = labelFormSchema.safeParse(formData);
      const newErrors = parsedData.success ? {} : parsedData.error.format();
      setErrors(prev => ({ ...prev, ...newErrors }));

      if (parsedData.success) {
        const { labels, labelType, startLabel, skipLabels } = parsedData.data;
        const settings = JSON.parse(localStorage.getItem('LabelSettings')) || defaultSettings;
        const validatedFormData = {
          'labels': labels, //formattedLabels
          'sheet_type': labelType,
          'start_label': startLabel,
          'skip_labels': skipLabels, // cleanedSkipLabels, 
          'border': settings.hasBorder, 
          'padding': settings.padding,
          'font_size': settings.fontSize, 
          'file_name': settings.fileName, 
          'text_anchor': settings.textAnchor,
        };

        setWaitingForApi(true);

        const response = await axios.post(process.env.REACT_APP_API, validatedFormData, {
          responseType: 'blob', // Important for handling binary data
          timeout: 60000, // timeout after 60 seconds
        });
  
        // Create a blob from the response
        const blob = new Blob([response.data], { type: 'application/pdf' });
  
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
  
        // Set the download link and open the modal
        setDownloadLink(url);
        
        setIsModalOpen(true);

      } else {
        if (errors?.labels) {
          setSubmissionAlertModalOpen(true);
        }
      }
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
        console.error(error)
        // add code to display error to user here
      }
      console.error('Error downloading the file:', error);
    } finally {
      setIsSubmitting(false);
      setWaitingForApi(false);
    }
    
  };

  return (
    waitingForApi ? 
    (
      <div className="loading-container">
      <LoadingSpinner/>
      </div>
    ) :
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
            >
              {labelSheetTypes.map((labelType, i) => <option key={i}>{labelType}</option>)}
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
                className="form-input form-input-narrow"
                invalid={!!errors.startLabel} // convert to bool
                onBlur={handleBlur}
              />
              <FormFeedback>
                {errors.startLabel?._errors}
              </FormFeedback>
            </Col>
           
          </Row>
          <SkipLabelsDropdown 
            skipLabelsValue={formData.skipLabels}
            onChange={handleChange} 
            error={errors.skipLabels}
            onBlur={handleBlur}
          />
    
          <LabelList 
            labels={formData.labels} 
            addLabel={addLabel}
            removeLabel={removeLabel}
            addAliquot={addAliquot}
            removeAliquot={removeAliquot}
            onChange={handleChange}
            setLabelAliquots={setLabelAliquots}
          />
          <div className="form-submit-container">
            <Button color="primary" type="submit" disabled={isSubmitting}>Create Labels</Button>
          </div>
        </Form>
        <DownloadModal isOpen={isModalOpen} toggle={handleModalToggle} downloadLink={downloadLink} />
        <SubmissionAlertModal 
          isOpen={submissionAlertModalOpen} 
          toggle={() => setSubmissionAlertModalOpen(!submissionAlertModalOpen)}
          errorMessage={errors.labels._errors}
        />
    </div>)
  );
}

export default LabelForm;
