// Write each command line argument to the console
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});