export const monthsObj = {
  jan: {
    label: "January",
    value: 31,
  },
  feb: {
    label: "February",
    value: 28,
  },
  mar: {
    label: "March",
    value: 31,
  },
  apr: {
    label: "April",
    value: 30,
  },
  may: {
    label: "May",
    value: 31,
  },
  jun: {
    label: "June",
    value: 30,
  },
  jul: {
    label: "July",
    value: 31,
  },
  aug: {
    label: "August",
    value: 31,
  },
  sept: {
    label: "September",
    value: 30,
  },
  oct: {
    label: "October",
    value: 31,
  },
  nov: {
    label: "November",
    value: 30,
  },
  dec: {
    label: "December",
    value: 31,
  },
};

const checkLeapYear = (year) => {
  return new Date(year, 1, 29).getDate() === 29;
};

export const months = (name, year) => {
  if (name === "feb") {
    return checkLeapYear(year)
      ? { ...monthsObj[name], value: 29 }
      : monthsObj[name];
  }
  return monthsObj[name];
};
