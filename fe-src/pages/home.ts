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
        const lostPets = this.shadow.querySelector(".lost-pets") as any;
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

                const reportButton = this.shadow.querySelector(".button") as any;
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
                        align-items: center;
                        padding-bottom: 30px;
                        flex-direction: column;
                    }

                    @media(min-width: 600px) {
                        .lost-pets {
                            display: grid;
                            align-items: center;
                            justify-items: center;
                            grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
                        }
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
                `;
            }
        });

        this.shadow.appendChild(lostPets);
        this.shadow.appendChild(lostPetsStyle);
    }
    render() {

        const userExists = state.getState().userExists;
        console.log("Esto es userExist: ", userExists);

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