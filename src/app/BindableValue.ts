import { Subject } from 'rxjs';
import { IBindableValue } from './IBindableValue';



export class BindableValue<ValueType> implements IBindableValue<ValueType> {
    protected _onChanged = new Subject<[IBindableValue<ValueType>, any]>();
    constructor(protected _value: ValueType) { }
    getValue(): ValueType {
        return this._value;
    }
    setValue(newValue: ValueType, activator: any = null): void {
        if (this._value != newValue) {
            this._value = newValue;
            this.notify(activator);
        }
    }
    get onChanged(): Subject<[IBindableValue<ValueType>, any]> {
        return this._onChanged;
    }
    notify(activator: any = null) {
        this._onChanged.next([this, activator]);
    }
}
