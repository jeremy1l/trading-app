import {createSymbolsTable, install} from "./DBClient";

const axios = require('axios');
var appRouter = function (app) {
    app.get("/", function (req, res) {
        res.status(200).send("Welcome to our API");
    });
    app.get("/install", function (req, res) {

        axios.get('https://api.binance.com/api/v1/exchangeInfo')
            .then(response => {
                install(response.data.symbols);
                res.status(200).send(response.data.symbols);
            }).catch(error => {
            console.log(error);
        });
    });
    app.get("/symbols", function (req, res) {
        axios.get('https://api.binance.com/api/v1/exchangeInfo')
            .then(response => {
                console.log(response.data);
                res.status(200).send(response.data.symbols);
            })
            .catch(error => {
                console.log(error);
            });

    });

    app.get("/price/:symbol", function (req, res) {
        axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${req.params.symbol}`)
            .then(response => {
                console.log(response.data);
                res.status(200).send(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    });

    app.get("/hourly/:symbol", function (req, res) {
        let url = `https://api.binance.com/api/v1/klines?symbol=${req.params.symbol}&interval=1m&limit=61`;
        axios.get(url)
            .then(response => {
                let result = response.data.map(item => klinesTransform(item));
                console.log(result);
                res.status(200).send(JSON.stringify(result));
            })
            .catch(error => {
                console.log(error);
            });
        const klinesTransform = m => ({
            OpenTime: m[0],
            Open: m[1],
            High: m[2],
            Low: m[3],
            Close: m[4],
            Volume: m[5],
            CloseTime: m[6]
        });
    });
}

module.exports = appRouter;