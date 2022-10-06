// Begin Page Specific Functions

$(document).on('click','#btnAddAccount', function(){
let blnError = false;
let strErrorMessage = '';

if($('#txtFirstName').val().length < 1 || $('#txtLastName').val().length < 1 || $('#txtEmail').val().length < 1 || $('#txtPassword').val().length < 1 || $('#txtVerifyPassword').val().length < 1){
    blnError = true;
    strErrorMessage += '<p>You must enter all information</p>';
}

if(doPasswordsMatch($('#txtPassword').val(), $('#txtVerifyPassword').val()) == false){
    blnError = true;
    strErrorMessage += '<p>Passwords must match</p>';
}

if(isValidEmail($('#txtEmail').val()) == false){
    blnError = true;
    strErrorMessage += '<p>Email must be real</p>';
}

if(isValidPassword($('#txtPassword').val()) == false){
    blnError = true;
    strErrorMessage += '<p>Password must be complex</p>';
}

if(blnError == true){
    Swal.fire({
        icon: 'error',
        html: strErrorMessage
    })
} else{
    $.post('https://www.swollenhippo.com/DS3870/Comics/createAccount.php',{strEmail:$('#txtEmail').val(), strFirstName:$('#txtFirstName').val(), strLastName:$('#txtLastName').val(), strPassword:$('#txtPassword').val()})
    .done(function(result){
        let objResult = JSON.parse(result);
        if(objResult.Outcome == 'New User Create'){
            Swal.fire({
                icon: 'success',
                html: '<p>Account Created</p>'
            })
        }
    })
}


})

$(document).on('click','#btnAddCharacter', function(){
    if($('#txtCharacterName').val().length < 1 || $('#txtSuperPower').val().length < 1 || $('#txtLocation').val().length < 1){
        Swal.fire({
            icon: 'error',
            html: '<p>Missing required info</p>'
        })
    } else {
        $.post('https://www.swollenhippo.com/DS3870/Comics/addCharacter.php',{strSessionID:sessionStorage.getItem('CharacterSession'), strName:$('#txtCharacterName').val(), strSuperPower:$('#txtSuperPower').val(), strLocation:$('#txtLocation').val(), strStatus:$('#txtStatus').val()})
        .done(function(result){
            fillCharacterTable();
            clearCharacterFields();
        })
    }
})

$(document).on('click','#btnLogin', function(){
    let blnError = false;
    let strErrorMessage = '';
    if(!$('#txtEmail').val()){
        blnError = true;
        strErrorMessage += '<p>Please provide an email address to continue</p>';
    }
    if(!$('#txtPassword').val()){
        blnError = true;
        strErrorMessage += '<p>Please provide your password to continue</p>';
    }
    if(blnError == true){
        Swal.fire({
            icon: 'error',
            title: 'Missing Data',
            html: strErrorMessage
        }) 
    } else{
        $.post('https://www.swollenhippo.com/DS3870/Comics/createSession.php',{strEmail:$('#txtEmail').val(),strPassword:$('#txtPassword').val()},function(result){
        objResult = JSON.parse(result);    
        if(objResult.Outcome != 'Login Failed'){
                // set your Session Storage Item here
                sessionStorage.setItem('CharacterSession',objResult.Outcome);

                // then redirect the user to the dashboard
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    html: '<p>The provided username and password did not match any in our database</p>'
                })
            }
        })
    }
})

$(document).on('click','#btnToggleExisting', function(){

})


function clearCreateAccountPage(){
    $('#txtFirstName').val('');
    $('#txtLastName').val('');
    $('#txtEmail').val('');
    $('#txtPassword').val('');
    $('#txtVerifyPassword').val('');
}

function clearCharacterFields(){
    $('#txtCharacterName').val('');
    $('#txtSuperPower').val('');
    $('#txtLocation').val('');
    $('#selectStatus').val('Active').trigger('change');
}

function fillCharacterTable(){
    $('#tblCharacters tbody').empty();
    let strCurrentSessionID = sessionStorage.getItem('CharacterSession');
    $.getJSON('https://www.swollenhippo.com/DS3870/Comics/getCharacters.php',{strSessionID:strCurrentSessionID},function(result){
        $.each(result,function(i,superhero){
            let strTableHTML = '<tr><td>' + superhero.Name + '</td><td>' + superhero.SuperPower + '</td><td>' + superhero.Location + '</td><td>' + superhero.Status + '</td></tr>';
            $('#tblCharacters tbody').append(strTableHTML);
        })
    })
}

// End Page Specific Functions


// Begin Helper Functions
function isValidEmail(strEmailAddress){
    let regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return regEmail.test(strEmailAddress);
}

function isValidPassword(strPassword){
    let regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,64}$/;
    return regPassword.test(strPassword);
}

function doPasswordsMatch(strPassword, strVerifyPassword){
    if(strPassword == strVerifyPassword){
        return true;
    } else {
        return false;
    }
}
// End Helper Functions

// Begin Universal Functions
function verifySession(){
    if(sessionStorage.getItem('CharacterSession')){
        let strCurrentSessionID = sessionStorage.getItem('CharacterSession')
        $.getJSON('https://www.swollenhippo.com/DS3870/Test1/verifySession.php', {strSessionID: strCurrentSessionID}, function(result){
            if(result.Outcome != 'Valid Session'){
                return false;
            } else {
                return true;
            }
        })
    } else {
        return false;
    }
}
// End Universal Functions

