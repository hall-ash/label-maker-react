import React, { useState, useContext } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupText, FormGroup, Label as RSLabel } from 'reactstrap';
import { settingsSchema, getErrors } from './validationSchemas.js';
import { useForm } from "react-hook-form"

const SettingsModal = ({ isOpen, toggle }) => {

  const { savedSettings, setSavedSettings } = useContext(SettingsContext);
  const [settings, setSettings] = useState(savedSettings);

  const handleSaveClick = () => {
    setSavedSettings(settings);
  };

  const handleBorderToggle = () => {
    setSettings(prevSettings => ({
      ...prevSettings,
      hasBorder: !prevSettings.hasBorder,
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setSettings(prevSettings => {
      const updatedSettings = {
          ...prevSettings,
          [name]: value,
      };

      const parsedData = settingsSchema.safeParse(updatedSettings);
      setErrors(getErrors(parsedData.error));

      return updatedSettings;
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Label Settings</ModalHeader>
      <ModalBody>
        <FormGroup>
          <RSLabel className="padding" for="padding">Padding</RSLabel>
          <Input
            id="padding"
            name="padding"
            type="number"
            value={settings.padding}
            onChange={handleChange}
            min="0"
            bsSize="sm"
            className="label-padding-input"
          />
          {errors.padding && <small className="text-danger">{errors.padding}</small>}
        </FormGroup>

        <FormGroup>
          <RSLabel className="fontSize" for="fontSize">Font Size</RSLabel>
          <Input
            id="fontSize"
            name="fontSize"
            type="number"
            value={settings.fontSize}
            onChange={handleChange}
            min="1"
            bsSize="sm"
            className="label-font-size-input"
          />
          {errors.fontSize && <small className="text-danger">{errors.fontSize}</small>}
        </FormGroup>

        <FormGroup check className="d-flex align-items-center form-check-group">
          <Input
            type="checkbox"
            id="border"
            name="border"
            checked={settings.hasBorder}
            onChange={handleBorderToggle}
            className="form-check-input"
          />
          <RSLabel htmlFor="border" check className="form-check-label ms-2">
            Add Border
          </RSLabel>
        </FormGroup>

        <FormGroup>
          <RSLabel for="fileName" className="font-weight-bold">Save pdf as...</RSLabel>
          <InputGroup>
            <Input
              id="fileName"
              name="fileName"
              type="text"
              value={settings.fileName}
              onChange={handleChange}
              bsSize="sm"
            />
            <InputGroupText>.pdf</InputGroupText>
          </InputGroup>
          {errors.fileName && <small className="text-danger">{errors.fileName}</small>}
        </FormGroup>
      </ModalBody>

      <ModalFooter className="justify-content-center">
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>{' '}
        <Button color="primary" onClick={handleSaveClick} disabled={isSubmitting}>Save</Button>
      </ModalFooter>
    </Modal>
  );
};

export default SettingsModal;
