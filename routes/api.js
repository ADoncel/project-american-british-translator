'use strict';

const Translator = require('../components/translator.js');

module.exports = function(app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let text = req.body.text;
      let locale = req.body.locale;

      if (!text || !locale) {
        if (text == '') {
          res.json({ error: 'No text to translate' });
          return;
        }
        res.json({ error: 'Required field(s) missing' })
        return;
      }

      let translation = '';

      switch (locale) {
        case 'british-to-american':
          translation = translator.toAmerican(text);
          break;
        case 'american-to-british':
          translation = translator.toBritish(text);
          break;
        default:
          res.json({ error: 'Invalid value for locale field' });
          return;
      }

      res.json({
        text: text,
        translation: translation
      })
    });
};
