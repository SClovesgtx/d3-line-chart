import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';

export const WrapperChart = ({ temperatures, temperatureType, selectYear, yScale, dimensions }) => {
  const legend =
    temperatureType == 'mean_temperature' ? 'Médias' : temperatureType == 'max_temperature' ? 'Máximas' : 'Mínimas';
  const xAccessor = (d) => d.date;
  const xScale = d3.scaleTime().domain(d3.extent(temperatures, xAccessor)).range([0, dimensions.boundedWidth]);
  const yAxisTicksGenerator = () => {
    const ticks = yScale.ticks();
    const reversedTicks = [...ticks].sort((a, b) => a - b);
    let new_ticks = [];
    for (let i in ticks) {
      new_ticks.push({ text: reversedTicks[i].toString(), scaledValue: yScale(ticks[i].toString()) });
    }
    return new_ticks;
  };

  const xAxisTicksGenerator = () => {
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const ticks = xScale.ticks().map((d) => {
      return { month: months[d.getMonth()], scaledValue: xScale(d) };
    });
    return ticks;
  };

  return (
    <>
      {
        <text
          x={-40}
          y={dimensions.boundedHeight / 2}
          style={{
            fontSize: '15px',
            fontFamily: 'Droid serif',
            fontStyle: 'italic',
            textAnchor: 'middle',
          }}
        >
          °C
        </text>
      }
      {
        <text
          x={dimensions.boundedWidth / 2}
          y={10}
          style={{
            textAnchor: 'middle',
            fontSize: '25px',
            fontFamily: 'Playfair Display',
          }}
        >
          Temperaturas {legend} de Florianópolis em {selectYear}
        </text>
      }
      {/* Desenhando a linha do eixo Y */}
      {<path d={`M 0 0 L 0 ${dimensions.boundedHeight}`} stroke="black" fill="none" strokeWidth="1"></path>}

      {yAxisTicksGenerator().map((tick) => (
        <React.Fragment key={'y-' + tick.text}>
          <text
            x={-15}
            y={tick.scaledValue + 3}
            style={{
              fontSize: '15px',
              textAnchor: 'middle',
            }}
          >
            {tick.text}
          </text>

          <line x1={0} y1={tick.scaledValue} x2={-5} y2={tick.scaledValue} stroke="black" />
        </React.Fragment>
      ))}
      {/* Desenhando a linha do eixo X */}
      {
        <path
          d={`M 0 ${dimensions.boundedHeight} H ${dimensions.boundedHeight} ${dimensions.boundedWidth}`}
          stroke="black"
          fill="none"
          strokeWidth="1"
        ></path>
      }
      {xAxisTicksGenerator().map((tick) => (
        <React.Fragment key={'x-' + tick.month}>
          <text
            x={tick.scaledValue}
            y={dimensions.boundedHeight + 17}
            style={{
              fontSize: '15px',
              textAnchor: 'middle',
            }}
          >
            {tick.month}
          </text>

          <line
            x1={tick.scaledValue}
            y1={dimensions.boundedHeight}
            x2={tick.scaledValue}
            y2={dimensions.boundedHeight + 5}
            stroke="black"
          />
        </React.Fragment>
      ))}
    </>
  );
};

WrapperChart.propTypes = {
  temperatureType: PropTypes.string.isRequired,
  temperatures: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.date,
      mean_temperature: PropTypes.string,
      min_temperature: PropTypes.string,
      max_temperature: PropTypes.string,
    }),
  ).isRequired,
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    boundedHeight: PropTypes.number,
    boundedWidth: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
  }).isRequired,
  yScale: PropTypes.func.isRequired,
  selectYear: PropTypes.number,
};
