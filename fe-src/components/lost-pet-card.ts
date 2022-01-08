import { state } from "../state";

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
        const reportedMascots = this.shadow.querySelectorAll(".lost-pet");
        reportedMascots.forEach((reportedMascot) => {
            
            const petSeenReported = reportedMascot.querySelector(".pet-seen");
            petSeenReported.addEventListener('click', () => {
                this.dispatchEvent(
                new CustomEvent('reportPet', {
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
                }),
                );
            });
        });
    }
    render() {

        const divEl = document.createElement("div");
        divEl.className = "mascot-lost";
        const divStyle = document.createElement("style");

        divEl.innerHTML = `

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

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(divStyle);
        this.listeners();
    }
}
customElements.define("lost-pet-card", Card);