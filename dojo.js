let emptyDiv = $("#emptyDiv")
let previewDiv = $("#previewDiv")
let user_post = $("#user_post")

// buttons
let post = $("#postIt")
let deletePost = $("#deletePost")
let updatePost = $("#updatePost")
let previewButton = document.getElementById("previewButton")
let uploadButton = $("#uploadButton")

let dbRef = firebase.database().ref() // get the root
let listsRef = dbRef.child("user_posts")
let list = []

let selectedFile;


//-------------------------------------------------------------------------
function appendToPreview() {
  let name = $("#name").val()
  let breed = $("#breed").val()
  let description = $("#description").val()
  let price = $("#price").val()
  let emailAddress = $("#emailAddress").val()
  let phoneNumber = $("#phoneNumber").val()

  $(previewDiv).html(`
    <p>${$("#name").val()}</p>
    <p>${$("#breed").val()}</p>
    <p>${$("#description").val()}</p>
    <p>${$("#price").val()}</p>
    <p>${$("#phoneNumber").val()}</p>
    <p>${$("#emailAddress").val()}</p>
    `)
}
//-------------------------------------------------------------------------
previewButton.addEventListener("click",function(){
  let phoneValidity = phoneNumber.checkValidity()
  let emailValidity = emailAddress.checkValidity()

  if(emailValidity == false) {
    $("#emailReq").html("Enter a valid email address")
  } else if(phoneValidity == false) {
    $("#phoneReq").html("Please enter a valid number")
  } else {
    appendToPreview()
  }

  if(emailValidity == false && phoneValidity == false) {
    $("#emailReq").html("Enter a valid email address")
    &&
    $("#phoneReq").html("Please enter a valid number")
  }

})
//-------------------------------------------------------------------------
$(deletePost).click(function(){
  console.log("Delete button clicked")
  $("#postForm")[0].reset()
  $(previewDiv).html("")
})
//-------------------------------------------------------------------------
// Firing the "post" button
$(post).click(function(){
  // Grabbing user's postInput ID's
  let name = $("#name").val()
  let breed = $("#breed").val()
  let description = $("#description").val()
  let price = $("#price").val()
  let emailAddress = $("#emailAddress").val()
  let phoneNumber = $("#phoneNumber").val()

  let createDog = new dogListing(name,breed,description,price)
  listsRef.child(name).set(createDog)
  reloadPage()
})
//-------------------------------------------------------------------------
// Monitoring when there is a change in the data
function monitorUpdates(){
  listsRef.on("value", function( snapshot ){

    for(key in snapshot.val()) {
      let data = (snapshot.val()[key])
      let createDog = new dogListing(data)
      list.push(createDog)
    }
    updateUI()
  })
}
//-------------------------------------------------------------------------
// Updating the UI
function updateUI() {
  listsRef.once("value",function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      var dataKey = childSnapshot.key
      let dataVal = childSnapshot.val()

      $("<div>").attr({ class: "postHolder" })
      .append($("<li>").html(dataVal.name))
      .append($("<li>").html(dataVal.breed))
      .append($("<li>").html(dataVal.description))
      .append($("<li>").html(dataVal.price))
      .appendTo($(listingsHolder))
    })
  })
}
//-------------------------------------------------------------------------

// reload page when submit button is clicked
function reloadPage() {
  window.location.reload();
}
//-------------------------------------------------------------------------
$(uploadButton).click(function() {
  uploadFile()
})

$("#file").on("change",function(event) {
  selectedFile = event.target.files[0]
})

function uploadFile() {
  let filename = selectedFile.name // get the file name of the image the user uploads
  let storageRef = firebase.storage().ref("/dogImages/ + filename")
  let uploadTask = storageRef.put(selectedFile)

  uploadTask.on("state_changed", function(snapshot) {
  }, function(error) {

  }, function() {
    let postKey = firebase.database().ref("image_posts/").push.key
    let downloadURL = uploadTask.snapshot.downloadURL
    var updates = {}
    let postImage = {
        contentType : "Image",
        customImages : {
        url : downloadURL
      }
    }
    updates["/image_posts/" + postKey] = postImage
    firebase.database().ref().update(updates);
    console.log(downloadURL)
  })
}
