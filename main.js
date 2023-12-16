 
    let endpoint = 'live';
    let access_key = '46ac6145823187ccb701cb1763e43d08';

    
    function get_live(figureId) {
        let storedData = localStorage.getItem('cryptoData');

        if (storedData) {
            updateHTML(figureId, JSON.parse(storedData));
        } else {
            let apiUrl = `https://api.coinlayer.com/api/${endpoint}?access_key=${access_key}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    updateHTML(figureId, data);
                    localStorage.setItem('cryptoData', JSON.stringify(data));
                })
                .catch(error => {
                    console.error('Error fetching live data:', error);
                });
        }
    }

    // Function to update HTML with live data
    function updateHTML(figureId, data) {
        let figure = document.getElementById(figureId);

        let htmlContent = `<table>
                              <thead>
                                <tr>
                                  <th>Crypto</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>`;
        for (let crypto in data.rates) {
            htmlContent += `<tr>
                              <td>${crypto}</td>
                              <td>${data.rates[crypto]}</td>
                              <!-- Add more cells as needed -->
                            </tr>`;
        }

        htmlContent += `</tbody></table>`;

        figure.innerHTML = htmlContent;
    }


    // Call get_live when the page loads
    window.onload = function () {
        get_live('fig1');
    };

   

   
    // now for the past data query
    // Function to make the API request for past data on a specified date
    function past_value(figureId, event) {
        event.preventDefault();
    
        let cryptoNameInput = document.getElementById('cryptoName');
        let desiredDateInput = document.getElementById('desiredDate');
    
        let cryptoName = cryptoNameInput.value.trim();
        let desiredDate = desiredDateInput.value.trim();
    
        if (cryptoName && desiredDate) {
            let pastValueFigure = document.querySelector('.past_value_table');
            console.log('pastValueFigure:', pastValueFigure);
    
            let pastValueTable = pastValueFigure.querySelector('table');
            console.log('pastValueTable:', pastValueTable);
    
            // Make the API request for the specified cryptocurrency on the given date
            let apiUrl = `https://api.coinlayer.com/api/${desiredDate}?access_key=${access_key}&symbols=${cryptoName}`;
    
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.rates && data.rates.hasOwnProperty(cryptoName)) {
                        let pastValue = data.rates[cryptoName];
    
                        pastValueTable.innerHTML = `<thead>
                                                       <tr>
                                                         <th>Crypto</th>
                                                         <th>Past Value</th>
                                                         <!-- Add more columns as needed -->
                                                       </tr>
                                                     </thead>
                                                     <tbody>
                                                       <tr>
                                                         <td>${cryptoName}</td>
                                                         <td>${pastValue}</td>
                                                       </tr>
                                                     </tbody>`;
                    } else {
                        console.log(`${cryptoName} data not available on ${desiredDate}.`);
                    }
                })
                .catch(error => {
                    console.error(`Error fetching past data for ${cryptoName} on ${desiredDate}:`, error);
                });
        } else {
            console.log('Please enter the name of the cryptocurrency and the desired date.');
        }
    }
    

    function convertCurrency() {
        let fromCurrencyInput = document.getElementById('fromCurrency');
        let toCurrencyInput = document.getElementById('toCurrency');
        let amountInput = document.getElementById('amount');
       

        let fromCurrency = fromCurrencyInput.value.trim().toUpperCase();
        let toCurrency = toCurrencyInput.value.trim().toUpperCase();
        let amount = parseFloat(amountInput.value.trim());

        if (fromCurrency && toCurrency && !isNaN(amount) && amount > 0) {
            let accessKey = '46ac6145823187ccb701cb1763e43d08';

            let apiUrl = `https://api.coinlayer.com/convert?access_key=${accessKey}&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
            let ConversionFigure = document.querySelector('.conversion_table');
            console.log('ConversionFigure:', ConversionFigure);
    
            let ConversionTable = ConversionFigure.querySelector('#Conv_table');
            console.log('ConversionTable:',ConversionTable );
    
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(`Conversion successful: ${amount} ${fromCurrency} = ${data.result} ${toCurrency}`);
                        ConversionTable.innerHTML = `<thead>
                               <tr>
                                 <th>${fromCurrency} converted into ${toCurrency}</th>
                                 <th></th>
                                 <!-- Add more columns as needed -->
                               </tr>
                             </thead>
                             <tbody>
                               <tr>
                                 <td>${data.result}</td>
                                 <!-- Add more cells as needed -->
                               </tr>
                             </tbody>`;

                        ;
                    } else {
                        console.error(`Conversion failed: ${data.error.info}`);
                    }
                })
                .catch(error => {
                    console.error('Error converting currency:', error);
                });

        } else {
            console.log('Please enter valid values for currency codes and amount.');
        }
    }