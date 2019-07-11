const request = require('request');
const cheerio = require('cheerio');

function scraper(targetUrl) {
  const prefix = 'https://www.crunchbase.com/organization/';

  let res = '';

  const promise = new Promise((resolve, reject) => {
    if (!targetUrl) {
      console.log('empty url');
      return resolve('empty url');
    } else if(!targetUrl.startsWith(prefix)) {
      console.log('not crunchbase url');
      return resolve('not crunchbase url');
    }

    const options = prepareOption(targetUrl);
    
    request(options, (error, response, body) => {
      if (error) throw error;
      const $ = cheerio.load(body);

      let data = '';
      try {
        data = formatData($);
      } catch(err) {
        console.log(err);
        resolve(err);
      }

      const title = ['name', 'founded', 'employee', 'funds', 'stage', 'summary', 'website', 'city', 'state', 'pais'];
      let values = [];
      for (let i = 0; i < title.length; i++) {
        values.push(data[title[i]]);
      }
      // res = title.join(', ') + '\n' + values.join(', ');
      res = values.join(', ');
      resolve(res);
    });
  });
  return promise;
}

function prepareOption(targetUrl) {
  // const headerlist = [{
  //     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  //     'accept-language': 'en',
  //     'cache-control': 'no-cache',
  //     'cookie': '_vdl=1; __qca=P0-1568303072-1511204995709; D_SID=99.0.84.102:1FrLcvl328FhpBL5IveUdFzoBv117KPWfHSqXv6Cmnk; _ga=GA1.2.879501565.1511204994; olfsk=olfsk45176155676658136; hblid=3Y1yK2EJKz8D31Vx3F6pZ0X03JEADFKb; __stripe_mid=c8f373a2-522f-4a1a-bbc3-eb6f78d79b1c; optimizelyEndUserId=oeu1519085954984r0.42184407920790523; D_IID=1345475C-E7F8-3703-A281-ABE39D8A8DAB; D_UID=101F4498-CBC8-38B1-B6AD-63AFB1FFC250; AMCV_6B25357E519160E40A490D44%40AdobeOrg=1099438348%7CMCMID%7C07307093730793086150918585251763795631%7CMCAAMLH-1520988280%7C9%7CMCAAMB-1521331811%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1520734211s%7CNONE%7CMCAID%7CNONE%7CMCSYNCSOP%7C411-17605%7CvVersion%7C2.1.0; s_pers=%20s_getnr%3D1520729964247-Repeat%7C1583801964247%3B%20s_nrgvo%3DRepeat%7C1583801964249%3B; D_ZID=E5EDB0C4-C70A-3182-94D1-29A0B6A055E1; D_ZUID=D44AB39F-C376-39FF-9D22-3B5B93E45308; D_HID=79430E38-555D-3E05-8FE7-B005F01D8424; _gid=GA1.2.1952193213.1523923846; _hp2_ses_props.973801186=%7B%22r%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22ts%22%3A1523984932756%2C%22d%22%3A%22www.crunchbase.com%22%2C%22h%22%3A%22%2Forganization%2Fidentitymind-global%2Finvestors%2Finvestors_list%22%7D; _hp2_props.973801186=%7B%22Logged%20In%22%3Afalse%2C%22Pro%22%3Afalse%2C%22cbPro%22%3Afalse%2C%22apptopia-lite%22%3Afalse%2C%22apptopia-premium%22%3Afalse%2C%22builtwith%22%3Afalse%2C%22ipqwery%22%3Afalse%2C%22siftery%22%3Afalse%2C%22similarweb%22%3Afalse%2C%22bombora%22%3Afalse%7D; _hp2_id.973801186=%7B%22userId%22%3A%222828410359712841%22%2C%22pageviewId%22%3A%226476944640446685%22%2C%22sessionId%22%3A%225133393053552942%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%223.0%22%7D; _okdetect=%7B%22token%22%3A%2215239849376780%22%2C%22proto%22%3A%22https%3A%22%2C%22host%22%3A%22www.crunchbase.com%22%7D; _ok=1554-355-10-6773; wcsid=gALrrDbXsn2u3EVN3F6pZ0W07TEZD3A6; _okbk=cd4%3Dtrue%2Cvi5%3D0%2Cvi4%3D1523985676616%2Cvi3%3Dactive%2Cvi2%3Dfalse%2Cvi1%3Dfalse%2Ccd8%3Dchat%2Ccd6%3D0%2Ccd5%3Daway%2Ccd3%3Dfalse%2Ccd2%3D0%2Ccd1%3D0%2C; _oklv=1523986339549%2CgALrrDbXsn2u3EVN3F6pZ0W07TEZD3A6',
  //     'pragma': 'no-cache',
  //     'referer': 'https://www.google.com/',
  //     'upgrade-insecure-requests': '1',
  //     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3325.181 Safari/537.36',
  //   },
  //   {
  //     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  //     'accept-language': 'en-US,en;q=0.9',
  //     'cache-control': 'max-age=0',
  //     'cookie': '_hp2_props.973801186=%7B%22Logged%20In%22%3Afalse%2C%22Pro%22%3Afalse%2C%22cbPro%22%3Afalse%2C%22apptopia-lite%22%3Afalse%2C%22apptopia-premium%22%3Afalse%2C%22builtwith%22%3Afalse%2C%22ipqwery%22%3Afalse%2C%22siftery%22%3Afalse%2C%22similarweb%22%3Afalse%2C%22bombora%22%3Afalse%7D; _ga=GA1.2.75328986.1524004409; _gid=GA1.2.854169083.1524004409; _gat_UA-60854465-1=1; _hp2_id.973801186=%7B%22userId%22%3A%228233679809853701%22%2C%22pageviewId%22%3A%221862814861383199%22%2C%22sessionId%22%3A%221376721454064015%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%223.0%22%7D; _hp2_ses_props.973801186=%7B%22ts%22%3A1524004409489%2C%22d%22%3A%22www.crunchbase.com%22%2C%22h%22%3A%22%2Forganization%2Fxiaomi%22%7D; __qca=P0-1260073585-1524004409543; wcsid=28Bh7DpB1aLd6ONF3F6pZ0W07TEDBZpb; hblid=102aP4pdTFS3i2iu3F6pZ0W07TErb6pJ; _oklv=1524004409758%2C28Bh7DpB1aLd6ONF3F6pZ0W07TEDBZpb; _okdetect=%7B%22token%22%3A%2215240044102550%22%2C%22proto%22%3A%22https%3A%22%2C%22host%22%3A%22www.crunchbase.com%22%7D; olfsk=olfsk38537284791441007; _okbk=cd4%3Dtrue%2Cvi5%3D0%2Cvi4%3D1524004410416%2Cvi3%3Dactive%2Cvi2%3Dfalse%2Cvi1%3Dfalse%2Ccd8%3Dchat%2Ccd6%3D0%2Ccd5%3Daway%2Ccd3%3Dfalse%2Ccd2%3D0%2Ccd1%3D0%2C; _ok=1554-355-10-6773; D_IID=45156AB7-688C-353A-943D-95DBE2B2EFDA; D_UID=156A60F2-2E89-3DD8-9394-CBFF039821C0; D_ZID=7035D5EE-0310-3BB9-846C-189BB8489E97; D_ZUID=253ADFDD-6963-39C9-9E7E-DA792347B247; D_HID=3B397E9F-3248-35A4-A868-C6CF7BEF1977; D_SID=99.0.84.102:1FrLcvl328FhpBL5IveUdFzoBv117KPWfHSqXv6Cmnk',
  //     'referer': 'https://www.google.com/',
  //     'upgrade-insecure-requests': '1',
  //     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3325.181 Safari/537.36',
  //   }
  // ];
  const headerfile = './header.json';
  const headerlist = JSON.parse(require('fs').readFileSync(headerfile,'utf8'))["headerlist"];
  const options = {
    uri: targetUrl,
    headers: headerlist[Math.floor(Math.random() * headerlist.length)]
  };

  return options;
}

