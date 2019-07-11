const scraper = require('./scraper');
const fs = require('fs');

const urls = fs.readFileSync('./urls.txt','utf8').split('\n');
console.log(urls);

const filename = './result.txt';
if (fs.existsSync(filename)) fs.unlinkSync(filename);

for (let i=0; i<urls.length; i++) {
  scraper(urls[i])
    .then(data=>{
      const options = {'encoding':'utf8', 'flag':'a'};
      const result = data + ', ' + urls[i] + '\n';
      fs.writeFile(filename,result,options,(err,data)=>{
        if (err) console.error(err);
        console.log('wrote');
      });
    });
}