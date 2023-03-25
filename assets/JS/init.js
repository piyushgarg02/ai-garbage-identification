//const axios = require('axios/dist/browser/axios.cjs'); // browser
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input");
let file;
button.onclick = () => {
  input.click();
}
input.addEventListener("change", function () {
  file = this.files[0];
  dropArea.classList.add("active");
  showFile();
});
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});
dropArea.addEventListener("drop", (event) => {
  event.preventDefault();

  file = event.dataTransfer.files[0];
  showFile();
});



var convertToBase64 = function (url, imagetype) {

  var img = document.createElement('IMG'),
    canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    data = '';

  img.crossOrigin = 'Anonymous'

  img.onLoad = function () {

    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    data = canvas.toDataURL(imagetype);
    //callback(data);
  };

  img.src = url;
  return img;
};

var imgResult = { "garbage_type": "plastic", "collection_point": "collection point1", "accuracy": "87%" }
var sendBase64ToServer = function (name, base64) {
  var httpPost = new XMLHttpRequest(),
    path = "http://www.mydomain.com/subdomain-if-any/predict/" + name,
    data = JSON.stringify({ image: base64.src });
  httpPost.onreadystatechange = function (err) {
    if (httpPost.readyState == 4 && httpPost.status == 200) {
      console.log(httpPost.responseText);
    } else {
      console.log(err);
      console.log(imgResult);
    }
    showResult();
  };
  httpPost.open("POST", path, true);
  // httpPost.setRequestHeader('Content-Type', 'application/json')
  httpPost.setRequestHeader('Access-Control-Allow-Origin', 'origin');
  httpPost.send(data);
}
var uploadImage = function (src, name, type) {
  var x = convertToBase64(src, type)

  try {
    sendBase64ToServer(name, x);
  }
  catch (err) {
    console.log(err.message);
  }
  //});
};


function showFile() {
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let fileReaderURL = fileReader.result; //passing user file source in fileURL variable
      let fileURL = file.name;
      let fileNameArea = document.getElementById('file-name');
      fileNameArea.innerHTML = fileURL;
      uploadImage(fileReaderURL, fileURL, 'image/png')
    }
    fileReader.readAsDataURL(file);


  } else {
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}
function showResult(){
  document.querySelector('.uploaded-file-container').style.display = 'block';
  document.querySelector('#gabage-detail-container .garbage-name .type').innerHTML = imgResult.garbage_type;
  document.querySelector('#gabage-detail-container .garbage-collector .type').innerHTML = imgResult.collection_point;
  document.querySelector('#gabage-detail-container .garbage-accuracy .type').innerHTML = imgResult.accuracy;
}
