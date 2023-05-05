import { describe, expect, test } from "@jest/globals";

import * as indx from "..";

describe("index.ts", () => {
    test("must match from previous api", () => {
        expect(indx).toMatchSnapshot();
    });
});
