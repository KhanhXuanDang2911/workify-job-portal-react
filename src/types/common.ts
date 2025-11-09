export type With<T, U extends object> = T & U;

export type WithOverride<T, U extends object> = Omit<T, keyof U> & U;

export type AddProperty<T, K extends string, V> = T & { [P in K]: V };
    