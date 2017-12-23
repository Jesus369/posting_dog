let emptyDiv = $("#emptyDiv")
let previewDiv = $("#previewDiv")
let user_post = $("#user_post")

// buttons
let post = $("#postIt")
let deletePost = $("#deletePost")
let updatePost = $("#updatePost")
let previewButton = document.getElementById("previewButton")
let uploadButton = $("#uploadButton")

let selectedFile;

$("#file").on("change", function(event) {
  selectedFile = event.target.files[0]
})

function uploadFile() {
  let filename = selectedFile.name
  var storageRef = firebase.storage().ref("/userPosts/" + filename)
  let uploadTask = storageRef.put(selectedFile)

  uploadTask.on("state_changed", function(snapshot) {

  }, 

  function(error) {

  }, 

  function() {
    let postKey = firebase.database().ref("Posts/").push().key
    let downloadURL = uploadTask.snapshot.downloadURL
    let updates = {}
    let postData = {
      url : downloadURL,
      name : $("#name").val(),
      breed : $("#breed").val(),
      description : $("#description").val(),
      price : $("#price").val(),
      phone : $("#phoneNumber").val(),
      email : $("#emailAddress").val()
    }
    updates["/Posts/" + postKey] = postData
    firebase.database().ref().update(updates)
    console.log(downloadURL)
  })

}

$(post).click(function() {
  uploadFile()
})

