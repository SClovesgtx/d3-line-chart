## Origem dos Dados

Histórico da TEMPERATURA DO AR - BULBO SECO, HORARIA (°C) na cidade de Florianópolis no ano de 2020, presente
na planilha csv disponível no site do [Instituto Nacional de Meteorologia](https://portal.inmet.gov.br/dadoshistoricos).

Clique [aqui](https://portal.inmet.gov.br/uploads/dadoshistoricos/2020.zip) para fazer download, depois procure pelo csv INMET_S_SC_A806_FLORIANOPOLIS_01-01-2020_A_31-12-2020.

Removi todas as outras colunas, deixando apenas as colunas Data e TEMPERATURA DO AR - BULBO SECO, HORARIA (°C) (renomei para "temperatura") e salvei como floripa_weather_data.csv.

Usei o notebook data_manipulation.ipynb para gerar o arquivo 2020_floripa_temperature_by_day.csv contento a temperatura média de cada dia.







