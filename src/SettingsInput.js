import { Input, FormGroup, Label as RSLabel } from 'reactstrap';

// not finished
const SettingsInput = ({ label, register, required, title, type, errorMsg }) => {
  return (
    <FormGroup check={type === 'checkbox'} className={className}>
      <RSLabel className={label} for={label}>{title}</RSLabel>
      <Input
        id={label}
        name={label}
        type={type}
        value={settings.padding}
        onChange={handleChange}
        min="0"
        bsSize="sm"
        className={`${label}-padding-input`}
        {...register(label, { required })}
      />
      {errorMsg && <small className="text-danger">{errorMsg}</small>}
    </FormGroup>
    );
};

export default SettingsInput;
