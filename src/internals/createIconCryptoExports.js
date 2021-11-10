const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const outPathSvg = 'src/assets/svgs/IconCurrency.ts';
const outPathImg = 'src/assets/images/currency.ts';

const result = fs
  .readdirSync(path.join(process.cwd(), 'node_modules/cryptocurrency-icons/svg/icon'))
  .filter((path) => path.endsWith('.svg'));

let contentSvg = `// File nay duoc tao boi src/internals/createIconCryptoExports.js
// Khong tu sua file nay. Chay 'yarn script:createIconCryptoExports' de update.

`;
let contentImg = `// File nay duoc tao boi src/internals/createIconCryptoExports.js
// Khong tu sua file nay. Chay 'yarn script:createIconCryptoExports' de update.

`;
let contentImgBottom = `
  export const currencyImgs: Record<string, string> = { 
`;

for (const fileName of result) {
  const name = fileName.split('.')[0].toUpperCase();
  contentSvg += `export { default as Icon${name} } from 'cryptocurrency-icons/svg/icon/${fileName}';
`;
  contentImg += `import { default as Image${name} } from 'cryptocurrency-icons/svg/icon/${fileName}';
`;
  contentImgBottom += `'${name}': Image${name}.src,`;
}

const extraIcons = {
  KOIN: 'assets/svgs/coins/koin.svg',
};

for (const [icon, filePath] of Object.entries(extraIcons)) {
  contentSvg += `export { default as Icon${icon} } from '${filePath}';
`;
  contentImg += `import { default as Image${icon} } from '${filePath}';
`;
  contentImgBottom += `'${icon}': Image${icon}.src,`;
}

contentSvg = prettier.format(contentSvg, { parser: 'babel' });
contentImg += contentImgBottom + '}';
contentImg = prettier.format(contentImg, { parser: 'babel' });

fs.writeFileSync(path.join(process.cwd(), outPathSvg), contentSvg);
fs.writeFileSync(path.join(process.cwd(), outPathImg), contentImg);
