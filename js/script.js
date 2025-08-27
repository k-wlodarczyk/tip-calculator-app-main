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

function setCalculatedTipTotal(value) {
  document.querySelector("#calculated-tip-total").textContent = value;
}

function setCalculatedTipPerPerson(value) {
  document.querySelector("#calculated-tip-amount").textContent = value;
}

function presentAsAmountValue(value) {
  const num = Number(value);
  if (isNaN(num)) return "Not a number";
  return `$${(Math.trunc(num * 100) / 100).toFixed(2)}`;
}

function calculateTotalTip() {
  const bill = Number(billEl.value);
  const tip = Number(activeTipValue);
  return bill + bill * tip;
}

function calculateTipPerPerson() {
  const total = calculateTotalTip();
  const people = Number(numberOfPeopleInputEl.value);
  return total / people > 0.01 ? total / people : 0.01;
}

function checkIfCorrectBillInput() {
  if (billEl.value <= 0) {
    toggleParentClass(billEl, "invalid", true);
    return;
  }

  toggleParentClass(billEl, "invalid", false);

  const parts = billEl.value.split(".");
  if (parts[1] && parts[1].length > 2) {
    billEl.value = `${parts[0]}.${parts[1].substring(0, 2)}`;
  }
}

function clearActiveBtns() {
  tipButtonsEl.forEach((tipBtn) => tipBtn.classList.remove("active"));
}

function clearCustomInputValue() {
  customInputEl.value = "";
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
    setCalculatedTipTotal(presentAsAmountValue(calculateTotalTip()));
    setCalculatedTipPerPerson(presentAsAmountValue(calculateTipPerPerson()));
  } else {
    setCalculatedTipTotal("$0.00");
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
  const numberOfPeople = Number(numberOfPeopleInputEl.value);
  return Number.isInteger(numberOfPeople) && numberOfPeople > 0 ? true : false;
}

function resetAllFields() {
  [billEl, customInputEl, numberOfPeopleInputEl].forEach((input) => {
    input.value = "";
    input.parentElement.classList.remove("invalid");
  });
  tipButtonsEl.forEach((tipBtn) => tipBtn.classList.remove("active"));
  activeTipValue = null;
}

billEl.addEventListener("input", () => {
  checkIfCorrectBillInput();
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
  clearActiveBtns();
  activeTipValue = parseInt(customInputEl.value) / 100;
  calcTip();
});

numberOfPeopleInputEl.addEventListener("input", () => {
  const isCorrectValue = isNumberOfPeopleCorrect();
  togglePeopleFieldOutline(isCorrectValue);
  calcTip();
});

resetButtonEl.addEventListener("click", () => {
  resetAllFields();
});
