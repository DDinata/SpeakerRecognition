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

app.get("/test", function(req, res) {
  res.sendFile(PUBLIC_DIR + "index.html");
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

server.listen(process.env.PORT || 3000, function() {
    console.log("server up boi");
});
