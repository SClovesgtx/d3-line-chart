import * as d3 from 'd3'
import Tippy from '@tippyjs/react';
import './styles.css'
import 'tippy.js/dist/tippy.css';

export const BoundsChart = (props) => {
    const { temperatures, xScale, yScale, temperatureKind } = props;

    const strokeColor = temperatureKind === 'min_temperature' ? '#34cfeb' : 
                        temperatureKind === 'max_temperature' ? '#f5390a' : '#af9358';

    const yAccessor = d => d[temperatureKind]

    const [ minTemperature, maxTemperature ] = d3.extent(temperatures, yAccessor)

    const linePathGenerator = (temperatures) => {
        let path = `M ${xScale(temperatures[0].date)} ${yScale(temperatures[0][temperatureKind])}`
        for (let i = 1; i < temperatures.length; i++) {
          let row = temperatures[i]
          path += ` L ${xScale(row.date)} ${yScale(row[temperatureKind])}`
        }
        return path
      }

    const dateConvertStringFormat = (date) => {
        const mnth = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)
        return [date.getFullYear(), mnth, day].join("-")
    }

    return (
        <>
            <path 
                d={ linePathGenerator(temperatures) } 
                fill="none"
                stroke={ strokeColor }
                strokeWidth="2"
            >

            </path>
            {
                temperatures.map(d => {

                if (d[temperatureKind] === maxTemperature || d[temperatureKind] === minTemperature){
                    return (
                        <Tippy content={`Temperatura: ${d[temperatureKind]} °C Data: ${dateConvertStringFormat(d.date)}`}>
                            <circle
                            cx={ xScale(d.date) }
                            cy={ yScale(d[temperatureKind]) }
                            r="3"
                            fill={d[temperatureKind] === maxTemperature ? "#de5454": "#5e9de6"}
                            />
                        </Tippy>
                    )
                }

                })
            }
        </>
    )

};