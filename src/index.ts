const appliedMixins: unique symbol = Symbol("mixins");

type Ctor<
    T extends NonNullable<unknown> = NonNullable<unknown>,
    // Since this is a necessary `any`, lets ignore it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Params extends unknown[] = any[],
> = new (...params: Params) => T;

export type Mixin<Superclass extends Ctor, Extension extends Ctor> = (
    ctor: Superclass,
) => Superclass & Extension;

export interface IChainMixable {
    new (...args: unknown[]);
    with<T extends IChainMixable, K extends Ctor>(
        this: Ctor<T>,
        mixin: Mixin<Ctor<T>, K>,
    ): this & ReturnType<Mixin<Ctor<T>, K>>;
    hasMixin<T extends Mixin<Ctor, Ctor>>(
        possibleMixin: Mixin<Ctor, Ctor>,
    ): this is this & ReturnType<T>;
}

export abstract class MixinBase {
    static [appliedMixins]: Mixin<Ctor, Ctor>[] = [];
    static with<T extends MixinBase, K extends Ctor>(
        this: Ctor<T>,
        mixin: Mixin<Ctor<T>, K>,
    ) {
        const mixed = mixin(this);
        if (appliedMixins in mixed && Array.isArray(mixed[appliedMixins]))
            mixed[appliedMixins].push(mixin);
        return mixed;
    }
    static hasMixin(possibleMixin: Mixin<Ctor, Ctor>) {
        if (appliedMixins in this && Array.isArray(this[appliedMixins]))
            return this[appliedMixins].includes(possibleMixin);
    }

    hasMixin<
        T extends Mixin<Ctor<this>, Ctor<K>>,
        K extends NonNullable<unknown>,
    >(possibleMixin: T): this is InstanceType<ReturnType<T>> {
        if (
            appliedMixins in this.constructor &&
            Array.isArray(this.constructor[appliedMixins])
        )
            return this.constructor[appliedMixins].includes(possibleMixin);
        return false;
    }
}
