// FIELDS
const billInput = '[data-cy="bill-input"]';
const tipBtn5 = "[data-cy=btn-5]";
const tipBtn10 = "[data-cy=btn-10]";
const tipBtn15 = "[data-cy=btn-15]";
const tipBtn25 = "[data-cy=btn-25]";
const tipBtn50 = "[data-cy=btn-50]";
const tipBtns = [tipBtn5, tipBtn10, tipBtn15, tipBtn25, tipBtn50];
const customInputBtn = "[data-cy=custom-input-btn]";
const peopleInput = "[data-cy=number-people-input]";

const allConfigFields = [billInput, customInputBtn, peopleInput];

const calculatedTotal = "[data-cy=calculated-total]";
const calculatedTotalPerPerson = "[data-cy=calculated-total-per-person]";
const calculatedTipPerPerson = "[data-cy=calculated-tip-per-person]";

const calculationFields = [
  calculatedTotal,
  calculatedTotalPerPerson,
  calculatedTipPerPerson,
];
const resetBtn = "[data-cy=reset]";

const allFields = [allConfigFields, tipBtns, calculationFields];
const testCasesLink = "[data-cy=test-cases-link]";
// HELPESR FUNCTIONS

function visitHomePage() {
  return cy.visit("localhost:5500/");
}

function click(element) {
  return cy.get(element).click();
}

function clickAndType(element, value) {
  return cy.get(element).click().type(value);
}

function clear(element) {
  return cy.get(element).clear();
}

// Cypress - shoulds

function shouldHaveText(element, text) {
  return cy.get(element).should("have.text", text);
}

function shouldNotHaveText(element, text) {
  return cy.get(element).should("not.have.text", text);
}

function shouldHaveValue(element, value) {
  return cy.get(element).should("have.value", value);
}

function shouldNotHaveValue(element, value) {
  return cy.get(element).should("not.have.value", value);
}

function shouldHaveClass(element, className) {
  return element.should("have.class", className);
}

function shouldNotHaveClass(element, className) {
  return element.should("not.have.class", className);
}

function clearFieldsExceptsOf(field) {
  for (let i = 0; i < allConfigFields.length; i++) {
    if (allConfigFields[i] === field) continue;

    cy.get(allConfigFields[i]).clear();
  }
}

function configFieldsAreDefault() {
  return cy.wrap(allConfigFields).each((field) => {
    cy.get(field).should("have.value", "");
  });
}

function noActiveBtn() {
  return cy.wrap(tipBtns).each((btn) => {
    cy.get(btn).should("not.have.class", "active");
  });
}

function calculationFieldsAreDefault() {
  cy.wrap(calculationFields).each((field) => {
    cy.get(field).should("have.text", "$0.00");
  });
}

function allFieldsDefault() {
  configFieldsAreDefault();
  noActiveBtn();
  calculationFieldsAreDefault();
}
// TESTS

describe("Bill field tests", () => {
  beforeEach(() => {
    visitHomePage();
  });

  it("Finds Bill field", () => {
    cy.contains("Bill");
    cy.get(billInput).should("have.value", "");
  });

  it("Sets integer value in Bill field", () => {
    cy.get(billInput).click().type("3");
    cy.get(billInput).should("have.value", "3");
  });

  it("Sets float value with 2 decimals in Bill field", () => {
    cy.get(billInput).click().type("3.3");
    cy.get(billInput).should("have.value", "3.3");
    cy.get(billInput).click().type("3.33");
    cy.get(billInput).should("have.value", "3.33");
  });

  it("Changes the separator from comma to dot", () => {
    cy.get(billInput).click().type("3,3");
    cy.get(billInput).should("have.value", "3.3");
  });

  it("Forbids input more than one decimal separator", () => {
    cy.get(billInput).click().type("3.3.");
    cy.get(billInput).should("have.value", "3.3");
  });

  it("Forbids input value with more than 2 decimals", () => {
    cy.get(billInput).click().type("3.333");
    cy.get(billInput).should("have.value", "3.33");
  });

  it("Limits max value", () => {
    cy.get(billInput).click().type("100000");
    cy.get(billInput).should("have.value", "10000");
    cy.get(billInput).clear().type(999999.99);
    cy.get(billInput).should("have.value", "99999.99");
  });

  it("Forbids input string", () => {
    cy.get(billInput).click().type("abc");
    cy.get(billInput).should("have.value", "");
  });

  it("Forbids value 0", () => {
    cy.get(billInput).click().type("0");
    cy.get(billInput).should("have.value", "0");
    cy.get(billInput).parent().should("have.class", "invalid");
  });

  it("Removes red frame after clearing the field or setting to positive", () => {
    cy.get(billInput).click().type("0");
    cy.get(billInput).parent().should("have.class", "invalid");
    cy.get(billInput).clear();
    cy.get(billInput).parent().should("not.have.class", "invalid");
    cy.get(billInput).click().type("0");
    cy.get(billInput).parent().should("have.class", "invalid");
    cy.get(billInput).clear().type("1");
    cy.get(billInput).parent().should("not.have.class", "invalid");
  });
});

