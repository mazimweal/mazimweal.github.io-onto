import React from 'react';
import LeafletMap from '../Map';
import FormDisplay from '../FormDisplay';
import ResultsArea from '../ResultsArea';
import Matrix from '../Matrix';
import "./App.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      polygon: [],
      points: [],
      results: [],
      resultsError: '',
      geojson: null,
      showTable: false,
      showMatrix: false,
      matrixResults: []
    };

    this.getPolygons = this.getPolygons.bind(this);
    this.getPoints = this.getPoints.bind(this);
    this.getResults = this.getResults.bind(this);
    this.getGeojsonObject = this.getGeojsonObject.bind(this);
    this.toggleShowTable = this.toggleShowTable.bind(this);
    this.getMatrixData = this.getMatrixData.bind(this);
    this.getDamageNum = this.getDamageNum.bind(this);
    this.getHazardNum = this.getHazardNum.bind(this);
  }

  getPolygons(polygons) {
    this.setState({
      polygon: polygons
    });
  }

  getPoints(points) {
    this.setState({
      points: points
    });
  }


  toggleShowTable() {
    this.setState({
      showTable: !this.state.showTable
    });
  }

  getResults(error, queryResults) {
    this.setState({
      resultsError: error,
      results: queryResults
    })
  }

  getGeojsonObject(data) {
    this.setState({
      geojson: data
    })
  }

  getDamageNum(stringVal) {
    let numValue = 0;
    stringVal = stringVal.toLowerCase().trim();

    if (stringVal === 'verylow') {
      numValue = 0.5;
    } else if (stringVal === 'low') {
      numValue = 1.5;
    } else if (stringVal === 'medium') {
      numValue = 2.5;
    } else if (stringVal === 'high') {
      numValue = 3.5;
    }

    return numValue;
  }

  getHazardNum(stringVal) {
    let numValue = 0;
    stringVal = stringVal.toLowerCase().trim();

    if (stringVal === 'wetseason') {
      numValue = 0.5;
    } else if (stringVal === 'normal') {
      numValue = 1.5;
    } else if (stringVal === 'dryspell') {
      numValue = 2.5;
    } else if (stringVal === 'drought') {
      numValue = 3.5;
    }

    return numValue;
  }

  getMatrixData() {
    let extractedMatrixResults = [];

    this.setState({
      showMatrix: !this.state.showMatrix
    });
    
    this.state.results.forEach(resultObject => {
      let place = resultObject["?place"]["value"].toString().split('HazardousEvent#').pop();
      let damagePotential = resultObject["?exlPar"]["value"].toString().split('VVD#').pop();
      let hazardPotential = resultObject["?hazardous"]["value"].toString().split('HazardousEvent#').pop();
      // hazardPotential: resultObject["?par"]["value"].toString().split('HazardousEvent#').pop(),

      let matrixObj = {
        place,
        damagePotential,
        hazardPotential,
        damageNumValue: this.getDamageNum(damagePotential),
        hazardNumValue: this.getHazardNum(hazardPotential)
      };

      extractedMatrixResults.push(matrixObj);      
    });

    // console.log(extractedMatrixResults);

    this.setState({ matrixResults: extractedMatrixResults });
  }

  render() {
    return (
      <div className="full-height-grow AppContainer">
        <div className="Header">
          <div className="FormHeading">
            <div className="Heading">early warning system</div>
            <div className="SubHeading">querying multi-agency data sources</div>
            {/* <hr /> */}
          </div>
        </div>
        <div className="AppRowOne">
          <FormDisplay
            hasPolygons={this.getPolygons}
            hasPoints={this.getPoints}
            hasResults={this.getResults}
            hasMatrix={this.getMatrixData}
            hasChoropleth={this.getGeojsonObject}
            toggleShowTable={this.toggleShowTable}
            showTable={this.state.showTable}
          />
          <LeafletMap
            polygonsToPlot={this.state.polygon}
            pointsToPlot={this.state.points}
            geojson={this.state.geojson}
          />
        </div>
        {(this.state.results.length > 0 && this.state.showTable) && (
          <div className="AppRowTwo">
            <ResultsArea
              results={this.state.results}
              error={this.state.resultsError}
            />
          </div>
        )}
        {/* {(this.state.results.length > 0) && ( */}
        {(true) && (
          <Matrix
            matrixData={this.state.matrixResults}
          />
        )}
      </div>
    );
  }
}

export default App;
