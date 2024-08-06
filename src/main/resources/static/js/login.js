$(document).ready(function () {
    // Handle form submission
	//nabil
//	$('#login-form').submit(function(response) {  
//		 event.preventDefault();
//
//		  /* get the action attribute from the <form action=""> element */
//		  var $form = $(this),
//		    url = $form.attr('action');
//
//		  /* Send the data using post with element id name and name2*/
//		  var posting = $.post(url, {
//		    username: $('#username').val(),
//		    password: $('#password').val()
//		  });
//			
//		  /* Alerts the results */
//		  posting.done(function(data) {
//			  location.assign('index');
//		  });
//		  posting.fail(function(data) {
//		      $('#result').html(JSON.parse(data.responseText).exception);
//		  });
//	});
    $('#login-form').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission
//debugger ;
        // Get input values
        var username = $('#username').val();
        var password = $('#password').val();
        // Create a JSON object with the parameters to send to the controller
        var requestData = {
            username: username,
            password: password
        };
        // Send the AJAX request to the controller
    fetch(`http://192.168.101.20:8089/DBOPs/login`, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())   //ws response.text() so ezch line contain data.message show that "property message doesnot exist on type string"
    .then(data => {
    	 // Check the response for success or failure
        if (data.success) {
            // Handle success, data.message contains a message from the server
            console.log('Success:', data.message);
//            location.assign('index.html'); // Nabil
            // Redirect or perform other actions
           window.location.href = 'http://192.168.101.20:8089/DBOPs/index'; // Replace with the actual URL
        } else {
            // Handle failure, data.message contains an error message from the server
            console.error('Error:', data.message);

            // Display an error message to the user
            $('#login-message').text(data.message);
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch
        console.error('Error:', error);
    });
});
});