import { Router } from "@vaadin/router";
import { state } from "../state";

const logo = require("url:../img/logo-pata.png");
const burgerMenu = require("url:../img/burger-menu.png");
const xButton = require("url:../img/Vector.png");

class Home extends HTMLElement {

    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();

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
                padding-left: 62px;
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

                    burgerMenu.addEventListener('click', (e) => {
                        e.preventDefault();
        
                        menuStyle.innerHTML = `
                            .menu-open {
                                display: inherit;
                            }
                        `;
                    });
            
                    const myData = this.shadow.querySelector('.mis-datos');
                    myData.addEventListener('click',(e) => {
                        e.preventDefault();
            
                        if (currentState["email"] == '') {
            
                            const location = currentState['locationBefore'] = "/mis-datos";
                            console.log(location);
                            console.error('Necesitas loguearte para acceder a los datos');
                        } else {
            
                            Router.go("/mis-datos");
                        }
                    });
            
                    const myMascotsReported = this.shadow.querySelector('.mis-mascotas-reportadas');
                    myMascotsReported.addEventListener('click',(e) => {
                        e.preventDefault();
            
                        if (currentState["email"] == '') {
            
                            const location = currentState['locationBefore'] = "/mis-mascotas-reportadas";
                            console.log(location);
                            console.error('Necesitas loguearte para acceder a tus mascotas');
                        } else {
            
                            Router.go("/mis-mascotas-reportadas");
                        }
                    });
            
                    const reportMascot = this.shadow.querySelector('.reportar-mascotas');
                    reportMascot.addEventListener('click',(e) => {
                        e.preventDefault();
            
                        if (currentState["email"] == '') {
            
                            currentState['locationBefore'] = "/reportar-mascota";
                            console.error('Necesitas loguearte para acceder a tus mascotas');
                        } else {
                            
                            console.log(currentState["email"]);
                            Router.go("/reportar-mascota");
                        }
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

            burgerMenu.addEventListener('click', (e) => {
                e.preventDefault();

                menuStyle.innerHTML = `
                    .menu-open {
                        display: inherit;
                    }
                `;
            });
    
            const myData = this.shadow.querySelector('.mis-datos');
            myData.addEventListener('click',(e) => {
                e.preventDefault();
    
                if (currentState["email"] == '') {
    
                    const location = currentState['locationBefore'] = "/mis-datos";
                    console.log(location);
                    console.error('Necesitas loguearte para acceder a los datos');
                } else {
    
                    Router.go("/mis-datos");
                }
            });
    
            const myMascotsReported = this.shadow.querySelector('.mis-mascotas-reportadas');
            myMascotsReported.addEventListener('click',(e) => {
                e.preventDefault();
    
                if (currentState["email"] == '') {
    
                    const location = currentState['locationBefore'] = "/mis-mascotas-reportadas";
                    console.log(location);
                    console.error('Necesitas loguearte para acceder a tus mascotas');
                } else {
    
                    Router.go("/mis-mascotas-reportadas");
                }
            });
    
            const reportMascot = this.shadow.querySelector('.reportar-mascotas');
            reportMascot.addEventListener('click',(e) => {
                e.preventDefault();
    
                if (currentState["email"] == '') {
    
                    currentState['locationBefore'] = "/reportar-mascota";
                    console.error('Necesitas loguearte para acceder a tus mascotas');
                } else {
                    
                    console.log(currentState["email"]);
                    Router.go("/reportar-mascota");
                }
            });
        });

