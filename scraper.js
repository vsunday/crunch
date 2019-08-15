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
        resolve(err);
      }

      const title = ['name', 'founded', 'employee', 'funds', 'stage', 'summary', 'website', 'city', 'state', 'pais'];
      let values = [];
      for (let i = 0; i < title.length; i++) {
        values.push(data[title[i]]);
      }
      res = values.join('@@@');
      resolve(res);
    });
  });
  return promise;
}

function prepareOption(targetUrl) {
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
