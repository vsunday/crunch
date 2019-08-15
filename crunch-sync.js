const scraper = require('./scraper');
const fs = require('fs');

const INTERVAL = 10000;

const urls = fs.readFileSync('./urls.txt','utf8').split('\n');
console.log(urls);

const filename = './result.txt';
if (fs.existsSync(filename)) fs.unlinkSync(filename);

function sleep(ms) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > ms){
      break;
    }
  }
}

(async () => {
for (let i=0; i<urls.length; i++) {
  sleep(INTERVAL);
  console.log(i);
  await getOne(urls[i]);
}
})();

async function getOne(url) {
  const data = await scraper(url);
  const options = {'encoding':'utf8', 'flag':'a'};
  const result = data + ', ' + url + '\n';
  fs.writeFile(filename,result,options,(err,data)=>{
    if (err) console.error(err);
    console.log(`wrote: ${url}`);
  });
}

