import React from 'react';
import './ResultsArea.css';

const ResultsArea = ({ results, error }) => {
  return (
    <div className="ResultsArea">
      <div className="QueryResultsDisplay">
        {error ? error : (
          <div className="TableContainer">
            {(results.length > 0) && (
              <table>
                <thead>
                  <tr>
                    <th className="IndexColumn" />
                    {Object.keys(results[0]).filter((item) =>
                      !item.toString().toLowerCase().includes("polygon")
                    ).map((keyName, index) => (
                      <th key={index}>{keyName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr>
                      <td className="IndexColumn"><div>{(results.indexOf(result) + 1).toString()}</div></td>
                      {Object.keys(result).filter((item) =>
                        !item.toString().toLowerCase().includes("polygon")
                      ).map((keyName, index) => (
                        <>
                          {Object.keys(result[keyName]).map((keyName2, index) => {
                            if (keyName2 === 'value') {
                              let valueString = result[keyName][keyName2].toString();

                              if (valueString.includes('http')) {
                                valueString = valueString.split('#').pop();
                              }

                              return <td><div>{valueString}</div></td>
                            }
                            return null;
                          })}
                        </>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsArea;
