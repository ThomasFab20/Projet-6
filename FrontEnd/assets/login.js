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
            if(response.ok === true){
                let result = await response.json();
                localStorage.setItem('token', result.token)
                localStorage.setItem('userId', result.userId)
                console.log(result);
                form.submit()
            }
            else{
                throw new Error('Impossible de contacter la base de donnée des utilisateurs')
            }
}


submitBtn.addEventListener('click', function(){
    form.addEventListener('submit', function(form){
        form.preventDefault()
    });
    if(email.value === user.email && password.value === user.password){
        errorMessage.innerText = ""
        fetchPost();  
    }
    else{
        errorMessage.innerText = "L'email ou le mot de passe est incorrect"
    };
})

export const token = localStorage.getItem('token')
export const userId = localStorage.getItem('userId')






