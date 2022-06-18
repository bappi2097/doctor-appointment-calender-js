export const dateToMonthShortCode = (date) => {
  if (typeof date !== "object") {
    return new Date(date)
      .toLocaleString("default", { month: "short" })
      .toLowerCase();
  }
  return date.toLocaleString("default", { month: "short" }).toLowerCase();
};

export const timeConvert = (time) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? "AM" : "PM";
    time[0] = +time[0] % 12 || 12;
  }
  return time.join("");
};

export const dateToDayNo = (date) => {
  return new Date(date).getDate() ?? 0;
};

export const sortByTime = (data) => {
  data.sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  return data;
};

export const storeData = (data) => {
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

export const getAppoinmentsByMonthAndDay = (month, day) => {
  const localstorageData = JSON.parse(localStorage.getItem("calender") ?? "{}");
  return localstorageData[month] ? localstorageData[month][day] ?? null : null;
};

export const getAppoinment = (month, day, index) => {
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
