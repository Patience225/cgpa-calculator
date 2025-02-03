document.addEventListener("DOMContentLoaded", function () {
  loadSavedData();

  document.getElementById('add-course').addEventListener('click', function () {
    addCourseRow();
  });

  document.getElementById('course-form').addEventListener('submit', function (event) {
    event.preventDefault();
    calculateCGPA();
  });

  document.getElementById('reset-form').addEventListener('click', function () {
    resetForm();
  });

  function addCourseRow(courseTitle = "", creditHours = "", gradeValue = "") {
    const courseContainer = document.getElementById('course-container');
    const courseRow = document.createElement('div');
    courseRow.classList.add('course-row');
    courseRow.innerHTML = `
      <input type="text" placeholder="Course Title" value="${courseTitle}" required>
      <input type="number" placeholder="Credit Hours" min="1" max="6" value="${creditHours}" required>
      <select required>
        <option value="">Select Grade</option>
        <option value="4" ${gradeValue === "4" ? "selected" : ""}>A (4.0)</option>
        <option value="3.5" ${gradeValue === "3.5" ? "selected" : ""}>B+ (3.5)</option>
        <option value="3" ${gradeValue === "3" ? "selected" : ""}>B (3.0)</option>
        <option value="2.5" ${gradeValue === "2.5" ? "selected" : ""}>C+ (2.5)</option>
        <option value="2" ${gradeValue === "2" ? "selected" : ""}>C (2.0)</option>
        <option value="1" ${gradeValue === "1" ? "selected" : ""}>D (1.0)</option>
        <option value="0" ${gradeValue === "0" ? "selected" : ""}>F (0.0)</option>
      </select>
    `;
    courseContainer.appendChild(courseRow);
  }

  function calculateCGPA() {
    let totalCredits = 0;
    let totalGradePoints = 0;
    const courseData = [];

    const courseRows = document.querySelectorAll('.course-row');

    courseRows.forEach(row => {
      const titleInput = row.querySelector('input[type="text"]').value;
      const creditInput = row.querySelector('input[type="number"]').value;
      const gradeSelect = row.querySelector('select').value;

      const creditHours = parseFloat(creditInput);
      const gradePoint = parseFloat(gradeSelect);

      if (!isNaN(creditHours) && !isNaN(gradePoint)) {
        totalCredits += creditHours;
        totalGradePoints += creditHours * gradePoint;
        courseData.push({ title: titleInput, credit: creditHours, grade: gradePoint });
      }
    });

    const cgpa = (totalCredits > 0) ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    document.getElementById('result').textContent = `Your CGPA is: ${cgpa}`;

    saveData(courseData);
    displayCourseSummary(courseData);
  }

  function displayCourseSummary(courseData) {
    const summaryDiv = document.getElementById('course-summary');
    summaryDiv.innerHTML = '';
    courseData.forEach(course => {
      const summary = document.createElement('p');
      summary.textContent = `Course: ${course.title}, Credit Hours: ${course.credit}, Grade: ${course.grade}`;
      summaryDiv.appendChild(summary);
    });
  }

  function resetForm() {
    document.getElementById('course-container').innerHTML = '';
    document.getElementById('result').textContent = '';
    document.getElementById('course-summary').innerHTML = '';
    localStorage.removeItem('cgpaData');
    addCourseRow();
  }

  function saveData(data) {
    localStorage.setItem('cgpaData', JSON.stringify(data));
  }

  function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('cgpaData'));
    if (savedData) {
      savedData.forEach(course => addCourseRow(course.title, course.credit, course.grade));
    } else {
      addCourseRow();
    }
  }
});
