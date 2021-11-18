import { Component } from 'react';
import React from 'react';
import Tippy from '@tippyjs/react';
import * as d3 from 'd3';
import './App.css';
import 'tippy.js/dist/tippy.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  state = {
    temperatures: [{"id": "2020/01/01", "date": new Date(2020, 1, 1), "temperature": 20}]
  }

  componentDidMount() {
    this.loadDataSet()
  }

  

  loadDataSet = async () => {
    const dataset = await d3.csv("./2020_floripa_temperature_by_day.csv")
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
 
    const yAccessor = d => d.temperature
    const xAccessor = d => d.date

    const yScale = d3.scaleLinear()
                    .domain([0, 40]) // min and max values of temperatures
                    .range([dimensions.boundedHeight, 0]) // max and min values of the axis

    const xScale = d3.scaleTime()
      .domain(d3.extent(temperatures, xAccessor))
      .range([0, dimensions.boundedWidth])
    
    const pathGenerator = (temperatures) => {
      let path = `M ${xScale(temperatures[0].date)} ${yScale(temperatures[0].temperature)}`
      for (let i = 1; i < temperatures.length; i++) {
        let row = temperatures[i]
        path += ` L ${xScale(row.date)} ${yScale(row.temperature)}`
      }
      return path
    }
    const yAxisTicksGenerator = () => {
        const ticks = yScale.ticks()
        const reversedTicks = [...ticks].sort((a, b) => a - b)
        // console.log("ticks: ", ticks)
        // console.log("reverse ticks: ", reversedTicks)
        let new_ticks = []
        for (let i in ticks) {
            new_ticks.push({"text": reversedTicks[i].toString(), "scaledValue": yScale(ticks[i].toString())})
        }
        return new_ticks
    }

    const xAxisTicksGenerator = () => {
      const months = ["2020", "Fevereiro", "Março", 
                      "Abril", "Maio", "Junho", "Julho", 
                      "Agosto", "Setembro", "Outubro", 
                      "Novembro", "Dezembro"];
      const ticks = xScale.ticks().map(d => {
                                          return {"month": months[d.getMonth()], 
                                                  "scaledValue": xScale(d)}
                                       })
      return ticks
    }

    const dateConvertStringFormat = (date) => {
      
      const mnth = ("0" + (date.getMonth() + 1)).slice(-2)
      const day = ("0" + date.getDate()).slice(-2)
      return [date.getFullYear(), mnth, day].join("-")
    }

    const [ minTemperature, maxTemperature ] = d3.extent(temperatures, yAccessor)
    return (
      <svg width={dimensions.width} height={dimensions.height}>

        <g style={ styles }>
           {/* Desenhando a linha que representa as temperaturas*/}
           { 
              <path 
                d={ pathGenerator(temperatures) } 
                fill="none"
                stroke="#af9358"
                strokeWidth="2"
              >

              </path> 
            } 
            {
              temperatures.map(d => {

                if (d.temperature === maxTemperature || d.temperature === minTemperature){
                  return (
                        <Tippy content={`Temperatura: ${d.temperature} °C Data: ${dateConvertStringFormat(d.date)}`}>
                          <circle
                            cx={ xScale(d.date) }
                            cy={ yScale(d.temperature) }
                            r="3"
                            fill={d.temperature === maxTemperature ? "#de5454": "#5e9de6"}
                          />
                        </Tippy>
                  )
                }

              })
            }
            {
              <text
                x={ -35 } 
                y={ dimensions.boundedHeight/2 }
                style={{
                  fontSize: "12px",
                  fontFamily: 'Droid serif',
                  fontStyle: "italic",
                  textAnchor: "middle"
                }}
              >°C</text>
            } 
            {
              <text
                x={ dimensions.boundedWidth/2 } 
                y={ 10 }
                style={{
                  textAnchor: "middle",
                  fontSize: "16px",
                  fontFamily: 'Playfair Display',
                }}
              >Temperaturas de Florianópolis em 2020</text>
            }
            {/* Desenhando a linha do eixo Y */}
            { 
              <path 
                d={ `M 0 0 L 0 ${dimensions.boundedHeight}` } 
                stroke="black"
                fill="none"
                strokeWidth="1"
              >

              </path> 
            }   
            
            {
              yAxisTicksGenerator().map(tick => 
                <>
                  <text key={ tick.text + "-text" } 
                        x={ -15 } 
                        y={ tick.scaledValue + 3 }
                        style={{
                          fontSize: "10px",
                          textAnchor: "middle"
                        }}> { tick.text } </text>

                  <line 
                    key={ tick.text + "-line" }
                    x1={ 0 }
                    y1={ tick.scaledValue }
                    x2={ -5 }
                    y2={ tick.scaledValue }
                    stroke='black'
                  />
                </>
              )
            }
            {/* Desenhando a linha do eixo X */}
            { 
              <path 
                d={ `M 0 ${dimensions.boundedHeight} H ${dimensions.boundedHeight} ${dimensions.boundedWidth}` }
                stroke="black"
                fill="none"
                strokeWidth="1"
              >

              </path> 
            }   
            {
              xAxisTicksGenerator().map(tick => 
                <>
                  <text key={ tick.month + "-text" } 
                        x={ tick.scaledValue } 
                        y={ dimensions.boundedHeight + 17 }
                        style={{
                          fontSize: "10px",
                          textAnchor: "middle"
                        }}> { tick.month } </text>

                  <line 
                    key={ tick.month + "-line" }
                    x1={ tick.scaledValue }
                    y1={ dimensions.boundedHeight }
                    x2={ tick.scaledValue }
                    y2={ dimensions.boundedHeight + 5 }
                    stroke='black'
                  />
                </>
              )
            }

        </g>
        
      </svg>
    )
  }
}

export default App;
