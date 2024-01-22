const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');

const { stdin: input, stdout: output } = require('process');

const txtFilePath = path.join(__dirname, 'destination.txt');

const emitter = new EventEmitter();

const out = fs.createWriteStream(txtFilePath);

const rl = readline.createInterface({ input, output });

emitter.on('start', () => console.log('Пожалуйста введите ваше имя:'));
emitter.emit('start');

rl.on('line', (input) => {
  input = input.trim();
  if (input !== 'exit') {
    out.write(`${input}\n`);
  } else {
    rl.close();
  }
}).on('close', () => {
  console.log('Спасибо за информацию!');
  rl.close();
});
