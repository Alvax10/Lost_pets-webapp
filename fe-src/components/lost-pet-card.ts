import { Router } from "@vaadin/router";
import { state } from "../state";
const xButton = require("url:../img/Vector.png");

export class Card extends HTMLElement {

    shadow: ShadowRoot;
    petName;
    petPhoto;
    petLocationName;
    constructor() {

        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.petName = this.getAttribute("pet-name");
        this.petPhoto = this.getAttribute("pet-photo");
        this.petLocationName = this.getAttribute("pet-location-name");
    }
    connectedCallback() {
        this.render();
    }
    listeners() {

        const currentState = state.getState();
        const { token } = currentState;
        const reportNotification = document.createElement("div");
        reportNotification.className = "notification-pet-seen"
        const reportNotificationStyle = document.createElement("style");

        (this.shadow.querySelector(".pet-seen") as HTMLButtonElement).addEventListener('click', () => {

            const CustomPetEvent = new CustomEvent('report', {
                detail: {
                    petName: this.petName,
                    petPhoto: this.petPhoto,
                    petLocationName: this.petLocationName,
                    email: currentState["email"],
                },
                bubbles: true
                // esto hace que el evento pueda
                // ser escuchado desde un elemento
                // que está más "arriba" en el arbol
            });

            const lostPets = this.shadow.querySelectorAll(".lost-pet");
            lostPets.forEach((lostPet) => {

                const petSeen = lostPet.querySelector(".pet-seen") as HTMLButtonElement;
                petSeen.addEventListener('report', (e) => {
                    e.preventDefault();

                    reportNotification.innerHTML = `
                    <img src=${xButton} class="close-button" alt="cierre-menu" />
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
                            <textarea class="input__user-info" placeholder="Depositar calle o barrio" ></textarea>
                        </label>
                        <button class="button sendPetInfo"> Enviar </button>
                    </form>
                `;

                    reportNotificationStyle.innerHTML = `
                    .notification-pet-seen {
                        top: 20%;
                        left: 30%;
                        width: 314px;
                        height: 603px;
                        position: fixed;
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

                    const closeButton = this.shadow.querySelector(".close-button") as HTMLButtonElement;
                    closeButton.addEventListener('click', (e) => {
                        e.preventDefault();

                        reportNotificationStyle.innerHTML = `
                        .notification-pet-seen {
                            display: none;
                        }
                    `;
                    });

                    const numeroDelUsuario = (this.shadow.querySelector(".input__user-phone") as HTMLInputElement);
                    const newLocation = (this.shadow.querySelector(".input__user-info") as HTMLInputElement);
                    const sendPetSeenInfo = this.shadow.querySelector(".form") as HTMLFormElement;
                    const divNotification = document.createElement('div');
                    divNotification.className = 'notification';
                    const notificationStyle = document.createElement('style');

                    sendPetSeenInfo.addEventListener('submit', (ev) => {
                        ev.preventDefault();

                        if (!token) {

                            divNotification.innerHTML = `
                                <h3 class="alert"> Necesitas estar logeado para acceder a estos features! </h3>
                                <button class="login-button"> Loguearme </button>
                            `;

                            this.shadow.appendChild(divNotification);
                            this.shadow.appendChild(notificationStyle);

                            notificationStyle.innerHTML = `
                                .notification {
                                    top: 40%;
                                    left: 25%;
                                    width: 250px;
                                    height: 115px;
                                    border-radius: 4px;
                                    padding: 10px 10px;
                                    position: fixed;
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
                                @media (min-width: 800px) {
                                    .notification {
                                        left: 35%;
                                    }
                                }
                                @media (min-width: 900px) {
                                    .notification {
                                        top: 40%;
                                        left: 45%;
                                    }
                                }
                            `;

                            const loginButton = this.shadow.querySelector('.login-button') as HTMLButtonElement;
                            loginButton.addEventListener('click', (e) => {
                                e.preventDefault();
                                currentState["locationBefore"] = "/home";
                                Router.go("/login-1");
                            });

                        } else {

                            // console.log(newLocation.value, OtherUserEmail.value, e["detail"]["petName"], currentState["email"], numeroDelUsuario.value);

                            state.sendEmailWithInfo(e["detail"]["petName"], newLocation.value, currentState["email"], numeroDelUsuario.value);
                            console.log("Email enviado! :D");
                            reportNotificationStyle.innerHTML = `
                                .notification-pet-seen {
                                    display: none;
                                }
                            `;
                        }
                    });
                });
                petSeen.dispatchEvent(CustomPetEvent);
            });
        });
    }
    render() {

        const divEl = document.createElement("div");
        const divStyle = document.createElement("style");
        divEl.innerHTML = `

            <div class="lost-pet">
                <img class="pet-photo" src=${this.petPhoto} alt="imagen de la mascota" />
                <h3 class="pet-name"> Nombre: ${this.petName} </h3>
                <p class="pet-location"> Ubicación: ${this.petLocationName} </p>
                <p class="pet-seen"> Reportar informacion </p>
            </div>
        `;

        divStyle.innerHTML = `
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
                box-shadow: 5px 5px peachpuff;
                grid-template-rows: 150px 80px;
                grid-template-columns: 240px 90px;
            }
            .pet-photo {
                width: 330px;
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

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(divStyle);
        this.listeners();
    }
}
customElements.define("lost-pet-card", Card);