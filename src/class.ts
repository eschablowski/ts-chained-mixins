import NotMixableError from "./NotMixableError";
import { Mixin, IConstructor } from "./interfaces";

const appliedMixins: unique symbol = Symbol("mixins");

export default abstract class PolymorphicChainMixableBase {
    /**
     * @private
     */
    private static [appliedMixins]: Mixin<IConstructor, IConstructor>[] = [];

    /**
     *
     * @param this
     * @param mixin
     * @returns
     * @nosideeffects
     */
    static with<
        T extends PolymorphicChainMixableBase,
        K extends IConstructor,
        C extends IConstructor<T>,
        M extends Mixin<C, K>,
    >(this: C, mixin: M): C & ReturnType<M> {
        const mixed = mixin(this);
        if (appliedMixins in mixed && Array.isArray(mixed[appliedMixins]))
            mixed[appliedMixins] = mixed[appliedMixins].concat([mixin]);
        return mixed as C & ReturnType<M>;
    }

    /**
     *
     * @param possibleMixin The mixin that *may* have been added to the class
     * @returns Whether the mixin was applied
     * @throws {import("./NotMixableError").default}
     * @nosideeffects
     */
    static hasMixin(possibleMixin: Mixin<IConstructor, IConstructor>) {
        if (appliedMixins in this && Array.isArray(this[appliedMixins]))
            return this[appliedMixins].includes(possibleMixin);
        throw new NotMixableError();
    }

    /**
     *
     * @param possibleMixin
     * @returns
     * @throws {import("./NotMixableError").default}
     * @nosideeffects
     */
    hasMixin<
        T extends Mixin<IConstructor<this>, IConstructor<K>>,
        K extends NonNullable<unknown>,
    >(possibleMixin: T): this is InstanceType<ReturnType<T>> {
        if (
            appliedMixins in this.constructor &&
            Array.isArray(this.constructor[appliedMixins])
        )
            return this.constructor[appliedMixins].includes(possibleMixin);
        throw new NotMixableError();
    }
}
