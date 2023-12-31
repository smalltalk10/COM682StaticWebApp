// Constants for REST endpoints
const endpoints = {
  CIM: "https://prod-17.uksouth.logic.azure.com/workflows/00db9b32c8fa4b83bdf1d99d4ac2a823/triggers/manual/paths/invoke/rest/v1/media?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wj2Nq7-jKCm7im5o2Qy2r5sKB6mYiKY7LniOfEASbQo",
  RAM: "https://prod-08.uksouth.logic.azure.com/workflows/f2d7f5f4493e48539f24855e5e069e1b/triggers/manual/paths/invoke/rest/v1/media?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nNEcwKdr8Ra8WXF5qPw9z6lsz5p2vSJLfPwUdXXht0E",
  UIM0: "https://prod-25.uksouth.logic.azure.com/workflows/c0a3fadf2e3c4e92bc0f7c3e5363ea10/triggers/manual/paths/invoke/rest/v1/media/",
  UIM1: "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5XPVcuiDvqgl8WQWY-3H_hiP1qUOO7rlGhArzYvc6Mc",
  DIM0: "https://prod-26.uksouth.logic.azure.com/workflows/0199066f66d043c883292ae972e0b97d/triggers/manual/paths/invoke/rest/v1/media/",
  DIM1: "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=W36m41es2d6x-9EZf9PTa3HABaQj7aMxM0b3QtPP1hE",
  
  BLOB_ACCOUNT: "https://assignment2storageacc.blob.core.windows.net",

  RIU0: "https://prod-10.uksouth.logic.azure.com/workflows/52b6ae0726e44a54b7ecf8237712c9f2/triggers/manual/paths/invoke/rest/v1/users/",
  RIU1: "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NVPNfLAbT8307taLDdavihTX5J4OWabbgpFGqVzsiO4",
  UIU0: "https://prod-22.uksouth.logic.azure.com/workflows/c19763a0cd1f4bf6b4791b1584d8a4b2/triggers/manual/paths/invoke/rest/v1/users/",
  UIU1: "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X3W6V7q-snsxjVt_KdwAd05xFcuJ9Vf9PR2Rzby2rPw",
  DIU0: "https://prod-25.uksouth.logic.azure.com/workflows/0b71792ff79b4ba5acbf7ea0c06fde0e/triggers/manual/paths/invoke/rest/v1/users/",
  DIU1: "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OBCnyO1OH9GSWcNkV5mbfUz6IFTcXVyk1BPj-1n_v5o",

  TRANSLATOR_ENDPOINT: "https://api.cognitive.microsofttranslator.com/translate"
};

let selectedLanguage = 'en';
// Retrieves the Json Web Token stored during the login process for both Guests and Users
const jwt = localStorage.getItem('token');

