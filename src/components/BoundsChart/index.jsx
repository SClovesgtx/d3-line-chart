import PropTypes from 'prop-types';
import React from 'react';
import Tippy from '@tippyjs/react';
import './styles.css';
import 'tippy.js/dist/tippy.css';

export const BoundsChart = ({ temperatures, xScale, yScale, dimensions, temperatureType = 'mean_temperature' }) => {
  const strokeColor = '#af9358';

  const linePathGenerator = (temperatures) => {
    let path = `M ${xScale(temperatures[0].date)} ${yScale(temperatures[0][temperatureType])}`;
    for (let i = 1; i < temperatures.length; i++) {
      let row = temperatures[i];
      path += ` L ${xScale(row.date)} ${yScale(row[temperatureType])}`;
    }
    return path;
  };

  const dateConvertStringFormat = (date) => {
    const mnth = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  };

  const handleDecimalPlaces = (value) => {
    const splitedNumber = value.split('.');
    if (splitedNumber.length > 1) {
      const decimalPlaces = splitedNumber[1];
      value = decimalPlaces.length >= 2 ? value : value + '0';
    } else {
      value = splitedNumber[0] + '.00';
    }
    return value;
  };

  const findMinAndMax = (temperatures) => {
    const temperaturesValues = temperatures.map((d) => d[temperatureType]);
    let max = Math.max(...temperaturesValues).toString();
    max = handleDecimalPlaces(max);
    const indexMax = temperaturesValues.indexOf(max);
    let min = Math.min(...temperaturesValues).toString();
    min = handleDecimalPlaces(min);
    const indexMin = temperaturesValues.indexOf(min);
    return [
      [temperatures[indexMin], 'min'],
      [temperatures[indexMax], 'max'],
    ];
  };

  const minAndMaxTemperatures = findMinAndMax(temperatures);
  const description =
    temperatureType == 'mean_temperature' ? 'Médias' : temperatureType === 'max_temperature' ? 'Máximas' : 'Mínimas';
  return (
    <>
      <path d={linePathGenerator(temperatures)} fill="none" stroke={strokeColor} strokeWidth="2"></path>
      {minAndMaxTemperatures.map((d) => {
        const cx1 = xScale(d[0].date);
        const cy1 = yScale(d[0][temperatureType]);
        const invertDirectionLeft = cx1 - dimensions.margin.left < 20 ? -1 : 0.5;
        const invertDirectionBotton = dimensions.boundedHeight - cy1 < 30 ? 0.3 : 1;
        let cx2 = d[1] == 'max' ? cx1 - invertDirectionLeft * 60 : cx1 + 10;
        const cy2 = d[1] == 'max' ? cy1 - 20 : cy1 + invertDirectionBotton * 15;
        const add = d[1] == 'max' ? -3 : 9;
        const type = d[1] == 'max' ? 'Maior' : 'Menor';
        return (
          <React.Fragment key={`${d[1]}-tooltip`}>
            <path d={`M ${cx1} ${cy1} L ${cx2} ${cy2}`} stroke="black"></path>
            <text
              x={cx2}
              y={cy2 + add}
              style={{ textAnchor: 'middle', fontSize: '10px', fontFamily: 'Playfair Display' }}
            >
              {type} das {description}
            </text>
            <Tippy content={`Temperatura: ${d[0][temperatureType]} Data: ${dateConvertStringFormat(d[0].date)}`}>
              <circle cx={cx1} cy={cy1} r="3" fill={d[1] === 'max' ? '#de5454' : '#1089c9'} />
            </Tippy>
          </React.Fragment>
        );
      })}
    </>
  );
};

BoundsChart.defaultProps = {
  temperatureType: 'mean_temperature',
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
  temperatureType: PropTypes.string,
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
};
