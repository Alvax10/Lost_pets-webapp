import { Router } from "@vaadin/router";
import { state } from "../state";

class Login extends HTMLElement {

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
        const formEl = this.shadow.querySelector('.form') as HTMLFormElement;
        formEl.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = (this.shadow.querySelector('.input-email') as HTMLInputElement);
            currentState["email"] = emailInput.value;

            state.checkIfUserExists(() => {

                if (currentState['userExists'] == true) {
                    Router.go("/login-2");

                } else {
                    Router.go("/mis-datos/registrarse");
                }
                state.setState(currentState);
            });
        });
    }
    render() {

        const divEl = document.createElement('div');
        divEl.className = 'general-container';
        const style = document.createElement('style');

        style.innerHTML = `
        .img {
            padding: 0 30px;
        }
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
        .email-zone {
            align-self: center;
            justify-content: center;
        }
        .email {
            margin-left: 5px;
        }
        .input-email {
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
            margin-top: 10px;
            border-radius: 4px;
            border-style: none;
            align-self: center;
            background-color: #FF9DF5;
        }

        `;

        divEl.innerHTML = `
            <header-component></header-component>
            <div class="main-body">
                <h2 class="title"> Ingresar </h2>
                <form class="form">
                    <label class="email-zone">
                        <p class="email"> Email </p>
                        <input class="input-email" type="text" placeholder=" Email" />
                    </label>
                    <button class="button"> Siguiente </button>
                </form>
            </div>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);
        this.listeners();
    }
}

customElements.define('login1-page', Login);