import PropTypes from 'prop-types';

export const YearChoice = ({ handleYearChoice, years, defaultYear }) => {
  return (
    <select name="Years" className="selectorContainer" onChange={handleYearChoice} defaultValue={defaultYear}>
      {years.map((year) => (
        <option key={'option1-' + year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

YearChoice.propTypes = {
  handleYearChoice: PropTypes.func.isRequired,
  years: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultYear: PropTypes.string.isRequired,
};
