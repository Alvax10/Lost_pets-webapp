import { Router } from "@vaadin/router";
import { state } from "../state";

class giveLocation extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
        const currentState = state.getState();

        const buttonEl = this.shadow.querySelector('.button') as HTMLButtonElement;
        buttonEl.addEventListener('click', () => {


            if (currentState["_geoloc"]["lat"] != 0 && currentState["_geoloc"]["lng"] != 0) {
                Router.go("/home");
            } else {

                const options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
                function success(position) {
                    var coord = position.coords;

                    // console.log('Your current position is:');
                    // console.log('Latitude : ' + coord.latitude);
                    // console.log('Longitude: ' + coord.longitude);
                    // console.log('More or less ' + coord.accuracy + ' meters.');
                    currentState["_geoloc"]["lat"] = coord.latitude;
                    currentState["_geoloc"]["lng"] = coord.longitude;

                    state.setState(currentState);
                }
                function error(err) {
                    console.warn('ERROR(' + err.code + '): ' + err.message);
                }
                navigator.geolocation.getCurrentPosition(success, error, options);
                Router.go("/home");
            }
        });
    }
    render() {

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
        .parrafo {
            font-size: 16px;
            width: 300px;
            height: 50px;
            text-align: center;
        }
        .button {
            width: 335px;
            height: 50px;
            margin-top: 10px;
            border-style: none;
            border-radius: 4px;
            background-color: #FF9DF5;
        }
        `;

        divEl.innerHTML = `
            <header-component></header-component>
            <div class="main-body">
                <h2 class="title"> Mascotas perdidas cerca tuyo </h2>

                <p class="parrafo"> Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación. </p>
                <button class="button"> Dar mi Ubicación </button>
            </div>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);
    }
}
customElements.define("give-location", giveLocation);