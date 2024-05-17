const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget-number');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

let isError = false;

function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
}

function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return regex.test(str);
}

function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    let entryNumber1 = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const entryNumber = entryNumber1;
    const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name"></input>
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories"></input> 
    `;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

addEntryButton.addEventListener('click', addEntry);

function getCaloriesFromInputs(list) {
    let carlories = 0;
    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);
        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
    }   carlories += Number(currVal);
    return carlories;
}

function calculateCalories(e) {
    e.preventDefault();
    isError = false;
    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snackNumberInputs = document.querySelectorAll('#snack input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snackCalories = getCaloriesFromInputs(snackNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    if (isError) {
        return;
    }

    const totalCalories = sum(breakfastCalories, lunchCalories, dinnerCalories, snackCalories);
    const remainingCalories = subtract(budgetCalories, sum(totalCalories, exerciseCalories));

    const surplusOrDeficit = remainingCalories < 0 ? 'deficit' : 'surpluse';
    output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(surplusOrDeficit)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;
    output.classList.remove('hide');
}

calorieCounter.addEventListener('submit', calculateCalories);

function clearForm(){
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));
    for (const container of inputContainers) {
        container.innerHTML = '';
    }
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

clearButton.addEventListener('click', clearForm);