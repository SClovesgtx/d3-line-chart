import { Component } from 'react';
import { TemperatureTypeChoice } from './components/TemperatureTypeChoice';
import { YearChoice } from './components/YearChoice';
import { LineChart } from './components/LineChart';
import React from 'react';
import * as d3 from 'd3';
import './App.css';
import 'tippy.js/dist/tippy.css';

class App extends Component {
  state = {
    isFechting: true,
    allData: [],
    temperaturesYear1: [],
    temperaturesYear2: [],
    selectYear1: 2020,
    selectYear2: 2010,
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
    const temperatures1 = allData.filter((d) => d.date.getFullYear() === this.state.selectYear1);
    const temperatures2 = allData.filter((d) => d.date.getFullYear() === this.state.selectYear2);
    this.setState({
      allData: allData,
      temperaturesYear1: temperatures1,
      temperaturesYear2: temperatures2,
      isFechting: false,
    });
  };

  handleYearChoice1 = (event) => {
    const year = Number(event.target.value);
    this.setState({
      selectYear1: year,
      temperaturesYear1: this.state.allData.filter((d) => d.date.getFullYear() === year),
    });
  };

  handleYearChoice2 = (event) => {
    const year = Number(event.target.value);
    this.setState({
      selectYear2: year,
      temperaturesYear2: this.state.allData.filter((d) => d.date.getFullYear() === year),
    });
  };

  handleTemperatureTypeChoice = (event) => {
    const temperatureType = event.target.value;
    this.setState({ temperatureType: temperatureType });
  };

  render() {
    const { temperatureType, selectYear1, selectYear2, temperaturesYear1, temperaturesYear2, isFechting } = this.state;
    let dimensions = {
      width: window.innerWidth * 0.9,
      height: 400,
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

    const yScale = d3
      .scaleLinear()
      .domain([0, 50]) // min and max values of temperatures
      .range([dimensions.boundedHeight, 0]); // max and min values of the axis

    return isFechting ? (
      <p>Loading...</p>
    ) : (
      <>
        <div className="chartContainer" key="chart1">
          <div className="choicesContainer">
            <YearChoice handleYearChoice={this.handleYearChoice1} years={years} defaultYear="2020" />
            <TemperatureTypeChoice
              temperatureType={temperatureType}
              handleTemperatureTypeChoice={this.handleTemperatureTypeChoice}
            />
          </div>
          <LineChart
            dimensions={dimensions}
            selectYear={selectYear1}
            temperatureType={temperatureType}
            temperatures={temperaturesYear1}
            yScale={yScale}
          />
          <div className="choicesContainer">
            <YearChoice handleYearChoice={this.handleYearChoice2} years={years} defaultYear="2010" />
          </div>
          <LineChart
            dimensions={dimensions}
            selectYear={selectYear2}
            temperatureType={temperatureType}
            temperatures={temperaturesYear2}
            yScale={yScale}
          />
        </div>
      </>
    );
  }
}

export default App;
