// import './style.css'
import { initBackground } from './utilz/background.js';
import { showToast } from './utilz/ShowToast.js';

let temperconvert = document.getElementById('temperatureSpin');
let swapCurrencies1 = document.getElementById('swapCurrencies');
const RESULTBOX = document.getElementById('resultBand-Currency');
const parentSlide = document.getElementById('parentSlide1');
const temperatureValue = document.getElementById('temperature-from')
const temperatureConvertBuds = document.getElementById('TemperatureConverterBud')
const TEMPEBOX = document.getElementById('temperatureREsu')

async function fetchCountries() {
    try {
      const response = await fetch('fetchCountries.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      const credentials = data.map(county =>{
        if (!county.name || !county.flags || !county.currencies || !county.cca2) {
          console.warn('Missing data for country:', county);
          return null; 
        }
        if (typeof county.name !== 'object' || typeof county.flags !== 'object' ||
            typeof county.currencies !== 'object' || typeof county.cca2 !== 'string') {
          console.warn('Invalid data format for country:', county);
          return null; 
        }

        const name = county.name.common || county.name.official || 'Unknown';
        const currencyCode = Object.keys(county.currencies)[0];
        const currency = county.currencies[currencyCode];
        return {
          name: name,
          flagsvg: county.flags.svg || 'placeholder-600x317.gif',
          flagPng: county.flags.png || 'placeholder-600x317.gif',
          flagAlt: county.flags.alt || '',
          flagEmoji: county.flags.emoji || '',
          currency: Object.keys(county.currencies || {})[0],
          cca2: county.cca2,
          symbol: currency ? currency.symbol || '' : '',
          currencyName: currency ? currency.name || '' : '',
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
        
      return credentials
    }catch (error){
      console.error('Error fetching countries:', error);
      showToast('Failed to fetch countries. Please try again later.', 'error');
      return [];
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    initBackground()
    
    document.querySelectorAll('header div').forEach(e =>{
        e.addEventListener('click', () => {
            document.querySelectorAll('header div').forEach(e => e.classList.remove('active'))
            e.classList.add('active')
            const valuediv = e.getAttribute('data-value');
            switch (valuediv) {
                case 'currency':
                    parentSlide.classList.remove('flipped');
                break;
            
                case'temperature':
                    parentSlide.classList.add('flipped');
                break;
            }
        })
    })

const allCountries = await fetchCountries();
document.querySelectorAll('.custom-dropdown').forEach(dropdown => { 
  const selected = dropdown.querySelector('.dropdown-selected');
  const optionsBox = dropdown.querySelector('.dropdown-options');
  const contentwrapper = optionsBox.querySelector('.contentwrapper');
  const searchInput = dropdown.querySelector('.dropdown-search')
  const placeholder = selected.querySelector('.placeholder');
  const clearButton = selected.querySelector('.clear-button');
  const allInputs = dropdown.querySelectorAll('.dropdown-temperate')
  selected.addEventListener('click', (e) => {
    e.stopPropagation();

    document.querySelectorAll('.dropdown-options').forEach(opt => {
      if (opt !== optionsBox) {
        opt.style.visibility = 'hidden';
        opt.style.opacity = '0';
      }
    });
    
    const isVisible = optionsBox.style.visibility === 'visible';
    optionsBox.style.visibility = isVisible ? 'hidden' : 'visible';
    optionsBox.style.opacity = isVisible ? '0' : '1';
  });

 

  searchInput.addEventListener('click', (e)=>{
    e.stopPropagation()
  })

 
  clearButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdownSelected = clearButton.closest('.dropdown-selected');
    const placeholder = dropdownSelected.querySelector('.placeholder');
    const selected1 = placeholder.getAttribute('data-placeHold')
    console.log(selected1)
    placeholder.textContent = selected1; 
    selected.removeAttribute('data-value');
    clearButton.style.display = 'none';
  });

  allCountries.forEach(country => {
    const option = document.createElement('div');
    option.className = 'dropdown-option';
    option.dataset.value = country.currency;
    option.dataset.symbol = country.symbol || '';
    option.innerHTML = `
      <img src="${country.flagsvg || country.flagPng}" alt="${country.flagAlt}" style="width: 20px; height: 14px; margin-right: 6px;" />
      ${country.name} (${country.symbol || ''})
    `;
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      placeholder.textContent = option.textContent;
      selected.setAttribute('data-value', option.dataset.value);
      selected.setAttribute('data-symbon', option.dataset.symbol);
      optionsBox.style.visibility = 'hidden';
      optionsBox.style.opacity = '0';
      clearButton.style.display = 'inline-block';
      if(searchInput.value !== '') {
        searchInput.value = '';
        const options = optionsBox.querySelectorAll('.dropdown-option');
        options.forEach(opt => {
          opt.style.display = 'block';
        });
      }
      searchInput.focus();
    });
    if(!contentwrapper) return;
    contentwrapper.appendChild(option);

    searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const options = optionsBox.querySelectorAll('.dropdown-option');
    options.forEach(option => {
      const text = option.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        option.style.display = 'block'; 
      } else {
        option.style.display = 'none';
      }

    });
    if (searchTerm === '') {
      options.forEach(option => {
        
        option.style.display = 'block';
      });
    }   
  });
  
  });

  allInputs.forEach(val =>{
    val.addEventListener('click', ()=>{
      const values = val.getAttribute('data-value')
      selected.setAttribute('data-value', values);
      placeholder.textContent = val.textContent;
    })
  })

});

