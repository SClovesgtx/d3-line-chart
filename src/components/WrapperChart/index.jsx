export const WrapperChart = (props) =>{
    const { xScale, yScale, dimensions } = props;

    const yAxisTicksGenerator = () => {
        const ticks = yScale.ticks()
        const reversedTicks = [...ticks].sort((a, b) => a - b)
        let new_ticks = []
        for (let i in ticks) {
            new_ticks.push({"text": reversedTicks[i].toString(), "scaledValue": yScale(ticks[i].toString())})
        }
        return new_ticks
    }

    const xAxisTicksGenerator = () => {
      const months = ["2020", "Fevereiro", "Março",
                      "Abril", "Maio", "Junho", "Julho",
                      "Agosto", "Setembro", "Outubro",
                      "Novembro", "Dezembro"];
      const ticks = xScale.ticks().map(d => {
                                          return {"month": months[d.getMonth()],
                                                  "scaledValue": xScale(d)}
                                       })
      return ticks
    }

    return (
        <>
            {
              <text
                x={ -35 }
                y={ dimensions.boundedHeight/2 }
                style={{
                  fontSize: "12px",
                  fontFamily: 'Droid serif',
                  fontStyle: "italic",
                  textAnchor: "middle"
                }}
              >°C</text>
            }
            {
              <text
                x={ dimensions.boundedWidth/2 }
                y={ 10 }
                style={{
                  textAnchor: "middle",
                  fontSize: "16px",
                  fontFamily: 'Playfair Display',
                }}
              >Temperaturas de Florianópolis em 2020</text>
            }
            {/* Desenhando a linha do eixo Y */}
            {
              <path
                d={ `M 0 0 L 0 ${dimensions.boundedHeight}` }
                stroke="black"
                fill="none"
                strokeWidth="1"
              >

              </path>
            }

            {
              yAxisTicksGenerator().map(tick =>
                <>
                  <text key={ tick.text + "-text" }
                        x={ -15 }
                        y={ tick.scaledValue + 3 }
                        style={{
                          fontSize: "10px",
                          textAnchor: "middle"
                        }}> { tick.text } </text>

                  <line
                    key={ tick.text + "-line" }
                    x1={ 0 }
                    y1={ tick.scaledValue }
                    x2={ -5 }
                    y2={ tick.scaledValue }
                    stroke='black'
                  />
                </>
              )
            }
            {/* Desenhando a linha do eixo X */}
            {
              <path
                d={ `M 0 ${dimensions.boundedHeight} H ${dimensions.boundedHeight} ${dimensions.boundedWidth}` }
                stroke="black"
                fill="none"
                strokeWidth="1"
              >

              </path>
            }
            {
              xAxisTicksGenerator().map(tick =>
                <>
                  <text key={ tick.month + "-text" }
                        x={ tick.scaledValue }
                        y={ dimensions.boundedHeight + 17 }
                        style={{
                          fontSize: "10px",
                          textAnchor: "middle"
                        }}> { tick.month } </text>

                  <line
                    key={ tick.month + "-line" }
                    x1={ tick.scaledValue }
                    y1={ dimensions.boundedHeight }
                    x2={ tick.scaledValue }
                    y2={ dimensions.boundedHeight + 5 }
                    stroke='black'
                  />
                </>
              )
            }
        </>
    )
}
