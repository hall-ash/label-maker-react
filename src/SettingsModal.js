import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupText, FormGroup, Label as RSLabel } from 'reactstrap';
import useLocalStorage from "./useLocalStorage.js";

const SettingsModal = ({ isOpen, toggle }) => {

  const defaultSettings = {
    'hasBorder': false, 
    'fontSize': 12, 
    'padding': 1.75,
    'fileName': 'labels',
  }

  const [settings, setSettings] = useState(defaultSettings);


  useEffect(() => {
    if (isOpen) {
      const savedSettings = JSON.parse(localStorage.getItem('settings'));
      if (savedSettings) {
        setSettings({ ...settings, ...savedSettings });
      } 
    }
  }, [isOpen]);



  const handleSaveClick = () => {
    toggle();
    const changedSettings = Object.entries(settings).reduce((changes, [key, value]) => {
      if (key in defaultSettings && value !== defaultSettings.value) {
        changes[key] = value;
      }
    }, {});

    localStorage.setItem('settings', JSON.stringify(changedSettings));
    
  };
 

  const handleBorderToggle = () => {
    setSettings(prevSettings => ({
      ...prevSettings,
      hasBorder: !prevSettings.hasBorder,
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    })
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
              value={settings.padding !== null ? settings.padding : defaultSettings.padding}
              onChange={handleChange}
              min="0"
              bsSize="sm"
              className="label-padding-input"
            />
        </FormGroup>
        <FormGroup>
          <RSLabel className="fontSize" for="fontSize">Font Size</RSLabel>
            <Input
              id="fontSize"
              name="fontSize"
              type="number"
              value={settings.fontSize !== null ? settings.fontSize : defaultSettings.fontSize}
              onChange={handleChange}
              min="1"
              bsSize="sm"
              className="label-font-size-input"
            />
        </FormGroup>
         <FormGroup check className="d-flex align-items-center form-check-group">
              
              <Input
                type="checkbox"
                id="border"
                name="border"
                checked={settings.hasBorder !== null ? settings.hasBorder : defaultSettings.hasBorder}
                onChange={handleBorderToggle}
                className="form-check-input"
              />
              <RSLabel htmlFor="border" check className="form-check-label ms-2">
                Add Border
              </RSLabel>
              
          </FormGroup>
         
          <InputGroup>
             <RSLabel htmlFor="fileName" check className="font-weight-bold">
              Save pdf as...
            </RSLabel>
            <Input
              id="fileName"
              name="fileName"
              type="text"
              value={settings.fileName !==null ? settings.fileName : defaultSettings.fileName}
              onChange={handleChange}
            />
            <InputGroupText>
              .pdf
            </InputGroupText>
          </InputGroup>
    
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
