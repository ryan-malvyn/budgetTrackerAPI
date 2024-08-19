const envelopesRouter = require("express").Router();
const {
  getEnvelopesData,
  getSpecificEnvelope,
  addEnvelope,
  addTransactionData,
  removeEnvelopes,
  transferBalance,
  searchForDuplicates
} = require("./db");

module.exports = envelopesRouter;

// Envelopes Duplicate Checker Middleware -> Targets a specific HTTP verb
const duplicateChecker = (dataType) => {
    return (req,res,next) =>{
    const body = req.body;
    const id = req.params.envelopeId
    const result = searchForDuplicates(dataType,body,id)
    if(result){
        next();
    } else {
        res.status(404).send('There is already a duplicate');
    }
    }
}

// Getting user envelopes data
envelopesRouter.get("/", (req, res, next) => {
  const envelopes = getEnvelopesData();
  res.status(201).send(envelopes);
});

// Add new transaction data
envelopesRouter.post("/:envelopeId",duplicateChecker('transaction'),(req, res, next) => {
    const result = addTransactionData(req.body,req.params.envelopeId)
    res.send(result)
});

// Getting a specific envelope data
envelopesRouter.get("/:envelopeId", (req, res, next) => {
  const envelope = getSpecificEnvelope(req.params.envelopeId);
  if (envelope) {
    res.status(201).send(envelope);
  } else {
    res.status(404).send("Envelope not found");
  }
});

// Creating a new envelope
envelopesRouter.post("/",duplicateChecker('envelope'), (req, res, next) => {
  const { name, budget } = req.body;
  if (name && budget) {
    const results = addEnvelope({ name, budget });
    res.status(201).send(results);
  } else {
    res.status(500).send();
  }
});

// Transfer balance
envelopesRouter.put("/:envelopeId",(req,res,next)=>{
    const data = {
        from:req.params.envelopeId,
        to:req.body
    }
    const result = transferBalance(data)
    res.send(result);
})

// Delete an envelope
envelopesRouter.delete("/:envelopeId",(req,res,next)=>{
    res.send(removeEnvelopes(req.params.envelopeId));
})
