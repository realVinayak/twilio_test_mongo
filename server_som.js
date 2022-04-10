const express = require('express');
const WebSocket = require('ws');
const http = require("http")
const wss = new WebSocket.Server("ws://34.133.218.58:80")
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const mongoose = require('mongoose')
let obj_employer={
    name:"",
    phone_number:"",
    age_of_employee:"",
    job_loc:"",
    job_descrip:""
    
}
let obj_app={
    name:"",
    phone_number:"",
    age:"",
    location:"",
    will_move:"",
    job_qual:""
}
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
  name:{
    type: String
  },
  age:{
    type: String
  },
  current_loc:{
    type: String
  },
  loc_to_move:{
    type: String
  },
  quals:{
    type: String
  }
})
const links_ = mongoose.model('link_ae', linkSchema)
const app = express();
const app2 = express();


var server = http.createServer(app2)
server.listen(port)

console.log("http server listening on %d", port)
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)})

const PORT = process.env.PORT || 5000;
app.post('/join', (request, response) => {
  const tml = new VoiceResponse();
  const gatherNode = tml.gather({ numDigits: 1,
    action: '/response_user',
    method:'GET'})
  gatherNode.say('Hello! Welcome to job search. Please press 1, if you are an employer. If you are a job seeker, press 2');
  response.type('text/xml');
  response.send(tml.toString());
})
app.get('/response_user', (req, res)=>{
    console.log(req.Digits, req.From)
    obj_employer.phone_number = req.query.From
    obj_app.phone_number = req.query.From
    console.log(obj_employer)
    let is_employer = (req.query.Digits == '1')
    const tml = new VoiceResponse();
    tml.say("What is your name")
    if (is_employer){
        tml.record({
            action: '/min_age',
            finishOnKey: 1,
            timeout: 10,
            recordingStatusCallback: '/name_emplyr',
            recordingStatusCallbackMethod: 'GET'
          });
    }else{
        tml.record({
            action: '/age',
            finishOnKey: 1,
            timeout: 10,
            recordingStatusCallback: '/name_record',
            recordingStatusCallbackMethod: 'GET'
          });
    }
    res.type('text/xml');
    res.send(tml.toString());
})
//Employer Part:
app.post('/min_age', (request, response)=>{
    const tml = new VoiceResponse();
    tml.say({ voice: 'alice' }, 'What should be the minimum age of employee');
    tml.record({
    action: '/location_job',
    finishOnKey: 1,
    timeout: 10,
    recordingStatusCallback: '/min_age_record',
    recordingStatusCallbackMethod: 'GET'
    });
    response.type('text/xml');
    response.send(tml.toString());
})
app.post('/location_job', (request, response) => {
    const tml = new VoiceResponse();
    tml.say({ voice: 'alice' }, 'What is the zip code of the job?');
    tml.record({
      action: '/job_descrip',
      finishOnKey: 1,
      timeout: 10,
      recordingStatusCallback: '/location_job_record',
      recordingStatusCallbackMethod: 'GET'
    });
    response.type('text/xml');
    response.send(tml.toString());
  });
app.post('/job_descrip', (request, response) => {
    const tml = new VoiceResponse();
    tml.say({ voice: 'alice' }, 'Please describe the job, and what experience should an employee have');
    tml.record({
      action: '/end_emplyr',
      finishOnKey: 1,
      timeout: 10,
      recordingStatusCallback: '/job_descrip_record',
      recordingStatusCallbackMethod: 'GET'
    });
    response.type('text/xml');
    response.send(tml.toString());
  });
app.post('/end_emplyr', (request, response)=>{
    const tml = new VoiceResponse();
    tml.say("We will call you when we find appropriate matches")
    response.type('text/xml');
    response.send(tml.toString());
    tml.hangup()
    console.log(obj_employer)
})
app.get('/name_emplyr', (req, res)=>{
    obj_employer.name = req.query.RecordingUrl;
})
app.get('/min_age_record', (req, res)=>{
    obj_employer.age_of_employee = req.query.RecordingUrl;
})
app.get('/location_job_record', (req, res)=>{
    obj_employer.job_loc = req.query.RecordingUrl;
})
app.get('/job_descrip_record', (req, res)=>{
    obj_employer.job_descrip = req.query.RecordingUrl;
})

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
  tml.say({ voice: 'alice' }, 'What is your current zipcode');
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
  tml.say({ voice: 'alice' }, 'How many miles are you willing to relocate');
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
    action: '/app_end',
    finishOnKey: 1,
    timeout: 0,
    recordingStatusCallback: '/qual_record',
    recordingStatusCallbackMethod: 'GET'
  });
  response.type('text/xml');
  response.send(tml.toString());
});
app.post('/app_end', (req, res)=>{
    const tml = new VoiceResponse();
    tml.say("Thanks for answering the questions. We will call you when we find job matches for you")
    tml.hangup()
    res.type('text/xml');
    res.send(tml.toString());
    
})
app.get('/name_record', (req, res)=>{
  obj_app.name = req.query.RecordingUrl;
})
app.get('/age_record', (req, res)=>{
  obj_app.age = req.query.RecordingUrl;
})
app.get('/location_record', (req, res)=>{
 obj_app.location = req.query.RecordingUrl;
})
app.get('/lm_record', (req, res)=>{
 obj_app.will_move = req.query.RecordingUrl;
})
app.get('/qual_record', (req, res)=>{
    obj_app.job_qual = req.query.RecordingUrl;
    console.log("Main Object", obj_app)
    const obj_app_1 = new links_({phone_number:obj_app.name, is_seeking:true, age:obj_app.age, current_loc:obj_app.location, loc_to_move:obj_app.will_move, quals:obj_app.job_qual})
    obj_app_1.save((err)=>{
        console.log(err)
    })
})
app.listen(PORT, () => {
  console.log(
    'Now listening on port 3000. ' +
    'Be sure to restart when you make code changes!'
  );
});
