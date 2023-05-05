# ts-chained-mixins

## Overview

`ts-chained-mixins` brings chained mixins to TypeScript.
Chained mixins allow for a more natural and compact way to express mixin patterns.

## Features

-   mixes multiple classes
-   allows mixing of different add ons later on
-   Keeps all type signatures intact
-   Good generic class support (After chainable mixin is loaded)
-   Allows for polymorphic mixins
-   Almost purely TypeScript typing
-   Non-polymorphic mixin to allow meta-mixing

## Caveats

-   Currently no support for calling with arrays
-   Increases compile time

## Quick Start

### Installation

```bash
npm install ts-chained-mixins
```

or if you prefer [Yarn](://yarnpkg.com)

```bash
yarn add ts-chained-mixins
```

or if you prefer [pnpm](://pnpm.io)

```bash
pnpm add ts-chained-mixins
```

## Examples

### Basic Inheritance

```ts
import { MixinBase, Constructor } from "ts-chained-mixins";

class Sprite extends MixinBase {
    name = "";
    x = 0;
    y = 0;

    constructor(name: string) {
        this.name = name;
    }
}

function Scale<TBase extends Constructor>(Base: TBase) {
    return class Scaling extends Base {
        _scale = 1;

        setScale(scale: number) {
            this._scale = scale;
        }

        get scale(): number {
            return this._scale;
        }
    };
}

function Rotate<TBase extends Constructor>(Base: TBase) {
    return class Rotation extends Base {
        _angle = 0;

        setAngle(angle: number) {
            this._angle = angle;
        }

        get angle(): number {
            return this._angle;
        }
    };
}

const EightBitSprite = Sprite.with(Scale).with(Rotate);

const flappySprite = new EightBitSprite("Bird");
flappySprite.setScale(0.8);
flappySprite.setAngle(20);
console.log(flappySprite.scale);
console.log(flappySprite.angle);
```

## Other features

### static `hasMixin`

This function can be called to check whether a specific class has a mixin applied to it.

```ts
import { MixinBase, Constructor } from "ts-chained-mixins";

class Sprite extends MixinBase {
    name = "";
    x = 0;
    y = 0;

    constructor(name: string) {
        this.name = name;
    }
}

function Scale<TBase extends Constructor>(Base: TBase) {
    return class Scaling extends Base {
        _scale = 1;

        setScale(scale: number) {
            this._scale = scale;
        }

        get scale(): number {
            return this._scale;
        }
    };
}

const EightBitSprite = Sprite.with(Scale);

const isSpriteScalable = EightBitSprite.hasMixin(Scale); // False
const isEightBitSpriteScalable = Sprite.hasMixin(Scale); // True
```

### instance `hasMixin`

This function can be called to check whether a specific instance has a mixin applied to it.

> Note: This also functions as a type guard, so guard away with it.

```ts
import { MixinBase, Constructor } from "ts-chained-mixins";

class Sprite extends MixinBase {
    name = "";
    x = 0;
    y = 0;

    constructor(name: string) {
        this.name = name;
    }
}

function Scale<TBase extends Constructor>(Base: TBase) {
    return class Scaling extends Base {
        _scale = 1;

        setScale(scale: number) {
            this._scale = scale;
        }

        get scale(): number {
            return this._scale;
        }
    };
}

const EightBitSprite = Sprite.with(Scale);

// Make sure we lose the Mixin definition
const flappySprite: Sprite = new EightBitSprite("Bird");

// @ts-ignore-next-line
flappySprite.setScale(0.8); // Errors out due to Polymorphism
if (flappySprite.hasMixin(Scalable)) {
    flappySprite.setScale(0.8); // Works
}
```
