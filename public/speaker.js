// media and audio stuff
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;
var audioContext = new AudioContext;
if (audioContext.createScriptProcessor == null)
  audioContext.createScriptProcessor = audioContext.createJavaScriptNode;

// elements (jQuery objects)
var $microphone = $('#microphone'),
    $microphoneLevel = $('#microphone-level'),
    $recording = $('#recording'),
    $timeDisplay = $('#time-display'),
    $record = $('#btnRecord'),
    $cancel = $('#cancel')

// initialize input element states (required for reloading page on Firefox)
$microphone.attr('disabled', false);
$microphone[0].checked = true;
$microphoneLevel.attr('disabled', false);
$microphoneLevel[0].valueAsNumber = 0.3;


var microphone = undefined,     // obtained by user click
    microphoneLevel = audioContext.createGain(),
    mixer = audioContext.createGain(),
    input = audioContext.createGain(),
    processor = undefined;      // created on recording
microphoneLevel.gain.value = 0.3;
microphoneLevel.connect(mixer);
mixer.connect(input);
mixer.connect(audioContext.destination);


$microphoneLevel.on('input', function() {
  var level = $microphoneLevel[0].valueAsNumber / 100;
  microphoneLevel.gain.value = level * level;
});

// obtaining microphone input
if (microphone == null)
  navigator.getUserMedia({ audio: true },
    function(stream) {
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(microphoneLevel);
      $microphone.attr('disabled', true);
      //$microphoneLevel.removeClass('hidden');
    },
    function(error) {
      $microphone[0].checked = false;
      window.alert("Could not get audio input.");
    });




// recording process
var encoder = undefined;


function getBuffers(event) {
  var buffers = [];
  for (var ch = 0; ch < 2; ++ch)
    buffers[ch] = event.inputBuffer.getChannelData(ch);
  return buffers;
}
const bufSz = 1024;

var text = [];
var chunk_num = 0;
var start_time = Date.now();

var profiles = {}

function startRegularRecording() {
  console.log("STARTING TO RECORD");
  processor = audioContext.createScriptProcessor(bufSz, 2, 2);
  input.connect(processor);
  processor.connect(audioContext.destination);
  encoder = new WavAudioEncoder(audioContext.sampleRate, 1);
  start_time = Date.now();
  start_time_chunk = Date.now();
  processor.onaudioprocess = function(event) {
    encoder.encode(getBuffers(event));
    if (Date.now() - start_time_chunk > 10000) {
      console.log("RESETTING CHUNK");
      encoded_audio = encoder.finish();
      encoder = new WavAudioEncoder(audioContext.sampleRate, 1);
      start_time_chunk = Date.now();
      text.push("");
      send_encoded_audio(encoded_audio, chunk_num);
      chunk_num = chunk_num +  1;
    }
  };
}

function stopRegularRecording() {
  input.disconnect();
  processor.disconnect();
  if (finish) {
    encoded_audio = encoder.finish();
    console.log(encoded_audio);
  }
  else
    encoder.cancel();

}
  

speaker_chunks = [];

var has_fucking_recorded = false
function startRecordingProcess() {
  if (has_fucking_recorded) {
    return;
  }
  else {
    has_fucking_recorded = true;
  }
  console.log("STARTING TO RECORD");
  processor = audioContext.createScriptProcessor(bufSz, 2, 2);
  input.connect(processor);
  processor.connect(audioContext.destination);
  encoder = new WavAudioEncoder(audioContext.sampleRate, 1);
  start_time = Date.now();
  start_time_chunk = Date.now();
  processor.onaudioprocess = function(event) {
    encoder.encode(getBuffers(event));
    if (Date.now() - start_time_chunk > 10000) {
      console.log("RESETTING CHUNK");
      encoded_audio = encoder.finish();
      encoder = new WavAudioEncoder(audioContext.sampleRate, 1);
      start_time_chunk = Date.now();
      text.push("");
      send_encoded_audio(encoded_audio, chunk_num);
      resample_encoded_audio(encoded_audio, chunk_num, function(resampled_audio) {
        //console.log(resampled_audio);
        identifyAudio(resampled_audio, function(name) {
          speaker_chunks.push(name);
          console.log(speaker_chunks);
        });
      });
      chunk_num = chunk_num +  1;
    }
    else if (Date.now() - start_time > 1000) {
      console.log("ENCODING AND SENDING");
      encoded_audio = encoder.temp_finish();
      send_encoded_audio(encoded_audio, chunk_num);
      start_time = Date.now();
    }
  };
}

