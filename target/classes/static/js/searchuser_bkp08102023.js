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

    //role user modal start 
    // Function to open the role user modal 
    // Function to open the role user modal 

    function openRoleUserModal(user) {
        usernameRoleModal = user.USER_NAME;
        userTable.innerHTML = '';    //fix bug of reopen the modal with a new search user empty the old search data for that table
        userRolesTable.innerHTML = '';   //fix bug of reopen the modal with a new search user empty the old search data for that table
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




    //handle multi selection2 for top half table start

    let selectedRoles = []; // Array to store selected roles
    let lastSelectedRow = null; // Store the last selected row

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
                    selectedRoles = selectedRoles.filter(
                        (role) => !(role.username === username && role.roleCode === roleCode)
                    );
                    row.classList.remove('selected');
                } else {
                    // Row is not selected, add it to the selectedRoles array
                    selectedRoles.push({ username, roleCode });
                    row.classList.add('selected');
                }
            } else {
                // Neither Ctrl nor Shift key is pressed
                if (lastSelectedRow && event.shiftKey) {
                    // Shift key is pressed, select rows between last selected and current row
                    const rows = userRolesTable.querySelectorAll('tbody tr');
                    const startIndex = Array.from(rows).indexOf(lastSelectedRow);
                    const endIndex = Array.from(rows).indexOf(row);

                    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                        const currentRow = rows[i];
                        const currentUsername = currentRow.cells[0].textContent;
                        const currentRoleCode = currentRow.cells[1].textContent;

                        if (!currentRow.classList.contains('selected')) {
                            selectedRoles.push({ username: currentUsername, roleCode: currentRoleCode });
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
                        selectedRoles = selectedRoles.filter(
                            (role) => !(role.username === username && role.roleCode === roleCode)
                        );
                        row.classList.remove('selected');
                    } else {
                        // Select the clicked row and update the selectedRoles array
                        row.classList.add('selected');
                        selectedRoles = [{ username, roleCode }];
                    }
                }
            }

            // Update the last selected row
            lastSelectedRow = row;

            // Log the selectedRoles array
            console.log('Selected Roles:', selectedRoles);
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

    //handle multi selection2 for top half table  end

    // Function to close the role user modal
    function closeRoleUserModal() {
        debugger;
        var roleUserModal = document.getElementById('roleModal');
        userRolesTable.innerHTML = '';  //fix bug of reopen the modal with a new search user empty the old search data for that table
        userTable.innerHTML = '';    //fix bug of reopen the modal with a new search user empty the old search data for that table
        roleUserModal.style.display = 'none';
    }

    // Function to close the role user modal
    function closeRespUserModal() {
        debugger;
        var respUserModal = document.getElementById('respModal');
        userRespsTable.innerHTML = '';  //fix bug of reopen the modal with a new search user empty the old search data for that table
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
        if (selectedRoles.length == 0) {
            alert(`No Roles are selected `);
        } else {
            const requestData = selectedRoles;
            console.log('Roles is:', selectedRoles);

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
        if (selectedRoles.length == 0) {
            alert(`No Roles are selected `);
        } else {
            const requestData = selectedRoles;
            console.log('Roles is:', selectedRoles);

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


});  //end of DOM brackets
//#####################block of search user Role   -  end ##############
const empUserSearchTable = document.getElementById('empUserSearchTable').getElementsByTagName('tbody')[0]; // to handle bug without it table appear with headr at modal apperance but without it  when search and fill data it disappear the header 
const user_nameInput = document.getElementById('userNameSearchInput');
const empnoInput = document.getElementById('empNoSearchInput');

///event listeners start 
// Event listener for the Role seach button
document.getElementById('empUserSearchButton').addEventListener('click', fillSearchUserRoleTable);

//// Event listener for "Enter" key press on the left role search  modal  input
//implement it
///event listeners end

///// Function to manage userroleSearch action
function fillSearchUserRoleTable() {
    const { user_nameValue, empnoValue } = getSearchData();
    fetchSearchUserRoleTable(user_nameValue, empnoValue);

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
    debugger;
    //    	  const requestData = {
    //   	    selectedRoles: selectedRoles, // in case of sent it in shappe of JSONArray as in approches revRoles file approch1
    //    			  
    //      	  };
    if (selectedRolesL.length == 0) {
        alert(`No Roles are selected `);
    } else {
        const requestData = selectedRolesL;
        console.log('Roles is:', selectedRolesL);

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

let selectedRolesL = []; // Array to store selected roles L stands for left table for role search
let lastSelectedRowL = null; // Store the last selected row

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
                selectedRolesL = selectedRolesL.filter(
                    (role) => !(role.username === username && role.roleCode === roleCode)
                );
                row.classList.remove('selected');
            } else {
                // Row is not selected, add it to the selectedRolesL array
                selectedRolesL.push({ username, roleCode });
                row.classList.add('selected');
            }
        } else {
            // Neither Ctrl nor Shift key is pressed
            if (lastSelectedRowL && event.shiftKey) {
                // Shift key is pressed, select rows between last selected and current row
                const rows = userRolesTable.querySelectorAll('tbody tr');
                const startIndex = Array.from(rows).indexOf(lastSelectedRowL);
                const endIndex = Array.from(rows).indexOf(row);

                for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                    const currentRow = rows[i];
                    const currentUsername = currentRow.cells[0].textContent;
                    const currentRoleCode = currentRow.cells[1].textContent;

                    if (!currentRow.classList.contains('selected')) {
                        selectedRolesL.push({ username: currentUsername, roleCode: currentRoleCode });
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
                    selectedRolesL = selectedRolesL.filter(
                        (role) => !(role.username === username && role.roleCode === roleCode)
                    );
                    row.classList.remove('selected');
                } else {
                    // Select the clicked row and update the selectedRolesL array
                    row.classList.add('selected');
                    selectedRolesL = [{ username, roleCode }];
                }
            }
        }

        // Update the last selected row
        lastSelectedRowL = row;

        // Log the selectedRolesL array
        console.log('Selected Roles:', selectedRolesL);
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
    debugger;
    //    	  const requestData = {
    //   	    selectedRoles: selectedRoles, // in case of sent it in shappe of JSONArray as in approches revRoles file approch1
    //    			  
    //      	  };
    if (selectedRolesR.length == 0) {
        alert(`No Roles are selected `);
    } else {
        const requestData = selectedRolesR;
        console.log('Roles is:', selectedRolesR);

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

let selectedRolesR = []; // Array to store selected roles L stands for left table for role search
let lastSelectedRowR = null; // Store the last selected row

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
                selectedRolesR = selectedRolesR.filter(
                    (role) => !(role.username === username && role.roleCode === roleCode)
                );
                row.classList.remove('selected');
            } else {
                // Row is not selected, add it to the selectedRolesL array
                selectedRolesR.push({ username, roleCode });
                row.classList.add('selected');
            }
        } else {
            // Neither Ctrl nor Shift key is pressed
            if (lastSelectedRowR && event.shiftKey) {
                // Shift key is pressed, select rows between last selected and current row
                const rows = empUserSearchTable.querySelectorAll('tbody tr');
                const startIndex = Array.from(rows).indexOf(lastSelectedRowR);
                const endIndex = Array.from(rows).indexOf(row);

                for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                    const currentRow = rows[i];
                    const currentUsername = currentRow.cells[0].textContent;
                    const currentRoleCode = currentRow.cells[1].textContent;

                    if (!currentRow.classList.contains('selected')) {
                        selectedRolesR.push({ username: currentUsername, roleCode: currentRoleCode });
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
                    selectedRolesR = selectedRolesR.filter(
                        (role) => !(role.username === username && role.roleCode === roleCode)
                    );
                    row.classList.remove('selected');
                } else {
                    // Select the clicked row and update the selectedRolesL array
                    row.classList.add('selected');
                    selectedRolesR = [{ username, roleCode }];
                }
            }
        }

        // Update the last selected row
        lastSelectedRowR = row;

        // Log the selectedRolesL array
        console.log('Selected Roles:', selectedRolesR);
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



