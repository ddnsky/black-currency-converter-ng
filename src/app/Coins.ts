import { ICurrencyValue, ICurrency } from './currency';


export class Coins implements ICurrencyValue {
    constructor(
        public _value: number,
        public _code: string,
        public _currency: ICurrency) { }

    get coins(): number { return this._value; }
    get code(): string { return this._code; }
    get currency(): ICurrency { return this._currency; }

    isEqual(other: ICurrencyValue): boolean {
        return this._code === other.code && this._value === other.coins;
    }
    assign(other: ICurrencyValue) {
        this._value = other.coins;
        this._code = other.code;
        this._currency = other.currency;
    }
}