document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-options').forEach(opt => {
    opt.style.visibility = 'hidden';
    opt.style.opacity = '0';
  });
});

document.getElementById('SyncExchange').addEventListener('click', async () => {
  initsync('currency', true);
  const fromEl = document.getElementById('fromCurrency1');
  const toEl = document.getElementById('toCurrency2');

  const fromCurrency = fromEl?.getAttribute('data-value');
  const toCurrency = toEl?.getAttribute('data-value');
  const symbonon = fromEl?.getAttribute('data-symbon') || '';
  const symbonon2 = toEl?.getAttribute('data-symbon') || '';
  const amount = parseFloat(document.getElementById('currency-from')?.value);
  if (!fromCurrency || !toCurrency) {
    initsync('currency', false);
    ErrorLog('values')
    showToast('Please select both currencies.', 'error');
    RESULTBOX.innerHTML = 'Please select both currencies.';
    return;
  }

  if (isNaN(amount)) {
    initsync('currency', false);
    ErrorLog('selectAmount')
    RESULTBOX.innerHTML = 'Please enter a valid amount.';
    showToast('Please enter a valid amount.', 'error');
    return;
  }

  const url = `/.netlify/functions/converter?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
  try {   
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
  //  setTimeout(() =>{
    RESULTBOX.innerHTML = `${(symbonon)}${amount.toLocaleString()} ${fromCurrency} => ${(symbonon2)}${data.result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${toCurrency}`;
    initsync('currency', false);
  //  }, 3000)
  } catch (error) {
    console.error('Error fetching conversion data:', error);
    showToast(`Error: ${error}`, "error");
    initsync('currency', false);
    RESULTBOX.innerHTML = 'Fail to fetching data. Please try again later.';
  }

});

temperatureConvertBuds.addEventListener('click', ()=>{
  initsync('temperature', true);
  const valueToconvert = parseFloat(temperatureValue?.value);
  const fromTemperatureCon = document.getElementById('fromtempe')
  const toTemperatureCon = document.getElementById('totempe')
  
  const fromvalueD = fromTemperatureCon?.getAttribute('data-value')
  const tovalueD = toTemperatureCon?.getAttribute('data-value')

   if (!fromvalueD || !tovalueD) {
    initsync('temperature', false);
    ErrorLog('temperturevaluz')
    TEMPEBOX.innerHTML = 'Select a Measuring Unit.'
    showToast('Select a Measuring Unit.', 'error');
    return;
  }

  if (isNaN(valueToconvert)) {
    initsync('temperature', false);
    ErrorLog('temperatureAmmount')
    TEMPEBOX.innerHTML = 'Please enter a valid amount.';
    showToast('Please enter a valid amount.', 'error');
    return;
  }

 
    initsync('temperature', false);
    const result = convertTemperature(valueToconvert, fromvalueD, tovalueD);
    TEMPEBOX.textContent = result !== null ? `${result.toFixed(2)} ${tovalueD}` : 'Invalid input';

  

})

});
function initsync(side ,isLoading) {
  switch (side) {
    case 'currency':
      if (!swapCurrencies1) return;
      const syncBtn = document.getElementById('SyncExchange');
      if (isLoading) {
        swapCurrencies1.innerHTML = `<img class="spiro" src="synchronize-svgrepo-com.svg" alt="Syncing...">`;
        if (syncBtn) {
          syncBtn.innerHTML = 'Please Wait...';
          syncBtn.disabled = true;
        }
      } else {
        swapCurrencies1.innerHTML = `<img src="sort-swap-svgrepo-com.svg" alt="Swap">`;
        if (syncBtn) {
          syncBtn.innerHTML = 'Get Exchange Rate';
          syncBtn.disabled = false;
        }
      }
    break

    case 'temperature':
      if (!temperconvert) return;
      const TemperatureConverterBud = document.getElementById('TemperatureConverterBud');
      if (isLoading) {
        temperconvert.innerHTML = `<img class="spiro" src="synchronize-svgrepo-com.svg" alt="Syncing...">`;
        if (TemperatureConverterBud) {
          TemperatureConverterBud.innerHTML = 'Calculating Please Wait...';
          TemperatureConverterBud.disabled = true;
        }
      } else {
        temperconvert.innerHTML = `<img src="sort-swap-svgrepo-com.svg" alt="Swap">`;
        if (TemperatureConverterBud) {
          TemperatureConverterBud.innerHTML = 'Calculate';
          TemperatureConverterBud.disabled = false;
        }
      }
    break
  }
}
function convertTemperature(value, fromUnit, toUnit) {
  value = parseFloat(value);
  if (isNaN(value)) return null;

  let celsius;
  switch (fromUnit) {
    case 'celsius(°C)':
      celsius = value;
      break;
    case 'fahrenheit(°F)':
      celsius = (value - 32) * 5 / 9;
    break;
    case 'kelvin(K)':
      celsius = value - 273.15;
    break;
    default:
      return null;
  }

  switch (toUnit) {
    case 'celsius(°C)':
      return celsius;
    case 'fahrenheit(°F)':
      return (celsius * 9 / 5) + 32;
    case 'kelvin(K)':
      return celsius + 273.15;
    default:
      return null;
  }
}
function ErrorLog(typeOfError){
  const fromEl = document.getElementById('fromCurrency1');
  const toEl = document.getElementById('toCurrency2');
  const amount = document.getElementById('currency-from')

  const fromTemperatureCon = document.getElementById('fromtempe')
  const toTemperatureCon = document.getElementById('totempe')

  
  switch (typeOfError) {
    case 'selectAmount':
      amount.classList.add('indicateError')
      setTimeout(()=>{
        if(amount.classList.contains('indicateError')){
          amount.classList.remove('indicateError')
        }
      }, 1000)
    break;
  
    case 'values':
      fromEl.classList.add('indicateError')
      toEl.classList.add('indicateError')
      setTimeout(()=>{
        if(toEl.classList.contains('indicateError') || fromEl.classList.contains('indicateError')){
          fromEl.classList.remove('indicateError')
          toEl.classList.remove('indicateError')
        }
      }, 1000)
    break;

    case 'temperturevaluz':
      fromTemperatureCon.classList.add('indicateError')
      toTemperatureCon.classList.add('indicateError')
      setTimeout(()=>{
        if(toTemperatureCon.classList.contains('indicateError') || fromTemperatureCon.classList.contains('indicateError')){
          fromTemperatureCon.classList.remove('indicateError')
          toTemperatureCon.classList.remove('indicateError')
        }
      }, 1000)
    break

    case 'temperatureAmmount':
      temperatureValue.classList.add('indicateError')
      setTimeout(()=>{
        if(temperatureValue.classList.contains('indicateError')){
          temperatureValue.classList.remove('indicateError')
        }
      }, 1000)
    break;
  }

}
// const temperatureTab = document.getElementById('checkSize');
// const currencyTab = document.getElementById('currencySize')
// window.addEventListener('resize', ()=>{
  
//   if(window.innerWidth <= 500){
//     currencyTab.innerHTML = `<img style="width:50px; height:50px;" src="currency-exchange-svgrepo-com.svg" alt="Idadt1">`;
//     temperatureTab.innerHTML = `<img style="width:50px; height:50px;" src="thermometer-svgrepo-com.svg" alt="Idadt2">`;
//   }else{
//     temperatureTab.innerHTML = 'Temperature Converter';
//     currencyTab.innerHTML = 'Currency Converter';
//   }
// })