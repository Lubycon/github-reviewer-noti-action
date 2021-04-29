import fs from 'fs';

export async function readFile(file: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}
