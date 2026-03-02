/***
 * Author : Ivan Donyk
 * Path : ./App.js
 */

import React, { useState, useMemo } from 'react';
import { detectSums } from './utils';
import './App.css';

/***
 * Author : Ivan Donyk
 * Path : ./App.js
 * Input : string : comma-separated numbers
 * Output : array : splited number array by comma
 */
const parseInput = (raw) => {
  if (!raw.trim())
    return { numbers: null, error: 'Input is empty. Enter comma-separated numbers.' };

  const tokens = raw.split(',').map(t => t.trim()).filter(t => t !== '');

  if (tokens.length === 0)
    return { numbers: null, error: 'Input is empty. Enter comma-separated numbers.' };

  const numbers = [];
  for (const token of tokens) {
    const n = Number(token);
    if (isNaN(n))
      return { numbers: null, error: `"${token}" is not a valid number.` };
    numbers.push(n);
  }
  return { numbers, error: null };
};

export default function App() {
  const [value, setValue] = useState(''); // comma-separated numbers
  const [dirty, setDirty] = useState(false); // "dirty" state
  const { numbers, error } = useMemo(() => parseInput(value), [value]);
  const results = useMemo(() => (numbers ? detectSums(numbers) : []), [numbers]);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (!dirty) setDirty(true);
  };

  const showError = dirty && !!error;
  const showResults = !error && numbers !== null;

  return (
    <div className="App">
      <div className="App-card">
        <h1 className="App-title">Input an array of numbers</h1>

        <div className={`App-input-wrapper${showError ? ' App-input-wrapper--error' : showResults ? ' App-input-wrapper--valid' : ''}`}>
          <input
            className="App-input"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="e.g. 1, 2, 3, 4, 5"
            aria-label="Comma-separated number array"
            aria-invalid={showError}
            aria-describedby={showError ? 'input-error' : undefined}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {showError && (
          <p className="App-error" id="input-error" role="alert">
            <span className="App-error-icon">&#9888;</span> {error}
          </p>
        )}

        {showResults && (
          <div className="App-results">

            {results.length === 0 ? (
              <p className="App-no-results">No matching sums found.</p>
            ) : (
              <>
                <p className="App-match-count">
                  {results.length} match{results.length === 1 ? '' : 'es'} found
                </p>
                <div className="App-table-wrapper">
                  <table className="App-table">
                    <thead>
                      <tr>
                        <th>pA</th>
                        <th>pB</th>
                        <th>sum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(({ pA, pB, sum }, i) => (
                        <tr key={i}>
                          <td><span className="App-badge">{pA}</span></td>
                          <td><span className="App-badge">{pB}</span></td>
                          <td><span className="App-badge App-badge--sum">{sum}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
