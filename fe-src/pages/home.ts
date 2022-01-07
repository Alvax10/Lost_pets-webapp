import { Router } from "@vaadin/router";
import { state } from "../state";
import "../components/header";
import "../components/lost-pet-card";
const xButton = require("url:../img/Vector.png");

class Home extends HTMLElement {

    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
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
            <header-component></header-component>
            <div class="main-body">
                <h2 class="title"> Mascotas perdidas cerca tuyo </h2>
                <div class="lost-pets"></div>
            </div>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);

        const lostPets = this.shadow.querySelector(".lost-pets");
        const lostPetsStyle = document.createElement("style");

        state.mascotCloseFrom(() => {

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
                
                    `<lost-pet-card class="pet" pet-location-name=${pet["_geoloc"]["name"]} pet-photo="${pet["ImageDataURL"]}" pet-name=${pet["petName"]}></lost-pet-card>`
                                    
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
        });

        this.shadow.appendChild(lostPetsStyle);
        
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
                const OtherUserEmail = (this.shadow.querySelector(".input__user-email") as HTMLInputElement);
                const numeroDelUsuario = (this.shadow.querySelector(".input__user-phone") as HTMLInputElement);
                const newLocation = (this.shadow.querySelector(".input__user-info") as HTMLInputElement);
                const sendPetSeenInfo = this.shadow.querySelector(".button");

                sendPetSeenInfo.addEventListener('submit', (event) => {
                    event.preventDefault();

                    state.sendEmailWithInfo(newLocation.value, OtherUserEmail.value, e["detail"]["petName"], userEmail, numeroDelUsuario.value, () => {

                        Router.go("/home");
                    });
                });
            });
        });
    }
}

customElements.define('home-page', Home);