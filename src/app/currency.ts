export interface ICurrency {
    name: string;
    symbol?: string;
}

export interface ICurrencies {
    [property: string]: ICurrency;
}

export interface ICurrencyValue {
    readonly coins: number;
    readonly code: string;
    readonly currency: ICurrency;
}

export interface IExchangeRates {
    request?: string;
    date: string;
    base: string;
    rates: {
        [property: string]: number;
    };
}


