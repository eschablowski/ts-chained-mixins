const path = require("path");
const nodeExternals = require("webpack-node-externals");

/** @type {import("webpack").Configuration} */
module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    devtool: "source-map",
    output: {
        library: {
            type: "module",
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        module: true,
        libraryTarget: "module"
    },
    experiments: {
        outputModule: true,
    },
    target: "es2020", // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};
