const { readdir, stat } = require('fs/promises');
const path = require('path');

const readFolder = async () => {
  const folderPath = path.join(__dirname, 'secret-folder');
  try {
    const content = await readdir(folderPath);

    content.forEach(async (el) => {
      const pathFile = path.join(folderPath, el);

      const elStats = await stat(pathFile);

      if (elStats.isFile()) {
        const ext = path.extname(pathFile);
        const baseName = path.basename(pathFile, ext);
        const size = elStats.size;
        console.log(`${baseName} - ${ext.slice(1)} - ${size}b`);
      }
    });
  } catch (err) {
    if (err) console.error(err.message);
  }
};
readFolder();