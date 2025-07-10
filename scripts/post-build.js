const fs = require('fs');
const path = require('path');

// Path to the built library
const distPath = path.join(__dirname, '../dist/seacotools');
const packageJsonPath = path.join(distPath, 'package.json');

// Read the existing package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Ensure proper main entry points
packageJson.main = './bundles/seacotools.umd.js';
packageJson.module = './fesm2022/seacotools.mjs';
packageJson.es2022 = './fesm2022/seacotools.mjs';
packageJson.esm2022 = './esm2022/seacotools.mjs';
packageJson.fesm2022 = './fesm2022/seacotools.mjs';
packageJson.typings = './index.d.ts';

// Add proper exports field
packageJson.exports = {
  "./package.json": "./package.json",
  ".": {
    "types": "./index.d.ts",
    "esm2022": "./esm2022/seacotools.mjs",
    "es2022": "./fesm2022/seacotools.mjs",
    "esm": "./fesm2022/seacotools.mjs",
    "default": "./bundles/seacotools.umd.js"
  },
  "./styles/seacotools.css": "./styles/seacotools.css"
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Library build completed with proper exports');
