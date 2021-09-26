import { ICurrencies, IExchangeRates } from './currency';

export const someRequests = {
    '': {
        url: 'https://api.currencyfreaks.com/latest?apikey=680391bb13d646e6824b3f5591f8c1e3',
        responseType: 'json',
        converter: function (inp: any, currencies: ICurrencies): IExchangeRates | null {
            return convertDefault(_defaultExchangeRates, currencies);
        }
    },
    'api.currencyfreaks.com': {
        url: 'https://api.currencyfreaks.com/latest?apikey=680391bb13d646e6824b3f5591f8c1e3',
        responseType: 'json',
        converter: convertDefault
    },
    'www.ecb.europa.eu': {
        url: "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
        responseType: 'xml',
        converter: function (inp: any, currencies: ICurrencies): IExchangeRates | null {
            if (typeof inp !== 'string')
                return null;
            var str: string = inp;
            var rootRegex = /<Cube\s+time\s*='(\d{4}\-\d{2}\-\d{2})'\s*>/; // (\d{4}-\d{2}-\d{2})'\s*\/>/g;
            var root = str.match(rootRegex);
            if (!root || root.length < 2)
                return null;

            var elemRegex = /<Cube\s+currency\s*='([A-Z]{3})'\s+rate\s*=\s*'(\d+\.\d*)'\s*\/>/g;
            var match;
            var rates: { [key: string]: number } = { "EUR": 1 };

            while (match = elemRegex.exec(str)) {
                console.log(match);
                if (match.length < 3)
                    return null;
                if (currencies[match[1]])
                    rates[match[1]] = +match[2];
            }
            let result = { date: root[1], base: "EUR", rates: rates };
            return result;
        }
    },
    'cdn.jsdelivr.net': {
        url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json",
        responseType: 'json',
        converter: function (inp: any, currencies: ICurrencies): IExchangeRates | null {
            const inp_rates = inp.eur as { [key: string]: number };
            const seed: { [key: string]: number } = { "EUR": 1 };
            const rates = Object.keys(currencies)
                .reduce((prevValue, currentValue) => {
                    prevValue[currentValue] = inp_rates[currentValue.toLowerCase()];
                    return prevValue;
                }, seed);
            const result = { date: inp.date as string, base: "EUR", rates: rates };
            return result;
        }
    },
    "test-data": {
        url: "test-data",
        converter: function (inp: any, currencies: ICurrencies): IExchangeRates | null {
            return this.getFakeExchangeRates(currencies);
        },
        getFakeExchangeRates: function (currencies: ICurrencies): IExchangeRates {
            let rates: { [key: string]: number } = {};
            let rate = 10;
            let base = "EUR";
            for (var key in currencies)
                rates[key] = key == base ? 1 : rate++;
            let result = { request: "test-data", date: Date().toString(), base: base, rates: rates };
            return result;
        }
    }
}

interface IExchangeRatesDefault {
    request?: string;
    date: string;
    base: string;
    rates: {
        [property: string]: string;
    };
}

function convertDefault(_inp: any, currencies: ICurrencies): IExchangeRates {
    let inp = _inp as IExchangeRatesDefault;
    let rates: { [key: string]: number } = {};
    for (var key in currencies)
        rates[key] = +inp.rates[key];
    let result = { request: inp.request, date: inp.date, base: inp.base, rates: rates };
    return result;
}

