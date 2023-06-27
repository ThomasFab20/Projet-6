const user = {email: 'sophie.bluel@test.tld', password: 'S0phie'}
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const form = document.querySelector('#login_form');
const submitBtn = document.querySelector('#connection');
const errorMessage = document.querySelector('.error-message')

async function fetchPost(){
    let response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            });
            let result = await response.json();
            window.localStorage.setItem('token', result.token)
            console.log(result);
}

form.addEventListener('submit', function(form){
    form.preventDefault();
})

submitBtn.addEventListener('click', function(){
    if(email.value === user.email && password.value === user.password){
        errorMessage.innerText = ""
        fetchPost();
        form.submit();
    }
    else{
        errorMessage.innerText = "L'email ou le mot de passe est incorrect"
    };
})


const token = window.localStorage.getItem('token');
console.log(token)