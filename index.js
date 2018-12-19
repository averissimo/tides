const cheerio = require('cheerio');
const request = require('request');
const moment = require('moment-timezone');

class Tides {
  static forecastURL(position) {
    return `https://www.tide-forecast.com/locations/${position}/tides/latest`;
  }

  // See page below for the correct id to use here
  //  https://www.ipma.pt/pt/maritima/costeira/index.jsp?selLocal=42&idLocal=42
  async forecast(id) {
    const promise = await new Promise((resolve, reject) => {
      request
        .get({
          url: Tides.forecastURL(id)
        }, (error, reponse, body) => {
          if (error) {
            reject(error);
          }

          const $ = cheerio.load(body);

          const tides = {};

          const table = $('table.tide-table tr');

          let today;
          let day;
          let time;
          let timeZone;
          let type;
          let level;

          let firstDay;

          console.log(table.length);
          table.each((i, el) => {
            $(el).find('td, th').each((j, el2) => {
              let className = $(el2).attr('class');
              if (!className) {
                className = 'desc';
              }
              switch (className.trim()) {
                case 'date':
                  day = $(el2).text().trim();
                  break;
                case 'date last':
                  day = $(el2).text().trim();
                  break;
                case 'time tide':
                  time = $(el2).text().trim();
                  break;
                case 'time-zone':
                  timeZone = $(el2).text().trim();
                  break;
                // There's also a desc field
                case 'level metric':
                  level = $(el2).text().trim();
                  break;
                case 'tide':
                  type = $(el2).text().trim();
                  break;
                default: break;
              }
              if (className.trim() === 'time-zone' && time && timeZone && day) {
                today = moment.tz(`${day} ${time}`, 'dddd D MMMM h:mm A', timeZone);
                if (!today.isValid()) {
                  today = moment.tz(`${day} ${moment().year() + 1} ${time}`, 'dddd D MMMM YYYY h:mm A', timeZone);
                }
                if (!firstDay) {
                  firstDay = today;
                }
              }
            });
            if (type) {
              const startDay = today.startOf('day').unix();

              if (!tides[startDay]) {
                tides[startDay] = {date: startDay, data: [], source: 'tide-forecast.com'};
              }
              tides[startDay].data.push({time: today, level, type});
            }
            type = undefined;
            level = undefined;
            time = undefined;
            timeZone = undefined;
          });

          resolve(Object.values(tides).slice(0, 7));
        });
    });

    return promise;
  }
}

module.exports = {Tides};
