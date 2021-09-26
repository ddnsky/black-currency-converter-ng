import { Subject } from 'rxjs';
import { ICurrencyValue, IExchangeRates, ICurrencies } from './currency'

//
export abstract class ICurrencyConverter {
    abstract convert(fromValue: ICurrencyValue, toCurrency: string): number;
}

// 
export abstract class ICurrencyListService {
    abstract get currencies(): ICurrencies;
}

//
export abstract class IExchangeRateService {
    abstract get exchangeRates(): IExchangeRates;
    abstract get refreshStatus(): Subject<boolean>;
    abstract refresh(): void;
}

//
export interface IExchangeRatesRequest {
    url?: string;
    responseType?: 'text' | 'json' | string;
    converter: (inp: any, currencies: ICurrencies) => IExchangeRates | null;
}

export abstract class IExchangeRatesRequests {
    [property: string]: IExchangeRatesRequest;
}


