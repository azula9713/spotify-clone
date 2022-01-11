export function millisToMinutesAndSeconds(millis) {
  const minutes = pad(Math.floor(millis / 60000), 2);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
