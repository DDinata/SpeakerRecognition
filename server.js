const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));
const PUBLIC_DIR = __dirname + "/public/";
app.use(express.static(PUBLIC_DIR));
const server = require("http").Server(app);

// google cloud shit
const speech = require('@google-cloud/speech');
const fs = require('fs');
const projectId = 'speechdemon1738';
const client = new speech.SpeechClient({
  projectId: projectId,
});


// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const config = {
  encoding: 'wav',
  sampleRateHertz: 44100,
  languageCode: 'en-US',
};

  


app.get("/", function(req, res) {
  res.sendFile(PUBLIC_DIR + "index.html");
});

app.get("/temp", function(req, res) {
  res.sendFile(PUBLIC_DIR + "temp.html");
});

app.post("/stream_audio", function(req, res) {
  //console.log(req.body.blob_wav)

  fs.writeFile("stream_test.wav", req.body.blob_wav, 'base64', function(err){});

  const stream_audio = {
    content: req.body.blob_wav,
  };

  const stream_request = {
    audio: stream_audio,
    config: config,
  };

  // Detects speech in the audio file
  client
    .recognize(stream_request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
      res.send({transcription: transcription});
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

});

app.post("/resample", function(req, res) {
  console.log("RESAMPLING");
  audio = req.body.audio;
  fs.writeFile("resample_this_shit.wav", audio, 'base64', function(err){});
  cmd = "sox resample_this_shit.wav -r 16000 resampled.wav";
  const exec = require('child_process').exec;
  const child = exec(cmd,
      (error, stdout, stderr) => {
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          console.log("READING FILE");
          fs.readFile('resampled.wav', function (err, data) {
              if (err) throw err;
                console.log("RESAMPLED DATA.. SENDING BACK");
                resampled_audio = data.toString("base64");
                res.send({resampled_audio: resampled_audio});
          }); 
  }); 
});


app.post("/python_stuff", function(req, res) {
  console.log("PYTHON STUFF");
  inputString = req.body.inputString;

  fs.writeFile("pystuff", inputString, function(err){
    cmd = "python3 automation2.py pystuff";
      const exec = require('child_process').exec;
      const child = exec(cmd,
          (error, stdout, stderr) => {
            console.log("PYTHON STDOUT: " + stdout);

            /*
						fs.readFile("task", function(err, task_data) {
              console.log("TASK:");
              task_data = JSON.parse(task_data);
              console.log(task_data.toString());
              fs.readFile("idea", function(err, idea_data) {
                console.log("IDEA:");
                idea_data = JSON.parse(idea_data);
                console.log(idea_data.toString());
                fs.readFile("memo", function(err, memo_data) {
                  console.log("MEMO:");
                  console.log(memo_data.toString());
                  memo_data = JSON.parse(memo_data);
                  fs.readFile("uber", function(err, uber_data) {
                    console.log("UBER:");
                    uber_data = JSON.parse(uber_data);
                    console.log(uber_data.toString());
                    res.send({task_data, idea_data, memo_data, uber_data});
                  });
                });
              });
            });
            */


      }); 

  });


  /*
  cmd = "python3 automation.py '" + inputString + "'";
  const exec = require('child_process').exec;
  const child = exec(cmd,
      (error, stdout, stderr) => {
          //console.log(`stdout: ${stdout}`);
          //console.log(`stderr: ${stderr}`);
          
          console.log("STDOUT: " + stdout);
          res.send({output: stdout});
  }); 
  */

});


server.listen(process.env.PORT || 3000, function() {
    console.log("server up boi");
});
