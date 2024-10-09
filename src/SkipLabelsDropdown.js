import React, { useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  FormGroup,
  Label as RSLabel,
  Input,
} from 'reactstrap';
import { Controller } from 'react-hook-form';

const SkipLabelsDropdown = ({ skipLabelsErrorMsg, control }) => {
  const [open, setOpen] = useState(null);
  const toggle = id => {
    setOpen(open === id ? undefined : id);
  };

  return (
    <FormGroup className="mb-3">
      <RSLabel for="skipLabels" className="form-label">Skip Labels</RSLabel>
      <Accordion open={open} toggle={toggle}>
        <AccordionItem>
          <AccordionHeader targetId="1">
            {open ? "Add labels to skip below" : "Click to add labels to skip"}
          </AccordionHeader>
          <AccordionBody accordionId="1">
            <Controller
              name="skipLabels"
              control={control}
              render={({ field }) => (
                <textarea
                  id="skipLabels"
                  placeholder={`1: A1-D4, E17${String.fromCharCode(10)}2: B2-D5`}
                  {...field}
                  className="form-textarea"
                />
              )}
            />
            {skipLabelsErrorMsg && <small className="text-danger">{skipLabelsErrorMsg}</small>}
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </FormGroup>
  );
};


// const SkipLabelsDropdown = ({ skipLabelsErrorMsg, skipLabelsValue, onChange }) => {
//   const [open, setOpen] = useState('0');
//   const toggle = id => {
//     if (open === id) {
//       setOpen();
//     } else {
//       setOpen(id);
//     }
//   };

//   const handleChange = e => onChange(e);

//   return (
//     <FormGroup className="mb-3">
//               <RSLabel for="skipLabels" className="form-label">Skip Labels</RSLabel>
//       <Accordion open={open} toggle={toggle}>
//         <AccordionItem>
//           <AccordionHeader targetId="1">{open ? "Add labels to skip below" : "Click to add labels to skip"}</AccordionHeader>
//           <AccordionBody accordionId="1">
            
//               <Input
//                 id="skipLabels"
//                 name="skipLabels"
//                 type="textarea"
//                 placeholder={`1: A1-D4, E17${String.fromCharCode(10)}2: B2-D5`}
//                 value={skipLabelsValue}
//                 onChange={handleChange}
         
//                 className="form-textarea"
//               />
//               {skipLabelsErrorMsg && <small className="text-danger">{skipLabelsErrorMsg}</small>}
            
//           </AccordionBody>
//         </AccordionItem>
//       </Accordion>
//     </FormGroup>
//   );
// }

export default SkipLabelsDropdown;