const currencies = document.getElementById('currencies');
const submit = document.getElementById('button');
const amount = document.getElementById('amount');
const rate = document.getElementById('rate');
const dollarCurrency = document.getElementById('dollar-curr');
const history = document.getElementById('history');
const clear = document.getElementById('clear');

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
	history.innerText = '';

	const responseCurrencies = await fetch('https://open.er-api.com/v6/latest/USD');
	const dataResponseCurrencies = await responseCurrencies.json();

	if (dataResponseCurrencies) {
		varRate = dataResponseCurrencies.rates[currencies.value];
		rate.innerText = `1 USD = ${dataResponseCurrencies.rates[currencies.value]} ${currencies.value}`;
		amount.innerText = dataResponseCurrencies.rates[currencies.value] * dollarCurrency.value;
	}

	const newHistoryRates = {
		sourceCurrency: 'USD',
		targetCurrency: varCurr,
		rate: varRate,
		amount: amount.innerText,
	};

	const postResponse = await fetch('http://localhost:3000/api/history', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(newHistoryRates),
	});

	const getResponse = await fetch('http://localhost:3000/api/history');
	const dataGetResponse = await getResponse.json();

	let htmlTable = `
		<table>
			<thead>
				<tr>
					<th>Source</th>
					<th>Target</th>
					<th>Rate</th>
					<th>Amount</th>
				</tr>
			</thead>
			<tbody>
	`;

	dataGetResponse.forEach((item, index) => {
		htmlTable += `
			<tr>
				<td>${item.sourceCurrency}</td>
				<td>${item.targetCurrency}</td>
				<td>${item.rate}</td>
				<td>${item.amount}</td>
			</tr>
		`;
	});

	htmlTable += `</tbody>
		</table>
	`;

	history.innerHTML = htmlTable;
}

initProgram();

button.addEventListener('click', calculateRate);
clear.addEventListener('click', async () => {
	const deleteResponse = await fetch('http://localhost:3000/api/history', {
		method: 'DELETE',
	});

	const dataResponse = await deleteResponse.json();
	history.innerHTML = '';
	console.log(dataResponse);
});
