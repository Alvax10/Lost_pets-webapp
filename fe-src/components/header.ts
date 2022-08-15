import { Router } from "@vaadin/router";
import { state } from "../state";
import swal from "sweetalert";

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
        const { token } = currentState;
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-open';

        const menuStyle = document.createElement('style');
        menuStyle.innerHTML = `
                .menu-open {
                    display: none;
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

        const burgerHamMenu = this.shadow.querySelector(".menu") as any;
        burgerHamMenu.addEventListener('click', (ev) => {
            ev.preventDefault();

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
                    cursor: pointer;
                    align-self: flex-end;
                }

                .opciones {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-self: center;
                    justify-content: center;
                }

                .mis-datos {
                    cursor: pointer;
                    padding-left: 6px;
                }

                .mis-mascotas-reportadas {
                    cursor: pointer;
                }

                .reportar-mascotas {
                    cursor: pointer;
                    padding-left: 30px;
                }

                .sesion {
                    display: flex;
                    padding-top: 200px;
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
                    cursor: pointer;
                    align-self: center;
                    justify-content: center;
                    text-decoration-line: underline;
                }

                @media (min-width: 900px) {
                    .sesion {
                        padding-top: 300px;
                    }
                }
            `;

        });

        const myData = this.shadow.querySelector('.mis-datos') as any;
        myData.addEventListener('click', (e) => {
            e.preventDefault();

            if (!token) {

                currentState["locationBefore"] = "/mis-datos/registrarse";
                swal({
                    title: "Ups..",
                    text: "Debes estar logueado para seguir!",
                    icon: "error",
                }).then(() => Router.go("/login-1"));

            }
            else {
                Router.go("/mis-datos/registrarse")
            }
        });

        const myMascotsReported = this.shadow.querySelector('.mis-mascotas-reportadas') as any;
        myMascotsReported.addEventListener('click', (e) => {
            e.preventDefault();

            if (!token) {

                currentState["locationBefore"] = "/mis-mascotas-reportadas";
                swal({
                    title: "Ups..",
                    text: "Debes estar logueado para seguir!",
                    icon: "error",
                }).then(() => Router.go("/login-1"));

            } else {
                Router.go("/mis-mascotas-reportadas");
            }
        });

        const reportMascot = this.shadow.querySelector('.reportar-mascotas') as any;
        reportMascot.addEventListener('click', (e) => {
            e.preventDefault();

            if (!token) {

                currentState["locationBefore"] = "/reportar-mascota";
                swal({
                    title: "Ups..",
                    text: "Debes estar logueado para seguir!",
                    icon: "error",
                }).then(() => Router.go("/login-1"));

            } else {
                Router.go("/reportar-mascota");
            }
        });

        const closeButton = this.shadow.querySelector(".close-button") as any;
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();

            menuStyle.innerHTML = `
                .menu-open {
                    display: none;
                }
                .close-button {
                    cursor: pointer;
                }
            `;
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
            cursor: pointer;
            padding: 0 30px;
        }
        `;

        divEl.innerHTML = `
            <header class="header">
                <img class="img logo" style="cursor: pointer;" src="${logo}" alt="logo">
                <img class="img menu" src="${burgerMenu}" alt="menu" >
            </header>
        `;

        this.shadow.appendChild(style);
        this.shadow.appendChild(divEl);
        this.listeners();

        const logoHome = this.shadow.querySelector(".logo") as any;
        logoHome.addEventListener('click', (e) => {
            e.preventDefault();
            Router.go("/home");
        });
    }
}

customElements.define('header-component', Header);