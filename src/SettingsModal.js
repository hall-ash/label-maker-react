// import React, { useContext } from 'react';
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupText, FormGroup, Label as RSLabel } from 'reactstrap';
// import { useForm } from "react-hook-form"

// const SettingsModal = ({ isOpen, toggle }) => {
//   const { savedSettings, setSavedSettings } = useContext(SettingsContext);
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
//     defaultValues: savedSettings
//   });

//   const onSubmit = (data) => {
//     setSavedSettings(data);
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle}>
//       <ModalHeader toggle={toggle}>Label Settings</ModalHeader>
//       <ModalBody>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <FormGroup>
//             <RSLabel className="padding" for="padding">Padding</RSLabel>
//             <Input
//               id="padding"
//               name="padding"
//               type="number"
//               min="0"
//               bsSize="sm"
//               className="label-padding-input"
//               {...register('padding', {
//                 min: { value: 0, message: 'Padding must be positive' },
//                 max: { value: 100, message: 'Padding cannot be greater than 100' },
//                 valueAsNumber: true,
//                 validate: value => !isNaN(value) || 'Please enter a valid number'
//               })}
//             />
//             {errors.padding && <small className="text-danger">{errors.padding.message}</small>}
//           </FormGroup>

//           <FormGroup>
//             <RSLabel className="fontSize" for="fontSize">Font Size</RSLabel>
//             <Input
//               id="fontSize"
//               name="fontSize"
//               type="number"
//               min="1"
//               bsSize="sm"
//               className="label-font-size-input"
//               {...register('fontSize', { required: true })}
//             />
//             {errors.fontSize && <small className="text-danger">Font size is required</small>}
//           </FormGroup>

//           <FormGroup check className="d-flex align-items-center form-check-group">
//             <Input
//               type="checkbox"
//               id="border"
//               name="border"
//               className="form-check-input"
//               {...register('hasBorder')}
//             />
//             <RSLabel htmlFor="border" check className="form-check-label ms-2">
//               Add Border
//             </RSLabel>
//           </FormGroup>

//           <FormGroup>
//             <RSLabel for="fileName" className="font-weight-bold">Save pdf as...</RSLabel>
//             <InputGroup>
//               <Input
//                 id="fileName"
//                 name="fileName"
//                 type="text"
//                 bsSize="sm"
//                 {...register('fileName', { required: true })}
//               />
//               <InputGroupText>.pdf</InputGroupText>
//             </InputGroup>
//             {errors.fileName && <small className="text-danger">File name is required</small>}
//           </FormGroup>
//         </form>
//       </ModalBody>

//       <ModalFooter className="justify-content-center">
//         <Button color="secondary" onClick={toggle}>
//           Cancel
//         </Button>{' '}
//         <Button color="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Save</Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default SettingsModal;

import React, { useContext } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupText, FormGroup, Label as RSLabel } from 'reactstrap';
import { settingsSchema } from './validationSchemas.js';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import SettingsContext from './SettingsContext';
import useLocalStorage from './useLocalStorage.js';

const SettingsModal = ({ isOpen, toggle }) => {
  const { savedSettings, setSavedSettings } = useContext(SettingsContext);

  const defaultSettings = {
    'hasBorder': false, 
    'fontSize': 12, 
    'padding': 1.75,
    'fileName': 'labels',
  };

  const [localStorageSettings, setLocalStorageSettings] = useLocalStorage('LabelSettings', defaultSettings);

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, clearErrors } = useForm({
    defaultValues: savedSettings,
    resolver: zodResolver(settingsSchema),
  });

  const onSubmit = (data) => {
    setSavedSettings(data);
    setLocalStorageSettings(data);
    toggle(); // Close the modal after saving
  };


  const handleCancel = () => {
    toggle(); // close modal
  
    // reset any changed settings
    Object.keys(savedSettings).forEach(field => {
      setValue(field, savedSettings[field]);
    });
    
    // clear any errors 
    clearErrors();
  };


  return (
    <Modal isOpen={isOpen} toggle={handleCancel}>
      <ModalHeader toggle={toggle}>Label Settings</ModalHeader>
      <ModalBody>
        <FormGroup>
          <RSLabel className="padding" for="padding">Padding</RSLabel>
          <Controller
            control={control}
            name="padding"
       
            render={({ field }) => (
              <Input
                id="padding"
                type="text"
                bsSize="sm"
                className="label-padding-input"
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                {...field}
              />
            )}
          />
          {errors.padding && <small className="text-danger">{errors.padding.message}</small>}
        </FormGroup>

        <FormGroup>
          <RSLabel className="fontSize" for="fontSize">Font Size</RSLabel>
          <Controller
            control={control}
            name="fontSize"
            render={({ field }) => (
              <Input
                id="fontSize"
                type="text"
                bsSize="sm"
                className="label-font-size-input"
                {...field}
              />
            )}
          />
          {errors.fontSize && <small className="text-danger">{errors.fontSize.message}</small>}
        </FormGroup>

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

