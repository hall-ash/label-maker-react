<FormGroup className="mb-3">
<RSLabel for="labelFile" className="form-label">Label File</RSLabel>
<Input
  id="labelFile"
  name="labelFile"
  type="file"
  onChange={handleLabelInfoChange}
  className="form-file"
/>
<FormText className="form-text-info">Upload an excel or csv file to create labels.</FormText>
</FormGroup>