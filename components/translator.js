const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

  decorate(word) {
    return "<span class=\"highlight\">" + word + "</span>"
  }

  objSwap(obj) {
    return Object.entries(obj).reduce((ret, [key, value]) => {
      ret[value] = key;
      return ret;
    }, {});
  }

  capitalizeFirst(word) {
    return word[0].toUpperCase() + word.slice(1);
  }

  toAmerican(text) {
    const britToAmericanSpell = this.objSwap(americanToBritishSpelling);
    const wordComparation = { ...britToAmericanSpell, ...britishOnly };
    const britToAmericanTitles = this.objSwap(americanToBritishTitles);

    return this.translate(text, wordComparation, britToAmericanTitles);
  }

  toBritish(text) {
    const wordComparation = { ...americanToBritishSpelling, ...americanOnly };

    return this.translate(text, wordComparation, americanToBritishTitles);
  }

  translate(text, wordComparation, titles) {
    let solution = text;

    Object.entries(wordComparation).forEach(([key, value]) => {
      const regText = `^${key}\\b|(?<=.*\\s)${key}\\b`;
      const regex = new RegExp(regText, 'gi')
      const idx = solution.toLowerCase().search(regex);
      if (idx != -1) {
        let change = key[0] === solution[idx] ? this.decorate(value) : this.decorate(this.capitalizeFirst(value))
        solution = solution.slice(0, idx) + change + solution.slice(idx + key.length)
      }
    })

    Object.entries(titles).forEach(([key, value]) => {
      if (key.search('\\.') > 0) {
        const newKey = key.replace('.', '\\.')
        if (solution.toLowerCase().search(newKey) >= 0) {
          const regex = new RegExp(key, 'gi')
          let change = this.decorate(this.capitalizeFirst(value))
          solution = solution.replace(regex, change)
        }
      } else {
        const regText = `^${key}\\b|(?<=.*\\s)${key}\\b`;
        const regex = new RegExp(regText, 'gi')
        const idx = solution.toLowerCase().search(regex);
        if (idx != -1) {
          let change = this.decorate(this.capitalizeFirst(value))
          solution = solution.slice(0, idx) + change + solution.slice(idx + key.length)
        }
      }
    })

    const hourRegex = /([0-9]|0[0-9]|1[0-9]|2[0-3])([:\.])([0-5][0-9])/g
    let hoursToChange = solution.match(hourRegex);

    if (hoursToChange) {
      hoursToChange.every((hour) => {
        let newHour = hour.search(':') != -1 ? hour.replace(':', '.') : hour.replace('.', ':')
        solution = solution.replace(hour, this.decorate(newHour));
      })
    }

    if (solution == text) return "Everything looks good to me!";
    else return solution;
  }
}

module.exports = Translator;