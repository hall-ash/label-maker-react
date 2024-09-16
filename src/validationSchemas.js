// import { z } from 'zod';

// const positiveNumericSchema = z.number({
//   required_error: "Enter a value",
//   invalid_type_error: "The input must be a number",
// }).positive('The value must be positive').finite().safe();

// const calculateAliquotsModalSchema = z.object({
//   'concentration': positiveNumericSchema,
//   'volume': positiveNumericSchema,
//   'amounts': z.string().min(1, "Enter one or more values"),
// });

// export { calculateAliquotsModalSchema };