// Global variables to keep track of the calculator
let displayValue = "";
let number1 = "";
let number2 = "";
let operator = "";

// Keeping access to widely used HTML element
const displayHTML = document.getElementById("mainDisplay");
const equalsHTML = document.getElementById("equals");
const decimalHTML = document.getElementById("decimal");

// Basic Calculator functions ensuring large numbers are rounded to 3 decimal places
function add(a, b) {
  const addition = Number(a) + Number(b);

  if (addition.toString().indexOf(".") === -1) {
    return addition;
  }

  return addition.toFixed(3);
}

function subtract(a, b) {
  const subtraction = a - b;

  if (subtraction.toString().indexOf(".") === -1) {
    return subtraction;
  }

  return subtraction.toFixed(3);
}

function multiply(a, b) {
  const multiplication = a * b;

  if (multiplication.toString().indexOf(".") === -1) {
    return multiplication;
  }

  return multiplication.toFixed(3);
}

function divide(a, b) {
  if (Number(a) === 0 || Number(b) === 0) {
    return "ERROR";
  }
  const division = a / b;

  if (division.toString().indexOf(".") === -1) {
    return division;
  }

  return division.toFixed(3);
}

// Run mathematical operation based on user input
function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "X":
      return multiply(a, b);
    case "÷":
      return divide(a, b);
    default:
      break;
  }
}

// Show the operated final value in the display
function operateAndDisplay() {
  const value = operate(operator, number1, number2);

  if (isNaN(value)) {
    displayHTML.textContent = "ERROR!";
    setTimeout(() => {
      clearDOM();
    }, 2500);

    return null;
  }

  displayHTML.textContent = value;
  number1 = value;
  number2 = "";
  operator = "";
}

// Adding number to DOM function
function addNumberToDOM(number) {
  if (!operator) {
    // Ensuring numbers don't have zeroes in the front
    if (number1 === 0) {
      number1 = number;
      displayHTML.textContent = number1;
    } else {
      number1 += number;
      displayHTML.textContent = number1;
    }
  } else {
    number2 += number;
    displayHTML.textContent = number2;
    equalsHTML.classList.add("enabled");
  }
}

// Clear DOM on AC
function clearDOM() {
  displayHTML.textContent = "0";
  number1 = "";
  number2 = "";
  operator = "";
  equalsHTML.classList.remove("enabled");
}

// Listen for input and change number variables
document
  .querySelectorAll(".number")
  .forEach((numberElement) =>
    numberElement.addEventListener("click", () =>
      addNumberToDOM(numberElement.textContent)
    )
  );

// Handle operator selection
function operatorSelectionDOM(operatorElement) {
  if (!operator) {
    operator = operatorElement;
    const currentValue = displayHTML.textContent;
    // To have a small flicker effect
    displayHTML.textContent = "";
    setTimeout(() => {
      displayHTML.textContent = currentValue;
    }, 50);
  } else {
    operateAndDisplay();
    operator = operatorElement;
    equalsHTML.classList.toggle("enabled");
  }
}

// Listen for selection of operand
document
  .querySelectorAll(".operand")
  .forEach((operatorElement) =>
    operatorElement.addEventListener("click", () =>
      operatorSelectionDOM(operatorElement.textContent)
    )
  );

// Clear the display on AC click
document.getElementById("AC").addEventListener("click", () => clearDOM());

// Handle equals
function handleEquals() {
  if (number2) {
    operateAndDisplay();
    equalsHTML.classList.toggle("enabled");
  }
}

// Allow equals ensuring number2 presence
document
  .getElementById("equals")
  .addEventListener("click", () => handleEquals());

// Decimal function
function handleDecimal() {
  const decimal = ".";
  if (!operator) {
    if (!number1.includes(decimal)) {
      number1 += decimal;
      displayHTML.textContent = number1;
    }
  } else {
    if (!number2.includes(decimal)) {
      number2 += decimal;
      displayHTML.textContent = number2;
    }
  }
}

// Handling decimal selection
document
  .getElementById("decimal")
  .addEventListener("click", () => handleDecimal());

// Percentage function
function handlePercentage() {
  // Number2 presence should lead to conversion to percentage and operation on it
  if (operator && number2) {
    number2 = divide(number2, 100);
    equalsHTML.classList.remove("enabled");
    operateAndDisplay();
  } else if (number1) {
    number1 = divide(number1, 100);
    displayHTML.textContent = number1;
  }
}

// Handling % (percentage) selection
document
  .getElementById("percentage")
  .addEventListener("click", () => handlePercentage());

// Backspace function
function handleBackSpace() {
  // Check which number exists in the program and remove the last digit from there
  if (number2) {
    number2 = number2.toString().slice(0, -1);
    if (number2 === "") {
      displayHTML.textContent = "0";
    } else {
      displayHTML.textContent = number2;
    }
  } else if (number1) {
    number1 = number1.toString().slice(0, -1);
    if (number1 === "") {
      displayHTML.textContent = "0";
    } else {
      displayHTML.textContent = number1;
    }
  }
}

// Handling C (backspace) selection
document
  .getElementById("backspace")
  .addEventListener("click", () => handleBackSpace());

const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operatorKeys = ["+", "-", "*", "/"];
const enterKeys = ["Enter", "="];
const decimalKeys = ["."];
const operatorConversion = {
  "+": "+",
  "-": "-",
  "*": "X",
  "/": "÷",
};

document.addEventListener(
  "keydown",
  (event) => {
    console.log(event.key);
    if (numberKeys.includes(event.key)) {
      addNumberToDOM(event.key);
    } else if (operatorKeys.includes(event.key)) {
      operatorSelectionDOM(operatorConversion[event.key]);
    } else if (enterKeys.includes(event.key)) {
      handleEquals();
    } else if (event.key === ".") {
      handleDecimal();
    } else if (event.key === "Backspace") {
      handleBackSpace();
    } else if (event.key === "%") {
      handlePercentage();
    }
  },
  false
);
