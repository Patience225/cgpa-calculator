document.addEventListener("DOMContentLoaded", function () {
  // Load any saved courses from localStorage
  loadSavedData();

  // Attach event listeners
  document.getElementById("add-course").addEventListener("click", function () {
    addCourseRow();
  });

  document.getElementById("course-form").addEventListener("submit", function (event) {
    event.preventDefault();
    calculateCGPA();
  });

  document.getElementById("reset-form").addEventListener("click", function () {
    resetForm();
  });

  // Update all select options with current grade mapping values
  document.getElementById("update-mapping").addEventListener("click", function () {
    updateAllGradeSelects();
  });

  // Returns the current grade mapping as an object
  function getCurrentGradeMapping() {
    return {
      A: parseFloat(document.getElementById("grade-A").value) || 5,
      B: parseFloat(document.getElementById("grade-B").value) || 4,
      C: parseFloat(document.getElementById("grade-C").value) || 3,
      D: parseFloat(document.getElementById("grade-D").value) || 2,
      E: parseFloat(document.getElementById("grade-E").value) || 1,
      F: parseFloat(document.getElementById("grade-F").value) || 0,
    };
  }

  // Generate HTML for the grade select options based on current mapping.
  // Optionally, pass in the currently selected grade letter.
  function getMappingOptionsHTML(selectedValue = "") {
    const mapping = getCurrentGradeMapping();
    return `
      <option value="">Select Grade</option>
      <option value="A" ${selectedValue === "A" ? "selected" : ""}>A (${mapping.A.toFixed(1)})</option>
      <option value="B" ${selectedValue === "B" ? "selected" : ""}>B (${mapping.B.toFixed(1)})</option>
      <option value="C" ${selectedValue === "C" ? "selected" : ""}>C (${mapping.C.toFixed(1)})</option>
      <option value="D" ${selectedValue === "D" ? "selected" : ""}>D (${mapping.D.toFixed(1)})</option>
      <option value="E" ${selectedValue === "E" ? "selected" : ""}>E (${mapping.E.toFixed(1)})</option>
      <option value="F" ${selectedValue === "F" ? "selected" : ""}>F (${mapping.F.toFixed(1)})</option>
    `;
  }

  // Add a new course row to the form.
  // Optionally, set initial values for course title, credit hours, and grade.
  function addCourseRow(courseTitle = "", creditHours = "", gradeValue = "") {
    const courseContainer = document.getElementById("course-container");
    const courseRow = document.createElement("div");
    courseRow.classList.add("course-row");
    courseRow.innerHTML = `
      <input type="text" placeholder="Course Title" value="${courseTitle}" required>
      <input type="number" placeholder="Credit Hours" min="1" max="6" value="${creditHours}" required>
      <select required>
        ${getMappingOptionsHTML(gradeValue)}
      </select>
    `;
    courseContainer.appendChild(courseRow);
  }

  // Update all existing course row select elements with the new mapping options.
  function updateAllGradeSelects() {
    const courseRows = document.querySelectorAll(".course-row");
    courseRows.forEach(row => {
      const select = row.querySelector("select");
      // Preserve the currently selected value, if any.
      const currentValue = select.value;
      select.innerHTML = getMappingOptionsHTML(currentValue);
    });
  }

  // Retrieve the grade point value based on the letter (using the current mapping)
  function getGradePoint(letter) {
    const mapping = getCurrentGradeMapping();
    return mapping[letter] !== undefined ? mapping[letter] : 0;
  }

  // Calculate the CGPA based on the courses entered.
  function calculateCGPA() {
    let totalCredits = 0;
    let totalGradePoints = 0;
    const courseData = [];

    const courseRows = document.querySelectorAll(".course-row");

    courseRows.forEach(row => {
      const titleInput = row.querySelector('input[type="text"]').value;
      const creditInput = row.querySelector('input[type="number"]').value;
      const gradeLetter = row.querySelector("select").value;

      const creditHours = parseFloat(creditInput);
      const gradePoint = getGradePoint(gradeLetter);

      if (!isNaN(creditHours) && gradeLetter !== "") {
        totalCredits += creditHours;
        totalGradePoints += creditHours * gradePoint;
        courseData.push({ title: titleInput, credit: creditHours, grade: gradeLetter, point: gradePoint });
      }
    });

    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    document.getElementById("result").textContent = `Your CGPA is: ${cgpa}`;

    saveData(courseData);
    displayCourseSummary(courseData);
  }

  // Display a summary of courses entered.
  function displayCourseSummary(courseData) {
    const summaryDiv = document.getElementById("course-summary");
    summaryDiv.innerHTML = "";
    courseData.forEach(course => {
      const summary = document.createElement("p");
      summary.textContent = `Course: ${course.title}, Credit Hours: ${course.credit}, Grade: ${course.grade} (${course.point.toFixed(1)})`;
      summaryDiv.appendChild(summary);
    });
  }

  // Reset the form and local storage.
  function resetForm() {
    document.getElementById("course-container").innerHTML = "";
    document.getElementById("result").textContent = "";
    document.getElementById("course-summary").innerHTML = "";
    localStorage.removeItem("cgpaData");
    addCourseRow();
  }

  // Save course data to localStorage.
  function saveData(data) {
    localStorage.setItem("cgpaData", JSON.stringify(data));
  }

  // Load saved course data from localStorage.
  function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem("cgpaData"));
    if (savedData && savedData.length) {
      savedData.forEach(course => addCourseRow(course.title, course.credit, course.grade));
    } else {
      addCourseRow();
    }
  }
});
