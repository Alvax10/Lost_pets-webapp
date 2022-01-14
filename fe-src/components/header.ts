import { Router } from "@vaadin/router";
import { state } from "../state";

const logo = require("url:../img/logo-pata.png");
const burgerMenu = require("url:../img/burger-menu.png");
const xButton = require("url:../img/Vector.png");

export class Header extends HTMLElement {

    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
    }
    listeners() {

        const currentState = state.getState();
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
                align-self: flex-end;
            }
            .opciones {
                align-self: center;
                justify-content: center;
            }
            .mis-datos {
                padding-left: 6px;
            }
            .reportar-mascotas {
                padding-left: 30px;
            }
            .sesion {
                display: flex;
                padding-top: 40%;
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
                <h3 class="mis-datos"> Mis Datos / Registrarse </h3>
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
    
                if (currentState["email"] == '') {

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
                    <button class="login-button"> Loguearme </button>
                `;  
    
                    this.shadow.appendChild(divNotification);
                    this.shadow.appendChild(notificationStyle);
    
                    const loginButton = this.shadow.querySelector('.login-button');
                    loginButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        Router.go("/login-1");
                    });

                } else {
            
                    const myData = this.shadow.querySelector('.mis-datos');
                    myData.addEventListener('click',(e) => {
                        e.preventDefault();
            
                        Router.go("/mis-datos/registrarse");
                    });
            
                    const myMascotsReported = this.shadow.querySelector('.mis-mascotas-reportadas');
                    myMascotsReported.addEventListener('click',(e) => {
                        e.preventDefault();
            
                        Router.go("/mis-mascotas-reportadas");
                    });
            
                    const reportMascot = this.shadow.querySelector('.reportar-mascotas');
                    reportMascot.addEventListener('click',(e) => {
                        e.preventDefault();
            
                        Router.go("/reportar-mascota");
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
    render() {

        const divEl = document.createElement('div');
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
        `;

        divEl.innerHTML = `
            <header class="header">
                <img class="img" src="${logo}" alt="logo">
                <img class="img menu" src="${burgerMenu}" alt="menu" >
            </header>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);
        this.listeners();
    }
}

customElements.define('header-component', Header);