        const generalContainer = this.shadow.querySelector('.main-body');
        generalContainer.addEventListener('click', () => {

            if (currentState["email"] == '') {
    
                const divNotification = document.createElement('div');
                divNotification.className = 'notification';
                const notificationStyle = document.createElement('style');
    
                notificationStyle.innerHTML = `
                .notification {
                    top: 40%;
                    left: 30%;
                    width: 250px;
                    height: 90px;
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
                    <h3 class="alert"> Necesitas estar logeado para reportar mascotas! </h3>
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
                console.log(currentState["email"]);
            }
        });
    }
    listeners() {

        this.shadow.querySelectorAll(".pet").forEach((petSeen) => {

            petSeen.addEventListener("report", (e) => {
    
                const reportNotification = document.createElement("div");
                reportNotification.className = "notification-pet-seen"
                const reportNotificationStyle = document.createElement("style");
                            
                reportNotification.innerHTML = `
    
                    <img src="${xButton}" class="close-button" alt="cierre-menu" />
                    <h2 class="title"> Reportar info de ${e["detail"]["petName"]}</h2>
                    <form class="form">
        
                        <label class="user-name">
                            <p> Tu Nombre </p>
                            <input class="input__user-name" type="text" />
                        </label>
                                    
                        <label class="user-phone">
                            <p> Tu Teléfono </p>
                            <input class="input__user-phone" type="number" />
                        </label>
                        <label class="user-info">
                            <p> ¿Donde lo viste? </p>
                            <textarea class="input__user-info"> Depositar calle o barrio </textarea>
                        </label>
                            <button class="button"> Enviar </button>
                        </form>
                    `;
    
                    reportNotificationStyle.innerHTML = `
                    .general-container {
                        background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
                    }
                    .pets-reported {
                        background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
                    }
                    .notification-pet-seen {
                        top: 20%;
                        left: 30%;
                        width: 314px;
                        height: 603px;
                        display: inherit;
                        position: absolute;
                        border-radius: 4px;
                        background: #FFFFFF;
                    }
                    .close-button {
                        width: 30px;
                        height: 30px;
                        padding: 20px;
                        margin-left: 77%;
                    }
                    .title {
                        text-align: center;
                    }
                    .form {
                        display: flex;
                        margin-left: 10px; 
                        flex-direction: column;
                    }
                    .input__user-name {
                        width: 280px;
                        height: 30px;
                        border-radius: 4px;
                        border: 2px solid #000000;
                    }
                    .input__user-phone {
                        width: 280px;
                        height: 30px;
                        border-radius: 4px;
                        border: 2px solid #000000;
                    }
                    .input__user-info {
                        width: 280px;
                        height: 60px;
                        border-radius: 4px;
                        border: 2px solid #000000;
                    }
                    .button {
                        width: 280px;
                        height: 40px;
                        border: none;
                        margin-top: 10px;
                        margin-left: 5px;
                        border-radius: 4px;
                        background-color: #FF9DF5;
                    }
                `;
        
                this.shadow.appendChild(reportNotification);
                this.shadow.appendChild(reportNotificationStyle);
        
                const closeButton = this.shadow.querySelector(".close-button");
                closeButton.addEventListener('click', (e) => {
                    e.preventDefault();
        
                    reportNotificationStyle.innerHTML = `
                    .notification-pet-seen {
                        display: none;
                    }
                    `;
                });

                const currentState = state.getState();
                const userEmail = currentState["email"];
                const sendPetSeenInfo = this.shadow.querySelector(".button");
                const numeroDelUsuario = this.shadow.querySelector(".input__user-phone");

                sendPetSeenInfo.addEventListener('submit', (event) => {
                    event.preventDefault();

                    state.sendEmailWithInfo(e["petLocationName"], e["email"], e["petName"], userEmail, numeroDelUsuario);
                });
            });
        })
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
            align-items: center;
        }
        .title {
            font-size: 40px;
            margin: 40px 20px;
        }
        `;

        divEl.innerHTML = `
            <header class="header">
                <img class="img" src="${logo}" alt="logo">
                <img class="img menu" src="${burgerMenu}" alt="menu" >
            </header>
            <div class="main-body">
                <h2 class="title"> Mascotas perdidas cerca tuyo </h2>
                <div class="lost-pets"></div>
            </div>

        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);

        const lostPets = this.shadow.querySelector(".lost-pets");
        const lostPetsStyle = document.createElement("style");

        
        state.mascotCloseFrom();
        if (currentState["lostPetsAround"].length == 0) {
    
            lostPets.innerHTML = `
        
                <h2 class="title-mascots"> No hay mascotas reportadas cerca tuyo </h2>
                <button class="button"> Reportar mascota </button>
            `;

            lostPetsStyle.innerHTML = `
                .lost-pets {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .title {
                    align-self: center;
                }
                .button {
                    width: 335px;
                    border: none;
                    height: 50px;
                    border-radius: 4px;
                    align-self: center;
                    background-color: #FF9DF5;
                }
            `;
    
            const reportButton = this.shadow.querySelector(".button");
            reportButton.addEventListener('click', (e) => {
                e.preventDefault();
    
                Router.go("/reportar-mascota");
            });
    
        } else {
    
            lostPets.innerHTML = `
        
            ${currentState["lostPetsAround"].map((pet) => 
                            
                `<lost-pet-card class="pet" pet-location-name=${pet["location"]["name"]} pet-photo="${pet["imageDataURL"]}" pet-name=${pet["name"]}></lost-pet-card>`
                
            ).join("")}`;

            lostPetsStyle.innerHTML = `
                .lost-pets {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .reported-mascots {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .pets-reported {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }
                .lost-pet {
                    width: 330px;
                    height: 230px;
                    display: grid;
                    margin-top: 20px;
                    border-radius: 4px;
                    border: 2px solid #000000;
                    grid-template-columns: 240px 90px;
                    grid-template-rows: 150px 80px;
                }
                .pet-photo {
                    width: 325px;
                    border: none;
                    height: 150px;
                    border-radius: 4px;
                }
                .pet-name {
                    font-size: 18px;
                    font-weight: 400;
                    padding-left: 10px;
                    grid-column-start: 1;
                    grid-column-end: 2;
                    grid-row-start: 2;
                    grid-row-end: 3;
                }
                .pet-location {
                    padding-left: 10px;
                    grid-column-start: 1;
                    grid-column-end: 2;
                    grid-row-start: 2;
                    grid-row-end: 3;
                    margin-top: 55px;
                }
                .pet-seen {
                    margin-right: 20px;
                    color: #3E91DD;
                    margin-top: 35px;
                    grid-row-start: 2;
                    grid-row-end: 3;
                    text-decoration: underline;
                }
            `;
        }
        this.shadow.appendChild(lostPetsStyle);
        this.listeners();
    }
}

customElements.define('home-page', Home);