function send_encoded_audio(encoded_audio, cn, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/stream_audio", true);
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      text[cn] = response.transcription;
      console.log(cn);
      console.log("TEXT:");
      $("#response-text").html("");
      for (var i = 0; i <= cn; i++) {
        speaker = "";
        if (i < speaker_chunks.length) {
          speaker = speaker_chunks[i] + ": ";
        }
        p_text = speaker + text[i];
        p_content = "<p>" + p_text + "</p>";
        $("#response-text").append(p_content);
      }
      console.log(p_text);
      if (cb) {
        cb();
      }
    }   
  };  
  xhr.setRequestHeader("Content-Type", "application/json");

  var reader = new FileReader();
  reader.onloadend = function() {
    base64Data = reader.result;                
    base64Data = base64Data.replace("data:audio/wav;base64,", "");
    //console.log(base64Data);
    xhr.send(JSON.stringify({blob_wav: base64Data}));
  };
  reader.readAsDataURL(encoded_audio); 
}

function resample_encoded_audio(encoded_audio, cn, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/resample", true);
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      if (cb) {
        cb(response.resampled_audio);
      }
    }   
  };  
  xhr.setRequestHeader("Content-Type", "application/json");

  var reader = new FileReader();
  reader.onloadend = function() {
    base64Data = reader.result;                
    base64Data = base64Data.replace("data:audio/wav;base64,", "");
    //console.log(base64Data);
    xhr.send(JSON.stringify({audio: base64Data}));
  };
  reader.readAsDataURL(encoded_audio); 
}


function stopRecordingProcess(finish) {
  input.disconnect();
  processor.disconnect();
  if (finish) {
    encoded_audio = encoder.finish();
    console.log(encoded_audio);
    send_encoded_audio(encoded_audio, chunk_num);
  }
  else
    encoder.cancel();


  console.log("recording finished");
  sendFinalText();

}

function sendFinalText() {
  console.log("sending final text");
  var final_text = "";
  for (var i = 0; i < text.length; i++) {
    final_text = final_text + text[i] + " ";
  }
  console.log(final_text);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/python_stuff", true);
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      console.log(response.output);
    }   
  };  
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({inputString: final_text}));
}

// recording buttons interface
var startTime = null    // null indicates recording is stopped

function minSecStr(n) { return (n < 10 ? "0" : "") + n; }

function updateDateTime() {
  if (startTime != null) {
    var sec = Math.floor((Date.now() - startTime) / 1000);
    $timeDisplay.html(minSecStr(sec / 60 | 0) + ":" + minSecStr(sec % 60));
  }
}

window.setInterval(updateDateTime, 200);

function disableControlsOnRecord(disabled) {
  if (microphone == null)
    $microphone.attr('disabled', disabled);
}

function startRecording() {
  startTime = Date.now();
  $recording.removeClass('hidden');
  //$record.html('STOP');
  $cancel.removeClass('hidden');
  disableControlsOnRecord(true);
  startRecordingProcess();
}

function stopRecording(finish) {
  startTime = null;
  $timeDisplay.html('00:00');
  $recording.addClass('hidden');
  //$record.html('RECORD');
  $cancel.addClass('hidden');
  disableControlsOnRecord(false);
  stopRecordingProcess(finish);
}

$record.click(function() {
  if (startTime != null)
    stopRecording(true);
  else
    startRecording();
});

$cancel.click(function() { stopRecording(false); });
