import { Mixin, IConstructor, IChainableMixableClass } from "./interfaces";

/**
 * This is a non-polymorphic base class that allows chaining of mixins.
 *
 * @note This should only be used in internal applications where polymorphism can be guaranteed to be avoided, and performance is critical
 * @deprecated The use of this class is likely premature optimization and may nip you in the but for a measily 300 bytes, so its use is not encouraged
 * @example
 * ```ts
 * import { MixinBase } from "ts-chained-mixins/non-polymorphic";
 *
 * class Sprite extends MixinBase {
 *     // Some Implementation
 * }
 *
 * function Scale<TBase extends Constructor>(Base: TBase) {
 *     return class Scaling extends Base {
 *         // Some Implementation
 *     };
 * }
 *
 * function Rotate<TBase extends Constructor>(Base: TBase) {
 *     return class Rotation extends Base {
 *         // Some Implementation
 *     };
 * }
 *
 * class EightBitSprite extends Sprite.with(Scale).with(Rotate) {
 *      // Some Implementation
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ChainMixableBase {
    /**
     * Creates a new class using the provided mixin
     * @param mixin The mixin that should be applied
     * @returns The new class that has the mixin added to it
     * @nosideeffects
     *
     * @example
     * import ChainMixableSprite from "sprite"
     * import {Scale, Rotate} from "mixins";
     *
     * class EightBitSprite extends ChainMixableSprite.with(Scale).with(Rotate) {
     *      // Some Implementation
     * }
     */
    static with<
        T extends ChainMixableBase,
        K extends IConstructor,
        C extends IConstructor<T>,
        M extends Mixin<C, K>,
    >(this: C, mixin: M): C & ReturnType<M> {
        return mixin(this) as unknown as C & ReturnType<M>;
    }
}
/**
 * This allows chainable mixins, in mixin format
 * @param ctor The base class, that should be extended
 * @returns A new class that extends the base class, but allows for further mixins to be applied via a chainable API
 * @nosideeffects
 * @note We encourage using PolymorphicChainMixableBase in favor of this function to allow for polymorphic types
 * @example
 * ```ts
 * import { chainableMixinsMixin } from "ts-chained-mixins/non-polymorphic";
 * import Sprite, {Scale, Rotate} from "sprite"
 *
 * function Scale<TBase extends Constructor>(Base: TBase) {
 *     return class Scaling extends Base {
 *         // Some Implementation
 *     };
 * }
 *
 * class EightBitSprite extends chainableMixinsMixin(Sprite).with(Scale).with(Rotate) {
 *      // Some Implementation
 * }
 * ```
 */
export function chainableMixinsMixin<C extends IConstructor>(
    ctor: C,
): IChainableMixableClass<InstanceType<C>> & C {
    return class ChainableMixin extends ctor {
        /**
         * Creates a new class using the provided mixin
         * @param mixin The mixin that should be applied
         * @returns The new class that has the mixin added to it
         * @nosideeffects
         *
         * @example
         * ```ts
         * import { chainableMixinsMixin } from "ts-chained-mixins/non-polymorphic";
         * import ChainableSprite, {Scale, Rotate} from "sprite"
         *
         * function Scale<TBase extends Constructor>(Base: TBase) {
         *     return class Scaling extends Base {
         *         // Some Implementation
         *     };
         * }
         *
         * class EightBitSprite extends ChainableSprite.with(Scale).with(Rotate) {
         *      // Some Implementation
         * }
         * ```
         */
        static with<
            T extends ChainMixableBase,
            K extends IConstructor,
            C extends IConstructor<T>,
            M extends Mixin<C, K>,
        >(this: C, mixin: M): ReturnType<M> & C {
            return mixin(this) as unknown as C & ReturnType<M>;
        }
    } as unknown as IChainableMixableClass<InstanceType<C>> & C;
}
