import { WrapperChart } from '../WrapperChart'
import { BoundsChart } from '../BoundsChart'

const LineChart1 = (props) => {
    const { temperatures, xScale, yScale, dimensions } = props;
    return (
        <>
            {/*The wrapper contains the entire chart: the data elements, the axes, the labels, etc.*/}
            <WrapperChart  xScale={ xScale } yScale={ yScale } dimensions={ dimensions }/>

            {/* The bounds contain all of our data elements: in this case, our line.*/}
            <BoundsChart 
                temperatures={ temperatures } 
                xScale={ xScale } 
                yScale={ yScale }
                temperatureKind='mean_temperature'
            />
        </>
    )
}

export default LineChart1