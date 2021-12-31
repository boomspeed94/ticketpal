import { db } from './postgres';
import fs from 'fs';
import path from 'path';

var sqlFile = fs.readFileSync(path.resolve(__dirname, 'init_postgre.sql')).toString();

(async function init() {
  await new Promise((res, rej) => {
    db.connect(function(err, poolClient, done){
      if(err){
        rej(err);
      } else {
        poolClient.query(sqlFile, function(err, result){
          done();
          if(err){
            rej(err);
          } else {
            res(true);
          }
        });
      }
    })
  }).then(() => {
    console.log('Finished initiating database!!');
    process.exit(0);
  }).catch((e: any) => {
    console.log('Failed to initiate database', e);
    process.exit(1);
  });
})();