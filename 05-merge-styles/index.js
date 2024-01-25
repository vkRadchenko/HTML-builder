const fs = require('fs').promises;
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const bundleFile = path.join(distPath, 'bundle.css');

const mergeStyle = async () => {
  await fs.mkdir(distPath, { recursive: true });
  const readStyleFolder = await fs.readdir(stylesPath);
  const output = createWriteStream(bundleFile);

  readStyleFolder.reduce(async (acc, fail) => {
    const pathFile = path.join(stylesPath, fail);
    const elStats = path.extname(pathFile);

    if (elStats === '.css') {
      const input = createReadStream(pathFile);

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
