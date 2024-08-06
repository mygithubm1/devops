document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    const user_nameInput = document.getElementById('user_name');
    const empnoInput = document.getElementById('empno');
    const ResetPWDInput = document.getElementById('newPassword');
    // Retrieve stored values from localStorage
    const storedUsername = localStorage.getItem('user_name');
    const storedEmpno = localStorage.getItem('empno');

    // Set the field values from localStorage, if available
    if (storedUsername) {
        user_nameInput.value = storedUsername;
    }

    if (storedEmpno) {
        empnoInput.value = storedEmpno;
    }

    function getSearchData() {
        const user_name = user_nameInput.value;
        const empno = empnoInput.value;

        // Validate username and empno fields
        if (!user_name & !empno) {
            alert(`Username and EMPno can not be null`);
            return; // Stop execution if fields are empty
        }

        // Replace empty fields with '%'
        const user_nameValue = user_name || '%';
        const empnoValue = empno || '%';

        // Store the current field values in localStorage
        localStorage.setItem('user_name', user_name);
        localStorage.setItem('empno', empno);
        return { user_nameValue, empnoValue };
    }
    // // Make an AJAX request to the Spring Boot backend

    // fetch(`http://192.168.101.20:8089/oracleUsr/searchuser`, {
    // method: 'POST', // Use POST method
    //// headers: {
    //// // 'Content-Type': 'application/x-www-form-urlencoded',
    //// },
    // body: `user_name=${encodeURIComponent(user_nameValue)}&empno=${encodeURIComponent(empnoValue)}`,
    // })

    // Make an AJAX request to the Spring Boot backend
    // Replace this with your actual API endpoint URL
    function fetchUserData(user_nameValue, empnoValue) {
        fetch(`http://192.168.101.20:8089/oracleUsr/searchuser?username=${encodeURIComponent(user_nameValue)}&empno=${encodeURIComponent(empnoValue)}`,
            {
                method: 'POST', // Use POST method
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Received data:', data);
                console.log('Data type:', typeof data);
                // Display the results
                if (data.length === 0) {
                    //console.log('data lenght1:', data.length);
                    alert(`No Users `);

                } else {

                    console.log('data lenght2:', data.length);
                    populateUserTable(data);

                }
            })
        // .catch(error => {
        // // Show the error message on the screen
        // userList.innerHTML = `<li>Error: ${error.message}</li>`;
        // });
    }

    // Function to populate the user table
    function populateUserTable(data) {

        userTable.innerHTML = ''; //clear previous table search
        data.forEach(user => {
            const row = userTable.insertRow();

            // Add user data to the table cells
            const cells = ['USER_NAME', 'DESCRIPTION', 'EMAIL_ADDRESS', 'LAST_NAME'];

            cells.forEach(cell => {
                const cellValue = user[cell];
                const cellElement = row.insertCell();
                cellElement.textContent = cellValue;
            });

            // Add Edit buttons
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit');
            editButton.addEventListener('click', () => editUser(user));



            const actionCell = row.insertCell();
            actionCell.appendChild(editButton);
        });
    }
    // Function to handle edit button click
    function editUser(user) {
        // Implement your edit logic here
        // alert(`Editing user: ${user.USER_NAME}`);
        openEditUserModal(user)
    }

    // Event listener for the search button
    searchButton.addEventListener('click', function () {
        const { user_nameValue, empnoValue } = getSearchData();
        fetchUserData(user_nameValue, empnoValue);
    });

    // Event listener for "Enter" key press on the username input
    user_nameInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // debugger
            event.preventDefault(); // Prevent the form from submitting (if in a form)
            const { user_nameValue, empnoValue } = getSearchData();
            fetchUserData(user_nameValue, empnoValue);
        }
    });

    // Event listener for "Enter" key press on the empno input
    empnoInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the form from submitting (if in a form)
            const { user_nameValue, empnoValue } = getSearchData();
            fetchUserData(user_nameValue, empnoValue);
        }
    });




    // Function to open the edit user modal and populate input fields with user data
    function openEditUserModal(user) {
        var modal = document.getElementById('editUserModal');
        var modalUsernameInput = document.getElementById('modalUsername');
        var modalEmailInput = document.getElementById('modalEmail');
        var modalDescriptionInput = document.getElementById('modalDescription');
        var modalStatusInput = document.getElementById('modalStatus');
        var modalRequiredFirstLoginInput = document.getElementById('modalRequiredFirstLogin');
        var modalNameInput = document.getElementById('modalName');
        var modalEffectiveStartDateInput = document.getElementById('modalEffectiveStartDate');
        var modalEffectiveEndDateInput = document.getElementById('modalEffectiveEndDate');

        // Populate the modal input fields with user data
        modalUsernameInput.value = user.USER_NAME;
        modalEmailInput.value = user.EMAIL_ADDRESS;
        modalDescriptionInput.value = user.DESCRIPTION;
        modalStatusInput.value = user.STATUS;
        modalRequiredFirstLoginInput.value = user.FIRST_CHANGE_REQUIRED;
        modalNameInput.value = user.LAST_NAME;
        modalEffectiveStartDateInput.value = user.START_DATE;
        modalEffectiveEndDateInput.value = user.END_DATE;
        modal.style.display = 'block';
    }

    // Function to close the edit user modal
    function closeEditUserModal() {
        var modal = document.getElementById('editUserModal');
        modal.style.display = 'none';
    }


    // Function to manage userModal actions
    function resetPassword() {
        // alert('Reset PWD button clicked');
        openResetPasswordModal();
    }

    // Function to save end date
    function saveEndDate() {
        alert('Save End-Date button clicked');
    }

    // Function to manage roles
    function manageRoles() {
        alert('Manage Roles button clicked');
    }
    // Function to manage Resp
    function manageResp() {
        alert('Manage Roles button clicked');
        getlogfile();
    }

    //Event listener for the UserModal buttons
    // Event listener for the close button
    document.getElementById('closeUserModal').addEventListener('click', closeEditUserModal);

    // Event listener for the Reser PWD button
    document.getElementById('resetPwdButton').addEventListener('click', resetPassword);
    // Event listener for the Set End-date button
    document.getElementById('saveEndDateButton').addEventListener('click', saveEndDate);
    // Event listener for the Manage Roles button
    document.getElementById('manageRolesButton').addEventListener('click', manageRoles);
    // Event listener for the Manage Resp button
    document.getElementById('manageRespButton').addEventListener('click', manageResp);
    //ResetPWD Modal

    // Function to open the reset password modal
    function openResetPasswordModal() {
        var resetPasswordModal = document.getElementById('resetPasswordModal');
        resetPasswordModal.style.display = 'block';
    }

    // Function to close the reset password modal
    function closeResetPasswordModal() {
        var resetPasswordModal = document.getElementById('resetPasswordModal');
        resetPasswordModal.style.display = 'none';
    }

    // Function to reset the password
    function resetPasswordAction() {
        var newPasswordInput = document.getElementById('newPassword');
        var modalUsernameInput = document.getElementById('modalUsername');

        var newPassword = newPasswordInput.value;
        var username = modalUsernameInput.value;

//        // Display the new password and username in an alert
//        alert(`Resetting password for user: ${username}\nNew Password: ${newPassword}`);

        // Create a JSON object with the parameters to send to the controller
        var requestData = {
            username: username,
            password: newPassword
        };

        // Send the AJAX request to the controller
        fetch(`http://192.168.101.20:8089/oracleUsr/RPWD`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the controller
            if (data.success) {
                // Password reset was successful
            	 alert('data success ');
                alert(data.message);
            } else {
                // Password reset failed
            	   console.log('Received data:', data); // Print the data to the console
                   console.log('Data type:', typeof data);
                alert(data.message);
                alert(data.exceptionMessage);
            }
        })
        .catch(error => {
            // Handle any errors
            alert(`An error occurred while resetting the password: ${error.message}`);
        });

        // Close the reset password modal
        closeResetPasswordModal();
    }
    // Event listener for the Reset button
    document.getElementById('resetPasswordButton').addEventListener('click', resetPasswordAction);
    // Event listener to close the reset password modal
    document.getElementById('closeResetPWDModal').addEventListener('click', closeResetPasswordModal);

    // Event listener for "Enter" key press on the reset PWD modal  input
    ResetPWDInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the form from submitting (if in a form)
            resetPasswordAction();
        }
    });
});
