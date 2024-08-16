// const helpCalc = (totalMass, amounts, result) => {

//   const totalSum = amounts.reduce((a, b) => a + b, 0);
//   const factor = Math.floor(totalMass / totalSum);
//   let remaining_mgs = totalMass % totalSum;

//   // Update the result array in place
//   for (let i = 0; i < amounts.length; i++) {
//     result[i] += factor;
//   }

//   let i = 0;
//   while (remaining_mgs >= amounts[i] && i < amounts.length) {
  
//     result[i] += 1;
//     remaining_mgs -= amounts[i];
    
//     i++;
//   }

//   return remaining_mgs;
// };

// const calcResult = (concentration, volume, amounts) => {
//   amounts.sort((a, b) => a - b);

//   const result = Array(amounts.length).fill(0);
//   let remaining_mgs = concentration * volume;

//   // Ensure the loop terminates by handling cases when no amounts are left that can be used
//   while (remaining_mgs > 0) {
//     const newAmounts = amounts.filter(amount => amount <= remaining_mgs);

//     // If no amounts are left that can be used, break the loop
//     if (newAmounts.length === 0) break;

//     // Update remaining_mgs based on the sum of newAmounts
//     remaining_mgs = helpCalc(remaining_mgs, newAmounts, result);
//   }

//   return { result, remaining_mgs };
// };


// const calculateAliquots = (concentration, volume, amounts, concentrationUnit="mg/mL", volumeUnit="mL", aliquotMassUnit="mg") => {

//   const { result, remaining_mgs } = calcResult(concentration, volume, amounts);
//   const aliquots = [];

//   const doRounding = (num) => num > 1 ? Math.round(num * 10) / 10 : Math.round(num * 1000) / 1000;
//   const doFormatting = (num) => num > 1 ? num.toFixed(1) : (num * 1000).toFixed(0);

//   for (let i = 0; i < amounts.length; i++) {
//     const mass = amounts[i];
//     const roundedVol = doRounding(mass / concentration);

//     const volume = doFormatting(roundedVol);
//     const volumeUnit = roundedVol > 1 ? 'mL' : 'µL';
//     const number = result[i];

//     aliquots.push({
//       aliquottext: `${mass}${aliquotMassUnit}, ${volume}${volumeUnit}`,
//       number,
//     })
//   }

//   if (remaining_mgs > 0) {
//     const rounded_remaining_mgs = doRounding(remaining_mgs);
//     const remaining_mgs_mass_unit = rounded_remaining_mgs > 1 ? 'mg' : 'µg';
//     const roundedVol = doRounding(remaining_mgs / concentration);
//     const remVolumeUnit = roundedVol > 1 ? 'mL' : 'µL';
//     aliquots.push({
//       aliquottext: `${rounded_remaining_mgs}${remaining_mgs_mass_unit}, ${doFormatting(roundedVol)}${remVolumeUnit}`,
//       number: 1,
//     });
//   }

//   return aliquots;
// };


const calculate = (concentration, volume, amounts) => {
  amounts.sort((a, b) => a - b);
  const totalMass = concentration * volume;
  const totalSum = amounts.reduce((a, b) => a + b, 0);
  const factor = Math.floor(totalMass / totalSum);
  let remaining_mgs = totalMass % totalSum;

  const aliquots = [];
  const result = Array(amounts.length).fill(factor);

  let i = 0;
  while (remaining_mgs >= amounts[0]) {
    if (remaining_mgs >= amounts[i]) {
      result[i] += 1;
      remaining_mgs -= amounts[i];
    }
   
    i = (i + 1) % amounts.length;
  }

  return result;
}


const calculateAliquotFrequency = (concentration, volume, amounts) => {
  amounts.sort((a, b) => a - b);
  const totalMass = concentration * volume;
  const totalSum = amounts.reduce((a, b) => a + b, 0);
  const factor = Math.floor(totalMass / totalSum);
  let remaining_mgs = totalMass % totalSum;

  const aliquots = [];
  const frequency = Array(amounts.length).fill(factor);

  // loop through the array in reverse (favors larger )
  let i = amounts.length - 1;
  while (remaining_mgs >= amounts[0]) {
    if (remaining_mgs >= amounts[i]) {
      frequency[i] += 1;
      remaining_mgs -= amounts[i];
    }
   
    i = (i - 1) % amounts.length;
  }

  return frequency;
}



const calculateAliquots = (concentration, volume, amounts, concentrationUnit="mg/mL", volumeUnit="mL", aliquotMassUnit="mg") => {


    amounts.sort((a, b) => a - b);
    const totalMass = concentration * volume;
    const totalSum = amounts.reduce((a, b) => a + b, 0);
    const factor = Math.floor(totalMass / totalSum);
    let remaining_mgs = totalMass % totalSum;

    const aliquots = [];
    const frequency = calculateAliquotFrequency(concentration, volume, amounts);


    const doRounding = (num) => num > 1 ? Math.round(num * 10) / 10 : Math.round(num * 1000) / 1000;
    const doFormatting = (num) => num > 1 ? num.toFixed(1) : (num * 1000).toFixed(0);

    for (let i = 0; i < amounts.length; i++) {
      const mass = amounts[i];
      const roundedVol = doRounding(mass / concentration);

      const volume = doFormatting(roundedVol);
      const volumeUnit = roundedVol > 1 ? 'mL' : 'µL';
      const number = frequency[i];

      aliquots.push({
        aliquottext: `${mass}${aliquotMassUnit}, ${volume}${volumeUnit}`,
        number,
      })
    }

    if (remaining_mgs > 0) {
      const rounded_remaining_mgs = doRounding(remaining_mgs);
      const remaining_mgs_mass_unit = rounded_remaining_mgs > 1 ? 'mg' : 'µg';
      const roundedVol = doRounding(remaining_mgs / concentration);
      const remVolumeUnit = roundedVol > 1 ? 'mL' : 'µL';
      aliquots.push({
        aliquottext: `${rounded_remaining_mgs}${remaining_mgs_mass_unit}, ${doFormatting(roundedVol)}${remVolumeUnit}`,
        number: 1,
      });
    }

    return aliquots;
  };

export default calculateAliquots;