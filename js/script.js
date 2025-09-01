"use strict";

const billEl = document.querySelector("#bill");
const customInputEl = document.querySelector(".custom-tip-input");
const tipButtonsEl = document.querySelectorAll(".tip-btn");
let activeTipValue;
const numberOfPeopleInputEl = document.querySelector("#people");
const resetButtonEl = document.querySelector(".reset-btn");

function toggleParentClass(element, className, condition) {
  element.parentElement.classList.toggle(className, condition);
}

function setInputFieldEmpty(element) {
  document.querySelector(element).value = "";
}

function setCalculatedTotal(value) {
  document.querySelector("#calculated-tip-total").textContent = value;
}

function setCalculatedTip(value) {
  document.querySelector("#calculated-tip-total-tip").textContent = value;
}

function setCalculatedTotalPerPerson(value) {
  document.querySelector("#calculated-tip-total-per-person").textContent =
    value;
}

function setCalculatedTipPerPerson(value) {
  document.querySelector("#calculated-tip-amount-per-person").textContent =
    value;
}

function presentAsAmountValue(value) {
  const num = Number(value);
  if (isNaN(num)) return "Not a number";
  return `$${(Math.ceil(num * 100) / 100).toFixed(2)}`;
}

function limitFieldValueToThreeDigits(element) {
  element.value = element.value.slice(0, 3);
}

function preventInsertOtherThanDigits(element) {
  element.value = element.value.replace(/\D/g, "");
}

function calculateTotalValue() {
  const bill = Number(billEl.value);
  const tip = Number(activeTipValue);
  return bill + bill * tip;
}

function calculateTotalTipValue() {
  return calculateTotalValue() - Number(billEl.value);
}

function calculateTotalPerPerson() {
  const total = calculateTotalValue();
  const people = Number(numberOfPeopleInputEl.value);
  return total / people > 0.01 ? total / people : 0.01;
}

function calculateTipPerPerson() {
  const totalTip = calculateTotalValue() - billEl.value;
  const people = Number(numberOfPeopleInputEl.value);
  return totalTip / people;
}

function presentValues(object) {
  setCalculatedTotal(presentAsAmountValue(object.totalValue));
  setCalculatedTip(presentAsAmountValue(object.tipValue));
  setCalculatedTotalPerPerson(presentAsAmountValue(object.totalPerPerson));
  setCalculatedTipPerPerson(presentAsAmountValue(object.tipPerPerson));
}

function calculateAndPresentTipValues() {
  const totalValue = calculateTotalValue();
  const totalPerPerson = calculateTotalPerPerson();
  const tipValue = calculateTotalTipValue();
  const tipPerPerson = calculateTipPerPerson();

  presentValues({ totalValue, totalPerPerson, tipValue, tipPerPerson });
}

function checkIfCorrectBillInput() {
  let value = billEl.value;
  const cursorPos = billEl.selectionStart;

  value = value.replace(",", ".");

  value = value.replace(/[^0-9.]/g, "");

  const firstDotIndex = value.indexOf(".");
  if (firstDotIndex !== -1) {
    value =
      value.slice(0, firstDotIndex + 1) +
      value.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  const parts = value.split(".");
  let newValue = value;

  if (parts[0] && parts[0].length > 5) {
    parts[0] = parts[0].substring(0, 5);
  }
  if (parts[1] && parts[1].length > 2) {
    parts[1] = parts[1].substring(0, 2);
  }

  if (parts.length === 2) {
    newValue = `${parts[0]}.${parts[1]}`;
  } else {
    newValue = parts[0];
  }

  if (billEl.value !== newValue) {
    billEl.value = newValue;

    billEl.setSelectionRange(cursorPos, cursorPos);
  }
}

function clearActiveBtns() {
  tipButtonsEl.forEach((tipBtn) => tipBtn.classList.remove("active"));
}

function clearCustomInputValue() {
  customInputEl.value = "";
  customInputEl.classList.remove("active");
}

function billAndPeopleCorrect() {
  const billCorrect =
    billEl.value && !billEl.parentElement.classList.contains("invalid");
  const peopleCorrect =
    numberOfPeopleInputEl.value &&
    !numberOfPeopleInputEl.parentElement.classList.contains("invalid");

  return billCorrect && peopleCorrect;
}

function selectedAnyBtnOrCustomInput() {
  const selectedAnyTipButton = Array.from(tipButtonsEl).some((tipBtn) =>
    tipBtn.classList.contains("active")
  );
  const customInputFilled = customInputEl.value;

  return selectedAnyTipButton || customInputFilled;
}

function calcTip() {
  if (billAndPeopleCorrect() && selectedAnyBtnOrCustomInput()) {
    calculateAndPresentTipValues();
  } else {
    setCalculatedTotal("$0.00");
    setCalculatedTip("$0.00");
    setCalculatedTotalPerPerson("$0.00");
    setCalculatedTipPerPerson("$0.00");
  }
}

function togglePeopleFieldOutline(isCorrect) {
  if (isCorrect) {
    toggleParentClass(numberOfPeopleInputEl, "invalid", false);
  } else {
    toggleParentClass(numberOfPeopleInputEl, "invalid", true);
  }
}

function isNumberOfPeopleCorrect() {
  if (numberOfPeopleInputEl.value === "") return true;
  const numberOfPeople = Number(numberOfPeopleInputEl.value);
  return Number.isInteger(numberOfPeople) && numberOfPeople > 0 ? true : false;
}

function resetAllFields() {
  [billEl, customInputEl, numberOfPeopleInputEl].forEach((input) => {
    input.value = "";
    input.parentElement.classList.remove("invalid");
  });
  tipButtonsEl.forEach((tipBtn) => tipBtn.classList.remove("active"));
  customInputEl.classList.remove("active");
  activeTipValue = null;
}

billEl.addEventListener("input", () => {
  checkIfCorrectBillInput();
  if (Number(billEl.value) <= 0 && billEl.value) {
    toggleParentClass(billEl, "invalid", true);
  } else {
    toggleParentClass(billEl, "invalid", false);
  }
  calcTip();
});

tipButtonsEl.forEach((tipBtn) => {
  tipBtn.addEventListener("click", () => {
    clearCustomInputValue();
    clearActiveBtns();
    tipBtn.classList.add("active");
    activeTipValue = parseInt(tipBtn.textContent) / 100;
    calcTip();
  });
});

customInputEl.addEventListener("input", () => {
  preventInsertOtherThanDigits(customInputEl);
  limitFieldValueToThreeDigits(customInputEl);
  if (customInputEl.value !== "") {
    clearActiveBtns();
    customInputEl.classList.add("active");
    activeTipValue = parseInt(customInputEl.value) / 100;
  } else {
    customInputEl.classList.remove("active");
  }

  calcTip();
});

numberOfPeopleInputEl.addEventListener("input", () => {
  preventInsertOtherThanDigits(numberOfPeopleInputEl);
  limitFieldValueToThreeDigits(numberOfPeopleInputEl);
  const isCorrectValue = isNumberOfPeopleCorrect();
  togglePeopleFieldOutline(isCorrectValue);
  calcTip();
});

resetButtonEl.addEventListener("click", () => {
  resetAllFields();
  calcTip();
});
