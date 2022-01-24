import { Router } from "@vaadin/router";
import { state } from "../state";

const logo = require("url:../img/logo-pata.png");
const burgerMenuImg = require("url:../img/burger-menu.png");
const xButton = require("url:../img/Vector.png");

class Login extends HTMLElement {

    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open'});
    }
    connectedCallback() {
        this.render();
    }
    render() {

        const currentState = state.getState();
        const divEl = document.createElement('div');
        divEl.className = 'general-container';
        const style = document.createElement('style');

        style.innerHTML = `
        .header {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            background-color: #FF6868;
            justify-content: space-between;
        }
        .menu {
            width: 40px;
        }
        .img {
            padding: 0 30px;
        }
        .main-body {
            display: flex;
            flex-direction: column;
        }
        .title {
            font-size: 40px;
            align-self: center;
        }
        .form {
            display: flex;
            align-self: center;
            flex-direction: column;
            justify-content: center;
        }
        .password-zone {
            align-self: center;
            justify-content: center;
        }
        .password {
            margin-left: 5px;
        }
        .input-password {
            width: 335px;
            height: 50px;
            padding-left: 10px;
            border-radius: 4px;
            border: 1px solid #000000;
        }
        .contraseña-olvidada {
            display: flex;
            color: #40AFFF;
            align-self: center;
            justify-content: center;
            text-decoration-line: underline;
        }
        .button {
            width: 335px;
            height: 50px;
            font-size: 18px;
            margin-top: 10px;
            border-radius: 4px;
            border-style: none;
            align-self: center;
            background-color: #FF9DF5;
        }

        `;

        divEl.innerHTML = `
            <header class="header">
                <img class="img" src="${logo}" alt="logo">
                <img class="img menu" src="${burgerMenuImg}" alt="menu" >
            </header>
            <div class="main-body">
                <h2 class="title"> Ingresar </h2>
                <form class="form">
                    <label class="password-zone">
                        <p class="password"> Contraseña </p>
                        <input class="input-password" type="text" placeholder=" Password" />
                        <p class="contraseña-olvidada"> Olvidé mi contraseña </p>
                    </label>
                    <button class="button"> Ingresar </button>
                </form>
            </div>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);

        const formEl = this.shadow.querySelector('.form');
        formEl.addEventListener('submit', (e) => {
            e.preventDefault();

            const passwordInput = (this.shadow.querySelector('.input-password') as HTMLInputElement);
            state.signInUser(passwordInput.value, () => {

                Router.go(`${currentState['locationBefore']}`);
            });
            
        });

        const contraseñaOlvidada = this.shadow.querySelector('.contraseña-olvidada');
        contraseñaOlvidada.addEventListener('click', (e) => {
            e.preventDefault();
            Router.go('/recuperar-contraseña');
        });
    }
}

customElements.define('login2-page', Login);