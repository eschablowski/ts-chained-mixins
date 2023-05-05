import { describe, expect, test, jest } from "@jest/globals";

import ChainMixableBase from "../class";
import NotMixableError from "../NotMixableError";

// Since this is a necessary `any`, lets ignore it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctor<T = NonNullable<unknown>> = new (...params: any[]) => T;

function Jumpable<TBase extends Ctor>(Base: TBase) {
    return class Jumpable extends Base {
        jump() {
            return 42;
        }
    };
}
function Hoppable<TBase extends Ctor>(Base: TBase) {
    return class Jumpable extends Base {
        hop() {
            return 100;
        }
    };
}

describe("MixinBase class", () => {
    test("with must call mixin", () => {
        const mockMixin: typeof Jumpable = jest.fn(Jumpable);

        class Testing extends ChainMixableBase {}

        const mixed = Testing.with(mockMixin);

        expect(new mixed()).toBeInstanceOf(Testing);
        expect(mockMixin).toHaveBeenCalledWith(Testing);
    });

    test("hasMixin must check if the mixin is in the class", () => {
        class Testing extends ChainMixableBase {}

        const mockMixin: typeof Jumpable = jest.fn(Jumpable);
        const mockMixin2: typeof Jumpable = jest.fn(Jumpable);

        const mixed = Testing.with(mockMixin);

        expect(mixed.hasMixin(mockMixin)).toBeTruthy();
        expect(mixed.hasMixin(mockMixin2)).toBeFalsy();
        const secondMix = mixed.with(mockMixin2);
        expect(secondMix.hasMixin(mockMixin)).toBeTruthy();
        expect(secondMix.hasMixin(mockMixin2)).toBeTruthy();
    });

    test("mixin properties are correctly typed", () => {
        class Testing extends ChainMixableBase {
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
        class Testing extends ChainMixableBase {
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

        expect(() => {
            if (testInst.hasMixin(Hoppable)) {
                testInst.hop();
                testInst.test();
            } else {
                testInst.test();
            }
        }).not.toThrowError();
    });

    test("static hasMixin throws on invalid this", () => {
        class Testing extends ChainMixableBase {
            test(): true {
                return true;
            }
        }

        expect(() => {
            (Testing.hasMixin.bind({}) as typeof Testing.hasMixin)(Jumpable);
        }).toThrowError(NotMixableError);
    });

    test("type guard throws on invalid this", () => {
        class Testing extends ChainMixableBase {
            test(): true {
                return true;
            }
        }
        const mixed = new Testing();

        expect(() => {
            (mixed.hasMixin.bind({}) as typeof mixed.hasMixin)(Jumpable);
        }).toThrowError(NotMixableError);
    });
});