describe("Tip section tests", () => {
  beforeEach(() => {
    visitHomePage();
  });

  it("Finds tip section", () => {
    cy.contains("Select tip %");
  });

  it("Sets tip button active", () => {
    cy.get(tipBtn5).click();
    cy.get(tipBtn5).should("have.class", "active");
  });

  it("Removes active state from a button after clicking other button", () => {
    tipBtns.forEach((btn, index) => {
      cy.get(btn).click();

      tipBtns.forEach((btn, i) => {
        if (i === index) {
          cy.get(btn).should("have.class", "active");
        } else {
          cy.get(btn).should("not.have.class", "active");
        }
      });
    });
  });

  it("Keeps active state of clicking a button", () => {
    cy.get(tipBtn5).click().click();
    cy.get(tipBtn5).should("have.class", "active");
  });

  it("Inputs value to custom input field and makes it active", () => {
    cy.get(customInputBtn).click().type("55");
    cy.get(customInputBtn).should("have.value", "55");
    cy.get(customInputBtn).should("have.class", "active");
  });

  it("Forbids input string to custom input field", () => {
    cy.get(customInputBtn).click().type("abc");
    cy.get(customInputBtn).should("have.value", "");
    cy.get(customInputBtn).should("not.have.class", "active");
  });

  it("Forbids float value in custom input field", () => {
    cy.get(customInputBtn).click().type("30.5");
    cy.get(customInputBtn).should("have.value", "305");
    cy.get(customInputBtn).should("have.class", "active");
  });

  it("Forbids higher value than 999 in custom input field", () => {
    cy.get(customInputBtn).click().type("9999");
    cy.get(customInputBtn).should("have.value", "999");
    cy.get(customInputBtn).should("have.class", "active");
  });

  it("Removes active state after clearing custom input field", () => {
    cy.get(customInputBtn).click().type("7");
    cy.get(customInputBtn).should("have.class", "active");
    cy.get(customInputBtn).clear();
    cy.get(customInputBtn).should("not.have.class", "active");
  });

  it("Removes active state from a button after inserting the custom tip", () => {
    cy.get(tipBtn15).click();
    cy.get(tipBtn15).should("have.class", "active");
    cy.get(customInputBtn).click().type("12");
    cy.get(tipBtn15).should("not.have.class", "active");
    cy.get(customInputBtn).should("have.class", "active");
  });

  it("Keeps active state on a button after inserting invalid custom tip", () => {
    cy.get(tipBtn15).click();
    cy.get(customInputBtn).click().type("abc");
    cy.get(tipBtn15).should("have.class", "active");
    cy.get(customInputBtn).should("not.have.class", "active");
  });
});

describe("Number of people field", () => {
  beforeEach(() => {
    visitHomePage();
  });

  it("Sets integer value in Number of people field", () => {
    clickAndType(peopleInput, "2");
    shouldHaveValue(peopleInput, "2");
  });

  it("Forbids input floating value", () => {
    clickAndType(peopleInput, "3.5");
    shouldHaveValue(peopleInput, "35");
  });

  it("Limits Number of people field value to 999", () => {
    clickAndType(peopleInput, "9999");
    shouldHaveValue(peopleInput, "999");
  });

  it("Forbids input string in Number of people field", () => {
    clickAndType(peopleInput, "abc");
    shouldHaveValue(peopleInput, "");
  });

  it("Adds red frame after input 0 in Number of people field", () => {
    clickAndType(peopleInput, "0");
    cy.get(peopleInput).parent().should("have.class", "invalid");
  });

  it("Forbids input negative value in Number of people field", () => {
    clickAndType(peopleInput, "-1");
    shouldHaveValue(peopleInput, "1");
    cy.get(peopleInput).parent().should("not.have.class", "invalid");
  });

  it("Removes red frame after clearing value in Number of people field", () => {
    clickAndType(peopleInput, "0");
    cy.get(peopleInput).parent().should("have.class", "invalid");
    clear(peopleInput);
    cy.get(peopleInput).parent().should("not.have.class", "invalid");
  });
});

