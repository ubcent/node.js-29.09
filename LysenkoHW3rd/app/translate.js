const request = require('request');
const rl = require ('readline').createInterface({input: process.stdin, output: process.stdout});

const key = 'trnsl.1.1.20181008T115503Z.0eeb525cb3b8bbff.17b2240139d943f46c78d86b9f05d0bfd42412e4';

const ruAnsw = 'Введите слово, которое хотите перевести на английский:'
const engAnsw = 'Enter the word which one u want to translate into russian language:'

class Translator {
  chooseLanguage(){
    rl.question(
      `\nChoose kind of translate:\n
      From EN to RU -> 1\n 
      From RU to EN -> 2\n
      Exit - Ctrl+C\n`, (answ) => {
      switch (answ){
        case '1': 
          this.lang = 'en-ru' 
          break
        case '2': 
          this.lang = 'ru-en'
          break
        default: this.chooseLanguage()
      }
      this.askWord()
    })
  }

  askWord(){
    switch (this.lang) {
      case ('en-ru'):
        rl.question(`\n${engAnsw} \n`, (answ) => {this.translation(answ)})
        break
      case ('ru-en'):
        rl.question(`\n${ruAnsw} \n`, (answ) => {this.translation(answ)})
        break
      default: this.chooseLanguage()
    }
  }
  
  translation(word){
    request(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${word}&lang=${this.lang}&format=plain`, function (error, response, html) {
      html = JSON.parse(html);
      if (html.code == 200) {
          console.log(html.text[0]);
          process.exit()
      }
      else {
          console.log('Error' + html.code + ' ' + html.message);
          process.exit()
      }
    })
  }

  renderTranslator(){
    this.chooseLanguage()
  }
}

const translation = new Translator()
translation.renderTranslator()
