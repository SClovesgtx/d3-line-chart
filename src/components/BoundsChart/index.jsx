import * as d3 from 'd3'
import Tippy from '@tippyjs/react';
import './styles.css'
import 'tippy.js/dist/tippy.css';

export const BoundsChart = (props) => {
    const { temperatures, xScale, yScale } = props;

    const yAccessor = d => d.temperature

    const [ minTemperature, maxTemperature ] = d3.extent(temperatures, yAccessor)

    const linePathGenerator = (temperatures) => {
        let path = `M ${xScale(temperatures[0].date)} ${yScale(temperatures[0].temperature)}`
        for (let i = 1; i < temperatures.length; i++) {
          let row = temperatures[i]
          path += ` L ${xScale(row.date)} ${yScale(row.temperature)}`
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
                stroke="#af9358"
                strokeWidth="2"
            >

            </path>
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
        </>
    )

};