// If decoded token cannot be found with role specified, redirect back to login page, else continue.
if (!jwt) {
  window.location.href = 'login.html';
} else {
  const jwtValues = jwt.split('.');
  const decodedToken = JSON.parse(atob(jwtValues[1]));

  if (!decodedToken || !decodedToken.role) {
    window.location.href = 'login.html';
  } else {
    const { username, userID, role } = decodedToken;

    if (role == "Guest User") {
      document.getElementById('myMedia').style.display = 'none';
      document.getElementById('createMediaBtn').style.display = 'none';
    }

    // Event handlers for button clicks
    $(document).ready(function () {
      $("#retMedia").on("click", function() {
        getMedia()
      });
      $("#createMediaBtn").click(openCreatePostModal);
      $("#editProfileBtn").click(openEditProfileModal);
      $("#logoutBtn").click(function () {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      });
    });
  
    var userWelcomeElement = document.getElementById("userWelcome");
  
    if (userWelcomeElement) {
      user = username ? username : role;
      userWelcomeElement.innerHTML = "Welcome " + user;
    }
  
    function searchMedia() {
        // Get the value from the search input
        var query = document.getElementById('searchInput').value;

        // Check if the query is not empty
        if (query.trim() !== "") {
          getMedia(query)
        } else {
            alert('Please enter a search query.');
        }
    }

    function getMyMedia() {
      getMedia(username)
    }
  
    async function getMedia(query) {
      $('#mediaContainer').empty(); // Clear previous media elements
      $.getJSON({
        url: endpoints.RAM,
        headers: { 'X-ACCESS-TOKEN': jwt }
      }, function (data) {
        // Iterate through each data item
        $.each(data, function (key, val) {
          if (query && query !== val['userName']) {
            return;
          }
          // Create media element
          let media;
          var fileType = val["fileType"];
          var split = fileType.split('/');
          var extension = split[split.length - 1];

          // Create a new div for each data item
          var mediaDiv = document.createElement('div');
          mediaDiv.className = 'content media-container'; // Added the 'media-container' class

          // Append media element inside the new div
          mediaDiv.innerHTML = media;

          // Apply CSS style to center the media element
          mediaDiv.style.textAlign = 'center';

          // Create table for each data item
          var table = document.createElement('table');
          table.className = 'table';

          // Create the table header
          var headerRow = table.insertRow();
          var headerLabels = ["File Name", "Description", "Type", "Username", "Edit", "Delete"];

          for (var i = 0; i < headerLabels.length; i++) {
            var headerCell = headerRow.insertCell(i);
            headerCell.textContent = headerLabels[i];
          }
  
          // Create table row
          var row = table.insertRow();
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          var cell5 = row.insertCell(4);
          var cell6 = row.insertCell(5);
  
          
          switch (extension) {
            case 'video': case 'mp4': case 'mov': case 'wmv': case 'avi': case 'flv': case 'mkv':
              media = `<video controls width="750"><source src="${endpoints.BLOB_ACCOUNT}${val["filePath"]}" type="video/mp4"></video>`;
              cell3.append('Video')
              break;
            case 'image': case 'jpeg': case 'pdf': case 'png': case 'raw': case 'bmp': case 'gif': case 'webp':
              media = `<img src="${endpoints.BLOB_ACCOUNT}${val["filePath"]}" width="400" alt="Image">`;
              cell3.append('Image')
              break;
            case 'audio': case 'mp3': case 'mpeg': case 'wav': case 'acc': case 'wma':
              media = `<audio controls><source src="${endpoints.BLOB_ACCOUNT}${val["filePath"]}" type="audio/mp3"></audio>`;
              cell3.append('Audio')
              break;
            default:
              media = '<p>Unsupported file type</p>';
              break;
          }
  
          // Populate cells with data
          cell1.textContent = val["fileName"];
          cell4.textContent = val["userName"];

          cell5.appendChild(createEditMediaButton(val["id"]));
          cell6.appendChild(createDeleteButton(val["id"]));

          // Append media element inside the new div
          mediaDiv.innerHTML = media;

          // Append the table to the new div
          mediaDiv.append(table);

          // Append the new div to the desired element
          $('#mediaPost').append(mediaDiv);
        });
      });
    }
  
    async function openCreatePostModal() {
      $('#createMediaModal').modal('show');
      $("#submitCreateBtn").off("click").on("click", function() {
        submitData = new FormData()

        //Get form variables and append them to the form data object
        submitData.append("fileName", $("#fileName").val())
        submitData.append("description", $("#description").val())
        submitData.append("file", $("#UpFile")[0].files[0])
        submitData.append("fileType", $("#UpFile")[0].files[0].type)
        submitCreateMedia(submitData);
        $('#createMediaModal').modal('hide');
      });
    }
<<<<<<< Updated upstream
  
=======

    // Function reaches out the 'create individual media' endpoint with the specified data, has error catching for e.g. an unauthorised response.
>>>>>>> Stashed changes
    function submitCreateMedia(submitData) {
      $.ajax({
        url: `${endpoints.CIM}`,
        headers: { 'X-ACCESS-TOKEN': jwt },
        data: submitData,
        cache: false,
        enctype: "multipart/form-data",
        contentType: false,
        processData: false,
        type: "POST",
        success: function() {
          getMedia();
        },
        error: function(jqXHR) {
          alert('Error: ' + jqXHR.responseJSON.message);
        }
      })
    }
<<<<<<< Updated upstream
  
=======

    // Creates the Edit and Delete media buttons
>>>>>>> Stashed changes
    function createEditMediaButton(id) {
      return createButton('Edit', 'btn btn-info', function () {
        openEditMediaForm(id);
      });
    }
<<<<<<< Updated upstream
  
=======
>>>>>>> Stashed changes
    function createDeleteButton(id) {
      return createButton('Delete', 'btn btn-danger', function () {
        deleteMedia(id);
      });
    }
<<<<<<< Updated upstream
  
=======
>>>>>>> Stashed changes
    function createButton(text, className, clickHandler) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.textContent = text;
      button.addEventListener('click', clickHandler);
      return button;
    }
<<<<<<< Updated upstream
  
=======

    // Opens the Edit media modal
>>>>>>> Stashed changes
    function openEditMediaForm(id) {
      $('#updateMediaModal').modal('show');
      $("#submitEditButton").off("click").on("click", function() {
        const appendData = {"fileName": $('#appendFileName').val(), "description": $('#appendDescription').val()};
        submitEditMedia(id, appendData);
        $('#updateMediaModal').modal('hide');
      });
    }
<<<<<<< Updated upstream
  
    $(document).ready(function () {
      $('#createMediaModal').on('hidden.bs.modal', function () {
        $('#fileName').val('');
        $('#description').val('');
        $('#file').val('');
      });
      $('#updateMediaModal').on('hidden.bs.modal', function () {
        $('#appendFileName').val('');
        $('#appendDescription').val('');
      });

      $('#editProfileModal').on('hidden.bs.modal', function () {
        $('#registerEmail').val('');
        $('#registerPassword').val('');
      });
    });
  
=======
    
    // Function reaches out the 'update individual media' endpoint with appended data, has error catching for e.g. an unauthorised response.
>>>>>>> Stashed changes
    function submitEditMedia(id, appendData) {
      $.ajax({
        type: 'PUT',
        url: `${endpoints.UIM0}${id}${endpoints.UIM1}`,
        headers: { 'X-ACCESS-TOKEN': jwt },
        data: appendData,
        success: function() {
          if (!document.getElementById('myMedia')) {
            getMyMedia();
          } else {
            getMedia();
          }
        },
        error: function(jqXHR) {
          alert('Error: ' + jqXHR.responseJSON.message);
        }
      });
    }
<<<<<<< Updated upstream
  
=======

   // Function reaches out the 'delete individual media' endpoint, has error catching for e.g. an unauthorised response.
>>>>>>> Stashed changes
    function deleteMedia(id) {
      $.ajax({
        type: 'DELETE',
        url: `${endpoints.DIM0}${id}${endpoints.DIM1}`,
        headers: { 'X-ACCESS-TOKEN': jwt },
        success: function() {
          if (!document.getElementById('myMedia')) {
            getMyMedia();
          } else {
            getMedia();
          }
        },
        error: function(jqXHR) {
          alert('Error: ' + jqXHR.responseJSON.message);
        }
      });
    }
<<<<<<< Updated upstream
  
=======

    // Open the edit profile modal. Initially reaches out to 'read individual media' endpoint to display user details within the modal.
>>>>>>> Stashed changes
    async function openEditProfileModal() {
      try {
        const data = await $.ajax({
          url: `${endpoints.RIU0}${userID}${endpoints.RIU1}`,
          headers: {'X-ACCESS-TOKEN': jwt},
          method: 'GET',
          dataType: 'json',
        });

        $('#editProfileModal').modal('show');
        document.getElementById("profileUsername").innerHTML = data["username"];
        document.getElementById("profileEmail").innerHTML = data["email"];
        document.getElementById("profileRole").innerHTML = data["role"];
        document.getElementById("profileCreateTime").innerHTML = new Date(data["createTime"]).toLocaleDateString();

        $("#subEditProfileBtn").off("click").on("click", function() {
          const updateData = {
            "email": $('#registerEmail').val(),
            "password": $('#registerPassword').val()
          };
          submitEditProfile(updateData)
            .then(() => $('#editProfileModal').modal('hide'))
            .catch(error => console.error('Error submitting edit profile:', error));
        });

        $("#subDeleteProfileBtn").off("click").on("click", function() {
          submitDeleteProfile()
            .then(() => $('#editProfileModal').modal('hide'))
            .catch(error => console.error('Error submitting delete profile:', error));
        });
      } catch (error) {
        alert('Error: ' + error.responseJSON.message);
      }
    }

    $(document).ready(function() {
      $('#editProfileModal').on('hidden.bs.modal', function() {
          $('#registerEmail').val('');
          $('#registerPassword').val('');
      });
    });
<<<<<<< Updated upstream
  
=======

    // Function reaches out the 'update individual user' endpoint, has error catching for e.g. an unauthorised response.
>>>>>>> Stashed changes
    async function submitEditProfile(data) {
      $.ajax({
        type: 'PUT',
        url: `${endpoints.UIU0}${userID}${endpoints.UIU1}`,
        headers: { 'X-ACCESS-TOKEN': jwt },
        data,
        error: function(jqXHR) {
          alert('Error: ' + jqXHR.responseJSON.message);
        }
      });
    }
<<<<<<< Updated upstream
  
=======

    // Function reaches out the 'delete individual user' endpoint, has error catching for e.g. an unauthorised response.
    // Removes token and redirects user back to login screen if successful
>>>>>>> Stashed changes
    async function submitDeleteProfile(data) {
      $.ajax({
        type: 'DELETE',
        url: `${endpoints.DIU0}${userID}${endpoints.DIU1}`,
        headers: { 'X-ACCESS-TOKEN': jwt },
        data,
        success: function() {
          localStorage.removeItem('token');
          window.location.href = 'login.html';
        },
        error: function(jqXHR) {
          alert('Error: ' + jqXHR.responseJSON.message);
        }
      });
    }
<<<<<<< Updated upstream
  }
}
=======

    // Handles language selecet 
    function onLanguageChange() {
      selectedLanguage = document.getElementById('languageSelect').value;
      var welcomeText = document.getElementById('welcomeText').textContent;
      var informationText = document.getElementById('informationText').textContent;

      translateText(welcomeText, selectedLanguage).then(result => {
          welcomePlaceholder.innerHTML = result + " " + user;
      });

      translateText(informationText, selectedLanguage).then(result => {
          informationPlaceholder.innerHTML = result;
      });

      hideMedia();
    }
    document.getElementById('languageSelect')?.addEventListener("change", onLanguageChange);

    // Translates to selected language
    function translateText(text, toLanguage) {
      const key = "e08b33492e4049bdb2acda2ab3d8f7ad"; // My translator key
      const location = "uksouth"; // My translator location

      const params = {
        'api-version': '3.0',
        'from': 'en',
        'to': toLanguage
      };

      const headers = new Headers({
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': Math.random().toString()
      });

      const body = [{
        'text': text
      }];

      return fetch(endpoints.TRANSLATOR_ENDPOINT + '?' + new URLSearchParams(params), {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(jsonResponse => {
        return (jsonResponse)[0]?.translations[0]?.text;
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
    }
  }
}
  
>>>>>>> Stashed changes
