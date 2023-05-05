export type IConstructor<
    T extends NonNullable<unknown> = NonNullable<unknown>,
    // Since this is a necessary `any`, lets ignore it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Params extends unknown[] = any[],
> = new (...params: Params) => T;

export type Mixin<
    Superclass extends IConstructor,
    Extension extends IConstructor,
> = (ctor: Superclass) => {
    [k in keyof Superclass | keyof Extension]: k extends keyof Extension
        ? Extension[k]
        : k extends keyof Superclass
        ? Superclass[k]
        : never;
} & (new (
    ...args: ConstructorParameters<Extension>
) => InstanceType<Superclass> & InstanceType<Extension>);

export interface IChainableMixableClass<
    C extends NonNullable<unknown> = NonNullable<unknown>,
> {
    new (...args: unknown[]): C;
    with<
        T extends NonNullable<unknown>,
        K extends IConstructor,
        C extends IChainableMixableClass<T>,
        M extends Mixin<C, K>,
    >(
        this: C,
        mixin: M,
    ): C & ReturnType<M>;
}

interface IPolyChainableMixable {
    hasMixin<
        T extends Mixin<IConstructor<this>, IConstructor<K>>,
        K extends NonNullable<unknown>,
    >(
        possibleMixin: T,
    ): this is InstanceType<ReturnType<T>>;
}

export interface IPolyChainableMixableClass<
    C extends IPolyChainableMixable = IPolyChainableMixable,
> extends IChainableMixableClass<C> {
    new (...args: unknown[]): C;

    hasMixin(possibleMixin: Mixin<IConstructor, IConstructor>): boolean;

    hasMixin<
        T extends Mixin<IConstructor<this>, IConstructor<K>>,
        K extends NonNullable<unknown>,
    >(
        possibleMixin: T,
    ): this is ReturnType<T>;
}
