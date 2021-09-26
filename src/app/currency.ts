export interface ICurrency {
    name: string;
    symbol?: string;
}

export interface ICurrencies {
    [property: string]: ICurrency;
}

export interface ICurrencyValue {
    get coins(): number;
    get code(): string;
    get currency(): ICurrency;
}

export interface IExchangeRates {
    request?: string;
    date: string;
    base: string;
    rates: {
        [property: string]: number;
    };
}


