import { months } from "./calender.js";

(function () {
  const app = document.getElementById("app");
  [...Array(months.jan.value)].forEach(
    (item, index) =>
      (app.innerHTML += `
      <div class="calender__date date_item">
        <span class="date_item__no">${index + 1}</span>
        <div class="date_item_appointment">
          <span class="new badge waves-effect appointment_item">
            <span class="appointment_item__sl">1.</span>
            <span class="appointment_item__time">8.30</span>
          </span>
          <span class="new badge waves-effect appointment_item">
            <span class="appointment_item__sl">1.</span>
            <span class="appointment_item__time">8.30</span>
          </span>
          <span class="new badge waves-effect appointment_item">
            <span class="appointment_item__sl">1.</span>
            <span class="appointment_item__time">8.30</span>
          </span>
          <span class="new badge waves-effect appointment_item">
            <span class="appointment_item__sl">1.</span>
            <span class="appointment_item__time">8.30</span>
          </span>
        </div>
      </div>
      `)
  );
})();
