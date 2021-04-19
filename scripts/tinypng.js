// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-misused-promises */
const tinify = require('tinify');
const fs = require('fs-extra');
const path = require('path');

tinify.key = '这里填秘钥'; //
const jsonForTiny = path.join(__dirname, 'cacheTiny.json');

function writeSaveRecord (content) {
  if (!content) {
    fs.writeJSONSync(jsonForTiny, { records: [] });

    return;
  }

  const records = readSaveRecord();

  records.push(content);
  fs.writeJSONSync(jsonForTiny, { records: records });
}

function readSaveRecord () {
  if (!fs.existsSync(jsonForTiny)) {
    writeSaveRecord();

    return { records: [] };
  }

  return fs.readJSONSync(jsonForTiny).records;
}

function formatBytes (bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return {
    num: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    print: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i],
    size: sizes[i]
  };
}

const records = readSaveRecord() || [];

const paths = [path.join(__dirname, '../packages')];
let count = 0;
let failCount = 0;
let successCount = 0;

async function start (p) {
  const files = fs.readdirSync(p);

  for (let i = 0; i < files.length; i++) {
    const s = files[i];
    const filePath = path.join(p, s);

    const stat = fs.statSync(filePath);

    if (fs.lstatSync(filePath).isDirectory()) {
      await start(filePath);
    } else {
      if (path.extname(filePath) === '.png' && filePath.indexOf('packages/apps/build') === -1) {
        const sizes = formatBytes(stat.size);

        if ((sizes.num < 15 && sizes.size === 'KB') || sizes.size === 'Bytes') {
          // console.log(s, '太小跳过', sizes.print);
        } else if (records.indexOf(filePath.split('/apps/packages')[1]) > -1) {
          console.log('已优化过', s, '跳过');
        } else {
          count += 1;
          console.log('需要压缩:', s, '大小为:', sizes.print);
          const source = tinify.fromFile(filePath);

          try {
            await source.toFile(filePath);
            console.log(s, '成功了');
            console.log('压缩后大小为', formatBytes(fs.statSync(filePath).size).print);
            writeSaveRecord(filePath.split('/apps/packages')[1]);
            successCount += 1;
          } catch (e) {
            console.log(s, '失败了');
            failCount += 1;
          }
        }
      }
    }
  }
}

paths.forEach(async (p) => {
  count = 0;
  await start(p);
  console.log('一共需要压缩', count);
  console.log('失败', failCount);
  console.log('成功', successCount);
});
