const lookup =
    (arr, title) => {
      let result = arr.find(el => el[1] == title);

      return result ? parseFloat(result[2]) : null;
    }

const offerExists =
    (twoDimArr, title,
     price) => {
      let result = twoDimArr.find(el => (el[1] == title && el[2] == price));
      return (result !== undefined);
    }

               function convertToCSV(data) {
                 return data.map(row => row.join(',')).join('\n');
               }

               function convertTo2DArr(data){
                data = data.split('\n');
                data.shift();
                data = data.map(el => el.split(','));
                data = data.filter(arr => arr.length > 1);
                return data;
               }

               function parseCustomDate(dateString) {
                 const [date, time] = dateString.split('T');
                 const [month, day, year] = date.split('-');
                 const [hours, minutes, seconds] = time.split(':');
                 return new Date(year, month - 1, day, hours, minutes, seconds);
               }

               module.exports = {
      lookup,
      offerExists,
      convertToCSV,
      convertTo2DArr,
      parseCustomDate
    }