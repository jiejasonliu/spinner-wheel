export function toHumanReadableDate(dateString: string) {
  const date = new Date(asZuluString(dateString));
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZoneName: "short",
  };

  return `${date.toLocaleDateString(
    "en-us",
    dateOptions
  )} (${date.toLocaleTimeString("en-us", timeOptions)})`;
}

function asZuluString(dateString: string) {
  return dateString + "Z";
}
