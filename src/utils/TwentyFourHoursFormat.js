export const TwentyFourHoursFormat = (date) => {
  if (date.time === "") {
    date.time = "11:59 PM";
  }

  // Split the time into hours and minutes
  const [timeHours, timeMinutes] = date.time.split(":");
  const isPM = date.time.endsWith("PM");

  // Convert hours to 24-hour format
  let hours = parseInt(timeHours, 10);
  if (isPM && hours !== 12) {
    hours += 12;
  } else if (!isPM && hours === 12) {
    hours = 0;
  }
  const newFormat = new Date(date.date);
  newFormat.setHours(hours, parseInt(timeMinutes, 10), 0);
  return newFormat;
};
