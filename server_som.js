const express = require('express');
const { request } = require('http');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const mongoose = require('mongoose')
let obj_employer={
    name:"",
    phone_number:"",
    age_of_employee:"",
    job_descrip:"",
    job_loc:""
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
const app = express();
const PORT = process.env.PORT || 5000;
app.post('/join', (request, response) => {
  const tml = new VoiceResponse();
  const gatherNode = tml.gather({ numDigits: 1,
    action: '/response_user',
    method:'GET'})
  gatherNode.say('Hello! Welcome to job search. Please press 1, if you are an employer. If you are a job seeker, press 2');
  })
app.get('/response_user', (req, res)=>{
    console.log(res, req)
})
  /**if (request.body.Digits) {
    switch (request.body.Digits) {
      case '1':
        tml.say('Please answer the following questions');
        tml.say("What is your name")
        tml.record({
            action: '/age_emplr',
            finishOnKey: 1,
            timeout: 10,
            recordingStatusCallback: '/name_record',
            recordingStatusCallbackMethod: 'GET'
          });
        break;
      case '2':
        tml.say('Please answer the following questions');
        break;
      default:
        tml.say("Sorry, I don't understand that choice.");
        tml.pause();
        gather();
        break;
    }
  } else {
    gather();
  }
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
**/
//Employer Part:
app.post('/age_emplr', (request, response)=>{
    const tml = new VoiceResponse();
    tml.say({ voice: 'alice' }, 'What should be the minimum age of employee');
    tml.record({
    action: '/location_job',
    finishOnKey: 1,
    timeout: 10,
    recordingStatusCallback: '/age_emplr_record',
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
      action: '/get_phone_number',
      finishOnKey: 1,
      timeout: 10,
      recordingStatusCallback: '/job_descrip_job',
      recordingStatusCallbackMethod: 'GET'
    });
    response.type('text/xml');
    response.send(tml.toString());
  });
app.post('/get_phone_number', (request, response)=>{
    const gatherNode = tml.gather({ 
        numDigits: 10,
        action: '/transf_phone_number',
        method: 'GET'
    });
})
app.get('/transf_phone_number', (request, response)=>{
  const tml = new VoiceResponse();
  tml.hangup();
  response.type('text/xml');
  response.send(tml.toString())
  console.log(request.body.Digits)
  obj_employer.phone_number = request.body.Digits;
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
