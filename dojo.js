let emptyDiv = $("#emptyDiv")
let user_post = $("#user_post")


// button
let post = $("#postIt")

let list = []

let dbRef = firebase.database().ref() // get the root
let listsRef = dbRef.child("user_posts")



//  -------------------------------------------------------------------------
// Firing the "post" button
$(post).click(function(){
  // Grabbing input ID's from HTML file
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

// Updating the UI
function updateUI() {
  listsRef.once("value",function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      var dataKey = childSnapshot.key
      console.log(dataKey)
      let dataVal = childSnapshot.val()
      console.log(dataVal)
      $("<div>").attr({ class: "postHolder" })
      .append($("<li>").html(dataVal.name))
      .appendTo($(user_post))

      $("<div>").attr({ class: "postHolder" })
      .append($("<li>").html(dataVal.name))
      .append($("<li>").html(dataVal.breed))
      .append($("<li>").html(dataVal.description))
      .append($("<li>").html(dataVal.price))
      .appendTo($(listingsHolder))
    })
  })
}

// reload page when submit button is clicked
function reloadPage() {
  window.location.reload();
}
//  -------------------------------------------------------------------------