const _defaultExchangeRates: IExchangeRatesDefault = {
    "request": "https://api.currencyfreaks.com/latest?apikey=680391bb13d646e6824b3f5591f8c1e3",
    "date": "2021-10-02 00:09:00+00", "base": "USD", "rates": { "FJD": "2.1205", "MATIC": "0.7912331368437711", "MXN": "20.4509", "STD": "21031.140504", "SCR": "13.494849", "CDF": "2002.0", "BBD": "2.0", "HNL": "24.18", "UGX": "3539.135792", "ZAR": "14.86313", "STN": "21.500121", "CUC": "1.0", "BSD": "1.0", "SDG": "440.731", "IQD": "1459.5", "CUP": "24.0985", "GMD": "51.55", "TWD": "27.77", "ZRX": "1.0267399006013103", "RSD": "101.492872", "BSV": "0.00713707193073972", "BCH": "0.0018427914605043721", "MYR": "4.1865", "OMG": "0.07730514272461975", "FKP": "0.738253", "BAND": "0.12437733596184102", "XOF": "565.77529", "BTC": "0.000020774927653911313", "UYU": "42.961105", "CVC": "2.1180405159970306", "CVE": "95.45", "OMR": "0.385001", "KES": "110.5", "SEK": "8.7486", "BTN": "74.127718", "GNF": "9770.0", "MZN": "63.774992", "SVC": "8.748042", "ARS": "98.70772", "QAR": "3.641", "IRR": "42025.8", "ANKR": "11.793148180906893", "SUSHI": "0.09266981744045964", "XPD": "0.00052004", "ALGO": "0.5647005675240704", "THB": "33.587161", "UZS": "10700.0", "XPF": "102.925879", "WBTC": "0.000019", "BDT": "85.641135", "LYD": "4.547094", "KWD": "0.30145", "XPT": "0.00102513", "RUB": "72.6726", "ISK": "129.65", "MANA": "1.3247261459874706", "MKD": "53.229301", "DZD": "137.35", "PAB": "1.0", "SGD": "1.3569", "NMR": "0.022325041440858177", "JEP": "0.738253", "MKR": "0.000410931036793183", "KGS": "84.801619", "ZEC": "0.008705872110738694", "REN": "0.9609840476648088", "REP": "0.04196391103650861", "XAF": "565.77529", "ADA": "0.4447706095581204", "XAG": "0.04438037", "STORJ": "0.8342370901810294", "CHF": "0.93038", "HRK": "6.4681", "DJF": "178.05", "PAX": "1.0", "DOGE": "4.49482", "TZS": "2305.0", "VND": "22732.543718", "XAU": "0.00056785", "AUD": "1.376822", "KHR": "4095.0", "IDR": "14307.337854", "KYD": "0.8332", "XRP": "0.962213", "BWP": "11.303661", "SHP": "0.738253", "TJS": "11.327875", "AED": "3.6732", "RWF": "997.5", "DKK": "6.41451", "BGN": "1.686685", "UMA": "0.1047943411055803", "MMK": "1871.086418", "NOK": "8.632", "SYP": "1257.86", "ZWL": "322.001774", "LKR": "199.706044", "CZK": "21.8368", "XCD": "2.70255", "HTG": "98.478699", "BHD": "0.377033", "CGLD": "0.16175079055698885", "KZT": "426.618734", "SZL": "15.13", "YER": "250.249998", "GRT": "1.4186409419775856", "AFN": "89.349994", "AWG": "1.8", "NPR": "118.603931", "UNI": "0.0392314557812454", "AAVE": "0.0033073759444625433", "MNT": "2847.063893", "GBP": "0.738253", "BYN": "2.513498", "HUF": "308.268096", "BYR": "25134.98", "GBX": "19.80179198296729", "YFI": "0.00003168243052399413", "BIF": "1996.0", "XTZ": "0.15057859826382877", "XDR": "0.708075", "EOS": "0.23441162681669012", "BZD": "2.015286", "MOP": "8.017384", "NAD": "15.13", "SKL": "3.072668612690121", "PEN": "4.1385", "WST": "2.574475", "TMT": "3.5", "CLF": "0.029108", "GTQ": "7.737291", "CLP": "803.26", "DNT": "6.459823130042699", "TND": "2.8325", "COMP": "0.0030613338231467455", "SLL": "10577.849699", "DOP": "56.45", "KMF": "424.650188", "GEL": "3.11", "MAD": "9.0655", "TOP": "2.2705", "AZN": "1.700805", "PGK": "3.535", "CNH": "6.435", "UAH": "26.626213", "ERN": "15.002477", "KNC": "0.6189076280365156", "MRO": "356.999828", "CNY": "6.4467", "ATOM": "0.026660978991148554", "MRU": "36.2101", "BMD": "1.0", "PHP": "50.860504", "SNX": "0.09605963382067588", "PYG": "6905.744104", "JMD": "147.568462", "COP": "3803.492878", "USD": "1.0", "DAI": "0.999409", "GGP": "0.738253", "ETB": "46.2", "ETC": "0.019313781348681353", "SOS": "585.0", "VEF": "248210.0", "VUV": "112.448866", "LAK": "9927.414952", "ETH": "0.0003028288759446368", "BND": "1.357737", "LRC": "2.576987501610617", "LRD": "171.000047", "ALL": "104.87654", "MTL": "0.31422937412607116", "VES": "4171561.083333", "ZMW": "16.74635", "BNT": "0.2648375221801425", "OXT": "3.130380341211457", "DASH": "0.005663524354570606", "ILS": "3.2189", "GHS": "6.05", "GYD": "209.165688", "KPW": "900.015", "BOB": "6.903487", "MDL": "17.516293", "AMD": "490.55469", "TRY": "8.861", "LBP": "1527.0", "JOD": "0.709", "GUSD": "1.0", "HKD": "7.78505", "EUR": "0.862519", "LSL": "15.13", "CAD": "1.26465", "MUR": "42.696494", "IMP": "0.738253", "GIP": "0.738253", "RON": "4.2654", "NGN": "410.77", "CRC": "625.870958", "PKR": "170.75", "ANG": "1.794578", "LTC": "0.00602627455706882", "USDC": "1.0", "SRD": "21.3985", "SAR": "3.750774", "TTD": "6.791132", "CRV": "0.3952022447487502", "NU": "3.4240712206813906", "MVR": "15.45", "INR": "74.15225", "KRW": "1180.499192", "JPY": "111.0765", "AOA": "599.0", "PLN": "3.949706", "SBD": "8.061298", "XLM": "3.3334388922315874", "LINK": "0.03815822460465217", "MWK": "815.0", "MGA": "3950.0", "FIL": "0.014131129819156867", "BAL": "0.04610988215466868", "BAM": "1.688236", "EGP": "15.720347", "SSP": "130.26", "BAT": "1.4743597776960327", "NIO": "35.25", "NZD": "1.441234", "ETH2": "0.0003028288759446368", "BUSD": "1.0", "BRL": "5.3661" }
};