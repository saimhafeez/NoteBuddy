import moment from "moment";

function GetNextRepeatingDate(dateStr, repeatPeriod) {
  // Parse the input date string into a moment.js object
  const currentDate = moment(dateStr);

  // Calculate the next repeating date based on the repeat period
  switch (repeatPeriod) {
    case "daily":
      currentDate.add(1, "days");
      break;
    case "weekly":
      currentDate.add(1, "weeks");
      break;
    case "monthly":
      currentDate.add(1, "months");
      break;
    case "yearly":
      currentDate.add(1, "years");
      break;
    default:
      throw new Error("Invalid repeatPeriod: " + repeatPeriod);
  }

  // Format the next repeating date as a string in the same format as the input
  return currentDate.format("YYYY-MM-DD");
}

export default GetNextRepeatingDate;
