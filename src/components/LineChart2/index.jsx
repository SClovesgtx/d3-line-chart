import { WrapperChart } from '../WrapperChart'
import { BoundsChart } from '../BoundsChart'

const LineChart2 = (props) => {
    const { temperatures, xScale, yScale, dimensions, columns } = props;
    return (
        <>
            {/*The wrapper contains the entire chart: the data elements, the axes, the labels, etc.*/}
            <WrapperChart  xScale={ xScale } yScale={ yScale } dimensions={ dimensions }/>
            {
                
                columns.map(temperatureKind => 
                    <BoundsChart 
                        temperatures={ temperatures } 
                        xScale={ xScale } 
                        yScale={ yScale }
                        temperatureKind={ temperatureKind }
                    />
                )
                
            }
        </>
    )
}

export default LineChart2