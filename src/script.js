//1.grab elements
const display = document.querySelector('.calculator-screen span:first-child');
const resultDisplay = document.querySelector('.calculator-screen span:last-child');
const buttons = document.querySelectorAll('.calculator-keypad button');
const themeToggle = document.querySelector('.toggle-container');
const knob = document.getElementById('toggle-knob');
const knobIcon = document.getElementById('toggle-icon');

//assigning keymap
const keyMap = {
	'0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
	'5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
	'.': '.',
	'+': '+',
	'-': '−', // Unicode minus sign 
	'*': '×', // Unicode multiplication sign 
	'/': '÷', // Unicode division sign 
	'%': '%',
	'Enter': '=',
	'=': '=',
	'Backspace': 'backspace',
	'Escape': 'AC'
};


// 2. Assign variables
let expression = '';
let isDarkMode = true; // default mode
let isResult = false; // Flag to check if the current display value is a result
const MAX_CHARS = 24;


function adjustFontSize() {
	const containerWidth = display.parentElement.offsetWidth;
	// Use text length or 1 to prevent division by zero
	const textLength = display.textContent.length || 1;

	const maxFontSize = 48; // Corresponds to the initial 3rem (text-5xl)
	const minFontSize = 32; // Corresponds to the previous smallest size (2rem)

	// Calculate the font size based on container width and text length
	const dynamicSize = containerWidth / textLength;

	// Clamp the font size between our min and max bounds for consistency
	const newSize = Math.max(minFontSize, Math.min(dynamicSize, maxFontSize));
	display.style.fontSize = `${newSize}px`;
}

function updateLiveResult() {
	// Create a temporary expression for safe evaluation
	let tempExpression = expression;

	// If the expression is empty, the result is 0
	if (!tempExpression) {
		resultDisplay.textContent = '= 0';
		return;
	}

	// If the last character is an operator or a dot, evaluate the expression without it
	const lastChar = tempExpression.slice(-1);
	if (['+', '−', '×', '÷', '.'].includes(lastChar)) {
		tempExpression = tempExpression.slice(0, -1);
	}

	// Avoid evaluation if the expression is or becomes empty after stripping the last char
	if (!tempExpression) {
		resultDisplay.textContent = '= 0';
		return;
	}

	try {
		// Replace display operators with JS operators for evaluation
		const evalExpression = tempExpression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
		const result = Function(`'use strict'; return ${evalExpression}`)();
		resultDisplay.textContent = `= ${!isFinite(result) ? 'Error' : parseFloat(result.toPrecision(12))}`;
	} catch (e) {
		// An error means the expression is not evaluatable yet (e.g., "5*").
		// We don't update the display, letting it show the last valid result.
	}
}

//3.theme toggle logic
themeToggle.addEventListener('click', () => {
	if ("vibrate" in navigator) {
		navigator.vibrate(5);
	}

	const container = document.querySelector('.calc-container');
	const buttons = document.querySelectorAll('.btn-num, .btn-circle, .btn-equal, .toggle-container');
	isDarkMode = !isDarkMode;


	if (isDarkMode) {
		knob.classList.remove('translate-x-10');
		knobIcon.textContent = 'bedtime';
	} else {
		knob.classList.add('translate-x-10'); // adjust distance if needed
		knobIcon.textContent = 'sunny';
	}

	// toggle class
	container.classList.toggle('light-theme');
	container.classList.toggle('dark-theme');

	// Update shadow classes for the container and all buttons
	if (container.classList.contains('light-theme')) {
		buttons.forEach(button => {
			button.classList.remove('dark:shadow-custom-dark');
			button.classList.add('shadow-custom-light');
		});
	} else {
		buttons.forEach(button => {
			button.classList.remove('shadow-custom-light');
			button.classList.add('dark:shadow-custom-dark');
		});
	}

});


//3.Calculation logic
buttons.forEach(button => {
	button.addEventListener('click', () => {
		// Vibrate on click
		if ("vibrate" in navigator) navigator.vibrate(5);

		const key = button.dataset.key;

		if (button.classList.contains('btn-num')) {
			if (expression.length >= MAX_CHARS) return;
			if (isResult) {
				expression = '';
				isResult = false;
			}
			expression += key;
			display.textContent = expression;
		} else if (button.classList.contains('btn-op')) {
			isResult = false;
			if (key === 'AC') {
				expression = '';
				display.textContent = '0';
				resultDisplay.textContent = '= 0';
			} else if (key === 'backspace') {
				expression = expression.slice(0, -1);
				display.textContent = expression || '0';
			} else if (key === '%') {
				if (expression === '') return;
				const match = expression.match(/[\d.]+$/);
				if (match) {
					const lastNumber = match[0];
					const percentage = parseFloat(lastNumber) / 100;
					expression = expression.substring(0, expression.length - lastNumber.length) + percentage;
					display.textContent = expression;
				}
			} else { // Other operators
				if (expression === '' || expression.endsWith('.')) return;
				const lastChar = expression.slice(-1);
				if (['+', '−', '×', '÷'].includes(lastChar)) {
					expression = expression.slice(0, -1) + key;
				} else {
					expression += key;
				}
				display.textContent = expression;
			}
		} else if (button.classList.contains('btn-equal')) {
			if (expression === '') return;
			try {
				// Replace display operators with JS operators for evaluation
				const evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
				const result = Function(`'use strict'; return ${evalExpression}`)();
				resultDisplay.textContent = `= ${result}`;
				display.textContent = result;
				expression = result.toString();
				isResult = true;
			} catch {
				resultDisplay.textContent = 'Error';
				expression = '';
			}
		}
		// For any key except '=', update the live result preview
		if (!button.classList.contains('btn-equal')) {
			updateLiveResult();
		}
		adjustFontSize();
	});
});
// 4. Sync with keyboard
document.addEventListener('keydown', (e) => {
	const key = e.key;

	const mappedKey = keyMap[key];
	if (mappedKey) {
		const button = Array.from(buttons).find(btn => btn.dataset.key === mappedKey);
		if (button) {
			button.click();
		}
	}
});