function formatData($) {
  const name = maybeNull($('span', 'div.component--image-with-text-card').html()).trim();
  const city = $('a', 'div.component--image-with-text-card')['0']['attribs']['title'];
  const state = $('a', 'div.component--image-with-text-card')['1']['attribs']['title'];
  const pais = $('a', 'div.component--image-with-text-card')['2']['attribs']['title'];
  const funds = maybeNull($('a.cb-link.component--field-formatter.field-type-money.ng-star-inserted').html()).trim();
  const founded = maybeNull($('span.component--field-formatter.field-type-date_precision.ng-star-inserted').html()).trim();
  const stage = maybeChildren($('a.cb-link.component--field-formatter.field-type-enum.ng-star-inserted')['0']);
  const employee = maybeChildren($('a.cb-link.component--field-formatter.field-type-enum.ng-star-inserted')['1']);
  const summary = maybeNull($('span.component--field-formatter.field-type-text_long.ng-star-inserted').html()).trim();
  const website = $('a.cb-link.component--field-formatter.field-type-link.layout-row.layout-align-start-end.ng-star-inserted')['0']['attribs']['href'];

  const data = {
    'name': name,
    'city': city,
    'state': state,
    'pais': pais,
    'funds': funds,
    'founded': founded,
    'stage': stage,
    'employee': employee,
    'summary': summary,
    'website': website
  };

  return data;
}

function maybeNull(arg) {
  return arg != null ? arg : '';
}

function maybeChildren(arg) {
  const arg2 = maybeNull(arg);
  if (arg2) {
    return arg2['children'][0]['data'].trim();
  } else {
    return '';
  }
}

module.exports = scraper;
