import { months, monthsObj } from "./calender.js";
import {
  dateToMonthShortCode,
  timeConvert,
  dateToDayNo,
  storeData,
  getAppoinmentsByMonthAndDay,
  getAppoinment,
} from "./utils.js";

const app = document.getElementById("app");
const createForm = document.getElementById("create-modal");

let selectedMonths = dateToMonthShortCode(new Date());

let formData = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  gender: "male",
  date: "",
  time: "",
};

const setEventListener = () => {
  const dropdownList = document
    .getElementById("dropdown")
    .getElementsByTagName("a");

  for (let dropdownItem of dropdownList) {
    dropdownItem.addEventListener("click", () => {
      selectedMonths = dropdownItem.getAttribute("data-id");
      setCalender();
    });
  }
};

const setDropdown = () => {
  const dropdownComponent = document.getElementById("dropdown-component");
  let dropdownItems = "";
  for (let item of Object.keys(monthsObj)) {
    dropdownItems += `<li><a href="#!" data-id='${item}'>${
      months(item).label
    }</a></li>`;
  }

  dropdownComponent.innerHTML = `
			<a
				class="dropdown-trigger btn"
				href="#"
				data-target="dropdown"
				id="dropdown-trigger"
				>
					${months(selectedMonths).label}
				</a>
				<ul id="dropdown" class="dropdown-content">
					${dropdownItems}
				</ul>
			`;
  M.Dropdown.init(document.getElementById("dropdown-trigger"));
  setEventListener();
};

const getAppointmentsButton = (month, day) => {
  const appointments = getAppoinmentsByMonthAndDay(month, day);
  let appointmentDom = "";
  appointments?.forEach((item, index) => {
    appointmentDom += `
			<span class="new badge waves-effect appointment_item" data-index='${index}' data-date='${
      item.date
    }'>
				<span class="appointment_item__sl">${index + 1}.</span>
				<span class="appointment_item__time">${timeConvert(item.time)}</span>
			</span>
		`;
  });
  return appointmentDom;
};

const setAppointmentListener = () => {
  const appointmentCollection = app.querySelectorAll(".appointment_item");
  for (let appointment of appointmentCollection) {
    appointment.addEventListener("click", () => {
      viewModal(
        appointment.getAttribute("data-date"),
        appointment.getAttribute("data-index")
      );
    });
  }
};

const setCalender = () => {
  let calenderDOM = "";
  for (let i = 0; i < months(selectedMonths).value; i++) {
    calenderDOM += `
			<div class="calender__date date_item">
				<span class="date_item__no">${i + 1}</span>
				<div class="date_item_appointment">
					${getAppointmentsButton(selectedMonths, i + 1)}
				</div>
			</div>
			`;
  }
  app.innerHTML = calenderDOM;
  setDropdown();
  setAppointmentListener();
};

const viewModal = (date, index) => {
  const month = dateToMonthShortCode(date);
  const day = dateToDayNo(date);
  const data = getAppoinment(month, day, index);
  const modalContent = `
	  <div class="row">
      <div class="col s6">
        <span class="teal-text">First Name:</span>
        <span>${data.firstName}</span>
      </div>
      <div class="col s6">
        <span class="teal-text">Last Name:</span>
        <span>${data.lastName}</span>
      </div>
      <div class="col s6">
        <span class="teal-text">Email:</span>
        <span>${data.email}</span>
      </div>
      <div class="col s6">
        <span class="teal-text">Gender:</span>
        <span>${data.gender}</span>
      </div>
      <div class="col s6">
        <span class="teal-text">Age:</span>
        <span>${data.age}</span>
      </div>
      <div class="col s6">
        <span class="teal-text">Date:</span>
        <span>${data.date}</span>
      </div>
      <div class="col s6">
        <span class="teal-text">Time:</span>
        <span>${data.time}</span>
      </div>
    </div>
	`;
  document.getElementById("view-data").innerHTML = modalContent;
  const instance = M.Modal.getInstance(document.getElementById("view-modal"));
  instance.open();
};

