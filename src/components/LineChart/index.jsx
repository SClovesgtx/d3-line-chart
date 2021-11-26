import PropTypes from 'prop-types';
import { WrapperChart } from '../WrapperChart';
import { BoundsChart } from '../BoundsChart';

export const LineChart = ({ dimensions, temperatures, temperatureType, yScale, selectYear }) => {
  const styles = {
    transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`,
  };

  return (
    <svg width={dimensions.width} height={dimensions.height}>
      <g style={styles}>
        {/*The wrapper contains the entire chart: the data elements, the axes, the labels, etc.*/}
        <WrapperChart temperatures={temperatures} selectYear={selectYear} yScale={yScale} dimensions={dimensions} />

        <BoundsChart
          temperatures={temperatures}
          yScale={yScale}
          temperatureType={temperatureType}
          dimensions={dimensions}
        />
      </g>
    </svg>
  );
};

LineChart.propTypes = {
  selectYear: PropTypes.number,
  temperatures: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.date,
      mean_temperature: PropTypes.string,
      min_temperature: PropTypes.string,
      max_temperature: PropTypes.string,
    }),
  ).isRequired,
  temperatureType: PropTypes.string.isRequired,
  yScale: PropTypes.func.isRequired,
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
