import validator from 'validator';
import { z } from 'zod';

// Validation schema for fileName
const fileNameSchema = z.string().regex(/^[a-zA-Z0-9_\-\.]+$/, "Invalid file name") // .endsWith('.pdf', 'pdf extension is automatically added to the file name');

// Validation schema for padding
const paddingSchema = z.number().min(0, "Padding must be at least 0").max(10, "Padding must be at most 10");

// Validation schema for fontSize
const fontSizeSchema = z.number().min(1, "Font size must be at least 1").max(60, "Font size must be at most 60");

// Validation schema for sanitized string inputs (labeltext, aliquottext)
const sanitizedStringSchema = z.string().transform(value => {
  // Basic sanitization logic
  return value.replace(/<script.*?>.*?<\/script>/gi, '') // Remove script tags
              .replace(/</g, '&lt;') // Escape <
              .replace(/>/g, '&gt;') // Escape >
              .replace(/&/g, '&amp;') // Escape &
              .replace(/'/g, '&#39;') // Escape '
              .replace(/"/g, '&quot;'); // Escape "
});

// Validation schema for labelcount and aliquotnumber
const numberRangeSchema = z.number().min(0, "Number must be at least 0").max(1000, "Number must be at most 1000");

// Validation schema for startlabel
const startLabelSchema = z.string().regex(/^[A-Za-z]\d{1,2}$/, "Start label must be a single letter followed by up to 2 digits");

// Validation schema for hasBorder
const hasBorderSchema = z.boolean();

// Validation schema for skipLabels
const skipLabelsSchema = z.string().regex(
  /^(\d+:\w\d+(?:-\w\d+)?(?:,\w\d+(?:-\w\d+)?)*)?(?:\r?\n\d+:\w\d+(?:-\w\d+)?(?:,\w\d+(?:-\w\d+)?)*)*$/,
  "Invalid skipLabels format"
);



// Aggregate schema combining all the above
const labelFormValidationSchema = z.object({
  fileName: fileNameSchema,
  padding: paddingSchema,
  fontSize: fontSizeSchema,
  labeltext: sanitizedStringSchema,
  aliquottext: sanitizedStringSchema,
  labelcount: numberRangeSchema,
  aliquotnumber: numberRangeSchema,
  startlabel: startLabelSchema,
  hasBorder: hasBorderSchema,
  skipLabels: skipLabelsSchema,
});

const cleanSkipLabels = input => {
 	
  return input.replace(/[ \t\f\v\r]+/g, '')  // Remove all whitespace except newlines
  			.replace(/^\n+|\n+$/g, '') // Remove newlines from the start and end of the string
  			.replace(/\n+/g, '\n'); // Replace consecutive newlines with a single newline

};

const validateSkipLabels = cleanedInput => {
  // ensure input matches valid pattern
  const pattern = /^(\d+:(\w\d+(-\w\d+)?)(,\w\d+(-\w\d+)?)*)?(\n\d+:(\w\d+(-\w\d+)?)(,\w\d+(-\w\d+)?)*)*$/;
  return pattern.test(cleanedInput) ? '' : 'Check skip labels format';
}


export { cleanSkipLabels, validateSkipLabels };