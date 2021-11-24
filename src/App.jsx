import { Component } from 'react';
import { WrapperChart } from './components/WrapperChart';
import { BoundsChart } from './components/BoundsChart';
import React from 'react';
import * as d3 from 'd3';
import './App.css';
import 'tippy.js/dist/tippy.css';

class App extends Component {
  state = {
    isFechting: true,
    allData: [],
    temperatures: [],
    selectYear: 2020,
    temperatureType: 'mean_temperature',
  };

  componentDidMount() {
    this.loadDataSet();
  }

  loadDataSet = async () => {
    const dataset = await d3.csv('./data/floripa_temperatures_by_day_2004_to_2020.csv');
    const allData = dataset.map((row) => {
      return {
        mean_temperature: parseFloat(row.mean_temperature).toFixed(2),
        max_temperature: parseFloat(row.max_temperature).toFixed(2),
        min_temperature: parseFloat(row.min_temperature).toFixed(2),
        date: new Date(row.date),
      };
    });
    const temperatures = allData.filter((d) => d.date.getFullYear() === this.state.selectYear);
    this.setState({
      allData: allData,
      temperatures: temperatures,
      isFechting: false,
    });
  };

  handleYearChoice = (event) => {
    const year = Number(event.target.value);
    this.setState({
      selectYear: year,
      temperatures: this.state.allData.filter((d) => d.date.getFullYear() === year),
    });
  };

  handleTemperatureTypeChoice = (event) => {
    const temperatureType = event.target.value;
    this.setState({ temperatureType: temperatureType });
  };

  render() {
    const { selectYear, temperatures, isFechting } = this.state;
    let dimensions = {
      width: window.innerWidth * 0.9,
      height: 300,
      margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
      },
    };

    const years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'].sort(
      (a, b) => b - a,
    );

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;

    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const styles = {
      transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`,
    };

    const xAccessor = (d) => d.date;

    const yScale = d3
      .scaleLinear()
      .domain([0, 50]) // min and max values of temperatures
      .range([dimensions.boundedHeight, 0]); // max and min values of the axis

    const xScale = d3.scaleTime().domain(d3.extent(temperatures, xAccessor)).range([0, dimensions.boundedWidth]);

    return isFechting ? (
      <p>Loading...</p>
    ) : (
      <>
        <div className="chartContainer">
          <div className="choicesContainer">
            {[
              ['Máxima', 'max_temperature'],
              ['Mínima', 'min_temperature'],
              ['Média', 'mean_temperature'],
            ].map((lbl) => (
              <label key={lbl[0] + '-label'}>
                <input
                  type="radio"
                  name="choice-temperature-type"
                  value={lbl[1]}
                  onChange={this.handleTemperatureTypeChoice}
                  checked={lbl[1] === this.state.temperatureType}
                />
                {lbl[0]}
              </label>
            ))}
            <select name="Years" className="selectorContainer" onChange={this.handleYearChoice}>
              {years.map((year) => (
                <option key={'option-' + year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <svg width={dimensions.width} height={dimensions.height}>
            <g style={styles}>
              {/*The wrapper contains the entire chart: the data elements, the axes, the labels, etc.*/}
              <WrapperChart selectYear={selectYear} xScale={xScale} yScale={yScale} dimensions={dimensions} />

              <BoundsChart
                temperatures={temperatures}
                xScale={xScale}
                yScale={yScale}
                temperatureType={this.state.temperatureType}
                dimensions={dimensions}
              />
            </g>
          </svg>
        </div>
      </>
    );
  }
}

export default App;
