import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Tippy from '@tippyjs/react';
import './styles.css';
import 'tippy.js/dist/tippy.css';

export const BoundsChart = ({ temperatures, xScale, yScale, temperatureKind = 'mean_temperature' }) => {
  const [maxToolTipExist, setMaxToolTipExist] = useState(false);

  const strokeColor =
    temperatureKind === 'min_temperature' ? '#34cfeb' : temperatureKind === 'max_temperature' ? '#f5390a' : '#af9358';

  const yAccessor = (d) => d[temperatureKind];

  const [minTemperature, maxTemperature] = d3.extent(temperatures, yAccessor);

  const linePathGenerator = (temperatures) => {
    let path = `M ${xScale(temperatures[0].date)} ${yScale(temperatures[0][temperatureKind])}`;
    for (let i = 1; i < temperatures.length; i++) {
      let row = temperatures[i];
      path += ` L ${xScale(row.date)} ${yScale(row[temperatureKind])}`;
    }
    return path;
  };

  const dateConvertStringFormat = (date) => {
    const mnth = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  };

  return (
    <>
      <path d={linePathGenerator(temperatures)} fill="none" stroke={strokeColor} strokeWidth="2"></path>
      {temperatures.map((d) => {
        if (d[temperatureKind] === maxTemperature && maxToolTipExist === false) {
          setMaxToolTipExist(true);
          return (
            <Tippy
              key={'max-tooltip-' + temperatureKind}
              content={`Temperatura: ${d[temperatureKind]} °C Data: ${dateConvertStringFormat(d.date)}`}
            >
              <circle cx={xScale(d.date)} cy={yScale(d[temperatureKind])} r="3" fill="#de5454" />
            </Tippy>
          );
        } else if (d[temperatureKind] === minTemperature) {
          return (
            <Tippy
              key={'min-tooltip-' + temperatureKind}
              content={`Temperatura: ${d[temperatureKind]} °C Data: ${dateConvertStringFormat(d.date)}`}
            >
              <circle cx={xScale(d.date)} cy={yScale(d[temperatureKind])} r="3" fill="#5e9de6" />
            </Tippy>
          );
        }
      })}
    </>
  );
};

BoundsChart.defaultProps = {
  temperatureKind: 'mean_temperature',
};

BoundsChart.propTypes = {
  temperatures: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.date,
      mean_temperature: PropTypes.string,
      min_temperature: PropTypes.string,
      max_temperature: PropTypes.string,
    }),
  ).isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  temperatureKind: PropTypes.string,
};