//#####################block of  search user Role   -  end ##############
//new outside the DOM the resp is copy of the roles   when i close the respmodal thae main search table buttonand design disappear sso i will enter it inside the DOM
//COOOOOOOOOOOOOOOPY to new - implement resp Modal start
// Function to handle edit button click
function respUser(user) {
    // Implement your edit logic here
    usernameRespModal = user.USER_NAME; //assign the value of the global variable
    //alert(`Editing Resp user: ${user.USER_NAME}`);
    // alert(`Editing Resp user: ${usernameRespModal}`);
    openRespUserModal(user)
} const userRespsTable = document.getElementById('userRespsTable').getElementsByTagName('tbody')[0];  // to handle bug without it table appear with headr at modal apperance but without it  when search and fill data it disappear the header


function openRespUserModal(user) {
    usernameRespModal = user.USER_NAME;
    userTable.innerHTML = '';    //fix bug of reopen the modal with a new search user empty the old search data for that table
    userRespsTable.innerHTML = '';   //fix bug of reopen the modal with a new search user empty the old search data for that table
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
    fetch(`http://192.168.101.20:8089/DBOPs/getUserResps`, {
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

    userRespsTable.innerHTML = ''; //clear previous table search this was a bug
    data.forEach(userRole => {
        const row = userRespsTable.insertRow();
        // Add user data to the table cells
        const cells = ['Username', 'Responsibility', 'Application', 'Start_Date', 'End_Date'];  // de same name as json key value must match to get its values not related to table headers names in html  

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




document.getElementById('refreshRespsButton').addEventListener('click', refreshResps); // vip note :can be   can be replaced by two lines to be able to use .click for auto click refreshRolesBut.click();
//     const refreshRolesBut =  document.getElementById('refreshRolesButton') ;
//      refreshRolesBut.addEventListener('click', refreshRoles);

// Function to refresh Role 
function refreshResps() {
    //alert('refresh Role button clicked');
    fetchUserRespModalData(usernameRespModal);

}
//implement resp set end date
document.getElementById('setEndDateButton').addEventListener('click', respSetEndDate); //grant role from table left

function respSetEndDate() {
    alert(`managing user  : ${usernameRespModal}`);
    respSetED();
}
//ajax request to grant Role from search role left table end 
function respSetED() {

    if (selectedResp.length == 0) {
        alert(`No Roles are selected `);
    } else {
        const requestData = selectedResp;
        console.log('Roles is:', selectedResp);

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
                let message = "Granting Status: \n";
                data.forEach(item => {
                    message += `Resp: ${item.Role_Code}   : ${item.Status} \n`;
                });
                alert(message);
                // block to parse the json objects returned and display them along  with thier status on the screen-END
                console.log(usernameRespModal);
                refreshRoles();   //to refresh tophalp tablee after granting  BUG notWorking check it .
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error:', error);
            });
    }

}