import { Router } from "@vaadin/router";
import { state } from "../state";
import * as Dropzone from "dropzone";
import * as mapboxgl from "mapbox-gl";
const MapboxClient = require("mapbox");
const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);
// console.log(process.env.MAPBOX_TOKEN);

const logo = require("url:../img/logo-pata.png");
const burgerMenuImg = require("url:../img/burger-menu.png");
const xButton = require("url:../img/Vector.png");

class reportMascot extends HTMLElement {

    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open'});
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
                align-self  : flex-end;
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
                        <button class="login-button"> Ok </button>
                    `;

                    this.shadow.appendChild(divNotification);
                    this.shadow.appendChild(notificationStyle);

                    const loginButton = this.shadow.querySelector('.login-button');
                    loginButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        notificationStyle.innerHTML = `
                        .notification {
                            display: none;
                        }
                        `;
                        Router.go("/login-1");
                    });
                } else {
                    // console.log(currentState["email"]);

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
        });
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
        }
        .title {
            font-size: 32px;
            align-self: center;
        }
        `;

        divEl.innerHTML = `
            <header class="header">
                <img class="img" src="${logo}" alt="logo">
                <img class="img menu" src="${burgerMenuImg}" alt="menu" >
            </header>
            <div class="main-body">
                <h2 class="title"> Mis mascotas reportadas </h2>
                <div class="reported-mascots"></div>
            </div>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);

        const reportedMascots = this.shadow.querySelector(".reported-mascots");
        const reportedMascotsStyle = document.createElement("style");

        reportedMascots.innerHTML = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>
        <link href="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone.css" rel="stylesheet" type="text/css" />

            <h2 class="title-pet"> Reportar mascota perdida </h2>

            <form class="form">
                <label class="pet-name-label"> 
                    <p class="pet-name"> Nombre de la Mascota </p>
                    <input name="pet-name-input" class="pet-name-input" placeholder=" Nombre de la mascota: "/>
                </label>

                <label class="pet-location-label"> 
                    <p class="pet-location-name"> Ubicacion de la mascota </p>
                    <div class="search-loc">
                        <input class="search" name="q" type="search" />
                    </div>
                    <div id="map" style="width: 620px; height: 335px;"></div>
                </label>

                <div id="dropzone" class="pet-photo-container dropzone">
                    <p class="pet-photo"> Foto de la Mascota </p>
                    <img class="pet-photo-input" name="pet-photo-input" width: 200px/>
                </div>

                <button class="button"> Reportar Mascota </button>
            </form>
        `;

        reportedMascotsStyle.innerHTML = `
            .title-pet {
                text-align: center;
            }
            .form {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .pet-name-label {
                display: flex;
                flex-direction: column;
            }
            .pet-name-input {
                width: 330px;
                height: 40px;
            }
            .pet-location-label {
                display: flex;
                flex-direction: column;
                align-self: center;
                align-items: center;
            }
            .pet-photo {
                align-self: center;
            }
            .search {
                width: 330px;
                height: 40px;
            }
            .button {
                width: 300px;
                height: 50px;
                border: none;
                margin-top: 15px;
                border-radius: 4px;
                align-self: center;
                background-color: #FF9DF5;
            }
            .mapboxgl-control-container {
                display: none;
            }
            .mapboxgl-control-attrib-inner {
                display: none;
            }
        `;

        this.shadow.appendChild(reportedMascots);
        this.shadow.appendChild(reportedMascotsStyle);

        if (currentState["email"] == '') {
            currentState["locationBefore"] = "/reportar-mascota";
            Router.go("/login-1");

        } else {

            const map = this.shadow.getElementById('map');
            const reportPetForm = this.shadow.querySelector(".form");
    
            function initMap() {
                mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
                return new mapboxgl.Map({
                    container: map,
                    style: 'mapbox://styles/mapbox/streets-v11',
                });
            }
    
            function initSearchForm(callback) {
                reportPetForm.addEventListener('submit', (e) => {
                    e.preventDefault();
    
                    mapboxClient.geocodeForward(
                        e.target['q'].value,
                        {
                        autocomplete: true,
                        language: "es",
                        },
                        function (err, data, res) {
                        // console.log(data);
                        if (!err) callback(data.features);
                        }
                    );
                });
            }
    
            (function () {
                const map = initMap();
                initSearchForm(function (results) {
                    const firstResult = results[0];
                    const marker = new mapboxgl.Marker()
                        .setLngLat(firstResult.geometry.coordinates)
                        .addTo(map);
                    map.setCenter(firstResult.geometry.coordinates);
                    map.setZoom(14);
                });
            })();
    
            const dropzoneEl = this.shadow.getElementById('dropzone');
            let imageDataURL;
            const myDropzone = new Dropzone(dropzoneEl, {
                url: "/falsa",
                clickeable: true,
                autoProcessQueue: false,
            });
    
            myDropzone.on("thumbnail", function (file) {
                // usando este evento pueden acceder al dataURL directamente
                imageDataURL = file.dataURL;
                // console.log(file.dataURL);
            });
    
            reportPetForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const target = e.target as any;
    
                const petName = (target["pet-name-input"] as HTMLInputElement).value;
                const petLocation = (this.shadow.querySelector(".search") as HTMLInputElement).value;
                const petPhoto = imageDataURL;
                currentState["location"]["name"] = petLocation;
                state.setState(currentState);
                
                state.reportLostPet(petPhoto, petName);
            });
        }
    }
}

customElements.define('reportar-mascota', reportMascot);