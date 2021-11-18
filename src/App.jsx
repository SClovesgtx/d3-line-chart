import { Component } from 'react';
import React from 'react';
import * as d3 from 'd3';
import { ticks } from 'd3';

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

    console.log(temperatures)
    
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

    console.log("Temperatura: " + yAccessor(temperatures[0]))

    const yScale = d3.scaleLinear()
                    .domain([40, 0]) // max and min values of temperatures
                    .range([dimensions.boundedHeight, 0]) // max and min values of the axis

    console.log("Temperatura Convertida para px: " + yScale(yAccessor(temperatures[0])))

    const xScale = d3.scaleTime()
      .domain(d3.extent(temperatures, xAccessor))
      .range([0, dimensions.boundedWidth])

      console.log("Data: " + xAccessor(temperatures[0]))
      console.log("Data Convertida para px: " + xScale(xAccessor(temperatures[0])))
    // const lineGenerator = d3.line()
    //                         .x(d => xScale(xAccessor(d)))
    //                         .y(d => yScale(yAccessor(d)))
    
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
            new_ticks.push({"text": reversedTicks[i], "scaledValue": yScale(ticks[i])})
        }
        return new_ticks
    }
    // console.log(yScale.ticks())
    // console.log(yScale.ticks().sort((a, b) => a - b))
    // yAxisTicksGenerator()
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
                    <line 
                      key={ tick.text + 1 }
                      
                      y2={ -10 } 
                    >
                    </line>

                    <text key={ tick.text } x={ -25 } y={ tick.scaledValue }> { tick.text } </text>
                  </>
              )
            }

        </g>
        
      </svg>
    )
  }
}

export default App;
