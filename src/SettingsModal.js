import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupText, FormGroup, Label as RSLabel } from 'reactstrap';
import { settingsSchema } from './validationSchemas.js';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import useLocalStorage from './useLocalStorage.js';
import _ from 'lodash';
import { defaultSettings } from './defaultSettings.js';
import ReactHookFormInput from './ReactHookFormInput';

const SettingsModal = ({ isOpen, toggle }) => {

  const [settings, setSettings] = useLocalStorage('LabelSettings', defaultSettings);

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, clearErrors } = useForm({
    defaultValues: settings,
    resolver: zodResolver(settingsSchema),
    mode: 'onTouched',
  });

  const onSubmit = (data) => {
    if (! _.isEqual(data, settings)) {
      setSettings(data); // save data to local storage if changed
    }
    
    toggle(); // Close the modal after saving
  };


  const handleCancel = () => {
    toggle(); // close modal
  
    // reset any changed settings
    Object.keys(settings).forEach(field => {
      setValue(field, settings[field]);
    });
    
    // clear any errors 
    clearErrors();
  };


  return (
    <Modal isOpen={isOpen} toggle={handleCancel}>
      <ModalHeader toggle={toggle}>Label Settings</ModalHeader>
      <ModalBody>
        <SettingsInput 
          label="padding"
          control={control}
          errors={errors}
        />
         <SettingsInput 
          label="fontSize"
          control={control}
          errors={errors}
        />
        <FormGroup check className="d-flex align-items-center form-check-group">
          <Controller
            control={control}
            name="hasBorder"
            render={({ field }) => (
              <Input
                type="checkbox"
                id="border"
                className="form-check-input"
                {...field}
              />
            )}
          />
          <RSLabel htmlFor="border" check className="form-check-label ms-2">
            Add Border
          </RSLabel>
        </FormGroup>

        <FormGroup>
          <RSLabel for="fileName" className="font-weight-bold">Save pdf as...</RSLabel>
          <InputGroup>
            <Controller
              control={control}
              name="fileName"
              render={({ field }) => (
                <Input
                  id="fileName"
                  type="text"
                  bsSize="sm"
                  {...field}
                />
              )}
            />
            <InputGroupText>.pdf</InputGroupText>
          </InputGroup>
          {errors.fileName && <small className="text-danger">{errors.fileName.message}</small>}
        </FormGroup>
      </ModalBody>

      <ModalFooter className="justify-content-center">
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>{' '}
        <Button color="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Save</Button>
      </ModalFooter>
    </Modal>
  );
};

export default SettingsModal;


