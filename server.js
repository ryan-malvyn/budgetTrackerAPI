const express = require("express");
const app = express();
const envelopesRouter = require("./envelopes");

app.use(express.json());

app.use("/envelopes", envelopesRouter);

const PORT = 4001;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
