import { z } from 'zod';
import DOMPurify from 'dompurify';

const parseData = () => {

  const amountsSchema = z
  .string() // Input is expected to be a string
  .transform(amountsStr => {
    const amounts = amountsStr.match(/\d+(\.\d+)?/g); // Extract numbers from the string
    return amounts ? amounts.map(Number) : []; // Convert to an array of numbers
  })
  .array(z.number()) // The transformed value should be an array of numbers
  .nonempty('Enter at least one amount in mg'); // Ensure at least one number is present


  const positiveNumberSchema = z.string({
    required_error: "Enter a value",  // Error message if the input is empty
  }).transform(value => parseFloat(value))
    .refine(number => !isNaN(number) && isFinite(number), { message: 'Enter a number' })
    .positive({ message: 'Must be a positive number' });
  

  const calculateAliquotsModalSchema = z.object({
    'concentration': positiveNumberSchema,
    'volume': positiveNumberSchema,
    'amounts': amountsSchema,
  });
  
  const parsedData = calculateAliquotsModalSchema.safeParse(formData)

  if (parsedData.error) {
    const issueMsgs = parsedData.error.issues.reduce((msgs, issue) => {
      const { path: inputs, message } = issue;
      msgs[inputs[0]] = message;
      return msgs;
    }, {});
    setErrorMsgs(issueMsgs);
  } else {
    setErrorMsgs({ concentration: '', volume: '', amounts: '' });
  }

  return parsedData;
};

 const formattedLabels = labels
        .filter(label => label.labeltext && label.labelcount)
        .map(({ labeltext, aliquots, labelcount, displayAliquots }) => ({
          name: labeltext.trim(),
          count: labelcount, 
          use_aliquots: displayAliquots,
          aliquots: aliquots
            .filter(aliquot => aliquot.number)
            .map(({ aliquottext, number }) => ({ text: aliquottext, number })),
      }));

const startLabelSchema = z.string().regex(/^[a-zA-Z]\d{1,2}$/, {
  message: "Invalid label coordinates",
});

const skipLabelsSchema = z.array();


const labelFormSchema = {
  labels: z.array(labelsSchema),
  sheet_type: z.string(),
  start_label: startLabelSchema,
  skip_labels: skipLabelsSchema, 
  border: z.boolean(),
  padding: z.number().nonnegative(),
  font_size: z.number().positive(),
  file_name: z.string(),
};

const aliquotSchema = z.object({
  aliquottext: z.string(),
  number: z.number().positive(),
});

const labelSchema = z.object({
  labeltext: z.string(),
  labelcount: z.number().positive(),
  displayAliquots: z.boolean(),
  aliquots: z.array(aliquotSchema),
  )
});

const labelsSchema = z
  .array(labelSchema)
  .transform((labels) =>
    labels
      .filter((label) => label.labeltext && label.labelcount) 
      .map(({ labeltext, aliquots, labelcount, displayAliquots }) => ({
        name: DOMPurify.sanitize(labeltext.trim()),
        count: labelcount,
        use_aliquots: displayAliquots,
        aliquots: aliquots
          .filter(aliquot => aliquot.number) 
          .map(({ aliquottext, number }) => ({ text: DOMPurify.sanitize(aliquottext), number })), 
      }))
  )
  .nonempty('Add a label to print.');

// Function to validate and transform labels
const validateAndTransformLabels = (labels) => {
  const parsedData = labelsSchema.safeParse(labels);
  
  if (!parsedData.success) {
    console.error(parsedData.error);
    return null; // or handle the error accordingly
  }
  
  return parsedData.data; // Return the transformed array
};

// Usage example
const formattedLabels = validateAndTransformLabels(labels);

const settingsSchema = {
  hasBorder: z.boolean(),
  fontSize: z.number().positive().max(100),
  padding: z.number().nonnegative().max(10),
  fileName: z.string().transform(input => DOMPurify.sanitize(input)).nonempty(),
};

const defaultSettings = {
    'hasBorder': false, 
    'fontSize': 12, 
    'padding': 1.75,
    'fileName': 'labels',
  }



