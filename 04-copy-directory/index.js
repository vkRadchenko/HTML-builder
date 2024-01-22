const fs = require('fs/promises');
const path = require('path');

const copyFiles = async (pathFolderName) => {
  const pathFolder = path.join(__dirname, pathFolderName);
  const folderCopy = path.join(__dirname, 'files-copy');

  const createFolder = await fs.mkdir(folderCopy, { recursive: true });

  const content = await fs.readdir(pathFolder);

  const readCopyFolder = await fs.readdir(folderCopy);
  readCopyFolder.forEach(async (file) => {
    await fs.unlink(path.join(folderCopy, file));
  });

  content.forEach(async (file) => {
    const fileFolderPath = path.join(folderCopy, file);
    const filePath = path.join(pathFolder, file);
    await fs.copyFile(filePath, fileFolderPath);
  });
};

copyFiles('files', 'files-copy');
