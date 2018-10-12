var request = require('request');
var cheerio = require('cheerio');
request('https://habr.com/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        //console.log(html)
        $('.post__title_link').each(function (i, element) {
            console.log(i +')' + element.children[0].data);
            var cols = $(this).find('td');
            console.log(
                cols.eq(0).text()
                + " " + cols.eq(1).text()
                + " " + cols.eq(2).text()
            );
        });

    }else {
        console.log('Request error');
    }
});
