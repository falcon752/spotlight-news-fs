const messages = [
  "TypeError: Cannot read property 'foo' of undefined",
  "ReferenceError: bar is not defined",
  "SyntaxError: Unexpected token '<'",
  "Error: Network request failed",
  "Warning: Each child in a list should have a unique 'key' prop",
  "Unhandled promise rejection",
  "Warning: Invalid prop `value` supplied to `Input`",
];

let count = 0;
const repeat = 500; // total error lines
const interval = 20; // milliseconds between lines

const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const flood = setInterval(() => {
  if (count >= repeat) {
    clearInterval(flood);
    console.log(`${RED}Done flooding!${RESET}`);
    return;
  }
  const msg = messages[Math.floor(Math.random() * messages.length)];
  console.error(`${RED}${msg}${RESET}`);
  count++;
}, interval);
