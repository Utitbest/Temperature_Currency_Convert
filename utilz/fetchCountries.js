
import fs from 'fs';
import https from 'https';

const url = 'https://restcountries.com/v3.1/all?fields=name,flags,currencies,cca2';

https.get(url, (res) => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    fs.writeFileSync('public/fetchCountries.json', data, 'utf8');
    console.log('countries.json saved!');
  });
}).on('error', err => {
  console.error('Error fetching data:', err.message);
});
