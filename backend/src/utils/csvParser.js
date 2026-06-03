const fs  = require('fs');
const csv = require('csv-parser');

/**
 * Parse a CSV file from disk into an array of row objects.
 * Deletes the temp file after reading.
 * @param {string} filePath - Absolute path to the CSV file
 * @param {{ mapHeaders?: function }} [options]
 * @returns {Promise<object[]>}
 */
function parseCSVFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: options.mapHeaders || (({ header }) => header.trim().replace(/﻿/, '')),
      }))
      .on('data', row => rows.push(row))
      .on('end', () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        resolve(rows);
      })
      .on('error', err => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(err);
      });
  });
}

module.exports = { parseCSVFile };
