const fs = require('fs');
const path = require('node:path');

const __fileTxt= path.join(__dirname,'text.txt');
const readableStream = fs.createReadStream(__fileTxt);

let data = '';

readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => console.log(data));
readableStream.on('error', (error) => console.log('Error', error.message));