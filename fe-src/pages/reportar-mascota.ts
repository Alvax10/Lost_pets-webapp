import { Router } from "@vaadin/router";
import { state } from "../state";
import * as Dropzone from "dropzone";
import * as mapboxgl from "mapbox-gl";
const MapboxClient = require("mapbox");
const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);

class reportMascot extends HTMLElement {

    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open'});
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

        const reportedMascots = this.shadow.querySelector(".reported-mascots");
        const reportedMascotsStyle = document.createElement("style");

        reportedMascots.innerHTML = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>

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

                <button class="button"> Marcar Ubicación </button>

                <div id="dropzone" class="pet-photo-container">
                    <p class="pet-photo"> Foto de la Mascota </p>
                </div>

                <button class="report-button"> Reportar Mascota </button>
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
            .pet-photo-container {
                margin: 35px;
                width: 300px;
                height: 150px;
                display: flex;
                border-radius: 4px;
                justify-content: center;
                background-color: #97EA9F;
            }
            .dz-size {
                display: none;
            }
            .dz-filename {
                display: none;
            }
            .dz-success-mark {
                display: none;
            }
            .dz-error-mark {
                display: none;
            }
            .search {
                width: 330px;
                height: 40px;
            }
            .report-button, .button {
                width: 300px;
                height: 50px;
                border: none;
                cursor: pointer;
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

            let ImageDataURL;
            const map = this.shadow.getElementById('map');
            const sendLocButton = this.shadow.querySelector(".button");
            const reportPetForm = this.shadow.querySelector(".form");
            const locationValue = (this.shadow.querySelector(".search") as HTMLInputElement);
            const petLocation = (this.shadow.querySelector(".search") as HTMLInputElement);

            const dropzoneEl = this.shadow.getElementById('dropzone');
            const myDropzone = new Dropzone(dropzoneEl, {
                url: "/falsa",
                clickeable: true,
                autoProcessQueue: false,
            });

            myDropzone.on("thumbnail", function (file) {
                // usando este evento pueden acceder al dataURL directamente
                ImageDataURL = file;
                // console.log(file.dataURL);
            });
    
            function initMap() {
                mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
                return new mapboxgl.Map({
                    container: map,
                    style: 'mapbox://styles/mapbox/streets-v11',
                });
            }
    
            function initSearchForm(callback) {
                sendLocButton.addEventListener('click', (e) => {
                    e.preventDefault();
    
                    mapboxClient.geocodeForward(
                        locationValue.value,
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

                    const mascotLocation = {
                        name: locationValue.value,
                        lat: firstResult.geometry.coordinates[1],
                        lng: firstResult.geometry.coordinates[0],
                    }
                    // console.log(mascotLocation);

                    reportPetForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const target = e.target as any;
                        const petPhoto = ImageDataURL.dataURL;
                        const petName = (target["pet-name-input"] as HTMLInputElement);

                        // console.log({
                        //     petName: petName.value,
                        //     _geoloc: mascotLocation,
                        //     ImageDataURL: petPhoto
                        // });
                        
                        console.log("Clickeaste en reportar mascota");
                        state.reportLostPet(petName.value, petPhoto, mascotLocation, () => {
        
                            console.log("Reportaste la mascota");
                            Router.go("/home");
                        });
                    });
                });
            })();
        }
    }
}

customElements.define('reportar-mascota', reportMascot);