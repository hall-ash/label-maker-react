import { z } from 'zod';
import DOMPurify from 'dompurify';
import filenamify from 'filenamify/browser';

// const startLabelSchema = z.optional(z.string().regex(/^[a-zA-Z]\d{1,2}$/, {
//   message: "Invalid label coordinates",
// }));

// const validatePattern = (value) => {
//   const pattern = /^[a-zA-Z]\d{1,2}$/; // Define your regex pattern
//   // Allow empty strings or strings that match the pattern
//   return value === '' || pattern.test(value);
// };

// // Define the schema using Zod and pass the custom function to `.refine()`
// const schema = z.string().refine(validatePattern, {
//   message: 'Invalid input: must be an empty string or match the specified pattern',
// });

const startLabelSchema = z.string()
                .refine(s => {
                  const startLabelPattern = /^[a-zA-Z]\d{1,2}$/;
                  return s === "" || startLabelPattern.test(s)
                }, { message: 'Invalid label coordinates' }
              );

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

const numberInputSchema = z.string()
  .transform(value => parseFloat(value)) // Transform string input to a float
  .refine(number => !isNaN(number) && isFinite(number), { message: 'Enter a number' }); 

const nonnegativeNumberInputSchema = numberInputSchema.refine(number => number >= 0, { message: 'Enter a number greater than or equal to 0' });
const labelOrAliquotQuantitySchema = z.string().refine(input => input === "").or(nonnegativeNumberInputSchema)

const aliquotSchema = z.object({
  aliquottext: z.string(),
  //number: labelOrAliquotQuantitySchema,
  number: z.number({ invalid_type_error: "Number of aliquots must be a valid number", })
           .nonnegative({ message: 'Number can\'t be negative', })
});

const labelSchema = z.object({
  labeltext: z.string(),
  //labelcount: labelOrAliquotQuantitySchema,
  labelcount: z.number({ invalid_type_error: "Number of labels must be a valid number", })
               .nonnegative({ message: 'Number can\'t be negative', }),
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

// const settingsSchema = z.object({
//   hasBorder: z.boolean(),
//   fontSize: z.string().refine(num => Number(num) > 0 && Number(num) <= 100 , { message: 'Font size must be between 1 and 100 inclusive' }).or(z.number().refine(num => num > 0 && num <= 100), { message: 'Font size must be between 1 and 100 inclusive' }),//z.string().refine(input => input === "").or(numberInputSchema.refine(number => number > 0 && number <= 100, { message: 'Font size must be between 1 and 100 inclusive' })).or(z.number().refine(num => num > 0 && num <= 100)), 
//   padding: z.string().refine(num => Number(num) >= 0 && Number(num) <= 10 , { message: 'Padding must be between 0 and 10 inclusive' }).or(z.number().refine(num => num >= 0 && num <= 10), { message: 'Padding must be between 0 and 10 inclusive' }), //z.string().refine(input => input === "").or(numberInputSchema.refine(number => number >= 0 && number <= 10, { message: 'Padding must be between 0 and 10 inclusive' })).or(z.number().refine(num => num >= 0 && num <= 10)), 
//   fileName: z.string().transform(input => filenamify(DOMPurify.sanitize(input))), 
// });

const settingsSchema = z.object({
  hasBorder: z.boolean(),
  fontSize: z.number({ invalid_type_error: "Font size must be a number", })
             .positive({ message: 'Font size must be greater than 0', })
             .lte(100, { message: 'Font size must no greater than 100', }),
  // fontSize: z.union([
  //   z.string().regex(/[0-9]*/, { message: 'Font size must be a number' }).transform(Number).refine(num => num > 0 && num <= 100, { message: 'Font size must be between 1 and 100 inclusive' }),
  //   z.number().refine(num => num > 0 && num <= 100, { message: 'Font size must be between 1 and 100 inclusive' })
  // ]),
  // padding: z.union([
  //   z.string().regex(/[0-9]*/, { message: 'Padding must be a number' }).transform(Number).refine(num => num >= 0 && num <= 10, { message: 'Padding must be between 0 and 10 inclusive' }),
  //   z.number().refine(num => num >= 0 && num <= 10, { message: 'Padding must be between 0 and 10 inclusive' })
  // ]),
  padding: z.number({ invalid_type_error: "Padding must be a number", })
            .nonnegative({ message: 'Padding can\'t be negative', })
            .lte(10, { message: 'Padding must no greater than 10', }),
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

const labelFormSchema = z.object({
  labels: labelsSchema,
  labelType: z.string(),
  startLabel: startLabelSchema,
  skipLabels: z.optional(skipLabelsSchema), 
});

const getErrors = parsedDataError => {
   // Check if there are any issues and reduce them to an object with error messages
  return parsedDataError?.issues?.reduce((msgs, issue) => {
    const { path: inputs, message } = issue; // Destructure path and message from the issue
    if (inputs.length > 0) { // Ensure path has at least one element
      msgs[inputs[0]] = message; // Map the first path element to the error message
    }
    return msgs;
  }, {}) || {}; // Return empty object if no errors
};


export { settingsSchema, labelFormSchema, calculateAliquotsModalSchema, labelSchema, nonnegativeNumberInputSchema, getErrors };



