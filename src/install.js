import {install} from "./DBClient";
const axios = require('axios');
axios.get('https://api.binance.com/api/v1/exchangeInfo')
    .then(response => {
        install(response.data.symbols);
    }).catch(error => {
    console.log(error);
});