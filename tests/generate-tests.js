"use strict";
const container = document.querySelector(".test-cases-window");
let currentSection = "";

// get test cases from json file
fetch("test-cases.json")
  .then((response) => response.json())
  .then((testCases) => {
    testCases.forEach((test, index) => {
      if (test.section !== currentSection) {
        currentSection = test.section;
        const h2 = document.createElement("h2");
        h2.classList.add("test-case-header");
        h2.id = test.section.toLowerCase().replace(/\s+/g, "-");
        h2.textContent = currentSection;
        container.appendChild(h2);
      }

      // create test container
      const div = document.createElement("div");
      div.classList.add("test-case-container");
      div.innerHTML = `
        <div class="test-case-container-header">
          <h3>Test case <span class="test-case-number">${index + 1}</span>:</h3>
          <p>${test.description}</p>
        </div>
        <div class="test-case-container-steps">
          <h4 class="steps-header">Steps:</h4>
          <ol class="steps-list">
            ${test?.steps?.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
        <div class="expected-result-section">
          <h4 class="expected-result-header">Expected result:</h4>
          <p>${test.expected}</p>
        </div>
      `;
      container.appendChild(div);
    });
  })
  .catch((err) => console.error("Błąd wczytywania testów JSON:", err));

// smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
