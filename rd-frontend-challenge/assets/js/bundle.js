(() => {
    const selector = selector => document.getElementById(selector);
    const create = element => document.createElement(element)

    const app = selector('app');
    const Login = create('div');
    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');

    Form.onsubmit = async e => {
        e.preventDefault();
        const [email, password] = e.target

        const {url} = await fakeAuthenticate(email.value, password.value);

        location.href='#users';
        
        const users = await getDevelopersList(url);
        renderPageUsers(users);
    };

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;
        (!email.validity.valid || !email.value || password.value.length <= 5) 
            ? button.setAttribute('disabled','disabled')
            : button.removeAttribute('disabled');
    };

    Form.innerHTML =    '<input type="text" id="email" name="email" />' + 
                        '<input type="password" id="password" name="password" />' + 
                        '<input type="submit" id="button" name="button" />' 
    

    app.appendChild(Logo);
    Login.appendChild(Form);

    async function fakeAuthenticate(email, password) {
        const headers = { 
            'Access-Control-Allow-Origin': '*'
        }
        let response  = await fetch('http://www.mocky.io/v2/5de18e6e320000005c809483', { headers: headers });
        // problema de cors no método acima
        // let data = response.json();
        let data = {
            url: "http://www.mocky.io/v2/5dba68fb3000007400028eb5"
        }
        const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;
        localStorage.setItem('token', fakeJwtToken)

        return data;
    }

    async function getDevelopersList(url) {
        const headers = { 
            'Access-Control-Allow-Origin': '*'
        }
        let response  = await fetch('http://www.mocky.io/v2/5dba68fb3000007400028eb5', { headers: headers });
        let users = await response.json();
        return users
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = "none"; /* trecho omitido */

        const Ul = create('ul');
        Ul.classList.add('container')
        for (let item of users) {
            Ul.innerHTML += '<li><img src="' + item.avatar_url + '" />'+ item.login + '</li>';
        }

        app.appendChild(Ul)
    }

    // init
    (async function(){
        const rawToken = localStorage.getItem('token')
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href='#login';
            app.appendChild(Login);
        } else {
            location.href='#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()