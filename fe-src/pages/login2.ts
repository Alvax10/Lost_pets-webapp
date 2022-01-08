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

        currentState['locationBefore'] = "/home";
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

        const burgerMenu = this.shadow.querySelector(".menu");
        burgerMenu.addEventListener('click', () => {

            const menuDiv = document.createElement('div');
            menuDiv.className = 'menu-open';

            const menuStyle = document.createElement('style');
            menuStyle.innerHTML = `
            .menu-open {
                top: 0%;
                left: 0%;
                width: 100%;
                height: 100%;
                display: flex;
                position: absolute;
                flex-direction: column;
                background-color: #8AF1FF;
            }
            .close-button {
                width: 30px;
                height: 30px;
                padding: 20px;
                align-self  : flex-end;
            }
            .opciones {
                align-self: center;
                justify-content: center;
            }
            .mis-datos {
                padding-left: 62px;
            }
            .reportar-mascotas {
                padding-left: 30px;
            }
            .sesion {
                display: flex;
                padding-top: 47%;
                flex-direction: column;
                justify-content: center;
            }
            .email {
                margin: 0px;
                align-self: center;
                justify-content: center;
            }
            .cerrar-sesion {
                color: #C6558B;
                align-self: center;
                justify-content: center;
                text-decoration-line: underline;
            }
            `;

            menuDiv.innerHTML = `
            <img class="close-button" src="${xButton}" alt="x-button">
            <div class="opciones">
                <h3 class="mis-datos"> Mis Datos </h3>
                <h3 class="mis-mascotas-reportadas"> Mis mascotas reportadas </h3>
                <h3 class="reportar-mascotas"> Reportar mascotas </h3>
            </div>
            <div class="sesion">
                <p class="email"> ${currentState["email"]} </p>
                <p class="cerrar-sesion"> Cerrar sesión </p>
            </div>
            `;

            this.shadow.appendChild(menuDiv);
            this.shadow.appendChild(menuStyle);

            const menuOpen = this.shadow.querySelector('.menu-open');
            menuOpen.addEventListener('click', (e) => {
                e.preventDefault();

                if (state.data.username == '' && state.data.email == '') {

                    const divNotification = document.createElement('div');
                    divNotification.className = 'notification';
                    const notificationStyle = document.createElement('style');
    
                    notificationStyle.innerHTML = `
                    .notification {
                        top: 30%;
                        left: 15%;
                        width: 250px;
                        height: 115px;
                        border-radius: 4px;
                        padding: 10px 10px;
                        position: absolute;
                        background-color: #FF6868;
                    }
                    .alert {
                        font-size: 24px;
                    }
                    .login-button {
                        width: 270px;
                        height: 50px;
                        margin: -5px -10px;
                        border-style: none;
                        border-radius: 4px;
                        background-color: #FF9DF5;
                    }
                    `;
                    divNotification.innerHTML = `
                        <h3 class="alert"> Necesitas estar logeado para acceder a estos features! </h3>
                        <button class="login-button"> Ok </button>
                    `;

                    this.shadow.appendChild(divNotification);
                    this.shadow.appendChild(notificationStyle);

                    const loginButton = this.shadow.querySelector('.login-button');
                    loginButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        notificationStyle.innerHTML = `
                        .notification {
                            display: none;
                        }
                        `;
                    });
                }
            });
            
            const closeButton = this.shadow.querySelector('.close-button');
            closeButton.addEventListener('click',(e) => {
                e.preventDefault();

                menuStyle.innerHTML = `
                    .menu-open {
                        display: none;
                    }
                `;
            });
        });
    }
}

customElements.define('login2-page', Login);