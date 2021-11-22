import { Component } from 'react';
import {BoundsChart} from './components/BoundsChart';
import {WrapperChart} from './components/WrapperChart';
import React from 'react';
import * as d3 from 'd3';
import './App.css';
import 'tippy.js/dist/tippy.css';

class App extends Component {
  state = {
    temperatures: [{"id": "2020/01/01", "date": new Date(2020, 1, 1), "temperature": 20}]
  }

  componentDidMount() {
    this.loadDataSet()
  }



  loadDataSet = async () => {
    const dataset = await d3.csv("./data/2020_floripa_temperature_by_day.csv")
    //const dates = dataset.map(row => new Date(row.data))
    const temperatures = dataset.map( (row) => {
                                          return {"temperature": parseFloat(row.temperatura).toFixed(2),
                                                  "date": new Date(row.data),
                                                  "id": row.data}
                                       }
                                )
    this.setState({
      temperatures: temperatures
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
                    .domain([0, 40]) // min and max values of temperatures
                    .range([dimensions.boundedHeight, 0]) // max and min values of the axis

    const xScale = d3.scaleTime()
      .domain(d3.extent(temperatures, xAccessor))
      .range([0, dimensions.boundedWidth])

    return (
      <svg width={dimensions.width} height={dimensions.height}>

        <g style={ styles }>

          {/*The wrapper contains the entire chart: the data elements, the axes, the labels, etc.*/}
          <WrapperChart  xScale={ xScale } yScale={ yScale } dimensions={ dimensions }/>

           {/* The bounds contain all of our data elements: in this case, our line.*/}
          <BoundsChart temperatures={ temperatures } xScale={ xScale } yScale={ yScale }/>

        </g>

      </svg>
    )
  }
}

export default App;
