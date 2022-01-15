import { Router } from "@vaadin/router";
import { state } from "../state";

class Home extends HTMLElement {

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

        this.shadow.appendChild(lostPets);
        this.shadow.appendChild(lostPetsStyle);
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
        this.listeners();
    }
}

customElements.define('home-page', Home);