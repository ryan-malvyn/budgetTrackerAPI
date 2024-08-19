const envelopesData = [
  {
    id: 1,
    name: "Rent",
    budget: 10000,
    spent: 0,
    history: [],
  },
  {
    id: 2,
    name: "Shopping",
    budget: 5000,
    spent: 0,
    history: [],
  },
];

// Returns all envelopes data -> Working
const getEnvelopesData = () => {
  return envelopesData;
};

// Returns a specific envelope -> Working
const getSpecificEnvelope = (envelopeId) => {
  const specificEnvelope = envelopesData.find(
    (envelope) => envelope.id === Number(envelopeId),
  );
  return specificEnvelope;
};

// Creates a new envelope and returns it -> Working
const addEnvelope = (envelopeData) => {
  const { name, budget } = envelopeData;
  const id =
    envelopesData.length > 0
      ? Math.max(...envelopesData.map((envelope) => Number(envelope.id))) + 1
      : 1;
  const newEnvelope = {
    id: id,
    name: name,
    budget: budget,
    history: [],
  };
  envelopesData.push(newEnvelope);
  return newEnvelope;
};
// Needs to check if there are duplicates or not & if the data entered is sufficient -> Working

// Adds transaction data to each envelope -> Working
const addTransactionData = (transaction,id) => {
    const targetEnvelope = envelopesData.find(envelope=>envelope.id === Number(id))
    const {note,price} = transaction
    const date = new Date()
    const history = targetEnvelope.history
    const transactionId = history.length > 0? Math.max(...history.map(transaction=>transaction.id))+1 : 1;
    const newTransaction = {
        "id":transactionId,
        "note":note,
        "price":price,
        "date":date
    }
    targetEnvelope.spent += price
    targetEnvelope.budget -= price
    targetEnvelope.history.push(newTransaction)
    return targetEnvelope
};
// If the name and amount exists, add a date using Date.now(); -> Working

// Deletes specific envelopes -> NOT YET
const removeEnvelopes = (envelopeId) => {
    const targetIndex = envelopesData.findIndex(envelope => Number(envelope.id) === Number(envelopeId))
  const removedEnvelope = envelopesData.splice(targetIndex, 1);
  return removedEnvelope;
};

// Transfers specific envelopes
const transferBalance = ({from,to}) => {
    const {targetId,targetName,amount} = to;
    const sourceEnvelope = envelopesData.findIndex(envelope => Number(envelope.id) === Number(from))
    const targetEnvelope = envelopesData.findIndex(envelope => Number(envelope.id) === Number(targetId))

    // Adding transaction data
    envelopesData[sourceEnvelope].budget -= amount;
    const date = new Date()
    const historyFrom = envelopesData[sourceEnvelope].history
    const transactionIdFrom = historyFrom.length > 0? Math.max(...history.map(transaction=>transaction.id))+1 : 1;
    const transferFrom = {
        "id":transactionIdFrom,
        "note":`${amount} transferred to ${targetName}`,
        "price":amount,
        "date":date
    }
    historyFrom.push(transferFrom)

    envelopesData[targetEnvelope].budget += amount;
    const historyTo = envelopesData[targetEnvelope].history
    const transactionIdTo = historyTo.length > 0? Math.max(...history.map(transaction=>transaction.id))+1 : 1;
    const transferTo = {
        "id":transactionIdTo,
        "note":`${amount} fransferred from ${envelopesData[sourceEnvelope].name}`,
        "price":amount,
        "date":date
    }
    historyTo.push(transferTo)


    return [envelopesData[sourceEnvelope],envelopesData[targetEnvelope]]
};

// Search for duplicates -> Returns true so next() is called
const searchForDuplicates = (dataType, body, id) => {
    switch (dataType) {
      case 'envelope': {
        const { name } = body;
        const foundEnvelope = envelopesData.findIndex(
          envelope => envelope.name.toLowerCase() === name.toLowerCase()
        );
        return foundEnvelope === -1;
      }
      case 'transaction': {
        const targetEnvelope = envelopesData.find(
          envelope => Number(envelope.id) === Number(id)
        );
        if (!targetEnvelope) return false; // If envelope doesn't exist, no need to check further.

        const { note, price } = body;
        const foundTransaction = targetEnvelope.history.findIndex(
          transaction => transaction.note.toLowerCase() === note.toLowerCase() && Number(transaction.price) === Number(price)
        );
        return foundTransaction === -1;
      }
      default:
        return false;
    }
  };

module.exports = {
  getEnvelopesData,
  getSpecificEnvelope,
  addEnvelope,
  addTransactionData,
  removeEnvelopes,
  searchForDuplicates,
  transferBalance
}
