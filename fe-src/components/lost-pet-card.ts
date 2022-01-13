import { state } from "../state";
import { Router } from "@vaadin/router";
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
        const reportPetSeen = this.shadow.querySelector(".pet-seen").addEventListener('click', () => {

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

            const reportedMascotsEl = this.shadow.querySelectorAll(".lost-pet");
            reportedMascotsEl.forEach((reportedMascot) => {

            const petSeen = reportedMascot.querySelector(".pet-seen")
            petSeen.addEventListener('report', (e) => {
                e.preventDefault();
    
                const reportedMascotsEl = this.shadow.querySelectorAll(".lost-pet");
                reportedMascotsEl.forEach((reportedMascot) => {
                        
                    const petSeenReported = reportedMascot.querySelector(".pet-seen");
                    petSeenReported.addEventListener('click', (ev) => {

                        const reportNotification = document.createElement("div");
                        reportNotification.className = "notification-pet-seen"
                        const reportNotificationStyle = document.createElement("style");
                        reportNotification.innerHTML = `
                    
                        <img src=${xButton} class="close-button" alt="cierre-menu" />
                        <h2 class="title"> Reportar info de ${e["detail"]["petName"]}</h2>
                        <form class="form">
                            <label class="user-name">
                                <p> Tu Email </p>
                                <input class="input__user-email" type="text" />
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
                            .input__user-email {
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
                            const OtherUserEmail = (this.shadow.querySelector(".input__user-email") as HTMLInputElement);
                            const numeroDelUsuario = (this.shadow.querySelector(".input__user-phone") as HTMLInputElement);
                            const newLocation = (this.shadow.querySelector(".input__user-info") as HTMLInputElement);
                            const sendPetSeenInfo = this.shadow.querySelector(".button");
                                    
                            sendPetSeenInfo.addEventListener('submit', (event) => {
                                event.preventDefault();
                                
                                console.log(newLocation.value, OtherUserEmail.value, e["detail"]["petName"], userEmail, numeroDelUsuario.value);
                                state.sendEmailWithInfo(newLocation.value, OtherUserEmail.value, e["detail"]["petName"], userEmail, numeroDelUsuario.value, () => {
                                    Router.go("/home");
                                });
                            });
                        });
                    });
                });
                petSeen.dispatchEvent(CustomPetEvent);
            });
        });

    }
    render() {

        const divStyle = document.createElement("style");
        this.shadow.innerHTML = `

            <div class="lost-pet">
                <img class="pet-photo" src=${this.petPhoto} alt="imagen de la mascota" />
                <h3 class="pet-name"> nombre de ${this.petName} </h3>
                <p class="pet-location"> locacion de ${this.petName} </p>
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
                grid-template-columns: 240px 90px;
                grid-template-rows: 150px 80px;
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
        this.shadow.appendChild(divStyle);
        this.listeners();
    }
}
customElements.define("lost-pet-card", Card);