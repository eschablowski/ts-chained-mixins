import { describe, expect, test, jest } from "@jest/globals";
import { MixinBase, IChainMixable } from "../index";

// Since this is a necessary `any`, lets ignore it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctor<T = NonNullable<unknown>> = new (...params: any[]) => T;

function Jumpable<TBase extends Ctor<MixinBase>>(Base: TBase) {
    return class Jumpable extends Base {
        jump() {
            return 42;
        }
    };
}

describe("MixinBase class", () => {
    test("with must call mixin", () => {
        const mockMixin: typeof Jumpable = jest.fn(Jumpable);

        class Testing extends MixinBase {}

        const mixed = Testing.with(mockMixin) as unknown as IChainMixable;

        expect(new mixed()).toBeInstanceOf(Testing);
        expect(mockMixin).toHaveBeenCalledWith(Testing);
    });

    test("hasMixin must check if the mixin is in the class", () => {
        const mockMixin: typeof Jumpable = jest.fn(Jumpable);
        const mockMixin2: typeof Jumpable = jest.fn(Jumpable);

        class Testing extends MixinBase {}

        const mixed = Testing.with(mockMixin) as unknown as IChainMixable;

        expect(mixed.hasMixin(mockMixin)).toBeTruthy();
        expect(mixed.hasMixin(mockMixin2)).toBeFalsy();
    });

    test("mixin properties are correctly typed", () => {
        class Testing extends MixinBase {
            test(): true {
                return true;
            }
        }

        const mixed = Testing.with(Jumpable);

        expect(() => {
            new mixed().jump();
            new mixed().test();
        }).not.toThrowError();
    });

    test("typeguard works correctly", () => {
        class Testing extends MixinBase {
            test(): true {
                return true;
            }
        }

        const mixed = Testing.with(Jumpable);

        const testInst: Testing = new mixed();

        expect(() => {
            if (testInst.hasMixin(Jumpable)) {
                testInst.jump();
                testInst.test();
            } else {
                throw new Error();
            }
        }).not.toThrowError();
    });
});
