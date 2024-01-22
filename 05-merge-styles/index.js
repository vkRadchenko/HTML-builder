const { readdir, readFile, writeFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const bindleFile = path.join(distPath, 'bundle.css');

const mergeStyle = async () => {
  const readDistFolder = await readdir(distPath);

  const readStyleFolder = await readdir(stylesPath);
  const output = fs.createWriteStream(bindleFile);
  
  readStyleFolder.reduce(async (acc, fail) => {
    const pathFile = path.join(stylesPath, fail);
    const elStats = path.extname(pathFile);

    if (elStats === '.css') {
      const input = fs.createReadStream(pathFile);

      let data = [];

      input.on('data', (chunk) => {
        data += chunk;
      });
      input.on('end', () => console.log('End', data.length));
      input.on('error', (error) => console.log('Error', error.message));
      input.on('data', (chunk) => output.write(chunk));

    }
  }, 0);
};

mergeStyle();
