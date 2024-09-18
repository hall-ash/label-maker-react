import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupText, FormGroup, Label as RSLabel } from 'reactstrap';
import { settingsSchema } from './validationSchemas.js';

const SettingsModal = ({ isOpen, toggle }) => {

  const defaultSettings = {
    'hasBorder': false, 
    'fontSize': 12, 
    'padding': 1.75,
    'fileName': 'labels',
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    if (isOpen) {
      const defaultSettings = {
        'hasBorder': false, 
        'fontSize': 12, 
        'padding': 1.75,
        'fileName': 'labels',
      }
      const savedSettings = JSON.parse(localStorage.getItem('settings'));
      if (savedSettings) {
        const fileName = savedSettings.fileName ? savedSettings.fileName : defaultSettings.fileName;
        setSettings({ ...defaultSettings, ...savedSettings, fileName });
      } else {
        setSettings(defaultSettings);
      }
    } 
  }, [isOpen]);

 


  const parseSettings = (updatedSettings) => {
    const parsedSettings = settingsSchema.safeParse(updatedSettings);

    if (parsedSettings.error) {
       const issueMsgs = parsedSettings.error.issues.reduce((msgs, issue) => {
        const { path: inputs, message } = issue;
        msgs[inputs[0]] = message;
        return msgs;
      }, {});
      setErrors(issueMsgs);
    } else {
      const blankErrors = Object.keys(errors).reduce((blank, key) => {
        blank[key] = '';
        return blank;
      }, {});
      setErrors(blankErrors);
    }

  };

  const validateSettings = () => {
    return Object.values(errors).every(msg => msg === '');
  };


  const handleSaveClick = () => {

    try {

      if (validateSettings()) {
        toggle();

        const changedSettings = Object.fromEntries(
          Object.entries(settings).filter(
            ([key, value]) => key in defaultSettings && value !== defaultSettings[key]
          )
        );
        
        if (Object.keys(changedSettings).length) {
          localStorage.setItem('settings', JSON.stringify(changedSettings));
        } else {
          localStorage.removeItem('settings');
        }
      }

    } catch (e) {
      console.error(e);
    }

  };
 

  const handleBorderToggle = () => {
    setSettings(prevSettings => ({
      ...prevSettings,
      hasBorder: !prevSettings.hasBorder,
    }));
  };

   //useEffect(() => parseSettings(), [settings]);



  const handleChange = e => {
    const { name, value } = e.target;

    setSettings(prevSettings => {
      const updatedSettings = {
          ...prevSettings,
          [name]: value,
      };

      parseSettings(updatedSettings);

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
        <Button color="primary" onClick={handleSaveClick}>Save</Button>
      </ModalFooter>
    </Modal>
  );
};

export default SettingsModal;
