import './LabelList.css'
import React from "react";
import Label from "./Label";
import { Button } from 'reactstrap';
import { Controller } from 'react-hook-form';

const LabelList = ({ control, errors, addLabel, removeLabel, addAliquot, removeAliquot, setLabelAliquots }) => {
  return (
    <div className="label-list-container">
      <Controller
        name="labels"
        control={control}
        render={({ field }) => (
          field.value.map(({ id, labeltext, aliquots, labelcount, displayAliquots, onChange }, index) => (
            <div key={id}>
              <Label 
                id={id}
                labeltext={labeltext}
                labelCount={labelcount}
                aliquots={aliquots}
                displayAliquots={displayAliquots}
                removeLabel={removeLabel}
                addAliquot={addAliquot}
                removeAliquot={removeAliquot}
                setAliquots={setLabelAliquots}
                onChange={onChange}
              />
              {errors.labels?.[index] && <small className="text-danger">{errors.labels[index].message}</small>}
            </div>
          ))
        )}
      />
      <Button className="add-label-btn" outline color="primary" size="sm" type="button" onClick={addLabel}>Add Label</Button>
    </div>
  );
};

export default LabelList;


// const LabelList = ({ labels, addLabel, removeLabel, addAliquot, removeAliquot, onChange, setLabelAliquots }) => {
  
//   const labelComponents = labels.map(({ id, labeltext, aliquots, labelcount, displayAliquots }) => (
//     <div key={id}>
//       <Label 
//         id={id}
//         labeltext={labeltext}
//         labelCount={labelcount}
//         aliquots={aliquots}
//         removeLabel={removeLabel}
//         addAliquot={addAliquot}
//         removeAliquot={removeAliquot}
//         onChange={onChange}
//         setAliquots={setLabelAliquots}
//         displayAliquots={displayAliquots}
//       />
//     </div>
//   ));

//   return (
//     <div className="label-list-container">
//       {labelComponents}
//       <Button className="add-label-btn" outline color="primary" size="sm" type="button" onClick={addLabel}>Add Label</Button>
//     </div>
//   );

// }

// export default LabelList;
