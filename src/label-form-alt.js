import './LabelForm.css';
import React, { useState } from "react";
import LabelList from "./LabelList";
import LoadingSpinner from './LoadingSpinner';
import DownloadModal from './DownloadModal';
import { Form, FormFeedback, Button, FormGroup, Label as RSLabel, Input, Row, Col } from 'reactstrap';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';
import SkipLabelsDropdown from "./SkipLabelsDropdown";
import { labelSchema } from './validationSchemas';

const LabelForm = () => {
  const [labelData, setLabelData] = useState({
    labeltext: '',
    labelCount: 1,
    skipLabels: 0,
  });
  const [errors, setErrors] = useState({
    labeltext: '',
    labelCount: ''
  });
  const [loading, setLoading] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'labeltext') {
      const result = labelSchema.safeParse(value);
      if (result.success) {
        setErrors({ ...errors, labeltext: '' });
      } else {
        setErrors({ ...errors, labeltext: result.error.errors[0]?.message || 'Invalid value' });
      }
    }

    if (name === 'labelCount') {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue > 0) {
        setErrors({ ...errors, labelCount: '' });
      } else {
        setErrors({ ...errors, labelCount: 'Label count must be a positive number' });
      }
    }

    setLabelData({ ...labelData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields before submitting
    const labelResult = labelSchema.safeParse(labelData.labeltext);
    if (!labelResult.success) {
      setErrors(prev => ({ ...prev, labeltext: labelResult.error.errors[0]?.message || 'Invalid value' }));
      setLoading(false);
      return;
    }

    if (labelData.labelCount <= 0) {
      setErrors(prev => ({ ...prev, labelCount: 'Label count must be a positive number' }));
      setLoading(false);
      return;
    }

    try {
      const uid = new ShortUniqueId();
      const response = await axios.post('/api/generate-labels', {
        ...labelData,
        id: uid(),
      });
      setDownloadLink(response.data.downloadLink);
      setIsDownloadModalOpen(true);
    } catch (error) {
      console.error('Error generating labels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="label-form">
      <FormGroup>
        <RSLabel for="labeltext">Label Text</RSLabel>
        <Input
          type="text"
          name="labeltext"
          id="labeltext"
          value={labelData.labeltext}
          onChange={handleChange}
          invalid={!!errors.labeltext}
        />
        <FormFeedback>{errors.labeltext}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <RSLabel for="labelCount">Label Count</RSLabel>
        <Input
          type="number"
          name="labelCount"
          id="labelCount"
          value={labelData.labelCount}
          onChange={handleChange}
          invalid={!!errors.labelCount}
        />
        <FormFeedback>{errors.labelCount}</FormFeedback>
      </FormGroup>
      <SkipLabelsDropdown
        skipLabelsValue={labelData.skipLabels}
        onChange={(e) => setLabelData({ ...labelData, skipLabels: e.target.value })}
      />
      <Button color="primary" type="submit" disabled={loading}>
        {loading ? <LoadingSpinner /> : 'Generate Labels'}
      </Button>
      <DownloadModal isOpen={isDownloadModalOpen} toggle={() => setIsDownloadModalOpen(!isDownloadModalOpen)} downloadLink={downloadLink} />
    </Form>
  );
};

export default LabelForm;
