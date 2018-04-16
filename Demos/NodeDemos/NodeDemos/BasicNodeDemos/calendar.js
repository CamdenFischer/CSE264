let sprintf = require("sprintf-js").sprintf;

let monthNames = ["", "January", "February", "March", "April",
        "May", "June", "July", "August", "September", "October",
        "November", "December"];
        
let month = 0;
let year = 0;

if (process.argv.length === 4) {
    // If user put month and year numbers on the command line, use them
    month = parseInt(process.argv[2]);
    year = parseInt(process.argv[3]);
} else {
    // Or else use the current month and year
    let today = new Date();
    month = today.getMonth() + 1;
    year = today.getFullYear();
}

// Calculate the last day of the month taking leap year into account
// How would you do this using the js Date object?
if (month === 4 || month === 6 || month === 9 || month === 11)
  lastDay = 30;
else if (month !== 2)
  lastDay = 31;
else if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
  lastDay = 29;
else
  lastDay = 28;

// Save the standard output stream object
let out = process.stdout;

// Use the day of the week number for the first day of the month to set the day
// number of the calendar cell in the upper left corner. This will be < 1 if the 
// cell is supposed to be blank.
let firstDayOfMonth = new Date(year, month-1, 1);
let dday = 1 - firstDayOfMonth.getDay();

// When done is true, stop printing the calendar.
let done = false;

out.write(sprintf("     %s %d\n", monthNames[month], year));
out.write(" SU MO TU WE TH FR SA\n");

for (let row = 1; !done; ++row) {
  for (let colday = 1; colday <= 7 && !done; ++colday, ++dday) {
    if (dday < 1)
      out.write("   ");
    else 
      out.write(sprintf(" %2d", dday));
    done = (dday === lastDay);
  }
  out.write('\n');
}

