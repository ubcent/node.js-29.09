const request = require('request'); 
const cheerio = require('cheerio'); 

let time = Date.now(); 

const url = 'https://vihr-motors.ru/catalog/19/filter/brand_custom-is-sea-..'; 

request( 
  { 
    "rejectUnauthorized": false, 
    "url": url, 
  }, 
  (err, response, body) => { 

    if(!err && response.statusCode === 200) { 

    time = Date.now() - time; 
    console.log('Время загрузки страницы: ' + url + ' ' + time + ' ms'); 

    const $ = cheerio.load(body); 
    const priceList = $('.startshop_col'); 

    priceList.each((idx, item) => { 

      let product = cheerio.load(item); 
      let name = product('.name').text().trim(); 

      let realPrice = parseFloat( 
      del_spaces(product('.new_price').text().trim()) 
    ); 

    let oldPrice = product('.oldPrice').text().trim(); 
    if (oldPrice.length > 0) { 
      oldPrice = parseFloat(del_spaces(oldPrice)); 
    } else { 
      oldPrice = 0; 
    } 

    console.log( 
      (idx + 1) + '. ' + name + ' ' + 
      (oldPrice > 0) ? ('старая цена: ' + oldPrice + ' р; цена со скидкой: ') : '' + 
      realPrice + ' р;') 
  }); 

  } else { 
    console.log(err); 
  } 
}); 

function del_spaces(str) { 
  str = str.replace(/\s/g, ''); 
  return str; 
}