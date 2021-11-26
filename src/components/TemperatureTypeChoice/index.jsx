import PropTypes from 'prop-types';

export const TemperatureTypeChoice = ({ handleTemperatureTypeChoice, temperatureType = 'mean_temperature' }) => {
  return (
    <>
      {[
        ['Máxima', 'max_temperature'],
        ['Mínima', 'min_temperature'],
        ['Média', 'mean_temperature'],
      ].map((lbl) => (
        <label key={lbl[0] + '-label'}>
          <input
            type="radio"
            name="choice-temperature-type"
            value={lbl[1]}
            onChange={handleTemperatureTypeChoice}
            checked={lbl[1] === temperatureType}
          />
          {lbl[0]}
        </label>
      ))}
    </>
  );
};

TemperatureTypeChoice.defaultProps = {
  temperatureType: 'mean_temperature',
};

TemperatureTypeChoice.propTypes = {
  handleTemperatureTypeChoice: PropTypes.func.isRequired,
  temperatureType: PropTypes.string,
};
