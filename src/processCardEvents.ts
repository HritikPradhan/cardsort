import { CardEvent, Transaction } from './types'

type CardTransactionMapping = {
  [cardId: string]: Transaction
}

/**
 * Write a function that receives a large batch of card events from multiple cards,
 * returning an object which maps from cardId -> valid transaction. Only cardIds with
 * a valid transaction should appear in the returned object.
 *
 * A valid transaction is a pair of card events, starting with a RESERVATION event
 * and finishing with either a CONFIRMATION or CANCELLATION event.
 *
 * The input is an array of unprocessed card events. Some events might be duplicated
 * or missing. For duplicated events, you may only use one of its occurrences and
 * discard the rest. Missing events invalidate the transaction.
 *
 * @param cardEvents CardEvent[] List of card events
 * @returns CardTransactionMapping Valid transactions grouped by cardId
 */
export const processCardEvents = (cardEvents: CardEvent[]): CardTransactionMapping => {

let i:number
let obj:{[key: string]:any}={}
for(let i=0;i<cardEvents.length;i++){
  if(!obj[cardEvents[i].cardId]){
    obj[cardEvents[i].cardId]=[cardEvents[i]]
  }else{
    let j:number
    let present=false
    for(j=0;j<obj[cardEvents[i].cardId].length;j++){
      if(obj[cardEvents[i].cardId][j].id==cardEvents[i].id){
        present=true
      }
    }
    if(present==false){
      (obj[cardEvents[i].cardId]).push(cardEvents[i])
    }
  }
}
for (let [key,value] of Object.entries(obj)){
  let reserve=0
  let cancel=0
  let k:number
  for(let k=0;k<value.length;k++){
    if(value[k].type=="RESERVATION"){
      reserve++
    }else{
      --cancel
    }
  }
  if(reserve+cancel !== 0){
   delete obj[key]
  }
}
  
  return obj as CardTransactionMapping
}