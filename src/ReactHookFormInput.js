import { Input, FormFeedback, Label as RSLabel } from 'reactstrap';
import { Controller } from "react-hook-form";

// use ReactStrap FormFeedback ???
{/* <Input
invalid={errors.number}
/>
<FormFeedback>
{errors.number}
</FormFeedback> */}

const ReactHookFormInput = ({ label, control, errors, type="text", bsSize="sm", required=false, className="" }) => {
  return (
    <>
      {/* <RSLabel className={label} for={label}>{_.startCase(label)}</RSLabel> */}
      <Controller
        control={control}
        name={label}
        render={({ field }) => (
          <Input
            id={label}
            type={type}
            bsSize={bsSize}
            required={required}
            className={className ? className : `label-${label}-input`}
            invalid={errors[label]}
            {...field} 
          />
        )}
      />
      <FormFeedback>
        {errors[label]?.message}
      </FormFeedback>
    </>
  );
};

export default ReactHookFormInput;
