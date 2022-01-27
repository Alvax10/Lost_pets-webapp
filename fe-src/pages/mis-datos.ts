import { Router } from "@vaadin/router";
import { state } from "../state";

class myData extends HTMLElement {

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
        .username-zone {
            align-self: center;
            justify-content: center;
        }
        .username {
            margin-left: 5px;
            margin-bottom: -0.005px;
        }
        .input-username {
            width: 335px;
            height: 50px;
            padding-left: 10px;
            border-radius: 4px;
            border: 1px solid #000000;
        }
        .password-zone {
            align-self: center;
            justify-content: center;
        }
        .password {
            margin-left: 5px;
            margin-bottom: -0.005px;
        }
        .input-password, .input-password-2 {
            width: 335px;
            height: 50px;
            padding-left: 10px;
            border-radius: 4px;
            border: 1px solid #000000;
        }
        .button {
            width: 335px;
            height: 50px;
            font-size: 18px;
            margin-top: 15px;
            border-radius: 4px;
            border-style: none;
            align-self: center;
            background-color: #FF9DF5;
        }
        `;

        divEl.innerHTML = `
            <header-component></header-component>
            <div class="main-body">
                <h2 class="title"> Mis datos / Registrarse </h2>
                <form class="form">
                    <label class="username-zone">
                        <p class="username"> Tu Nombre </p>
                        <input class="input-username" type="text" placeholder="${currentState['username']}" />
                    </label>
                    <label class="password-zone">
                        <p class="password"> Tu Contraseña </p>
                        <input class="input-password" type="password" placeholder=" Tu Contraseña" />
                    </label>
                    <label class="password-zone">
                        <p class="password"> Tu Contraseña </p>
                        <input class="input-password-2" type="password" placeholder=" Repetir Contraseña" />
                    </label>
                    <button class="button"> Guardar </button>
                </form>
            </div>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);

        const primerContraseñaInput = (this.shadow.querySelector(".input-password") as HTMLInputElement);
        const segundaContraseñaInput = (this.shadow.querySelector(".input-password-2") as HTMLInputElement);
        
        const formEl = this.shadow.querySelector('.form');
        formEl.addEventListener('submit', (e) => {
            e.preventDefault();

            if (primerContraseñaInput.value != segundaContraseñaInput.value) {
    
                alert('las contraseñas no coinciden');
            } else {
                // console.log(primerContraseñaInput.value, segundaContraseñaInput.value);
                const currentState = state.getState();
                const username = (this.shadow.querySelector(".input-username") as HTMLInputElement);
                currentState['username'] = username.value;

                state.checkIfUserExists(() => {

                    if (currentState['userExists'] == true) {
                        state.modifyUserInfo(primerContraseñaInput.value);
                        Router.go("/home");
        
                    } else {

                        state.signUpUser(primerContraseñaInput.value);
                        Router.go("/login-1");
                    }
                    state.setState(currentState);
                });
            }
        });
    }
}

customElements.define('mis-datos', myData);