describe("Calculate field Total", () => {
  beforeEach(() => {
    visitHomePage();
  });

  it("Field total shows $0.00 if not all fields are filled", () => {
    clickAndType(billInput, 100);
    clearFieldsExceptsOf(billInput);
    shouldHaveText(calculatedTotal, "$0.00");
    clear(billInput);
    clickAndType(peopleInput, "2");
    clearFieldsExceptsOf(peopleInput);
    shouldHaveText(calculatedTotal, "$0.00");
    clear(peopleInput);
    click(tipBtn10);
    clearFieldsExceptsOf(null);
    shouldHaveText(calculatedTotal, "$0.00");
    clickAndType(customInputBtn, "15");
    clearFieldsExceptsOf(customInputBtn);
    shouldHaveText(calculatedTotal, "$0.00");
  });

  it("Calculates field Total after filling all fields (Bill field last filled)", () => {
    click(tipBtn10);
    clickAndType(peopleInput, "2");
    clickAndType(billInput, "100");
    shouldHaveText(calculatedTotal, "$110.00");
  });

  it("Calculates field Total after filling all fields (Number of people last filled)", () => {
    clickAndType(billInput, "100");
    click(tipBtn10);
    clickAndType(peopleInput, "2");
    shouldHaveText(calculatedTotal, "$110.00");
  });

  it("Calculates field Total after filling all fields (Tip section last filled - button)", () => {
    clickAndType(billInput, "50");
    clickAndType(peopleInput, "4");
    click(tipBtn10);
    shouldHaveText(calculatedTotal, "$55.00");
  });

  it("Calculates field Total after filling all fields (Tip section last filled - custom tip)", () => {
    clickAndType(billInput, "50");
    clickAndType(peopleInput, "4");
    clickAndType(customInputBtn, "30");
    shouldHaveText(calculatedTotal, "$65.00");
  });

  it("Field Total shows 2 decimals", () => {
    clickAndType(billInput, "12.33");
    clickAndType(customInputBtn, "33");
    clickAndType(peopleInput, 3);
    shouldHaveText(calculatedTotal, "$16.40");
  });

  it("Changing any field to invalid or empty value after all fields are filled sets Total to $0.00", () => {
    clickAndType(billInput, "100");
    click(tipBtn10);
    clickAndType(peopleInput, "2");
    shouldHaveText(calculatedTotal, "$110.00");
    clear(billInput);
    shouldHaveText(calculatedTotal, "$0.00");
    clickAndType(billInput, "100");
    shouldHaveText(calculatedTotal, "$110.00");
    clear(peopleInput);
    shouldHaveText(calculatedTotal, "$0.00");
    clickAndType(peopleInput, "0");
    shouldHaveText(calculatedTotal, "$0.00");
  });
});

