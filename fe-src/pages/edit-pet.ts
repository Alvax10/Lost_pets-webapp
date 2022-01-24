import { state } from "../state";
import { Router } from "@vaadin/router";
import * as Dropzone from "dropzone";
import * as mapboxgl from "mapbox-gl";
const MapboxClient = require("mapbox");
const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);

class EditPet extends HTMLElement {

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
            font-size: 40px;
            align-self: center;
        }
        .form {
            display: flex;
            align-self: center;
            flex-direction: column;
            justify-content: center;
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
            margin: 20px;
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
        .mapboxgl-control-container {
            display: none;
        }
        .mapboxgl-control-attrib-inner {
            display: none;
        }
        .petname-zone {
            align-self: center;
            justify-content: center;
        }
        .petname {
            margin-left: 5px;
            margin-bottom: -0.005px;
        }
        .input-petname {
            width: 335px;
            height: 50px;
            padding-left: 10px;
            border-radius: 4px;
            border: 1px solid #000000;
        }
        .send-button, .button-found {
            width: 335px;
            height: 50px;
            font-size: 18px;
            margin-top: 15px;
            font-weight: 700;
            border-radius: 4px;
            border-style: none;
            align-self: center;
            background-color: #97EA9F;
        }
        .button {
            width: 335px;
            height: 50px;
            font-size: 18px;
            margin-top: 15px;
            font-weight: 700;
            border-radius: 4px;
            border-style: none;
            align-self: center;
            background-color: #FF9DF5;
        }
        .despublicar {
            margin: 30px;
            color: #FF3A3A;
            font-size: 16px;
            text-align: center;
            text-decoration: underline;
        }
        `;

        divEl.innerHTML = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>
        <link href="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone.css" rel="stylesheet" type="text/css" />

            <header-component></header-component>
            <div class="main-body">
                <h2 class="title"> Editar mascota perdida </h2>

                <form class="form">
                    <label class="petname-zone">
                        <p class="petname">  Nombre de la mascota </p>
                        <input class="input-petname" type="text" />
                    </label>

                    <div id="dropzone" class="pet-photo-container">
                        <p class="pet-photo"> Foto de la Mascota </p>
                    </div>

                    <label class="pet-location-label"> 
                        <p class="pet-location-name"> Ubicacion de la mascota </p>
                        <div class="search-loc">
                            <input class="search" name="q" type="search" />
                        </div>
                        <div id="map" style="width: 620px; height: 335px;"></div>
                    </label>

                    <button class="button"> Marcar Ubicación </button>

                    <button class="send-button"> Guardar </button>
                </form>

                <button class="button-found"> Reportar como encontrado </button>
                <p class="despublicar"> Despublicar </p>
            </div>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);

        let ImageDataURL;
        const map = this.shadow.getElementById('map');
        const sendLocButton = this.shadow.querySelector(".button");
        const reportPetForm = this.shadow.querySelector(".form");
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
                    e["target"]['q'].value,
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
                    name: petLocation.value,
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
                        
                    console.log("Clickeaste en editar mascota");
                    // ACA SE TIENE QUE ACTUALIZAR LA MASCOTA
                    state.updateMascotInfo(petPhoto, petName, mascotLocation);
                    Router.go("/home");
                });
            });
        })();

        const reportFoundButton = this.shadow.querySelector(".button-found");
        reportFoundButton.addEventListener("click", (e) => {
            e.preventDefault();

            // ACA SE TIENE QUE ELIMINAR TODA LA DATA DE LA MASCOTA
            state.eliminateMascot();
            Router.go("/mis-mascotas-reportadas");
        });
    }
}

customElements.define('edit-pet', EditPet);