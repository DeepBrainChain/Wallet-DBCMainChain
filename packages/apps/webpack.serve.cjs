// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const baseConfig = require("./webpack.base.cjs");

module.exports = merge(baseConfig(__dirname, "development"), {
  devServer: {
    firewall: false,
    open: false,
    port: 3000,
    static: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      PAGE_TITLE: "DBC Wallet Protal",
      inject: true,
      template: path.join(__dirname, "public/index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  watchOptions: {
    ignored: [".yarn", "build", "node_modules"],
  },
});
