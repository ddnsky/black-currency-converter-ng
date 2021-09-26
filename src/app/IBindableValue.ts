import { Subject } from 'rxjs';


export interface IBindableValue<ValueType> {
    getValue(): ValueType;
    setValue(newVal: ValueType, activator: any): void;
    notify(activator: any): void;
    get onChanged(): Subject<[IBindableValue<ValueType>, any]>;
}



