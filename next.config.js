/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const plugins = [
  [
    withLess,
    {
      lessLoaderOptions: { lessOptions: { javascriptEnabled: true } },
    },
  ],
];

/** @type {import('next').NextConfig} */
module.exports = withPlugins(plugins, {
  api: {
    bodyParser: false,
  },
});
