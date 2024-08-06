let usernameRoleModal   //used as a global variable to hold the user that manage its roles
let usernameRespModal   //used as a global variable to hold the user that manage its Resps
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    const userRolesTable = document.getElementById('userRolesTable').getElementsByTagName('tbody')[0];

    //  const userRolesTable = document.getElementById('userRolesTable');

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

    // fetch(`http://192.168.101.20:8089/DBOPs/searchuser`, {
    // method: 'POST', // Use POST method
    //// headers: {
    //// // 'Content-Type': 'application/x-www-form-urlencoded',
    //// },
    // body: `user_name=${encodeURIComponent(user_nameValue)}&empno=${encodeURIComponent(empnoValue)}`,
    // })

    // Make an AJAX request to the Spring Boot backend
    // Replace this with your actual API endpoint URL
    function fetchUserData(user_nameValue, empnoValue) {
        closeRoleUserModal();  //3shan lma a search t hide ild userRolemodal this was a bug
        fetch(`http://192.168.101.20:8089/DBOPs/searchuser?username=${encodeURIComponent(user_nameValue)}&empno=${encodeURIComponent(empnoValue)}`,
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
            .catch(response => {
                // Show the error message on the screen
                userList.innerHTML = `<li>Error: ${response.exceptionMessage}</li>`;   //quess why message doesnot appear althugh exception is ok return to consle?
            });
    }

    // Function to populate the user table
    function populateUserTable(data) {

        userTable.innerHTML = ''; //clear previous table search this was a bug append the user searh data 
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


            // Add Roles buttons
            const roleButton = document.createElement('button');
            roleButton.textContent = 'Roles';
            roleButton.classList.add('roles');
            //debugger;
            roleButton.addEventListener('click', () => rolesUser(user));


            // Add Resp buttons
            const respButton = document.createElement('button');
            respButton.textContent = 'Resp';
            respButton.classList.add('resp');
            respButton.addEventListener('click', () => respUser(user));


            const actionCell = row.insertCell();

            // Add spacing between buttons css
            // editButton.style.marginRight = '35px'; // Adjust the margin as needed
            // roleButton.style.marginRight = '35px';
            // respButton.style.marginRight = '35px';

            actionCell.appendChild(editButton);
            actionCell.appendChild(roleButton);
            actionCell.appendChild(respButton);



        });
    }
    // Function to handle edit button click
    function editUser(user) {
        // Implement your edit logic here
        // alert(`Editing user: ${user.USER_NAME}`);
        openEditUserModal(user)
    }
    // Function to handle edit button click
    function rolesUser(user) {
        // Implement your edit logic here
        // alert(`Editing Roles user: ${user.USER_NAME}`);
        //    	debugger;
        openRoleUserModal(user)
        usernameRoleModal = user.USER_NAME; //assign the value of the global variable

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
        userTable.innerHTML = '';   
    }


    // Function to manage userModal actions

    function resetPassword() {
        // alert('Reset PWD button clicked');
        openResetPasswordModal();
    }

    ////Event listener for "Enter" key press effective end date edit user  modal  input
    const modalEffectiveEndDateInput = document.getElementById('modalEffectiveEndDate');
    modalEffectiveEndDateInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the form from submitting (if in a form)
            saveEndDate();
        }
    });
    ///event listeners end

    // Function to save end date
    function saveEndDate() {
        //  alert('Save End-Date button clicked');
        //    	var newModalDescriptionInput = document.getElementById('modalDescription');
        //
        //        var newmodalDescription = newModalDescriptionInput.value;
        //
        //       alert('1 new IS ' +username + '2 : '+newmodalEffectiveEndDate) ;
        //        alert('DESC2 old IS ' +user.DESCRIPTION + 'and old end date 2 is : '+user.END_DATE) ;

        var newModalEffectiveEndDateInput = document.getElementById('modalEffectiveEndDate');
        var newModalUsernameInput = document.getElementById('modalUsername');
        var newmodalEffectiveEndDate = newModalEffectiveEndDateInput.value;
        var username = newModalUsernameInput.value;

        //alert('1 new IS ' +username + '2 : '+newmodalEffectiveEndDate) ;
        var requestData = {
            username: username,
            End_date: newmodalEffectiveEndDate
        };

        // Send the AJAX request to the controller
        fetch(`http://192.168.101.20:8089/DBOPs/SED`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                //debugger;
                // Handle the response from the controller
                console.log('Received data save ed:', data); // Print the data to the console
                if (data.Status == "success") {
                    alert(data.Message);
                } else {
                    // alert(data.Message);
                    alert("failed to update End date" + data.Message);
                }
            })
            .catch(error => {
                // Handle any errors
                alert(`An error occurred while Updat the end Date : ${error.message}`);
            });


    }

    ////Event listener for "Enter" key press Desciption in edit user  modal  input
    const modalDescriptionInput = document.getElementById('modalDescription');
    modalDescriptionInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the form from submitting (if in a form)
            saveDesc();
        }
    });
    ///event listeners end

    // Function to save end date
    function saveDesc() {          // VIM bug when by error make this function same name as saveEndDate it did not show error but make the edit user close function not work 
        //  alert('Save End-Date button clicked');
        //    	var newModalDescriptionInput = document.getElementById('modalDescription');
        //
        //        var newmodalDescription = newModalDescriptionInput.value;
        //
        //       alert('1 new IS ' +username + '2 : '+newmodalEffectiveEndDate) ;
        //        alert('DESC2 old IS ' +user.DESCRIPTION + 'and old end date 2 is : '+user.END_DATE) ;

        var newModalDescriptionInput = document.getElementById('modalDescription');
        var newModalUsernameInput = document.getElementById('modalUsername');
        var newModalDescription = newModalDescriptionInput.value;
        var username = newModalUsernameInput.value;

        //alert('1 new IS ' +username + '2 : '+newmodalEffectiveEndDate) ;
        var requestData = {
            username: username,
            desc: newModalDescription
        };

        // Send the AJAX request to the controller
        fetch(`http://192.168.101.20:8089/DBOPs/SUDESC`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                //debugger;
                // Handle the response from the controller
                console.log('Received data save ed:', data); // Print the data to the console
                if (data.Status == "success") {
                    alert(data.Message);
                } else {
                    // alert(data.Message);
                    alert("failed to update Desc" + data.Message);
                }
            })
            .catch(error => {
                // Handle any errors
                alert(`An error occurred while Updat the password: ${error.message}`);
            });


    }
    // Function to manage roles
    //    function manageRoles() {
    //        alert('Manage Roles button clicked');
    //    }
    //    // Function to manage Resp
    //    function manageResp() {
    //        alert('Manage Roles button clicked');
    //        getlogfile();
    //    }

    //Event listener for the UserModal buttons
    // Event listener for the close button
    document.getElementById('closeUserModal').addEventListener('click', closeEditUserModal);

    // Event listener for the Reser PWD button
    document.getElementById('resetPwdButton').addEventListener('click', resetPassword);
    // Event listener for the Set End-date button
    document.getElementById('saveEndDateButton').addEventListener('click', saveEndDate);

    // Event listener for the Manage Roles button of commented edit user modal 
    //document.getElementById('manageRolesButton').addEventListener('click', manageRoles);
    // Event listener for the Manage Resp button of commented edit user modal 
    // document.getElementById('manageRespButton').addEventListener('click', manageResp);
    document.getElementById('saveDescButton').addEventListener('click', saveDesc);
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
        fetch(`http://192.168.101.20:8089/DBOPs/RPWD`, {
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
                    //alert('data success ');
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

    //role user modal start 
    // Function to open the role user modal 
    // Function to open the role user modal 

    function openRoleUserModal(user) {
        usernameRoleModal = user.USER_NAME;
        userTable.innerHTML = '';    //fix bug of reopen the modal with a new search user empty the old search data for that table
        userRolesTable.innerHTML = '';   //fix bug of reopen the modal with a new search user empty the old search data for that table
        empUserSearchTable.innerHTML = '';
        roleNameSearchTable.innerHTML = '';
        fetchUserRolModalData(usernameRoleModal);

    }
    function fetchUserRolModalData(usernameRoleModal) {
        var modal = document.getElementById('roleModal');
        // alert(` editing role for value is : ' ${user.USER_NAME}`);
        //==start edit
        // Create a JSON object with the parameters to send to the controller
        var requestData = {
            username: usernameRoleModal
        };

        // Send the AJAX request to the controller
        fetch(`http://192.168.101.20:8089/DBOPs/getUserRoles`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the controller
                console.log('Received data:', data);
                console.log('Data type:', typeof data);
                // Display the results
                if (data.length === 0) {
                    //console.log('data lenght1:', data.length);
                    alert(`No Roles Assigned `);

                } else {

                    console.log('total Roles:', data.length);
                    populateRoleuserTable(data);

                }
            })
            .catch(error => {
                // Handle any errors
                alert(`An error occurred while getting user roles: ${error.message}`);
            });
        modal.style.display = 'block';  //t show the modal on the screen
    }



    function populateRoleuserTable(data) {

        userRolesTable.innerHTML = ''; //clear previous table search this was a bug
        data.forEach(userRole => {
            const row = userRolesTable.insertRow();
            // Add user data to the table cells
            const cells = ['USER_NAME', 'Role Code', 'Role Status', 'User Role Status'];

            cells.forEach(cell => {
                const cellValue = userRole[cell];
                const cellElement = row.insertCell();
                cellElement.textContent = cellValue;
            });
            //for row selection1  start
            // Add the class "user-role-row" to each row 
            row.classList.add('user-role-row');
            //debugger;
            // Attach a click event listener to each row
            //            row.addEventListener('click', function () {
            ////                alert('Row selected!');
            //            	
            //            });
            //for row selection1 end 
        });
    }




    //handle multi selection2 for top half table role start

    let selectedRole = []; // Array to store selected roles
    let lastSelectedRowRole = null; // Store the last selected row

    userRolesTable.addEventListener('click', function (event) {
        const target = event.target;

        // Check if the clicked element is a table cell (td)
        if (target.tagName === 'TD') {
            const row = target.parentElement;

            // Extract the username and role code from the selected row
            const username = row.cells[0].textContent;
            const roleCode = row.cells[1].textContent;

            if (event.ctrlKey || event.shiftKey) {
                // Ctrl or Shift key is pressed, check if the row is already selected
                if (row.classList.contains('selected')) {
                    // Row is selected, remove it from the selectedRoles array
                    selectedRole = selectedRole.filter(
                        (role) => !(role.username === username && role.roleCode === roleCode)
                    );
                    row.classList.remove('selected');
                } else {
                    // Row is not selected, add it to the selectedRoles array
                    selectedRole.push({ username, roleCode });
                    row.classList.add('selected');
                }
            } else {
                // Neither Ctrl nor Shift key is pressed
                if (lastSelectedRowRole && event.shiftKey) {
                    // Shift key is pressed, select rows between last selected and current row
                    const rows = userRolesTable.querySelectorAll('tbody tr');
                    const startIndex = Array.from(rows).indexOf(lastSelectedRowRole);
                    const endIndex = Array.from(rows).indexOf(row);

                    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                        const currentRow = rows[i];
                        const currentUsername = currentRow.cells[0].textContent;
                        const currentRoleCode = currentRow.cells[1].textContent;

                        if (!currentRow.classList.contains('selected')) {
                            selectedRole.push({ username: currentUsername, roleCode: currentRoleCode });
                            currentRow.classList.add('selected');
                        }
                    }
                } else {
                    // Ctrl key is not pressed, clear all other selections
                    const selectedRows = userRolesTable.querySelectorAll('tbody tr.selected');
                    selectedRows.forEach((selectedRow) => {
                        selectedRow.classList.remove('selected');
                    });

                    // If the clicked row is already selected, deselect it
                    if (row.classList.contains('selected')) {
                        selectedRole = selectedRole.filter(
                            (role) => !(role.username === username && role.roleCode === roleCode)
                        );
                        row.classList.remove('selected');
                    } else {
                        // Select the clicked row and update the selectedRoles array
                        row.classList.add('selected');
                        selectedRole = [{ username, roleCode }];
                    }
                }
            }

            // Update the last selected row
            lastSelectedRowRole = row;

            // Log the selectedRoles array
            console.log('Selected Roles:', selectedRole);
        }
    });
    //////////////
    // Add keyboard event listeners for arrow key navigation
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp') {
            // Move selection up
            moveSelection('up');
        } else if (event.key === 'ArrowDown') {
            // Move selection down
            moveSelection('down');
        }
    });

    function moveSelection(direction) {
        const selectedRows = userRolesTable.querySelectorAll('tbody tr.selected');

        if (selectedRows.length === 0) {
            // No rows are selected, start from the first row
            selectedRows[0].classList.remove('selected');
            selectedRows[0].blur(); // Remove focus from the currently selected row
            selectedRows[direction === 'up' ? 0 : selectedRows.length - 1].focus();
        } else {
            const currentIndex = Array.from(userRolesTable.querySelectorAll('tbody tr')).indexOf(
                selectedRows[selectedRows.length - 1]
            );

            let newIndex;
            if (direction === 'up') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            } else {
                newIndex =
                    currentIndex < userRolesTable.rows.length - 1
                        ? currentIndex + 1
                        : userRolesTable.rows.length - 1;
            }

            // Move the selection to the new index
            selectedRows[selectedRows.length - 1].classList.remove('selected');
            selectedRows[selectedRows.length - 1].blur(); // Remove focus from the currently selected row
            userRolesTable.rows[newIndex].classList.add('selected');
            userRolesTable.rows[newIndex].focus();
        }
    }

    //handle multi selection2 for top half table role  end

    // Function to close the role user modal
    function closeRoleUserModal() {
        //debugger;
        var roleUserModal = document.getElementById('roleModal');
        userRolesTable.innerHTML = '';  //fix bug of reopen the modal with a new search user empty the old search data for that table
        userTable.innerHTML = '';    //fix bug of reopen the modal with a new search user empty the old search data for that table
        roleUserModal.style.display = 'none';
    }

    // Function to close the role user modal
    function closeRespUserModal() {
        //debugger;
        var respUserModal = document.getElementById('respModal');
        userRespTable.innerHTML = '';  //fix bug of reopen the modal with a new search user empty the old search data for that table
        userTable.innerHTML = '';    //fix bug of reopen the modal with a new search user empty the old search data for that table
        respUserModal.style.display = 'none';
    }

    // Function to refresh Role 
    function refreshRoles() {
        //alert('refresh Role button clicked');
        fetchUserRolModalData(usernameRoleModal);

    }


    // Function to revoke Role 
    function revokeRole() {
        //        alert('Revoke Role button clicked');
        //    	debugger;
        revRole();
        //        refreshRoles();  // it was work here in debugger but not in normal //moved to inside then as asynchronus w klam mn dah inside revRoles
        //fetchUserRolModalData(usernameRoleModal); 
        //refreshRolesBut.click(); //can be used if we split the listener to two below lines  instead the following //  document.getElementById('refreshRolesButton').addEventListener('click', refreshRoles); // can be   can be replaced by two lines to be able to use .click 
        // const refreshRolesBut =  document.getElementById('refreshRolesButton') ;
        //refreshRolesBut.addEventListener('click', refreshRoles);
    }
    //ajax request to revoke Role start
    function revRole() {
        // Create the request data object with the selectedRoles array
        //debugger;
        //    	  const requestData = {
        //   	    selectedRoles: selectedRoles, // in case of sent it in shappe of JSONArray as in approches revRoles file approch1
        //    			  
        //      	  };
        if (selectedRole.length == 0) {
            alert(`No Roles are selected `);
        } else {
            const requestData = selectedRole;
            console.log('Roles is:', selectedRole);

            // Define the URL for your controller endpoint
            fetch(`http://192.168.101.20:8089/DBOPs/revRoles`, {
                method: 'POST',
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then((data) => {
                    // Handle the response from the server if needed
                    console.log('Response from server:', data);
                    //below block to parse the json objects returned and display them along  with thier status on the screen-START
                    let message = "Revoking Status: \n";
                    data.forEach(item => {
                        message += `Role: ${item.Role_Code}   : ${item.Status} \n`;
                    });
                    alert(message);
                    // block to parse the json objects returned and display them along  with thier status on the screen-END
                    refreshRoles();

                })
                .catch((error) => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }
    }
    //ajax request to revoke Role end 

    // Function to grant Role 
    function grantRole() {
        alert('grant Role button clicked');
        //        debugger;
        graRole();
        //      refreshRoles();   // it was work here in debugger but not in normal //moved to inside then as asynchronus w klam mn dah inside graRoles  
        //refreshRolesBut.click(); //can be used if we split the listener to two below lines  instead the following //  document.getElementById('refreshRolesButton').addEventListener('click', refreshRoles); // can be   can be replaced by two lines to be able to use .click 
        // const refreshRolesBut =  document.getElementById('refreshRolesButton') ;
        //refreshRolesBut.addEventListener('click', refreshRoles);
    }
    //ajax request to grant Role start
    function graRole() {
        // Create the request data object with the selectedRoles array
        // debugger;
        //    	  const requestData = {
        //   	    selectedRoles: selectedRoles, // in case of sent it in shappe of JSONArray as in approches revRoles file approch1
        //    			  
        //      	  };
        if (selectedRole.length == 0) {
            alert(`No Roles are selected `);
        } else {
            const requestData = selectedRole;
            console.log('Roles is:', selectedRole);

            // Define the URL for your controller endpoint
            fetch(`http://192.168.101.20:8089/DBOPs/graRoles`, {
                method: 'POST',
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then((data) => {
                    // Handle the response from the server if needed
                    console.log('Response from server:', data);
                    //below block to parse the json objects returned and display them along  with thier status on the screen-START
                    let message = "Granting Status: \n";
                    data.forEach(item => {
                        message += `Role: ${item.Role_Code}   : ${item.Status} \n`;
                    });
                    alert(message);
                    // block to parse the json objects returned and display them along  with thier status on the screen-END
                    console.log(usernameRoleModal);
                    refreshRoles();
                })
                .catch((error) => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }
    }
    //ajax request to grant Role end 
    //Event listener for the Role buttons
    // Event listener for the close button
    document.getElementById('closeRoleModal').addEventListener('click', closeRoleUserModal);
    document.getElementById('closeRespModal').addEventListener('click', closeRespUserModal);
    // Event listener for the Revoke Role button
    document.getElementById('revokeSelectedButton').addEventListener('click', revokeRole);
    // Event listener for the Grant Role button
    document.getElementById('activateSelectedButton').addEventListener('click', grantRole);
    // Event listener for the refresh Roles button
    document.getElementById('refreshRolesButton').addEventListener('click', refreshRoles); // vip note :can be   can be replaced by two lines to be able to use .click for auto click refreshRolesBut.click();
    //     const refreshRolesBut =  document.getElementById('refreshRolesButton') ;
    //      refreshRolesBut.addEventListener('click', refreshRoles);

    //role usser mopdal end 
    //#####################block of search Role   -  start ##############
    const role_nameInput = document.getElementById('roleNameSearchInput');  // define at top page related to search role table 
    const roleSearchInput = document.getElementById('roleNameSearchInput'); // define at top page related to search role table 
    const roleNameSearchTable = document.getElementById('roleNameSearchTable').getElementsByTagName('tbody')[0]; // to handle bug without it table appear with headr at modal apperance but without it  when search and fill data it disappear the header 
    ///event listeners start 
    // Event listener for the Role seach button
    document.getElementById('roleNameSearchButton').addEventListener('click', roleSearch);

    //// Event listener for "Enter" key press on the left role search  modal  input
    roleSearchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the form from submitting (if in a form)
            roleSearch(user);
        }
    });
    ///event listeners end

    // Function to manage roleSearch action


    function getRoleSearchData() {
        const Role_name = role_nameInput.value;
        // Validate Role name field
        if (!Role_name) { //if (!Role_name and len(Role_name) >= 3 )
            alert(`Role name can not be null`);
            return; // Stop execution if fields are empty
        }
        return { Role_name };
    }
    // Function to manage roleSearch action
    function roleSearch(user) {
        // alert('Role search button is clicked');
        const { Role_name } = getRoleSearchData();
        username = user.username;
        var requestData = {
            Role_name: Role_name,
            username: username     //replace username with global variable to exclude already assigned roles either active or not when search role usernameRoleModal 
        };
        // Send the AJAX request to the controller
        fetch(`http://192.168.101.20:8089/DBOPs/getSearchRoles`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the controller
                console.log('Received data:', data);
                console.log('Data type:', typeof data);
                // Display the results
                if (data.length === 0) {
                    //console.log('data lenght1:', data.length);
                    alert(`No Roles Assigned `);

                } else {

                    console.log('total Roles:', data.length);
                    populateRoleSearchTable(data);

                }
            })
            .catch(error => {
                // Handle any errors
                alert(`An error occurred while getting roles: ${error.message}`);
            });

        function populateRoleSearchTable(data) {

            roleNameSearchTable.innerHTML = ''; //clear previous table search this was a bug
            data.forEach(RoleSearch => {
                const row = roleNameSearchTable.insertRow();
                // Add user data to the table cells
                const cells = ['Role Code', 'Status', 'End Date'];

                cells.forEach(cell => {
                    const cellValue = RoleSearch[cell];
                    const cellElement = row.insertCell();
                    cellElement.textContent = cellValue;
                });
                // Add the class "search-role-row" to each row for multi selection
                row.classList.add('user-role-row');  //same class as tolp half table to take same css 
                //debugger;

            });
        }
    }
    const empUserSearchTable = document.getElementById('empUserSearchTable').getElementsByTagName('tbody')[0]; // to handle bug without it table appear with headr at modal apperance but without it  when search and fill data it disappear the header 
    const user_nameInputRole = document.getElementById('userNameSearchInput');
    const empnoInputRole = document.getElementById('empNoSearchInput');

    ///event listeners start 
    // Event listener for the Role seach button
    document.getElementById('empUserSearchButton').addEventListener('click', fillSearchUserRoleTable);

    //// Event listener for "Enter" key press on the left role search  modal  input
    //implement it
    ///event listeners end

    ///// Function to manage userroleSearch action
    function fillSearchUserRoleTable() {
        const { user_nameValue, empnoValue } = getSearchDataR();
        fetchSearchUserRoleTable(user_nameValue, empnoValue);

    }

    function getSearchDataR() {

        const user_name = user_nameInputRole.value;
        const empno = empnoInputRole.value;


        // Validate username and empno fields
        if (!user_name & !empno) {
            alert(`Username and EMPno can not be null`);
            return; // Stop execution if fields are empty
        }

        // Replace empty fields with '%'
        const user_nameValue = user_name || '%';
        const empnoValue = empno || '%';


        return { user_nameValue, empnoValue };
    }

    function fetchSearchUserRoleTable(user_nameValue, empnoValue) {
        var requestData = {
            username: user_nameValue,
            empno: empnoValue
        };
        fetch(`http://192.168.101.20:8089/DBOPs/searchUserRoles`,
            {
                method: 'POST', // Use POST method
                body: JSON.stringify(requestData),
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
                    alert(`No Roles `);
                } else {

                    console.log('data lenght2:', data.length);
                    populateSearchUserRoleTable(data);

                }
            })
        // .catch(error => {
        // // Show the error message on the screen
        // userList.innerHTML = `<li>Error: ${error.message}</li>`;
        // });
    }

    function populateSearchUserRoleTable(data) {

        empUserSearchTable.innerHTML = ''; //clear previous table search this was a bug
        data.forEach(UserRoleSearch => {
            const row = empUserSearchTable.insertRow();
            // Add user data to the table cells
            const cells = ['Role Code', 'Role Status', 'User Role Status'];

            cells.forEach(cell => {
                const cellValue = UserRoleSearch[cell];
                const cellElement = row.insertCell();
                cellElement.textContent = cellValue;
            });
            // Add the class "search-role-row" to each row for multi selection
            row.classList.add('user-role-row');
            //debugger;

        });
    }
    //##########handle grant role of role search table start 
    document.getElementById('grantRoleButton').addEventListener('click', grantRoleL); //grant role from table left

    function grantRoleL() {
        alert(`managing user  : ${usernameRoleModal}`);
        grantRoleL();
    }
    //ajax request to grant Role from search role left table end 
    function grantRoleL() {
        // Create the request data object with the selectedRoles array
        //debugger;
        //    	  const requestData = {
        //   	    selectedRoles: selectedRoles, // in case of sent it in shappe of JSONArray as in approches revRoles file approch1
        //    			  
        //      	  };
        if (selectedRoleL.length == 0) {
            alert(`No Roles are selected `);
        } else {
            const requestData = selectedRoleL;
            console.log('Roles is:', selectedRoleL);

            // Define the URL for your controller endpoint
            fetch(`http://192.168.101.20:8089/DBOPs/graRoles`, {
                method: 'POST',
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then((data) => {
                    // Handle the response from the server if needed
                    console.log('Response from server:', data);
                    //below block to parse the json objects returned and display them along  with thier status on the screen-START
                    let message = "Granting Status: \n";
                    data.forEach(item => {
                        message += `Role: ${item.Role_Code}   : ${item.Status} \n`;
                    });
                    alert(message);
                    // block to parse the json objects returned and display them along  with thier status on the screen-END
                    console.log(usernameRoleModal);
                    refreshRoles();   //to refresh tophalp tablee after granting  BUG notWorking check it .
                })
                .catch((error) => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }

    }
    //ajax request to grant Role from search role left table end 


    //##########handle grant role of role search table end 
    //####handle multi selection of left table start 
    //handle multi selection2 for left bottom table start

    let selectedRoleL = []; // Array to store selected roles L stands for left table for role search
    let lastSelectedRowRoleL = null; // Store the last selected row

    roleNameSearchTable.addEventListener('click', function (event) {
        const target = event.target;

        // Check if the clicked element is a table cell (td)
        if (target.tagName === 'TD') {
            const row = target.parentElement;

            // Extract the username and role code from the selected row
            const username = usernameRoleModal;
            const roleCode = row.cells[0].textContent;

            if (event.ctrlKey || event.shiftKey) {
                // Ctrl or Shift key is pressed, check if the row is already selected
                if (row.classList.contains('selected')) {
                    // Row is selected, remove it from the selectedRolesL array
                    selectedRoleL = selectedRoleL.filter(
                        (role) => !(role.username === username && role.roleCode === roleCode)
                    );
                    row.classList.remove('selected');
                } else {
                    // Row is not selected, add it to the selectedRolesL array
                    selectedRoleL.push({ username, roleCode });
                    row.classList.add('selected');
                }
            } else {
                // Neither Ctrl nor Shift key is pressed
                if (lastSelectedRowRoleL && event.shiftKey) {
                    // Shift key is pressed, select rows between last selected and current row
                    const rows = userRolesTable.querySelectorAll('tbody tr');
                    const startIndex = Array.from(rows).indexOf(lastSelectedRowRoleL);
                    const endIndex = Array.from(rows).indexOf(row);

                    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                        const currentRow = rows[i];
                        const currentUsername = currentRow.cells[0].textContent;
                        const currentRoleCode = currentRow.cells[1].textContent;

                        if (!currentRow.classList.contains('selected')) {
                            selectedRoleL.push({ username: currentUsername, roleCode: currentRoleCode });
                            currentRow.classList.add('selected');
                        }
                    }
                } else {
                    // Ctrl key is not pressed, clear all other selections
                    const selectedRows = roleNameSearchTable.querySelectorAll('tbody tr.selected');
                    selectedRows.forEach((selectedRow) => {
                        selectedRow.classList.remove('selected');
                    });

                    // If the clicked row is already selected, deselect it
                    if (row.classList.contains('selected')) {
                        selectedRoleL = selectedRoleL.filter(
                            (role) => !(role.username === username && role.roleCode === roleCode)
                        );
                        row.classList.remove('selected');
                    } else {
                        // Select the clicked row and update the selectedRolesL array
                        row.classList.add('selected');
                        selectedRoleL = [{ username, roleCode }];
                    }
                }
            }

            // Update the last selected row
            lastSelectedRowRoleL = row;

            // Log the selectedRolesL array
            console.log('Selected Roles:', selectedRoleL);
        }
    });
    //////////////
    // Add keyboard event listeners for arrow key navigation
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp') {
            // Move selection up
            moveSelection('up');
        } else if (event.key === 'ArrowDown') {
            // Move selection down
            moveSelection('down');
        }
    });

    function moveSelection(direction) {
        const selectedRows = roleNameSearchTable.querySelectorAll('tbody tr.selected');

        if (selectedRows.length === 0) {
            // No rows are selected, start from the first row
            selectedRows[0].classList.remove('selected');
            selectedRows[0].blur(); // Remove focus from the currently selected row
            selectedRows[direction === 'up' ? 0 : selectedRows.length - 1].focus();
        } else {
            const currentIndex = Array.from(roleNameSearchTable.querySelectorAll('tbody tr')).indexOf(
                selectedRows[selectedRows.length - 1]
            );

            let newIndex;
            if (direction === 'up') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            } else {
                newIndex =
                    currentIndex < roleNameSearchTable.rows.length - 1
                        ? currentIndex + 1
                        : roleNameSearchTable.rows.length - 1;
            }

            // Move the selection to the new index
            selectedRows[selectedRows.length - 1].classList.remove('selected');
            selectedRows[selectedRows.length - 1].blur(); // Remove focus from the currently selected row
            roleNameSearchTable.rows[newIndex].classList.add('selected');
            roleNameSearchTable.rows[newIndex].focus();
        }
    }
    //handle multi selection2 for left bottom table end
    //handle multi selection2 for top half table  end
    //##########handle grant role of user role search table start 
    document.getElementById('grantEmpUserButton').addEventListener('click', grantRoleR); //grant role from table left

    function grantRoleR() {
        alert(`managing user  : ${usernameRoleModal}`);
        graRoleR();
    }
    //ajax request to grant Role from search role left table end 
    function graRoleR() {
        // Create the request data object with the selectedRoles array
        //debugger;
        //    	  const requestData = {
        //   	    selectedRoles: selectedRoles, // in case of sent it in shappe of JSONArray as in approches revRoles file approch1
        //    			  
        //      	  };
        if (selectedRoleR.length == 0) {
            alert(`No Roles are selected `);
        } else {
            const requestData = selectedRoleR;
            console.log('Roles is:', selectedRoleR);

            // Define the URL for your controller endpoint
            fetch(`http://192.168.101.20:8089/DBOPs/graRoles`, {
                method: 'POST',
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then((data) => {
                    // Handle the response from the server if needed
                    console.log('Response from server:', data);
                    //below block to parse the json objects returned and display them along  with thier status on the screen-START
                    let message = "Granting Status: \n";
                    data.forEach(item => {
                        message += `Role: ${item.Role_Code}   : ${item.Status} \n`;
                    });
                    alert(message);
                    // block to parse the json objects returned and display them along  with thier status on the screen-END
                    console.log(usernameRoleModal);
                    refreshRoles();   //to refresh tophalp tablee after granting  BUG notWorking check it .
                })
                .catch((error) => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }

    }
    //ajax request to grant Role from search role left table end 


    //##########handle grant role of user role search table end 
    //####handle multi selection of right table start 
    //handle multi selection2 for right bottom table start

    let selectedRoleR = []; // Array to store selected roles L stands for left table for role search
    let lastSelectedRowRoleR = null; // Store the last selected row

    empUserSearchTable.addEventListener('click', function (event) {
        const target = event.target;

        // Check if the clicked element is a table cell (td)
        if (target.tagName === 'TD') {
            const row = target.parentElement;

            // Extract the username and role code from the selected row
            const username = usernameRoleModal;
            const roleCode = row.cells[0].textContent;

            if (event.ctrlKey || event.shiftKey) {
                // Ctrl or Shift key is pressed, check if the row is already selected
                if (row.classList.contains('selected')) {
                    // Row is selected, remove it from the selectedRolesL array
                    selectedRoleR = selectedRoleR.filter(
                        (role) => !(role.username === username && role.roleCode === roleCode)
                    );
                    row.classList.remove('selected');
                } else {
                    // Row is not selected, add it to the selectedRolesL array
                    selectedRoleR.push({ username, roleCode });
                    row.classList.add('selected');
                }
            } else {
                // Neither Ctrl nor Shift key is pressed
                if (lastSelectedRowRoleR && event.shiftKey) {
                    // Shift key is pressed, select rows between last selected and current row
                    const rows = empUserSearchTable.querySelectorAll('tbody tr');
                    const startIndex = Array.from(rows).indexOf(lastSelectedRowRoleR);
                    const endIndex = Array.from(rows).indexOf(row);

                    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                        const currentRow = rows[i];
                        const currentUsername = currentRow.cells[0].textContent;
                        const currentRoleCode = currentRow.cells[1].textContent;

                        if (!currentRow.classList.contains('selected')) {
                            selectedRoleR.push({ username: currentUsername, roleCode: currentRoleCode });
                            currentRow.classList.add('selected');
                        }
                    }
                } else {
                    // Ctrl key is not pressed, clear all other selections
                    const selectedRows = empUserSearchTable.querySelectorAll('tbody tr.selected');
                    selectedRows.forEach((selectedRow) => {
                        selectedRow.classList.remove('selected');
                    });

                    // If the clicked row is already selected, deselect it
                    if (row.classList.contains('selected')) {
                        selectedRoleR = selectedRoleR.filter(
                            (role) => !(role.username === username && role.roleCode === roleCode)
                        );
                        row.classList.remove('selected');
                    } else {
                        // Select the clicked row and update the selectedRolesL array
                        row.classList.add('selected');
                        selectedRoleR = [{ username, roleCode }];
                    }
                }
            }

            // Update the last selected row
            lastSelectedRowRoleR = row;

            // Log the selectedRolesL array
            console.log('Selected Roles:', selectedRoleR);
        }
    });
    //////////////
    // Add keyboard event listeners for arrow key navigation
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp') {
            // Move selection up
            moveSelection('up');
        } else if (event.key === 'ArrowDown') {
            // Move selection down
            moveSelection('down');
        }
    });

    function moveSelection(direction) {
        const selectedRows = empUserSearchTable.querySelectorAll('tbody tr.selected');

        if (selectedRows.length === 0) {
            // No rows are selected, start from the first row
            selectedRows[0].classList.remove('selected');
            selectedRows[0].blur(); // Remove focus from the currently selected row
            selectedRows[direction === 'up' ? 0 : selectedRows.length - 1].focus();
        } else {
            const currentIndex = Array.from(empUserSearchTable.querySelectorAll('tbody tr')).indexOf(
                selectedRows[selectedRows.length - 1]
            );

            let newIndex;
            if (direction === 'up') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            } else {
                newIndex =
                    currentIndex < empUserSearchTable.rows.length - 1
                        ? currentIndex + 1
                        : empUserSearchTable.rows.length - 1;
            }

            // Move the selection to the new index
            selectedRows[selectedRows.length - 1].classList.remove('selected');
            selectedRows[selectedRows.length - 1].blur(); // Remove focus from the currently selected row
            empUserSearchTable.rows[newIndex].classList.add('selected');
            empUserSearchTable.rows[newIndex].focus();
        }
    }
    //handle multi selection2 for left bottom table end
    //handle multi selection2 for top half table  end

    //#####################block of  search user Role   -  end ##############

    //implement resp Modal start
    //new OM the resp is copy of the roles   when i close the respmodal thae main search table buttonand design disappear sso i will enter it inside the DOM
    //COOOOOOOOOOOOOOOPY to new - implement resp Modal start

    // Function to handle edit button click
    function respUser(user) {
        // Implement your edit logic here
        usernameRespModal = user.USER_NAME; //assign the value of the global variable
        //alert(`Editing Resp user: ${user.USER_NAME}`);
        // alert(`Editing Resp user: ${usernameRespModal}`);
        openRespUserModal(user)
    }
    const userRespTable = document.getElementById('userRespTable').getElementsByTagName('tbody')[0];  // to handle bug without it table appear with headr at modal apperance but without it  when search and fill data it disappear the header


    function openRespUserModal(user) {
        usernameRespModal = user.USER_NAME;
        userTable.innerHTML = '';    //fix bug of reopen the modal with a new search user empty the old search data for that table
        userRespTable.innerHTML = '';   //fix bug of reopen the modal with a new search user empty the old search data for that table
        respNameSearchTable.innerHTML = '';
        respEmpUserSearchTable.innerHTML = '';
        fetchUserRespModalData(usernameRespModal);

    }
    function fetchUserRespModalData(usernameRespModal) {
        var modal = document.getElementById('respModal');
        // alert(` editing role for value is : ' ${user.USER_NAME}`);
        //==start edit
        // Create a JSON object with the parameters to send to the controller
        var requestData = {
            username: usernameRespModal
        };

        // Send the AJAX request to the controller
        fetch(`http://192.168.101.20:8089/DBOPs/getUserResp`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the controller
                console.log('Received data:', data);
                console.log('Data type:', typeof data);
                // Display the results
                if (data.length === 0) {
                    //console.log('data lenght1:', data.length);
                    alert(`No Resps Assigned `);

                } else {

                    console.log('total Resps:', data.length);
                    populateRespuserTable(data);

                }
            })
            .catch(error => {
                // Handle any errors
                alert(`An error occurred while getting user roles: ${error.message}`);
            });
        modal.style.display = 'block';  //t show the modal on the screen
    }



    function populateRespuserTable(data) {

        userRespTable.innerHTML = ''; //clear previous table search this was a bug
        data.forEach(userRole => {
            const row = userRespTable.insertRow();
            // Add user data to the table cells
            const cells = ['Username', 'Responsibility', 'Application', 'Start_Date', 'End_Date', 'Responsibility_Key'];  // de same name as json key value must match to get its values not related to table headers names in html  

            cells.forEach(cell => {
                const cellValue = userRole[cell];
                const cellElement = row.insertCell();
                cellElement.textContent = cellValue;
            });
            //for row selection1  start
            // Add the class "user-role-row" to each row 
            row.classList.add('user-role-row');
            //debugger;
            // Attach a click event listener to each row
            //            row.addEventListener('click', function () {
            ////                alert('Row selected!');
            //            	
            //            });
            //for row selection1 end 
        });
    }



    document.getElementById('refreshRespsButton').addEventListener('click', refreshResp); // vip note :can be   can be replaced by two lines to be able to use .click for auto click refreshRolesBut.click();
    //     const refreshRolesBut =  document.getElementById('refreshRolesButton') ;
    //      refreshRolesBut.addEventListener('click', refreshRoles);

    // Function to refresh Role 
    function refreshResp() {
        //alert('refresh Role button clicked');
        fetchUserRespModalData(usernameRespModal);

    }
    document.getElementById('setEndDateButton').addEventListener('click', openRespEDeModal); //open set resp end date modal listener 

    function openRespEDeModal() {     //below commented two lines in this function and in below closeRespEDModal() cause an error when close the modal it disappear and remain another modal without x signa nd can not close it  
        var respEndDateModal = document.getElementById('respEndDateModal');
        respEndDateModal.style.display = 'block';
        //        var RespEDModal = document.getElementById('respEndDateModal');
        //        RespEDModal.style.display = 'block';

    }
    //close resp set end date modal listeber 
    document.getElementById('closerespEndDateModal').addEventListener('click', closeRespEDModal); //open set resp end date modal listener 

    function closeRespEDModal() {
        var respEndDateModal = document.getElementById('respEndDateModal');
        respEndDateModal.style.display = 'none';
        //        var  closerespEndDateModal = document.getElementById('closerespEndDateModal');
        //        closerespEndDateModal.style.display = 'none';

    }


    ////Event listener for "Enter" key press on rep end date input  resp end date modal 
    const respEndDateInputInput = document.getElementById('respEndDateInput');
    respEndDateInputInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the form from submitting (if in a form)
            // Execute the respSetEndDate function
            const respEndDate = document.getElementById('respEndDateInput');
            const respEndDateValue = respEndDate.value;
            console.log('end date is:', respEndDateValue);
            respSetEndDate(respEndDateValue);

            // Execute the closeModal function
            closeRespEDModal();
        }
    });

    //event listener on the button save in resp set end date
    document.getElementById('saveRespEndDateBtn').addEventListener('click', function () {
        // Execute the respSetEndDate function
        const respEndDate = document.getElementById('respEndDateInput');
        const respEndDateValue = respEndDate.value;
        console.log('end date is:', respEndDateValue);
        respSetEndDate(respEndDateValue);

        // Execute the closeModal function
        closeRespEDModal();
    });



    function respSetEndDate(respEndDateValue) {

        if (selectedResp.length == 0) {
            alert(`No Roles are selected `);
        } else {
            // const requestData = selectedResp;
            const requestData = {
                selectedResp: selectedResp,
                respEndDateInput: respEndDateValue
            };

            console.log('Resp are:', selectedResp);

            // Define the URL for your controller endpoint
            fetch(`http://192.168.101.20:8089/DBOPs/respSetED`, {
                method: 'POST',
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then((data) => {
                    // Handle the response from the server if needed
                    console.log('Response from server:', data);
                    //below block to parse the json objects returned and display them along  with thier status on the screen-START
                    let message = "Set End date Status: \n";
                    data.forEach(item => {
                        message += `Resp: ${item.Resp_Name}   : ${item.Status} \n`;
                    });
                    alert(message);
                    // block to parse the json objects returned and display them along  with thier status on the screen-END
                    //console.log(usernameRespModal);
                    refreshResp();   //to refresh tophalp tablee after granting  BUG notWorking check it .
                })
                .catch((error) => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }

    }
    ///


    //handle multi selection2 for top half table resp start

    let selectedResp = []; // Array to store selected resp
    let lastSelectedRowResp = null; // Store the last selected row

    userRespTable.addEventListener('click', function (event) {
        const target = event.target;

        // Check if the clicked element is a table cell (td)
        if (target.tagName === 'TD') {
            const row = target.parentElement;

            // Extract the username and resp code from the selected row
            const username = row.cells[0].textContent;
            const respStartDate = row.cells[3].textContent;
            const respName = row.cells[1].textContent;

            if (event.ctrlKey || event.shiftKey) {
                // Ctrl or Shift key is pressed, check if the row is already selected
                if (row.classList.contains('selected')) {
                    // Row is selected, remove it from the selectedRoles array
                    selectedResp = selectedResp.filter(
                        (resp) => !(resp.username === username && resp.respStartDate === respStartDate && resp.respName === respName)
                    );
                    row.classList.remove('selected');
                } else {
                    // Row is not selected, add it to the selectedRoles array
                    const respName = row.cells[1].textContent;
                    selectedResp.push({ username, respStartDate, respName });
                    row.classList.add('selected');
                }
            } else {
                // Neither Ctrl nor Shift key is pressed
                if (lastSelectedRowResp && event.shiftKey) {
                    // Shift key is pressed, select rows between last selected and current row
                    const rows = userRespTable.querySelectorAll('tbody tr');
                    const startIndex = Array.from(rows).indexOf(lastSelectedRowResp);
                    const endIndex = Array.from(rows).indexOf(row);

                    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                        const currentRow = rows[i];
                        const currentUsername = currentRow.cells[0].textContent;
                        const currentrespStartDate = currentRow.cells[3].textContent;
                        const currentrespName = row.cells[5].textContent;

                        if (!currentRow.classList.contains('selected')) {
                            selectedResp.push({ username: currentUsername, respStartDate: currentrespStartDate, respName: currentrespName });
                            currentRow.classList.add('selected');
                        }
                    }
                } else {
                    // Ctrl key is not pressed, clear all other selections
                    const selectedRows = userRespTable.querySelectorAll('tbody tr.selected');
                    selectedRows.forEach((selectedRow) => {
                        selectedRow.classList.remove('selected');
                    });

                    // If the clicked row is already selected, deselect it
                    if (row.classList.contains('selected')) {
                        selectedResp = selectedResp.filter(
                            (resp) => !(resp.username === username && resp.respStartDate === respStartDate && resp.respName === respName)
                        );
                        row.classList.remove('selected');
                    } else {
                        // Select the clicked row and update the selectedResp array
                        row.classList.add('selected');
                        selectedResp = [{ username, respStartDate, respName }];
                    }
                }
            }

            // Update the last selected row
            lastSelectedRowResp = row;

            // Log the selectedRoles array
            console.log('Selected Resp:', selectedResp);
        }
    });
    //////////////
    // Add keyboard event listeners for arrow key navigation
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp') {
            // Move selection up
            moveSelection('up');
        } else if (event.key === 'ArrowDown') {
            // Move selection down
            moveSelection('down');
        }
    });

    function moveSelection(direction) {
        const selectedRows = userRespTable.querySelectorAll('tbody tr.selected');

        if (selectedRows.length === 0) {
            // No rows are selected, start from the first row
            selectedRows[0].classList.remove('selected');
            selectedRows[0].blur(); // Remove focus from the currently selected row
            selectedRows[direction === 'up' ? 0 : selectedRows.length - 1].focus();
        } else {
            const currentIndex = Array.from(userRespTable.querySelectorAll('tbody tr')).indexOf(
                selectedRows[selectedRows.length - 1]
            );

            let newIndex;
            if (direction === 'up') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            } else {
                newIndex =
                    currentIndex < userRolesTable.rows.length - 1
                        ? currentIndex + 1
                        : userRolesTable.rows.length - 1;
            }

            // Move the selection to the new index
            selectedRows[selectedRows.length - 1].classList.remove('selected');
            selectedRows[selectedRows.length - 1].blur(); // Remove focus from the currently selected row
            userRespTable.rows[newIndex].classList.add('selected');
            userRespTable.rows[newIndex].focus();
        }
    }

    //handle multi selection2 for top half table resp end

    //handle search RespL start 
    // Event listener for the Role seach button
    const respNameSearchTable = document.getElementById('respNameSearchTable').getElementsByTagName('tbody')[0]; // to handle bug without it table appear with headr at modal apperance but without it  when search and fill data it disappear the header 
    document.getElementById('respNameSearchButton').addEventListener('click', respSearch);
    const resp_nameInput = document.getElementById('respNameSearchInput');  //must be declared here and initialized before using it old place whew in xyz not worked as it declared after call the function 
    // Function to manage roleSearch action
    function respSearch() {  //when pass user and make user.username not work as in search role debug
        // alert('Role search button is clicked');
        //    	console.log('username00:',usernameRespModal);
        const { Resp_name } = getRespSearchData();
        username = usernameRespModal;
        //        console.log('username11:',username);
        var requestData = {
            Resp_name: Resp_name,
            username: username     //replace username with global variable to exclude already assigned roles either active or not when search role usernameRoleModal 
        };
        //xyz
        function getRespSearchData() {
            const Resp_name = resp_nameInput.value;
            // Validate Role name field
            if (!Resp_name) { //if (!Resp_name and len(Resp_name) >= 3 )
                alert(`Resp name can not be null`);
                return; // Stop execution if fields are empty
            }
            return { Resp_name };
        }
        // Send the AJAX request to the controller
        fetch(`http://192.168.101.20:8089/DBOPs/getSearchResp`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the controller
                console.log('Received data:', data);
                console.log('Data type:', typeof data);
                // Display the results
                if (data.length === 0) {
                    //console.log('data lenght1:', data.length);
                    alert(`No Resp Exist `);

                } else {

                    console.log('total Resps:', data.length);
                    populaterespNameSearchTable(data);

                }
            })
            .catch(error => {
                // Handle any errors
                alert(`An error occurred while getting roles: ${error.message}`);
            });


        function populaterespNameSearchTable(data) {

            respNameSearchTable.innerHTML = ''; //clear previous table search this was a bug
            data.forEach(RespSearch => {
                const row = respNameSearchTable.insertRow();
                // Add user data to the table cells
                const cells = ['Responsibility', 'Responsibility Key', 'Description']; //as come from json

                cells.forEach(cell => {
                    const cellValue = RespSearch[cell];
                    const cellElement = row.insertCell();
                    cellElement.textContent = cellValue;
                });
                // Add the class "search-role-row" to each row for multi selection
                row.classList.add('user-role-row');  //same class as tolp half table to take same css 
                //debugger;

            });
        }
    }
    //handle multi selection2 for left bottom table start

    let selectedRespL = []; // Array to store selected roles L stands for left table for role search
    let lastSelectedRowRespL = null; // Store the last selected row

    respNameSearchTable.addEventListener('click', function (event) {
        const target = event.target;

        // Check if the clicked element is a table cell (td)
        if (target.tagName === 'TD') {
            const row = target.parentElement;

            // Extract the username and role code from the selected row
            const username = usernameRespModal;
            const respName = row.cells[0].textContent;

            if (event.ctrlKey || event.shiftKey) {
                // Ctrl or Shift key is pressed, check if the row is already selected
                if (row.classList.contains('selected')) {
                    // Row is selected, remove it from the selectedRolesL array
                    selectedRespL = selectedRespL.filter(
                        (resp) => !(resp.username === username && role.respName === respName)
                    );
                    row.classList.remove('selected');
                } else {
                    // Row is not selected, add it to the selectedRolesL array
                    selectedRespL.push({ username, respName });
                    row.classList.add('selected');
                }
            } else {
                // Neither Ctrl nor Shift key is pressed
                if (lastSelectedRowRespL && event.shiftKey) {
                    // Shift key is pressed, select rows between last selected and current row
                    const rows = userRolesTable.querySelectorAll('tbody tr');
                    const startIndex = Array.from(rows).indexOf(lastSelectedRowRespL);
                    const endIndex = Array.from(rows).indexOf(row);

                    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                        const currentRow = rows[i];
                        const currentUsername = currentRow.cells[0].textContent;
                        const currentRespName = currentRow.cells[1].textContent;

                        if (!currentRow.classList.contains('selected')) {
                            selectedRespL.push({ username: currentUsername, respName: currentRespName });
                            currentRow.classList.add('selected');
                        }
                    }
                } else {
                    // Ctrl key is not pressed, clear all other selections
                    const selectedRows = respNameSearchTable.querySelectorAll('tbody tr.selected');
                    selectedRows.forEach((selectedRow) => {
                        selectedRow.classList.remove('selected');
                    });

                    // If the clicked row is already selected, deselect it
                    if (row.classList.contains('selected')) {
                        selectedRespL = selectedRespL.filter(
                            (resp) => !(resp.username === username && resp.respName === respName)
                        );
                        row.classList.remove('selected');
                    } else {
                        // Select the clicked row and update the selectedRolesL array
                        row.classList.add('selected');
                        selectedRespL = [{ username, respName }];
                    }
                }
            }

            // Update the last selected row
            lastSelectedRowRespL = row;

            // Log the selectedRolesL array
            console.log('Selected Resp:', selectedRespL);
        }
    });
    //////////////
    // Add keyboard event listeners for arrow key navigation
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp') {
            // Move selection up
            moveSelection('up');
        } else if (event.key === 'ArrowDown') {
            // Move selection down
            moveSelection('down');
        }
    });

    function moveSelection(direction) {
        const selectedRows = respNameSearchTable.querySelectorAll('tbody tr.selected');

        if (selectedRows.length === 0) {
            // No rows are selected, start from the first row
            selectedRows[0].classList.remove('selected');
            selectedRows[0].blur(); // Remove focus from the currently selected row
            selectedRows[direction === 'up' ? 0 : selectedRows.length - 1].focus();
        } else {
            const currentIndex = Array.from(roleNameSearchTable.querySelectorAll('tbody tr')).indexOf(
                selectedRows[selectedRows.length - 1]
            );

            let newIndex;
            if (direction === 'up') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            } else {
                newIndex =
                    currentIndex < respNameSearchTable.rows.length - 1
                        ? currentIndex + 1
                        : respNameSearchTable.rows.length - 1;
            }

            // Move the selection to the new index
            selectedRows[selectedRows.length - 1].classList.remove('selected');
            selectedRows[selectedRows.length - 1].blur(); // Remove focus from the currently selected row
            respNameSearchTable.rows[newIndex].classList.add('selected');
            respNameSearchTable.rows[newIndex].focus();
        }
    }
    //handle multi selection2 for left bottom table end

    //handle grant resp of resp search table start 
    document.getElementById('grantRespButton').addEventListener('click', grantRespL); //grant role from table left


    function grantRespL() {
        alert(`managing user  : ${usernameRespModal}`);
        grantResL();
    }
    //ajax request to grant Role from search role left table end 
    function grantResL() {
        // Create the request data object with the selectedRoles array
        //debugger;
        //    	  const requestData = {
        //   	    selectedRoles: selectedRoles, // in case of sent it in shappe of JSONArray as in approches revRoles file approch1
        //    			  
        //      	  };
        if (selectedRespL.length == 0) {
            alert(`No Resp are selected `);
        } else {
            const requestData = selectedRespL;
            console.log('Resps are:', selectedRespL);

            // Define the URL for your controllerendpoint 
            fetch(`http://192.168.101.20:8089/DBOPs/graResp`, {
                method: 'POST',
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then((data) => {
                    // Handle the response from the server if needed
                    console.log('Response from server:', data);
                    //below block to parse the json objects returned and display them along  with thier status on the screen-START
                    let message = "Granting Status: \n";
                    data.forEach(item => {
                        message += `Resp: ${item.Resp_Name}   : ${item.Status} \n`;
                    });
                    alert(message);
                    // block to parse the json objects returned and display them along  with thier status on the screen-END
                    console.log(usernameRespModal);
                    refreshResp();   //to refresh tophalp tablee after granting  BUG notWorking check it .
                })
                .catch((error) => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }

    }
    //ajax request to grant Role from search role left table     

    //handle search RespL End

    //handle search user  RespR start 
    const respEmpUserSearchTable = document.getElementById('respEmpUserSearchTable').getElementsByTagName('tbody')[0]; // to handle bug without it table appear with headr at modal apperance but without it  when search and fill data it disappear the header 
    const user_nameInputResp = document.getElementById('RespuserNameSearchInput');
    const empnoInputResp = document.getElementById('RespempNoSearchInput');

    ///event listeners start 
    // Event listener for the resp seach button
    document.getElementById('respEmpUserSearchButton').addEventListener('click', fillSearchUserRespTable);

    //// Event listener for "Enter" key press on the left role search  modal  input
    //implement it
    ///event listeners end

    ///// Function to manage userRespSearch action
    function fillSearchUserRespTable() {
        const { user_nameValue, empnoValue } = getRespSearchDataR();
        fetchSearchUserRespTable(user_nameValue, empnoValue);

    }

    function getRespSearchDataR() {

        const user_name = user_nameInputResp.value;
        const empno = empnoInputResp.value;


        // Validate username and empno fields
        if (!user_name & !empno) {
            alert(`Username and EMPno can not be null`);
            return; // Stop execution if fields are empty
        }

        // Replace empty fields with '%'
        const user_nameValue = user_name || '%';
        const empnoValue = empno || '%';


        return { user_nameValue, empnoValue };
    }

    function fetchSearchUserRespTable(user_nameValue, empnoValue) {
        var requestData = {
            username: user_nameValue,
            empno: empnoValue
        };
        fetch(`http://192.168.101.20:8089/DBOPs/searchUserResp`,
            {
                method: 'POST', // Use POST method
                body: JSON.stringify(requestData),
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
                    alert(`No Resp `);
                } else {

                    console.log('data lenght2:', data.length);
                    populateSearchUserRespTable(data);

                }
            })
        // .catch(error => {
        // // Show the error message on the screen
        // userList.innerHTML = `<li>Error: ${error.message}</li>`;
        // });
    }

    function populateSearchUserRespTable(data) {

        respEmpUserSearchTable.innerHTML = ''; //clear previous table search this was a bug
        data.forEach(UserRespSearch => {
            const row = respEmpUserSearchTable.insertRow();
            // Add user data to the table cells
            const cells = ['Responsibility', 'Application', 'Start_Date', 'End_Date'];

            cells.forEach(cell => {
                const cellValue = UserRespSearch[cell];
                const cellElement = row.insertCell();
                cellElement.textContent = cellValue;
            });
            // Add the class "search-role-row" to each row for multi selection
            row.classList.add('user-role-row');
            //debugger;

        });
    }

    //##########handle grant role of user role search table start 
    document.getElementById('respGrantEmpUserButton').addEventListener('click', grantRespR); //grant role from table left

    function grantRespR() {
        alert(`managing user  : ${usernameRoleModal}`);
        graRespR();
    }
    //ajax request to grant Role from search role left table end 
    function graRespR() {
        // Create the request data object with the selectedRoles array
        // debugger;
        //    	  const requestData = {
        //   	    selectedRoles: selectedRoles, // in case of sent it in shappe of JSONArray as in approches revRoles file approch1
        //    			  
        //      	  };
        if (selectedRespR.length == 0) {
            alert(`No Resp are selected `);
        } else {
            const requestData = selectedRespR;
            console.log('Resp is:', selectedRespR);

            // Define the URL for your controller endpoint
            fetch(`http://192.168.101.20:8089/DBOPs/graResp`, {
                method: 'POST',
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then((data) => {
                    // Handle the response from the server if needed
                    console.log('Response from server:', data);
                    //below block to parse the json objects returned and display them along  with thier status on the screen-START
                    let message = "Granting Status: \n";
                    data.forEach(item => {
                        message += `Resp: ${item.Resp_Name}   : ${item.Status} \n`;
                    });
                    alert(message);
                    // block to parse the json objects returned and display them along  with thier status on the screen-END
                    console.log(usernameRespModal);
                    refreshResp();   //to refresh tophalp tablee after granting  BUG notWorking check it .
                })
                .catch((error) => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }

    }
    //ajax request to grant Role from search role left table end 


    //##########handle grant role of user role search table end 
    //####handle multi selection of right table start 
    //handle multi selection2 for right bottom table start

    let selectedRespR = []; // Array to store selected roles L stands for left table for role search
    let lastSelectedRowRespR = null; // Store the last selected row

    respEmpUserSearchTable.addEventListener('click', function (event) {
        const target = event.target;

        // Check if the clicked element is a table cell (td)
        if (target.tagName === 'TD') {
            const row = target.parentElement;

            // Extract the username and role code from the selected row
            const username = usernameRespModal;
            const respName = row.cells[0].textContent;

            if (event.ctrlKey || event.shiftKey) {
                // Ctrl or Shift key is pressed, check if the row is already selected
                if (row.classList.contains('selected')) {
                    // Row is selected, remove it from the selectedRolesL array
                    selectedRespR = selectedRespR.filter(
                        (resp) => !(resp.username === username && resp.respName === respName)
                    );
                    row.classList.remove('selected');
                } else {
                    // Row is not selected, add it to the selectedRolesL array
                    selectedRespR.push({ username, respName });
                    row.classList.add('selected');
                }
            } else {
                // Neither Ctrl nor Shift key is pressed
                if (lastSelectedRowRespR && event.shiftKey) {
                    // Shift key is pressed, select rows between last selected and current row
                    const rows = respEmpUserSearchTable.querySelectorAll('tbody tr');
                    const startIndex = Array.from(rows).indexOf(lastSelectedRowRoleR);
                    const endIndex = Array.from(rows).indexOf(row);

                    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                        const currentRow = rows[i];
                        // const currentUsername = currentRow.cells[0].textContent;
                        const currentUsername = usernameRespModal;
                        const currentRespName = currentRow.cells[1].textContent;

                        if (!currentRow.classList.contains('selected')) {
                            selectedRoleR.push({ username: currentUsername, respName: currentRespName });
                            currentRow.classList.add('selected');
                        }
                    }
                } else {
                    // Ctrl key is not pressed, clear all other selections
                    const selectedRows = respEmpUserSearchTable.querySelectorAll('tbody tr.selected');
                    selectedRows.forEach((selectedRow) => {
                        selectedRow.classList.remove('selected');
                    });

                    // If the clicked row is already selected, deselect it
                    if (row.classList.contains('selected')) {
                        selectedRespR = selectedRespR.filter(
                            (resp) => !(resp.username === username && resp.respName === respName)
                        );
                        row.classList.remove('selected');
                    } else {
                        // Select the clicked row and update the selectedRolesL array
                        row.classList.add('selected');
                        selectedRespR = [{ username, respName }];
                    }
                }
            }

            // Update the last selected row
            lastSelectedRowRespR = row;

            // Log the selectedRolesL array
            console.log('Selected Roles:', selectedRespR);
        }
    });
    //////////////
    // Add keyboard event listeners for arrow key navigation
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp') {
            // Move selection up
            moveSelection('up');
        } else if (event.key === 'ArrowDown') {
            // Move selection down
            moveSelection('down');
        }
    });

    function moveSelection(direction) {
        const selectedRows = respEmpUserSearchTable.querySelectorAll('tbody tr.selected');

        if (selectedRows.length === 0) {
            // No rows are selected, start from the first row
            selectedRows[0].classList.remove('selected');
            selectedRows[0].blur(); // Remove focus from the currently selected row
            selectedRows[direction === 'up' ? 0 : selectedRows.length - 1].focus();
        } else {
            const currentIndex = Array.from(respEmpUserSearchTable.querySelectorAll('tbody tr')).indexOf(
                selectedRows[selectedRows.length - 1]
            );

            let newIndex;
            if (direction === 'up') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            } else {
                newIndex =
                    currentIndex < respEmpUserSearchTable.rows.length - 1
                        ? currentIndex + 1
                        : respEmpUserSearchTable.rows.length - 1;
            }

            // Move the selection to the new index
            selectedRows[selectedRows.length - 1].classList.remove('selected');
            selectedRows[selectedRows.length - 1].blur(); // Remove focus from the currently selected row
            respEmpUserSearchTable.rows[newIndex].classList.add('selected');
            respEmpUserSearchTable.rows[newIndex].focus();
        }
    }
    //handle multi selection2 for left bottom table end

    //handle search user  RespR end 

});  //end of DOM brackets





