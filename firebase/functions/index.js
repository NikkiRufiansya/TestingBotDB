// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
//file ini yg bener

'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`Saya Tidak Mengerti, Bisa Di Ulangi ?`);
  
    let query = agent.query;
    return admin.database().ref('/query_user').push({query: query}).then((snapshot) => {
      console.log('Sukses Baca Database: ' + snapshot.ref.toString());
    });
  
  }

 

  function insertToRealtimeFirebase(agent){
    let QueryTextFromUser = agent.query;
    return admin.database().ref('/query_user').push({query: QueryTextFromUser}).then((snapshot) => {
      console.log('database write sucessful: ' + snapshot.ref.toString());
      agent.add("okelah klw begitu");

    });
  }

  function insert(agent) {
    let kata = agent.query;
    agent.add("function jalan : " + kata)
  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('insertDB', insertToRealtimeFirebase);
  intentMap.set('insert', insert);
  agent.handleRequest(intentMap);
});
