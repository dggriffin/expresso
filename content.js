// Content scripts can interact with web pages directly
// Essentially, this JavaScript is injected into each page
// However, it cannot listen for clicks on the Browser Action (the button) or use Chrome APIs
// Ref: https://robots.thoughtbot.com/how-to-make-a-chrome-extension

var video;
var width = 320;
var height = 200; //cwkTODO compute this


var isStarted = false;
var isInitialized = false;
var timer;

var TEST_EMOTION_OBJECT = {
  anger: false,
  attention: false,
  browFurrow: false,
  browRaise: false,
  chinRaise: false,
  contempt: false,
  disgust: false,
  engagement: false,
  eyeClosure: false,
  fear: false,
  gender: false,
  glasses: false,
  innerBrowRaise: false,
  joy: false,
  lipCornerDepressor: false,
  lipPress: false,
  lipPucker: false,
  lipSuck: false,
  mouthOpen: false,
  noseWrinkle: false,
  sadness: false,
  smile: false,
  surprise: false,
  upperLipRaise: false,
  valence: false
};

$(window).on('load', function(e){
    chrome.runtime.sendMessage({"message": "page_loaded"});
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if ( request.message === "init_video" ) {
          // Send a message for the Background Script to catch
          addVideoElement();
        }
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if ( request.message === "trigger_post" ) {
          // Send a message for the Background Script to catch
          takePhoto();
        }
    }
);

// Ref: https://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm
function addVideoElement() {

    var videoElement = '<div id="container"><video autoplay="true" id="videoElement"></video></div>';
    $("body").append(videoElement);
    $("#container").hide();

    var canvasElement = '<canvas id="canvas"></canvas>';
    $("body").append(canvasElement);
    $("#canvas").hide();

    video = document.querySelector("#videoElement");
     
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
     
    if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
     
    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
    }
     
    function videoError(e) {
        // do something
        alert("video Error!");
    }
}

// Ref: http://stackoverflow.com/a/19632021
// Ref: https://jsfiddle.net/vh1socdc/
function takePhoto() {
    //alert("Smile!");

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL('image/png');

    // Add a new photo!
    // var photoElement = '<img class="photo" alt="photo">';
    // $("body").append(photoElement);
    // var newPhoto = $(".photo").last()[0];
    // newPhoto.setAttribute('src', data);
    _testPost(data, function(data) {
        if (data.success) {
            console.log(data.data);
            _pavlokGET(function(data){
                if(data.success){
                    console.log ("beeb");
                }
            })

        }
    })
}

function _testPost(file, callback){
    // var formData = new FormData();
    // formData.append("image", _dataURItoBlob(file), "imagefile.png");

    var dataObj = {
        uri : file,
        width: width,
        height: height
    }

    $.ajax({
        url: "https://posttestserver.com/post.php",
        data: JSON.stringify(dataObj),
        datatype: 'json',
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
          if(callback){
            callback({success: true, data: TEST_EMOTION_OBJECT});
          }
        }
    });
};


function _dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
        type: mimeString
    });
};

function _pavlokGET(callback){
    $.ajax({
        url: "https://pavlok.herokuapp.com/api/OBDSIrhb2J/beep/215",
        processData: false,
        contentType: false,
        type: 'GET',
        success: function(data) {
          if(callback){
            callback({success: true, data: data});
          }
        }
    });
};

