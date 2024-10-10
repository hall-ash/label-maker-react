import './LabelList.css'
import React from "react";
import Label from "./Label";
import { Button } from 'reactstrap';

function LabelList ({ labels, addLabel, removeLabel, addAliquot, removeAliquot, onChange, setLabelAliquots }) {
  
  // const labelComponents = labels.map(({ id, labeltext, aliquots, labelcount, displayAliquots }) => (
  //   <Label 
  //     id={id}
  //     key={id}
  //     labeltext={labeltext}
  //     labelCount={labelcount}
  //     aliquots={aliquots}
  //     removeLabel={removeLabel}
  //     addAliquot={addAliquot}
  //     removeAliquot={removeAliquot}
  //     onChange={onChange}
  //     setAliquots={setLabelAliquots}
  //     displayAliquots={displayAliquots}
  //   /> 
  // ));

  // return (
  //   <div>
  //     {labelComponents}
  //     <Button className="mx-1 add-label-btn" outline color="primary" size="sm" type="button" onClick={addLabel}>Add Label</Button>
  //   </div>
  // );

  const labelComponents = labels.map(({ id, labeltext, aliquots, labelcount, displayAliquots }, idx) => {
    
    // const error = labelListErrors.idx === idx ? labelListErrors; 
    return (
    
    <div key={id}>
      <Label 
        id={id}
        labeltext={labeltext}
        labelCount={labelcount}
        aliquots={aliquots}
        removeLabel={removeLabel}
        addAliquot={addAliquot}
        removeAliquot={removeAliquot}
        onChange={onChange}
        setAliquots={setLabelAliquots}
        displayAliquots={displayAliquots}
      />
    </div>
      )
    }
  );

  return (
    <div className="label-list-container">
      {labelComponents}
      <Button className="add-label-btn" outline color="primary" size="sm" type="button" onClick={addLabel}>Add Label</Button>
    </div>
  );

}

export default LabelList;
