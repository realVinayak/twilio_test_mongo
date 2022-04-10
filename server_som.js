const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const mongoose = require('mongoose')

const key_ = "mongodb+srv://vinayakjha12345:9313191625qaz@cluster0.sgzuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(key_, {useNewUrlParser:true})
  .then(()=>console.log('MongoDB Connected.... For Link'))
  .catch(err=>console.log(err))

const linkSchema = new mongoose.Schema({
  phone_number: {
    type: String
  },
  is_seeking: {
    type: Boolean
  },
  links: [String]
})
const app = express();
const PORT = process.env.PORT || 5000;

app.post('/name', (request, response) => {
  const tml = new VoiceResponse();
  tml.say({ voice: 'alice' }, 'What is your name');
  tml.record({
    action: '/age',
    finishOnKey: 1,
    timeout: 10,
    recordingStatusCallback: '/name_record',
    recordingStatusCallbackMethod: 'GET'
  });
  response.type('text/xml');
  response.send(tml.toString());
});
app.post('/hangup', (request, response) => {
  const tml = new VoiceResponse();
  tml.hangup();
  response.type('text/xml');
  response.send(tml.toString());
});
app.post('/age', (request, response) => {
  const tml = new VoiceResponse();
  tml.say({ voice: 'alice' }, 'What is your age');
  tml.record({
    action: '/location',
    finishOnKey: 1,
    timeout: 10,
    recordingStatusCallback: '/age_record',
    recordingStatusCallbackMethod: 'GET'
  });
  response.type('text/xml');
  response.send(tml.toString());
});
app.post('/location', (request, response) => {
  const tml = new VoiceResponse();
  tml.say({ voice: 'alice' }, 'Where do you currently live');
  tml.record({
    action: '/location_movement',
    finishOnKey: 1,
    timeout: 10,
    recordingStatusCallback: '/location_record',
    recordingStatusCallbackMethod: 'GET'
  });
  response.type('text/xml');
  response.send(tml.toString());
});
app.post('/location_movement', (request, response) => {
  const tml = new VoiceResponse();
  tml.say({ voice: 'alice' }, 'Where do you wanna work, and how far are you willing to relocate');
  tml.record({
    action: '/qualifications',
    finishOnKey: 1,
    timeout: 10,
    recordingStatusCallback: '/lm_record',
    recordingStatusCallbackMethod: 'GET'
  });
  response.type('text/xml');
  response.send(tml.toString());
});
app.post('/qualifications', (request, response) => {
  const tml = new VoiceResponse();
  tml.say({ voice: 'alice' }, 'What sort of job are you looking for, and what is your experience level');
  tml.record({
    action: '/hangup',
    finishOnKey: 1,
    timeout: 0,
    recordingStatusCallback: '/qual_record',
    recordingStatusCallbackMethod: 'GET'
  });
  response.type('text/xml');
  response.send(tml.toString());
});
app.get('/name_record', (req, res)=>{
  console.log("Got name record now");
  console.log(req.query);
})
app.get('/age_record', (req, res)=>{
  console.log(req.query);
})
app.get('/location_record', (req, res)=>{
  console.log(req.query)
})
app.get('/lm_record', (req, res)=>{
  console.log(req.query)
})
app.get('/qual_record', (req, res)=>{
  console.log(req.query)
})
app.listen(PORT, () => {
  console.log(
    'Now listening on port 3000. ' +
    'Be sure to restart when you make code changes!'
  );
});
