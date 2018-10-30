const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/sandbox.html`);
});

app.listen(3000, () => {
  console.log(
    "\x1b[32m%s\x1b[32m",
    "Open http://localhost:3000 to view sandbox."
  );
  console.log("\x1b[0m%s\x1b[0m", "To close, press CONTROL + C.\n");
});

app.use(express.static(`${__dirname}/`));
