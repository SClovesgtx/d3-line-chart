import { WrapperChart } from '../WrapperChart'
import { BoundsChart } from '../BoundsChart'

const LineChart2 = (props) => {
    const { selectYear, temperatures, xScale, yScale, dimensions, columns } = props;
    console.log("Ano selecionado 2:", selectYear)
    return (
        <>
            {/*The wrapper contains the entire chart: the data elements, the axes, the labels, etc.*/}
            <WrapperChart 
                selectYear={ selectYear } 
                xScale={ xScale } 
                yScale={ yScale } 
                dimensions={ dimensions }/>
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