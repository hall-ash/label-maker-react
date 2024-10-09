import { Input, FormGroup, Label as RSLabel } from 'reactstrap';
import { Controller } from "react-hook-form";
import _ from 'lodash';

const SettingsInput = ({ label, control, errors, type="text", bsSize="sm", required=false }) => {
  return (
    <FormGroup>
      <RSLabel className={label} for={label}>{_.startCase(label)}</RSLabel>
      <Controller
        control={control}
        name={label}
        render={({ field }) => (
          <Input
            id={label}
            type={type}
            bsSize={bsSize}
            required={required}
            className={`label-${label}-input`}
            {...field} 
          />
        )}
      />
      {errors[label] && <small className="text-danger">{errors[label].message}</small>} 
    </FormGroup>
  );
};

export default SettingsInput;
