import './LabelForm.css';
import React from 'react';
import LabelList from './LabelList';
import LoadingSpinner from './LoadingSpinner';
import DownloadModal from './DownloadModal';
import { Form, Button, FormGroup, Label as RSLabel, Input, Row, Col } from 'reactstrap';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';
import SkipLabelsDropdown from './SkipLabelsDropdown';
import { defaultSettings, labelSheetTypes } from './defaultSettings.js';
import useLocalStorage from './useLocalStorage.js';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { labelFormSchema } from './validationSchemas';

const LabelForm = () => {
  const uid = new ShortUniqueId({ length: 5 });
  const [settings] = useLocalStorage('LabelSettings', defaultSettings);
  const [waitingOnApi, setWaitingOnApi] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const { control, handleSubmit, setValue, getValues, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      labelType: labelSheetTypes[0],
      startLabel: '',
      skipLabels: '',
      labels: [
        {
          id: uid.rnd(),
          labeltext: '',
          labelcount: '',
          displayAliquots: false,
          aliquots: Array.from({ length: 1 }, () => ({ id: uid.rnd(), aliquottext: '', number: '' })),
        },
      ],
    },
    resolver: zodResolver(labelFormSchema),
    mode: 'onChange',
  });

  const addLabel = () => {
    const newLabel = { 
      id: uid.rnd(),
      labeltext: '',
      labelcount: '',
      displayAliquots: false,
      aliquots: Array.from({ length: 1 }, () => ({ id: uid.rnd(), aliquottext: '', number: '' })),
    };

    const labels = getValues('labels');
    setValue('labels', [...labels, newLabel]);
  };

  const removeLabel = (labelId) => {
    const labels = getValues('labels').filter(label => label.id !== labelId);
    setValue('labels', labels);
  };

  const addAliquot = (labelId) => {
    const newAliquot = { id: uid.rnd(), aliquottext: '', number: '' };
    const labels = getValues('labels').map(label => 
      label.id === labelId
      ? { ...label, aliquots: [...label.aliquots, newAliquot] }
      : label
    );
    setValue('labels', labels);
  };

  const removeAliquot = (labelId, aliquotId) => {
    const labels = getValues('labels').map(label =>
      label.id === labelId
      ? { ...label, aliquots: label.aliquots.filter(aliquot => aliquot.id !== aliquotId) }
      : label
    );
    setValue('labels', labels);
  };

  const setLabelAliquots = (labelId, aliquots) => {
    const labels = getValues('labels').map(label =>
      label.id === labelId
      ? { ...label, aliquots: aliquots.map(aliquot => ({ ...aliquot, id: uid.rnd() })) }
      : label
    );
    setValue('labels', labels);
  };

  const onSubmit = async (data) => {
    try {
      const validatedFormData = {
        labels: data.labels,
        sheet_type: data.labelType,
        start_label: data.startLabel,
        skip_labels: data.skipLabels,
        border: settings.hasBorder,
        padding: settings.padding,
        font_size: settings.fontSize,
        file_name: settings.fileName,
      };

      const atWork = true;
      const api = atWork ? 'http://192.168.134.118:5000/api/generate_pdf' : 'http://192.168.4.112:5000/api/generate_pdf';
      
      setWaitingOnApi(true);
      const response = await axios.post(api, validatedFormData, {
        responseType: 'blob',
        timeout: 10000,
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setDownloadLink(url);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error:', error);
    }
    setWaitingOnApi(false);
  };

  return waitingOnApi ? (
    <div className="loading-container">
      <LoadingSpinner />
    </div>
  ) : (
    <div className="label-form-container">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className="mb-3">
          <RSLabel for="labelType" className="form-label">Label Type</RSLabel>
          <Controller
            name="labelType"
            control={control}
            render={({ field }) => (
              <Input 
                id="labelType" 
                type="select" 
                {...field}>
                {labelSheetTypes.map((labelType, i) => <option key={i}>{labelType}</option>)}
              </Input>
            )}
          />
        </FormGroup>
        <Row className="row-cols-lg-auto g-3 align-items-end mb-4">
          <Col>
            <RSLabel for="startLabel" className="form-label">Start On Label:</RSLabel>
          </Col>
          <Col>
            <Controller
              name="startLabel"
              control={control}
              render={({ field }) => (
                <Input
                  id="startLabel"
                  type="text"
                  {...field}
                  className="form-input form-input-narrow"
                />
              )}
            />
            {errors.startLabel && <small className="text-danger">{errors.startLabel.message}</small>}
          </Col>
        </Row>

        <SkipLabelsDropdown
          control={control}
          skipLabelsErrorMsg={errors.skipLabels?.message}
        />

        <LabelList
          control={control}
          errors={errors}
          addLabel={addLabel}
          removeLabel={removeLabel}
          addAliquot={addAliquot}
          removeAliquot={removeAliquot}
          setLabelAliquots={setLabelAliquots}
        />

        {errors.labels && <small className="text-danger">{errors.labels.message}</small>}

        <div className="form-submit-container">
          <Button color="primary" type="submit" disabled={isSubmitting}>
            Create Labels
          </Button>
        </div>
      </Form>
      <DownloadModal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} downloadLink={downloadLink} />
    </div>
  );
};



export default LabelForm;
