import { describe, expect, test, jest } from "@jest/globals";

import ChainMixableBase, { chainableMixinsMixin } from "../non-polymorphic";

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

        class Testing extends ChainMixableBase {
            data: number;
        }

        const mixed = Testing.with(mockMixin);

        expect(new mixed()).toBeInstanceOf(Testing);
        expect(mockMixin).toHaveBeenCalledWith(Testing);
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

    test("with must be chainable", () => {
        class Testing extends ChainMixableBase {
            test(): true {
                return true;
            }
        }

        const mixed = Testing.with(Jumpable).with(Hoppable);

        expect(() => {
            new mixed().jump();
            new mixed().hop();
            new mixed().test();
        }).not.toThrowError();
    });
});

describe("Chainable Mixin", () => {
    test("with must call mixin", () => {
        const mockMixin: typeof Jumpable = jest.fn(Jumpable);

        class Testing extends chainableMixinsMixin(
            class {
                test2(): true {
                    return true;
                }
            },
        ) {
            data: number;
        }

        const mixed = Testing.with(mockMixin);

        expect(new mixed()).toBeInstanceOf(Testing);
        expect(mockMixin).toHaveBeenCalledWith(Testing);
    });

    test("mixin properties are correctly typed", () => {
        class Testing extends chainableMixinsMixin(
            class {
                test2(): true {
                    return true;
                }
            },
        ) {
            test(): true {
                return true;
            }
        }

        const mixed = Testing.with(Jumpable);

        expect(() => {
            new mixed().jump();
            new mixed().test();
            new mixed().test2();
        }).not.toThrowError();
    });

    test("with must be chainable", () => {
        class Testing extends chainableMixinsMixin(
            class {
                test2(): true {
                    return true;
                }
            },
        ) {
            test(): true {
                return true;
            }
        }

        const mixed = Testing.with(Jumpable).with(Hoppable);

        expect(() => {
            new mixed().jump();
            new mixed().hop();
            new mixed().test();
        }).not.toThrowError();
    });
});
