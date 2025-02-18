import React, { useEffect } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Input, InputGroup, InputGroupText,
  FormGroup, Label as RSLabel, FormFeedback
} from 'reactstrap';
import { settingsSchema } from '../utils/validationSchemas.js';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { defaultSettings } from '../defaultSettings.js';
import ReactHookFormInput from './ReactHookFormInput';

const SettingsModal = ({ isOpen, toggle }) => {
  const [settings, setSettings] = useLocalStorage('LabelSettings', defaultSettings);
  const {
    control, handleSubmit, formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: settings,
    resolver: zodResolver(settingsSchema),
    mode: 'onTouched',
  });

  const onSubmit = (data) => {
    setSettings(data); // Save to local storage
    toggle(); // Close modal
  };

  const handleCancel = () => {
    reset(settings); // Reset fields to last saved settings
    toggle(); // Close modal
  };

  return (
    <Modal isOpen={isOpen} toggle={handleCancel}>
      <ModalHeader toggle={handleCancel}>Label Settings</ModalHeader>
      <ModalBody>
        <FormGroup>
          <ReactHookFormInput label="padding" control={control} errors={errors} labelText="Padding" />
        </FormGroup>
        <FormGroup>
          <ReactHookFormInput label="fontSize" control={control} errors={errors} labelText="Font Size" />
        </FormGroup>
        <RSLabel for="textAnchor" className="font-weight-bold">Alignment</RSLabel>
        <FormGroup>
          <Controller
            control={control}
            name="textAnchor"
            render={({ field }) => (
              <Input type="select" id="textAnchor" {...field}>
                <option value="middle">Middle</option>
                <option value="start">Start</option>
                <option value="end">End</option>
              </Input>
            )}
          />
        </FormGroup>
        <FormGroup check className="d-flex align-items-center">
          <Controller
            control={control}
            name="hasBorder"
            render={({ field }) => (
              <Input
                type="checkbox"
                id="border"
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
              />
            )}
          />
          <RSLabel for="border" className="ms-2">Add Border</RSLabel>
        </FormGroup>
        <FormGroup>
          <RSLabel for="fileName" className="font-weight-bold">Save PDF as...</RSLabel>
          <InputGroup>
            <Controller
              control={control}
              name="fileName"
              render={({ field }) => (
                <Input id="fileName" type="text" invalid={!!errors.fileName} {...field} />
              )}
            />
            <InputGroupText>.pdf</InputGroupText>
            {errors.fileName && <FormFeedback>{errors.fileName.message}</FormFeedback>}
          </InputGroup>
        </FormGroup>
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="secondary" onClick={handleCancel}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Save</Button>
      </ModalFooter>
    </Modal>
  );
};

export default SettingsModal;



