$('#btnLogin').on('click', function(){
    let strUsername = $('#txtUsername').val();
    let strPassword = $('#txtPassword').val();
    console.log(strUsername);
    console.log(strPassword);
    if(strUsername && strPassword){
        alert(strUsername + ' entered the password ' + strPassword);
    }
})