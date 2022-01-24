import { state } from "../state";
import { Router } from "@vaadin/router";

class myReportedMascots extends HTMLElement {

    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open'});
    }
    connectedCallback() {
        this.render();
    }
    listeners() {

        const currentState = state.getState();
        const reportedMascots = this.shadow.querySelector(".reported-mascots");
        const reportedMascotsStyle = document.createElement("style");
        state.allReportedPetsByAUser(() => {

            if (currentState["myReportedPets"].length == 0) {
    
                reportedMascots.innerHTML = `
    
                    <h2 class="title-mascots"> No tienes mascotas reportadas </h2>
                    <button class="button"> Reportar mascota </button>
                `;
                reportedMascotsStyle.innerHTML = `
                    .reported-mascots {
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

                    if (currentState["email"] == '') {
                        Router.go("/login-1");

                    } else {
                        Router.go("/reportar-mascota")
                    }
                })
    
            } else {
                
                reportedMascots.innerHTML = `  
                    ${currentState["myReportedPets"].map((pet) => 

                    `<my-lost-pets pet-id=${pet['id']} class="pet" pet-location-name=${pet["_geoloc"]["name"]} pet-photo="${pet["ImageDataURL"]}" pet-name=${pet["petName"]}></my-lost-pets>`
                ).join("")}`;

                reportedMascotsStyle.innerHTML = `
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

        this.shadow.appendChild(reportedMascots);
        this.shadow.appendChild(reportedMascotsStyle);
    }
    render() {

        const divEl = document.createElement('div');
        divEl.className = 'general-container';
        const style = document.createElement('style');

        style.innerHTML = `
        .main-body {
            display: flex;
            flex-direction: column;
        }
        .title {
            font-size: 32px;
            align-self: center;
        }
        `;

        divEl.innerHTML = `
            <header-component></header-component>
            <div class="main-body">
                <h2 class="title"> Mis mascotas reportadas </h2>
                <div class="reported-mascots"></div>
            </div>
        `;
        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);
        this.listeners();
    }
}

customElements.define('mis-mascotas-reportadas', myReportedMascots);