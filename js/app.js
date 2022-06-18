import { months, monthsObj } from "./calender.js";

const app = document.getElementById("app");
const createForm = document.getElementById("create-modal");

const dateToMonthShortCode = (date) => {
  if (typeof date !== "object") {
    return new Date(date)
      .toLocaleString("default", { month: "short" })
      .toLowerCase();
  }
  return date.toLocaleString("default", { month: "short" }).toLowerCase();
};

let selectedMonths = dateToMonthShortCode(new Date());

const timeConvert = (time) => {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
};

const dateToDayNo = (date) => {
  return new Date(date).getDate() ?? 0;
};

const sortByTime = (data) => {
  data.sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  return data;
};

const storeData = (data) => {
  try {
    const calenderData = localStorage.getItem("calender");
    const localstorageData = JSON.parse(calenderData ?? "{}");
    localstorageData[dateToMonthShortCode(data.date)] = {
      ...(localstorageData[dateToMonthShortCode(data.date)] ?? {}),
    };
    localstorageData[dateToMonthShortCode(data.date)][dateToDayNo(data.date)] =
      sortByTime([
        ...(localstorageData[dateToMonthShortCode(data.date)][
          dateToDayNo(data.date)
        ] ?? []),
        data,
      ]);
    localStorage.setItem("calender", JSON.stringify(localstorageData));
  } catch (error) {
    console.log(error);
  }
};

const getAppoinmentsByMonth = (month) => {
  const localstorageData = JSON.parse(localStorage.getItem("calender") ?? "{}");
  return localstorageData[month] ?? null;
};

const getAppoinmentsByMonthAndDay = (month, day) => {
  const localstorageData = JSON.parse(localStorage.getItem("calender") ?? "{}");
  return localstorageData[month] ? localstorageData[month][day] ?? null : null;
};

const getAppoinment = (month, day, index) => {
  const localstorageData = JSON.parse(localStorage.getItem("calender") ?? "{}");
  if (
    localstorageData[month] &&
    localstorageData[month][day] &&
    localstorageData[month][day][index]
  ) {
    return localstorageData[month][day][index];
  }
  return null;
};

const setEventListener = () => {
  const dropdownContent = document.getElementById("dropdown");
  const dropdownList = dropdownContent.getElementsByTagName("a");
  for (let i = 0; i < dropdownList.length; i++) {
    dropdownList[i].addEventListener("click", () => {
      selectedMonths = dropdownList[i].getAttribute("data-id");
      setCalender();
    });
  }
};

const setDropdown = () => {
  const dropdownComponent = document.getElementById("dropdown-component");
  let dropdownItems = "";
  Object.keys(monthsObj).forEach((item) => {
    dropdownItems += `<li><a href="#!" data-id='${item}'>${
      months(item).label
    }</a></li>`;
  });
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
  const dropdownTrigger = document.getElementById("dropdown-trigger");
  M.Dropdown.init(dropdownTrigger);
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
  for (let i = 0; i < appointmentCollection.length; i++) {
    appointmentCollection[i].addEventListener("click", () => {
      viewModal(
        appointmentCollection[i].getAttribute("data-date"),
        appointmentCollection[i].getAttribute("data-index")
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

(function () {
  setCalender();
  const elems = document.querySelectorAll(".modal");
  for (let i = 0; i < elems.length; i++) M.Modal.init(elems[i]);
})();

(function () {
  let formData = {
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "male",
    date: "",
    time: "",
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

    for (let i = 0; i < fields.length; i++) {
      if (
        validateField.includes(fields[i]) &&
        !(formData[fields[i]] && formData[fields[i]] !== "")
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
    }
  };

  const inputCollection = createForm.querySelectorAll("input");
  for (let i = 0; i < inputCollection.length; i++) {
    inputCollection[i].addEventListener("keyup", handleChange);
  }

  const inputRadioCollection = createForm.querySelectorAll(
    "input[type='radio']"
  );
  for (let i = 0; i < inputRadioCollection.length; i++) {
    inputRadioCollection[i].addEventListener("change", handleChange);
  }

  createForm.querySelector("#date").addEventListener("change", handleChange);
  createForm.querySelector("#time").addEventListener("change", handleChange);

  document
    .getElementById("create-modal")
    .addEventListener("submit", handleSubmit);
})();
