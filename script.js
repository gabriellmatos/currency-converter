const currencies = document.getElementById('currencies');
const submit = document.getElementById('button');
const amount = document.getElementById('amount');
const rate = document.getElementById('rate');
const dollarCurrency = document.getElementById('dollar-curr');
const history = document.getElementById('history');

const rates = [];

async function initProgram() {
	await fillCurrencySelector();
}

async function fillCurrencySelector() {
	const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
	const data = await response.json();

	if (data) {
		const currenciesArray = Object.keys(data.rates);

		currenciesArray.forEach((item) => {
			const optionElement = document.createElement('option');
			optionElement.value = item;
			optionElement.innerText = item;
			if (item === 'USD') {
				optionElement.selected = true;
			}
			currencies.appendChild(optionElement);
		});
	}
}

async function calculateRate() {
	const varCurr = currencies.value;
	let varRate = 0;
	let divEl = '';

	await fetch('https://open.er-api.com/v6/latest/USD')
		.then((res) => res.json())
		.then((data) => {
			if (data) {
				varRate = data.rates[currencies.value];
				rate.innerText = `1 USD = ${data.rates[currencies.value]} ${currencies.value}`;
				amount.innerText = data.rates[currencies.value] * dollarCurrency.value;
			}
		});

	const newHistoryRates = {
		id: crypto.randomUUID(),
		dollar: 'USD',
		rate: varRate,
		amount: amount.innerText,
	};

	const postResponse = await fetch('http://localhost:3000/api/history', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(newHistoryRates),
	});

	history.innerText = '';

	fetch('http://localhost:3000/api/history')
		.then((res) => res.json())
		.then((data) => {
			data.forEach((item) => {
				history.innerText += JSON.stringify(item) + '\n';
			});
		});
}

initProgram();

button.addEventListener('click', calculateRate);
dollarCurrency.addEventListener('change', calculateRate);
currencies.addEventListener('change', calculateRate);
