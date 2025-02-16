import React, { useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  FormGroup,
  Label as RSLabel,
  Input,
  FormFeedback
} from 'reactstrap';

const SkipLabelsDropdown = ({ skipLabelsValue, onChange, error, onBlur }) => {
  const [open, setOpen] = useState('0');
  const toggle = id => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  // const toggle = () => setOpen(!open);
  const handleChange = e => onChange(e);
  const handleBlur = e => onBlur(e);

  return (
    <FormGroup className="mb-3">
              <RSLabel for="skipLabels" className="form-label">Skip Labels</RSLabel>
      <Accordion open={open} toggle={toggle}>
        <AccordionItem>
          <AccordionHeader targetId="1">{open === '1' ? "Add labels to skip below" : "Click to add labels to skip"}</AccordionHeader>
          <AccordionBody accordionId="1"> 
              <Input
                id="skipLabels"
                name="skipLabels"
                type="textarea"
                placeholder={`1: A1-D4, E17${String.fromCharCode(10)}2: B2-D5`}
                value={skipLabelsValue}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={error}
                className="form-textarea"
              />
              <FormFeedback>
                {error}
                {/*{error.errors[0]?.message}*/}
              </FormFeedback>
            
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </FormGroup>
  );
}

export default SkipLabelsDropdown;