const openCreateModal = () => {
  const createModal = document.getElementById("create-modal");
  createModal.innerHTML = `
  <div class="modal-content">
        <div class="row">
          <div class="input-field col s6">
            <input
              id="firstName"
              name="firstName"
              type="text"
              class="validate"
              required
              maxlength="40"
            />
            <label for="firstName">First Name</label>
            <span class="helper-text" data-error="Required"></span>
          </div>
          <div class="input-field col s6">
            <input
              id="lastName"
              name="lastName"
              type="text"
              class="validate"
              required
              maxlength="40"
            />
            <label for="lastName">Last Name</label>
            <span class="helper-text" data-error="Required"></span>
          </div>
          <div class="input-field col s6">
            <input
              id="Email"
              name="email"
              type="email"
              class="validate"
              required
            />
            <label for="Email">Email</label>
            <span class="helper-text" data-error="Required"></span>
          </div>
          <div class="col s6">
            <div class="row">
              <p>
                <label>
                  <input
                    id="male"
                    name="gender"
                    value="male"
                    type="radio"
                    checked
                  />
                  <span>Male</span>
                </label>
              </p>
              <p>
                <label>
                  <input
                    id="female"
                    name="gender"
                    value="female"
                    type="radio"
                  />
                  <span>Female</span>
                </label>
              </p>
            </div>
          </div>
          <div class="input-field col s6">
            <input id="age" name="age" type="number" min="1" max="130" />
            <label for="age">Age</label>
          </div>
          <div class="input-field col s6">
            <input
              id="date"
              name="date"
              type="date"
              class="validate"
              required
            />
            <label for="date">Date</label>
            <span class="helper-text" data-error="Required"></span>
          </div>
          <div class="input-field col s6">
            <input
              id="time"
              name="time"
              type="time"
              class="validate"
              required
            />
            <label for="time">Time</label>
            <span class="helper-text" data-error="Required"></span>
          </div>
        </div>
      </div>
      <div class="save-btn">
        <button type="submit" class="waves-effect waves-green btn">
          Submit
        </button>
      </div>
  `;
  const instance = M.Modal.getInstance(createModal);
  instance.open();
  const inputCollection = createForm.querySelectorAll("input");
  for (let inputField of inputCollection) {
    inputField.addEventListener("keyup", handleChange);
  }

  const inputRadioCollection = createForm.querySelectorAll(
    "input[type='radio']"
  );
  for (let inputRadio of inputRadioCollection) {
    inputRadio.addEventListener("change", handleChange);
  }

  createForm.querySelector("#date").addEventListener("change", handleChange);
  createForm.querySelector("#time").addEventListener("change", handleChange);

  document
    .getElementById("create-modal")
    .addEventListener("submit", handleSubmit);
};

const handleChange = (event) => {
  const { name, value } = event.target;
  formData = {
    ...formData,
    [name]: value,
  };
};

const isValid = () => {
  const validateField = ["firstName", "lastName", "email", "date", "time"];
  const fields = Object.keys(formData);

  for (let field of fields) {
    if (
      validateField.includes(field) &&
      !(formData[field] && formData[field] !== "")
    ) {
      return false;
    }
  }
  return true;
};

const handleSubmit = (event) => {
  event.preventDefault();
  if (isValid()) {
    storeData(formData);
    const instance = M.Modal.getInstance(
      document.getElementById("create-modal")
    );
    instance.close();
    setCalender();
    const inputCollection = createForm.querySelectorAll("input");
    for (let input of inputCollection) {
      input.value = "";
    }
  }
};

(function () {
  setCalender();
  const elems = document.querySelectorAll(".modal");
  for (let elem of elems) M.Modal.init(elem);
  document
    .getElementById("create-button")
    .addEventListener("click", openCreateModal);
})();
