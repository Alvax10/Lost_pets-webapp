import { Router } from "@vaadin/router";
import { state } from "../state";
const lapizEdit = require("url:../img/lapiz-edit.png");

export class MyLostPets extends HTMLElement {

    shadow: ShadowRoot;
    petName;
    petPhoto;
    petLocationName;
    petId;
    objectID;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.petName = this.getAttribute("pet-name");
        this.petId = this.getAttribute("pet-id");
        this.objectID = this.getAttribute("object-id");
        this.petPhoto = this.getAttribute("pet-photo");
        this.petLocationName = this.getAttribute("pet-location-name");
    }
    connectedCallback() {
        this.render();
    }
    listeners() {

        const currentState = state.getState();
        (this.shadow.querySelector(".edit-pet") as HTMLButtonElement).addEventListener('click', () => {

            const customPetEvent = new CustomEvent('edit', {
                detail: {
                    petName: this.petName,
                    petPhoto: this.petPhoto,
                    petLocationName: this.petLocationName,
                    petId: this.petId,
                    objectID: this.objectID,
                },
                bubbles: true
                // esto hace que el evento pueda
                // ser escuchado desde un elemento
                // que está más "arriba" en el arbol
            });

            const editPet = this.shadow.querySelector(".edit-pet") as HTMLElement;
            editPet.addEventListener('edit', (e) => {
                e.preventDefault();

                currentState["mascotId"] = this.petId;
                currentState["objectID"] = this.objectID;
                state.setState(currentState);

                Router.go("/edit-reported-pet")

            });
            editPet.dispatchEvent(customPetEvent);
        });
    }
    render() {

        const divStyle = document.createElement("style");
        this.shadow.innerHTML = `

            <div class="lost-pet" id=${this.petId}>
                <img class="pet-photo" src=${this.petPhoto} alt="imagen de la mascota" />
                <h3 class="pet-name"> Nombre: ${this.petName} </h3>
                <p class="pet-location"> Ubicación: ${this.petLocationName} </p>
                <img class="edit-pet" src=${lapizEdit} alt="Lápiz" />
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
            .edit-pet {
                grid-row-end: 3;
                margin-top: 35px;
                margin-left: 40px;
                grid-row-start: 2;
            }
        `;
        this.shadow.appendChild(divStyle);
        this.listeners();
    }
}
customElements.define("my-lost-pets", MyLostPets);