describe("Calculate field Total per person", () => {
  beforeEach(() => {
    visitHomePage();
  });

  it("Field total per person shows $0.00 if not all fields are filled", () => {
    clickAndType(billInput, 100);
    clearFieldsExceptsOf(billInput);
    shouldHaveText(calculatedTotalPerPerson, "$0.00");
    clear(billInput);
    clickAndType(peopleInput, "2");
    clearFieldsExceptsOf(peopleInput);
    shouldHaveText(calculatedTotalPerPerson, "$0.00");
    clear(peopleInput);
    click(tipBtn10);
    clearFieldsExceptsOf(null);
    shouldHaveText(calculatedTotalPerPerson, "$0.00");
    clickAndType(customInputBtn, "15");
    clearFieldsExceptsOf(customInputBtn);
    shouldHaveText(calculatedTotalPerPerson, "$0.00");
  });

  it("Field total per person is calculated after field Total calculation", () => {
    clickAndType(billInput, "100");
    clickAndType(customInputBtn, "45");
    clickAndType(peopleInput, "2");
    shouldHaveText(calculatedTotalPerPerson, "$72.50");
  });

  it("Field Total per person shows 2 decimals", () => {
    clickAndType(billInput, "12.33");
    clickAndType(customInputBtn, "33");
    clickAndType(peopleInput, 3);
    shouldHaveText(calculatedTotalPerPerson, "$5.47");
  });

  it("Changing any field after all fields are filled recalculates Total per person", () => {
    clickAndType(billInput, "100");
    click(tipBtn10);
    clickAndType(peopleInput, "2");
    shouldHaveText(calculatedTotalPerPerson, "$55.00");
    clear(billInput).type("200");
    shouldHaveText(calculatedTotalPerPerson, "$110.00");
    click(tipBtn5);
    shouldHaveText(calculatedTotalPerPerson, "$105.00");
    clear(peopleInput).type("4");
    shouldHaveText(calculatedTotalPerPerson, "$52.50");
  });
});

describe("Calculate tip amount per person", () => {
  beforeEach(() => {
    visitHomePage();
  });

  it("Field Tip amount per person shows $0.00 if not all fields are filled", () => {
    clickAndType(billInput, 100);
    clearFieldsExceptsOf(billInput);
    shouldHaveText(calculatedTipPerPerson, "$0.00");
    clear(billInput);
    clickAndType(peopleInput, "2");
    clearFieldsExceptsOf(peopleInput);
    shouldHaveText(calculatedTipPerPerson, "$0.00");
    clear(peopleInput);
    click(tipBtn10);
    clearFieldsExceptsOf(null);
    shouldHaveText(calculatedTipPerPerson, "$0.00");
    clickAndType(customInputBtn, "15");
    clearFieldsExceptsOf(customInputBtn);
    shouldHaveText(calculatedTipPerPerson, "$0.00");
  });

  it("Field Tip amount per person is calculated after field Total calculation", () => {
    clickAndType(billInput, "100");
    clickAndType(customInputBtn, "45");
    clickAndType(peopleInput, "2");
    shouldHaveText(calculatedTipPerPerson, "$22.50");
  });

  it("Field Tip per person shows 2 decimals", () => {
    clickAndType(billInput, "12.33");
    clickAndType(customInputBtn, "33");
    clickAndType(peopleInput, 3);
    shouldHaveText(calculatedTipPerPerson, "$1.36");
  });

  it("Changing any field after all fields are filled recalculates Tip per person", () => {
    clickAndType(billInput, "100");
    click(tipBtn10);
    clickAndType(peopleInput, "2");
    shouldHaveText(calculatedTipPerPerson, "$5.00");
    clear(billInput).type("200");
    shouldHaveText(calculatedTipPerPerson, "$10.00");
    click(tipBtn5);
    shouldHaveText(calculatedTipPerPerson, "$5.00");
    clear(peopleInput).type("4");
    shouldHaveText(calculatedTipPerPerson, "$2.50");
  });
});

describe("Reset button", () => {
  beforeEach(() => {
    visitHomePage();
  });

  it("Reset button restores all fields default values", () => {
    clickAndType(billInput, "100");
    click(tipBtn10);
    clickAndType(peopleInput, "2");
    click(resetBtn);

    allFieldsDefault();
  });

  it("Reset button is enabled without all fields filled", () => {
    click(resetBtn);
    allFieldsDefault();

    clickAndType(billInput, "100");
    click(resetBtn);
    allFieldsDefault();

    clickAndType(peopleInput, "2");
    click(resetBtn);
    allFieldsDefault();

    click(tipBtn10);
    click(resetBtn);
    allFieldsDefault();

    clickAndType(customInputBtn, "15");
    click(resetBtn);
    allFieldsDefault();
  });
});

describe("API", () => {
  beforeEach(() => {
    visitHomePage();
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("Test cases are loaded from external JSON file", () => {
    cy.intercept("GET", "**/test-cases.json", {
      fixture: "test-cases-fixture.json",
    }).as("testCases");

    cy.get(testCasesLink).invoke("removeAttr", "target").click();
    cy.contains("h3", "Test case 1").should("be.visible");
  });
});
