//A global variable of users array showing in user list
var users = [
  {
    id: 1,
    firstname: "Rachel",
    lastname: "Green",
    placeOfBirth: "New York",
    zipcode: 12345
  },
  {
    id: 2,
    firstname: "Ross",
    lastname: "Galler",
    placeOfBirth: "Georgia",
    zipcode: 21345
  },
  {
    id: 3,
    firstname: "Joey",
    lastname: "Tribiani",
    placeOfBirth: "California",
    zipcode: 32145
  }
];

/* to prevent default submit */
$("form").submit(function(e) {
  e.preventDefault();
});

/* Add/Create a new user by filling up all fields in the form */
$("form#addUser").submit(function() {
  var user = {};
  var firstnameInput = $('input[name="firstname"]').val().trim();
  var lastnameInput = $('input[name="lastname"]').val().trim();
  var placeOfBirthInput = $('input[name="placeOfBirth"]').val().trim();
  var zipcodeInput = $('input[name="zipcode"]').val().trim();
  //validating & mapping values of all the form fields
  if (firstnameInput && lastnameInput && placeOfBirthInput && zipcodeInput) {
    $(this).serializeArray().map(function(data) {
      user[data.name] = data.value;
    });
    var lastUser = users[Object.keys(users).sort().pop()];
    if (!lastUser) {
      //check if we don't have any last user left, then start from id 1
      user.id = 1;
    } else {
      //otherwise add 1 after last user's id
      user.id = lastUser.id + 1;
    }

    addUser(user);
  } else {
    alert("All fields must have a valid value.");
  }
});

/* add new user in the end & push it to show it in the list*/
function addUser(user) {
  users.push(user);
  appendToUserTable(user);
}

/*append each user in the userTable*/
$.each(users, function(i, user) {
  appendToUserTable(user);
});

/* append new user at the end in user list with EDIT & DELETE buttons */
function appendToUserTable(user) {
  $("#userTable > tbody:last-child").append(`
    <tr id="user-${user.id}">
      <td class="userData" name="firstname">${user.firstname}</td>
      <td class="userData" name="lastname">${user.lastname}</td>
      <td class="userData" name="placeOfBirth">${user.placeOfBirth}</td>
      <td class="userData" name="zipcode">${user.zipcode}</td>
      <td align="center">
        <button class="btn btn-success form-control" onClick="editUser(${user.id})" data-toggle="modal" data-target="#myModal")">Edit</button>
      </td>
      <td align="center">
        <button class="btn btn-danger form-control" onClick="deleteUser(${user.id})">Delete</button>
      </td>
    </tr>
`);
}

/* DELETE function */
function deleteUser(id) {
  var action = confirm("Are you sure you want to delete this user?");
  var msg = "User deleted successfully!";
  users.forEach(function(user, i) {
    //validating user id for delete & if action is true, then splice that user
    if (user.id == id && action != false) { 
      users.splice(i, 1);
      $("#userTable #user-" + user.id).remove(); //remove that user from userTable
      flashMessage(msg);    //showing msg of delete success.
    }
  });
}

/* EDIT Fn, Ln, PlaceOfBirth & zipcode fields with Save & cancel code*/
function editUser(id) {
  users.forEach(function(user, i) {
    if (user.id == id) {
      $(".modal-body").empty().append(`
        <form id="updateUser" action="">
          <label for="firstname">Firstname</label>
          <input class="form-control" type="text" name="firstname" value="${user.firstname}"/>
          <label for="lastname">Lastname</label>
          <input class="form-control" type="text" name="lastname" value="${user.lastname}"/>
          <label for="placeOfBirth">Place Of Birth</label>
          <input class="form-control" type="text" name="placeOfBirth" value="${user.placeOfBirth}"/>
          <label for="zipcode">Zipcode</label>
          <input class="form-control" type="text" name="zipcode" maxLength=5 value="${user.zipcode}"/>
      `);
      $(".modal-footer").empty().append(`
          <button type="submit" class="btn btn-primary" onClick="updateUser(${id})">Save</button>
          <button type="close" class="btn btn-default" data-dismiss="modal">Cancel</button>
        </form>
      `);
    }
  });
}

/* UPDATE function */
function updateUser(id) {
  var msg = "User updated successfully!";
  var user = {};  
  user.id = id;
  users.forEach(function(user, i) {
    if (user.id == id) {
      $("#updateUser").children("input").each(function() {
        var value = $(this).val();
        var attr1 = $(this).attr("name");
        if (attr1 == "firstname") {
          user.firstname = value;
        } else if (attr1 == "lastname") {
          user.lastname = value;
        } else if (attr1 == "placeOfBirth") {
          user.placeOfBirth = value;
        } else if (attr1 == "zipcode"){
          user.zipcode = value;
        }
      });
      
      users.splice(i, 1);     //splicing the old array we want to update
      users.splice(user.id - 1, 0, user); //splicing that old array's user id & adding new one
      
      //updating all name attributes if changed any.
      $("#userTable #user-" + user.id).children(".userData").each(function() {
        var updAttr = $(this).attr("name");
        if (updAttr == "firstname") {
          $(this).text(user.firstname);
        } else if (updAttr == "lastname") {
          $(this).text(user.lastname);
        } else if (updAttr == "placeOfBirth") {
          $(this).text(user.placeOfBirth);
        } else {
            $(this).text(user.zipcode);
        } 
      });

      $(".modal").modal("toggle");
      flashMessage(msg);    //showing success msg
    }
  });
}

/* Code to show success message */
function flashMessage(msg) {
  $(".flashMsg").remove();
  $("#uList").prepend(`
    <div class="col-xs-4" id="flMsg">
      <div class="flashMsg alert alert-success alert-dismissible fade in" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">X</span>
        </button> 
        <strong>${msg}</strong>
      </div>
    </div>
  `);
}