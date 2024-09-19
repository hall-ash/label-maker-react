import { z } from 'zod';
import DOMPurify from 'dompurify';
import filenamify from 'filenamify/browser';

const startLabelSchema = z.string().regex(/^[a-zA-Z]\d{1,2}$/, {
  message: "Invalid label coordinates",
});

const skipLabelsSchema = z
  .string()
  .transform((skips) => {
    // Clean up whitespace and newlines
    return skips
      .replace(/[ \t\f\v\r]+/g, '') // Remove all whitespace except newlines
      .replace(/^\n+|\n+$/g, '')    // Remove newlines from the start and end of the string
      .replace(/\n+/g, '\n');       // Replace consecutive newlines with a single newline
  })
  .refine(
    (skips) => {
      // Optional: Handle empty strings as valid (if required by your use case)
      if (!skips) return true;

      // Define the regex pattern to validate skip labels format
      const pattern = /^(\d+:\w\d+(?:-\w\d+)?(?:,\w\d+(?:-\w\d+)?)*)?(?:\n\d+:\w\d+(?:-\w\d+)?(?:,\w\d+(?:-\w\d+)?)*)*$/;
      return pattern.test(skips);
    },
    {
      message: "Invalid skipLabels format", // Error message shown when regex fails
    }
  );

const aliquotSchema = z.object({
  aliquottext: z.string(),
  number: z.number(),
});

const labelSchema = z.object({
  labeltext: z.string(),
  labelcount: z.number(),
  displayAliquots: z.boolean(),
  aliquots: z.array(aliquotSchema),
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
  .refine(labels => labels.length > 0, { message: "Add a label to print" });


const numberInputSchema = z.string({
    required_error: "Enter a value",
  })
  .transform(value => parseFloat(value)) // Transform string input to a float
  .refine(number => !isNaN(number) && isFinite(number), { message: 'Enter a valid number' }); 


const settingsSchema = z.object({
  hasBorder: z.boolean(),
  fontSize: numberInputSchema.refine(number => number > 0 && number <= 100, { message: 'Font size must be between 1 and 100 inclusive' }), 
  padding: numberInputSchema.refine(number => number >= 0 && number <= 10, { message: 'Padding must be between 0 and 10 inclusive' }), 
  fileName: z.string().transform(input => filenamify(DOMPurify.sanitize(input))), 
});

// expected array, received string
const amountsSchema = z
  .string() // Input is expected to be a string
  .transform(amountsStr => {
    const amounts = amountsStr.match(/\d+(\.\d+)?/g); // Extract numbers from the string
    return amounts ? amounts.map(Number) : []; // Convert to an array of numbers
  })
  .refine(amounts => amounts.length > 0, { message: 'Provide at least one amount' });
 // The transformed value should be an array of numbers


const calculateAliquotsModalSchema = z.object({
  'concentration': numberInputSchema.refine(number => number > 0, { message: 'concentration must be greater than 0'}),
  'volume': numberInputSchema.refine(number => number > 0, { message: 'volume must be greater than 0' }),
  'amounts': amountsSchema,
});

const labelFormSchema = {
  labels: z.array(labelsSchema),
  labelType: z.string(),
  startLabel: startLabelSchema,
  skipLabels: skipLabelsSchema, 
  ...settingsSchema,
};

const parseData = (updatedData, validationSchema, errors, setErrors, returnParsedData = false) => {
  const parsedData = validationSchema.safeParse(updatedData);

  if (parsedData.error) {
    const issueMsgs = parsedData.error.issues.reduce((msgs, issue) => {
     const { path: inputs, message } = issue;
     msgs[inputs[0]] = message;
     return msgs;
    }, {});
    setErrors(issueMsgs);
  } else {
    const blankErrors = Object.keys(errors).reduce((blank, key) => {
      blank[key] = '';
      return blank;
    }, {});
    setErrors(blankErrors);
  }

  if (returnParsedData) return parsedData;
};


export { settingsSchema, labelFormSchema, calculateAliquotsModalSchema, parseData };



