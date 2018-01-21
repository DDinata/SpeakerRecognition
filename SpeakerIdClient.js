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
