import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import './styles.css';
import 'tippy.js/dist/tippy.css';

export const BoundsChart = ({ temperatures, xScale, yScale, temperatureType = 'mean_temperature' }) => {
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
  return (
    <>
      <path d={linePathGenerator(temperatures)} fill="none" stroke={strokeColor} strokeWidth="2"></path>
      {minAndMaxTemperatures.map((d) => {
        return (
          <Tippy
            key={`${d[1]}-tooltip`}
            content={`Temperatura: ${d[0][temperatureType]} Data: ${dateConvertStringFormat(d[0].date)}`}
          >
            <circle
              cx={xScale(d[0].date)}
              cy={yScale(d[0][temperatureType])}
              r="3"
              fill={d[1] === 'max' ? '#de5454' : '#1089c9'}
            />
          </Tippy>
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
};
