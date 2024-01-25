const fs = require('fs').promises;
const { pipeline } = require('stream/promises');
const path = require('path');
const { createReadStream, createWriteStream } = require('fs');

const distFolderPath = path.join(__dirname, 'project-dist');
const indexFile = path.join(distFolderPath, 'index.html');
const bundleFile = path.join(distFolderPath, 'style.css');

const stylesFolderPath = path.join(__dirname, 'styles');

const sourceFonts = path.join(__dirname, 'assets/fonts');
const sourceImg = path.join(__dirname, 'assets/img');
const sourceSvg = path.join(__dirname, 'assets/svg');

const distFolderFonts = path.join(__dirname, 'project-dist/assets/fonts');
const distFolderImg = path.join(__dirname, 'project-dist/assets/img');
const distFolderSvg = path.join(__dirname, 'project-dist/assets/svg');

const mergeStyle = async () => {
  await fs.mkdir(distFolderPath, { recursive: true });

  const readStyleFolder = await fs.readdir(stylesFolderPath);
  const output = createWriteStream(bundleFile);

  readStyleFolder.reduce(async (acc, fail) => {
    const pathFile = path.join(stylesFolderPath, fail);
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

const copyFiles = async (sourceFonts, distFolderFonts) => {
  const contentFonts = await fs.readdir(sourceFonts);

  const createFolderFonts = await fs.mkdir(distFolderFonts, {
    recursive: true,
  });

  contentFonts.reduce(async (acc, file) => {
    const fontsFileSort = path.join(sourceFonts, file);
    const destFonts = path.join(distFolderFonts, file);
    const rs = createReadStream(fontsFileSort);
    const ws = createWriteStream(destFonts);
    await pipeline(rs, ws);
  }, 0);
};

copyFiles(sourceFonts, distFolderFonts);
copyFiles(sourceImg, distFolderImg);
copyFiles(sourceSvg, distFolderSvg);

const templateHTML = path.join(__dirname, 'template.html');

async function readComponent(componentName) {
  try {
    return await fs.readFile(
      path.join(__dirname, 'components', `${componentName}.html`),
      'utf8'
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const buildPage = async () => {
  let readTemplateHTML = await fs.readFile(templateHTML, 'utf-8');

  const componentMatches = readTemplateHTML.match(/{{\w+}}/g) || [];
  const componentNames = componentMatches.map((match) => match.slice(2, -2));

  const componentContents = await Promise.all(
    componentNames.map((componentName) => readComponent(componentName))
  );

  let finalHtml = readTemplateHTML;
  for (let i = 0; i < componentNames.length; i++) {
    finalHtml = finalHtml.replace(
      `{{${componentNames[i]}}}`,
      componentContents[i]
    );
  }
  await fs.writeFile(indexFile, finalHtml, 'utf8');
};

buildPage();
mergeStyle();
