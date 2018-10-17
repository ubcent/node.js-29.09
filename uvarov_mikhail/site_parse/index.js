const request = require('request'); 
const cheerio = require('cheerio'); 

let time = Date.now(); 

const url = 'https://ilodki.ru/pvh_lodki-m1/fregat-d1/'; 

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
    const priceList = $('.product'); 

    priceList.each((idx, item) => { 

      let product = cheerio.load(item); 
      let name = product('.hat').text().trim();
      
      let realPrice = parsePrice(product('.realPrice').text().trim());
      
      let oldPrice = parsePrice(product('.oldPrice').text().trim()); 
      
     
      
      let priceString = 
        (oldPrice > 0) ? 
          ('старая цена: ' + oldPrice + ' р; цена со скидкой: ') : 
          'цена: ';
          
      priceString += realPrice;
      
      console.log( 
        (idx + 1) + '. ' + name + ' ' + 
        priceString + ' р;'); 

    
  }); 

  } else { 
    console.log(err); 
  } 
}); 

function del_spaces(str) { 
  str = str.replace(/\s/g, ''); 
  return str; 
}

function parsePrice(price) {	
  price = price.toString().replace(/\руб./g, '');	
  price = del_spaces(price);
  if (price.length == 0 || price == 0) {
	return 0;
  }	
  return parseFloat(price);
}