import { Component } from 'react';
import LineChart1 from './components/LineChart1'
import LineChart2 from './components/LineChart2'
import React from 'react';
import * as d3 from 'd3';
import './App.css';
import 'tippy.js/dist/tippy.css';

class App extends Component {
  state = {
    temperatures: [{"id": "2020/01/01", "date": new Date(2020, 1, 1), "temperature": 20}],
    selectYear: 2020,
  }


  componentDidMount() {
    this.loadDataSet()
  }


  loadDataSet = async () => {
    const dataset = await d3.csv("./data/floripa_temperatures_by_day_2004_to_2020.csv")
    //const dates = dataset.map(row => new Date(row.data))
    const temperatures = dataset.map( (row) => {
                                          return {
                                            "mean_temperature": parseFloat(row.mean_temperature).toFixed(2),
                                            "max_temperature": parseFloat(row.max_temperature).toFixed(2),
                                            "min_temperature": parseFloat(row.min_temperature).toFixed(2),
                                            "date": new Date(row.date)
                                          }
                                       }
                                )
    this.setState({
      temperatures: temperatures.filter(d => d.date.getFullYear() === this.state.selectYear)
    })
  }


  render() {
    const {  temperatures  } = this.state
    let dimensions = {
      width: window.innerWidth * 0.9,
      height: 400,
      margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
      },
    }

    const years = ['2004', '2005', '2006', '2007', '2008', '2009', '2010', 
      '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'].sort((a, b) => b-a)

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right

    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    const styles = {
        transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    };

    const xAccessor = d => d.date

    const yScale = d3.scaleLinear()
                    .domain([0, 50]) // min and max values of temperatures
                    .range([dimensions.boundedHeight, 0]) // max and min values of the axis

    const xScale = d3.scaleTime()
      .domain(d3.extent(temperatures, xAccessor))
      .range([0, dimensions.boundedWidth])

    return (
      <>
      <div className="chartContainer">
        <svg width={dimensions.width} height={dimensions.height}>

          <g style={ styles }>

            <LineChart1 
              temperatures={ temperatures }  
              xScale={ xScale } 
              yScale={ yScale } 
              dimensions={ dimensions }
            />

          </g>

        </svg>
      </div>

      <div className="chartContainer">
        <div className="choicesContainer">
          <label>
            <input type="checkbox" />
            Max
          </label>
          <label>
            <input type="checkbox" />
            Min
          </label>
          <label>
            <input type="checkbox" />
            Avg
          </label>
          
          <select name="Years" className='selectorContainer'>
            {years.map(year => <option value={year}>{year}</option>)}
          </select>
         
        </div>
        <svg width={dimensions.width} height={dimensions.height}>

          <g style={ styles }>

            <LineChart2
              temperatures={ temperatures }  
              xScale={ xScale } 
              yScale={ yScale } 
              dimensions={ dimensions }
              columns={ ['mean_temperature', 'max_temperature', 'min_temperature'] }
            />

          </g>

        </svg>
      </div>
    </>
    )
  }
}

export default App;
