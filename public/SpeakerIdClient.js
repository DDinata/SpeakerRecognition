var subscription_key = "e1cd945293f54372ae77a4897e7c5811";

function createProfile() {
    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles?",
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscription_key);
        },
        type: "POST",
        // Request body
        data: '{"locale": "en-us"}',
    })
    .done(function(data) {
        console.log("profile created");
        console.log(data.identificationProfileId);
    })
    .fail(function() {
        console.log("error");
    });
};

function enrollProfile(identificationProfileId, audioFile) {
    var profId = document.getElementById(identificationProfileId).value;
    var audio = document.getElementById(audioFile).files[0];
    console.log(audio);

    var params = {
        // Request parameters
        "shortAudio": "true",
    };

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/" + profId +"/enroll?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "POST",
        // Request body
        data: audio,
        processData: false
    })
    .done(function(data) {
        console.log("success");
        console.log(data);
    })
    .fail(function() {
        console.log("error");
    })
};

function getStatus(operationId) {
    var opId = document.getElementById(operationId).value;

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/operations/" + opId,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "GET"
    })
    .done(function(data) {
        console.log("success");
        console.log(data);
    })
    .fail(function() {
        console.log("error");
    });
}

function identify(identificationProfileIds, audioFile) {
    var profId = document.getElementById(identificationProfileIds).value;
    var audio = document.getElementById(audioFile).files[0];

    console.log(audio);

    var params = {
        // Request parameters
        "shortAudio": "true",
    };

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/identify?identificationProfileIds=" + profId + "&" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "POST",
        // Request body
        data: audio,
        processData: false
    })
    .done(function(data,status,xhr) {
        console.log("success");
        console.log(xhr.getAllResponseHeaders());
    })
    .fail(function() {
        console.log("error");
    });
};

function deleteProfile(identificationProfileId) {
    var profId = document.getElementById(identificationProfileId).value;

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/" + profId,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscription_key);
        },
        type: "DELETE",
    })
    .done(function(data) {
        console.log("profile deleted");
    })
    .fail(function() {
        console.log("error");
    });
};

function getProfile(identificationProfileId) {
    var profId = document.getElementById(identificationProfileId).value;

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/" + profId,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscription_key);
        },
        type: "GET",
    })
    .done(function(data) {
        console.log("got profile");
        console.log(data);
    })
    .fail(function() {
        console.log("error");
    });
};

function getAllProfiles() {

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles?",
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "GET",
    })
    .done(function(data) {
        console.log("got all profiles");
        $.each(data, function(key, value) {
           console.log(value.identificationProfileId);
        });
    })
    .fail(function() {
        console.log("error");
    });
};










function set_name(id) {
  name = "godamnit";
  if (id == "4d2cccc4-d61c-48f4-b0a2-d2c871394f85") {
    name = "Eric";
  }
  else if (id == "2db575fa-98c9-4a8f-9d3e-027b9190e274") {
    name = "Gates";
  }
  else if (id == "fc0c40f9-2b61-461f-9df4-79e58e1c61f2") {
    name = "Neil";
  }
  return name;
}




function identifyAudio(audio, cb) {

  const profId = "fc0c40f9-2b61-461f-9df4-79e58e1c61f2, 2db575fa-98c9-4a8f-9d3e-027b9190e274, 4d2cccc4-d61c-48f4-b0a2-d2c871394f85";

  const audioBlob = base64ToBlob("data:audio/wav;base64,".concat(audio));

  const params = {
    "shortAudio": "true",
  };

  $.ajax({
    url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/identify?identificationProfileIds=" + profId + "&" + $.param(params),
    beforeSend: function(xhrObj){
      // Request headers
      xhrObj.setRequestHeader("Content-Type","application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
    },
    type: "POST",
    // Request body
    data: audioBlob,
    processData: false
  })
  .done(function(data,status,xhr) {
    console.log("success");
    loc = xhr.getResponseHeader("operation-location");
    loc_arr = loc.split("/");
    operation_id = loc_arr[loc_arr.length-1];
    setTimeout(function() {
      getStatusCb(operation_id, function(data) {
        id = data.processingResult.identifiedProfileId;
        name = set_name(id)
        console.log("name: " + name);
        if (cb) {
          cb(name);
        }
      });
    }, 3000);
  })
  .fail(function() {
    console.log("error");
  });
};


function getStatusCb(opId, cb) {

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/spid/v1.0/operations/" + opId,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "GET"
    })
    .done(function(data) {
        console.log("success");
        console.log(data);
        if (cb) {
          cb(data);
        }
    })
    .fail(function() {
        console.log("error");
    });
}

function base64ToBlob(str) {
  // extract content type and base64 payload from original string
  var pos = str.indexOf(';base64,');
  var type = str.substring(5, pos);
  var b64 = str.substr(pos + 8);

  // decode base64
  var content = atob(b64);

  // create an ArrayBuffer and a view (as unsigned 8-bit)
  var buffer = new ArrayBuffer(content.length);
  var view = new Uint8Array(buffer);

  // fill the view, using the decoded base64
  for(var n = 0; n < content.length; n++) {
    view[n] = content.charCodeAt(n);
  }

  // convert ArrayBuffer to Blob
  var blob = new Blob([buffer], { type: type });

  return blob;
}
