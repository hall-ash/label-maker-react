// Function to get the number of labels ahead of the start
const getNumLabelsAheadOfStart = (label, rows, cols) => {
  const colNum = letter => letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
  const endRow = parseInt(label.slice(1), 10);
  const endCol = colNum(label[0]);

  const numLabelsAheadOfStart = (endRow - 1) * cols + endCol - 1;

  return numLabelsAheadOfStart;
}

// Function to process skip labels input
const processSkipLabelsInput = inputText => {
  const labelsSkippedByPg = [];
  const pages = inputText.trim().split('\n');
  for (const pg of pages) {
    let [pgNo, skips] = pg.split(':');
    pgNo = parseInt(pgNo.trim(), 10);
    skips = skips.trim().split(', ').map(skip => skip.replace(' ', ''));
    labelsSkippedByPg.push([pgNo, skips]);
  }
  return labelsSkippedByPg;
}

// Function to convert skip range to list
const convertSkipRangeToList = (cellRanges, maxCols) => {
  const colNum = letter => letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;

  const skips = new Set();

  for (const cellRange of cellRanges) {
    const singleCell = !cellRange.includes('-');
    const [firstCell, lastCell = firstCell] = cellRange.split('-');
    const startCol = colNum(firstCell[0]);
    const endCol = colNum(lastCell[0]);
    const startRow = parseInt(firstCell.slice(1), 10);
    const endRow = parseInt(lastCell.slice(1), 10);

    if (singleCell) {
      skips.add(`${startRow},${startCol}`);
    } else {
      if (startCol === endCol) {
        for (let row = startRow; row <= endRow; row++) {
          skips.add(`${row},${startCol}`);
        }
      } else {
        for (let col = startCol; col <= maxCols; col++) {
          skips.add(`${startRow},${col}`);
        }
        for (let row = startRow + 1; row < endRow; row++) {
          for (let col = 1; col <= maxCols; col++) {
            skips.add(`${row},${col}`);
          }
        }
        for (let col = 1; col <= endCol; col++) {
          skips.add(`${endRow},${col}`);
        }
      }
    }
  }

  return Array.from(skips).map(skip => skip.split(',').map(Number));
}

// Function to get skips dictionary
const getSkipsDict = (skipInput, cols) => {
  const processedInput = processSkipLabelsInput(skipInput);
  const skipsDict = {};
  for (const [pgNo, skipRange] of processedInput) {
    skipsDict[pgNo] = convertSkipRangeToList(skipRange, cols);
  }
  return skipsDict;
}

// Function to get new start position and skips dictionary
const getNewStartPositionAndSkipsDict = (labels, labelType, startLabel, skipsInput) => {
  const dims = {
    'LCRY-1700': [17, 5]
  };
  const [rows, cols] = dims[labelType];
  const labelsPerPg = rows * cols;

  const numLabelsToPrint = labels.reduce((sum, label) => sum + label.aliquots.length, 0);

  const numLabelsAheadOfStart = startLabel ? getNumLabelsAheadOfStart(startLabel, rows, cols) : 0;

  const skipsDict = getSkipsDict(skipsInput, cols);

  const totalLabelsSkipped = Object.values(skipsDict).reduce((sum, skips) => sum + skips.length, 0) + numLabelsAheadOfStart;

  const total = numLabelsToPrint + totalLabelsSkipped;

  const numLabelsLastPg = total % labelsPerPg;

  const startCol = (numLabelsLastPg % cols) + 1;
  const startRow = Math.floor(numLabelsLastPg / cols) + 1;

  return {
    newStartPos: String.fromCharCode(startCol + 64) + startRow,
    skipsDict
  };
}

export default getNewStartPositionAndSkipsDict;