// const API_BASE_URL = "http://localhost:3011";
const API_BASE_URL = "https://desafio-final-dwf-m7.herokuapp.com";

const state = {
    data: {
        email: '',
        _geoloc: {
            lat: 0,
            lng: 0,
        },
        userExists: false,
        locationBefore: '/',
        myReportedPets: [],
        lostPetsAround: [],
        mascotId: 0,
        objectID: 0,
        token: null,
    },
    listeners: [],
    init() {
        const localData = JSON.parse(localStorage.getItem("data") as string);
        if (!localData) {
            return;
        }
        this.setState(localData);
    },
    getState() {
        return this.data;
    },
    async eliminateMascot(callback) {
        const currentState = this.getState();
        const { token } = currentState;
        const { mascotId } = currentState;
        const { objectID } = currentState;

        if (mascotId) {

            const eliminatePet = await fetch(API_BASE_URL + "/eliminate-mascot", {
                method: 'DELETE',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${token}`,
                },
                body: JSON.stringify({ mascotId, objectID }),
            });
        }
        callback();
    },
    async updateMascotInfo(callback, petName?, petPhoto?, mascotLocation?) {
        const currentState = this.getState();
        const { token } = currentState;
        const { mascotId } = currentState;
        const { objectID } = currentState;

        if (mascotId && mascotLocation && petName && petPhoto) {

            const updatedData = await fetch(API_BASE_URL + "/update-mascot-info", {
                method: 'PATCH',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${token}`,
                },
                body: JSON.stringify({ mascotId: mascotId, objectID: objectID, petName: petName, petPhoto: petPhoto, mascotLocation: mascotLocation }),
            });
            await console.log("Se actualizó la info! :D");
        }
        callback();
    },
    async sendEmailWithInfo(petName, newLocation, userEmail, numeroDelUsuario) {
        const currentState = this.getState();
        const { token } = currentState;

        const sendEmailToUser = await fetch(API_BASE_URL + "/send-email-to-user", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`,
            },
            body: JSON.stringify({ userEmail, petName, newLocation, numeroDelUsuario }),
        })
        await console.log("Email enviado! :D");

    },
    async mascotCloseFrom(callback) {
        const currentState = this.getState();
        const lat = currentState["_geoloc"]["lat"];
        const lng = currentState["_geoloc"]["lng"];

        const mascotsCloseFrom = await fetch(API_BASE_URL + "/mascots-close-from" + "?lat=" + lat + "&lng=" + lng, {
        })
        const data = await mascotsCloseFrom.json();
        console.log("Esta es la data de mascotas cerca de: ", data);
        currentState["lostPetsAround"] = data;
        callback();
    },
    async reportLostPet(petName, ImageDataURL, _geoloc, callback) {
        const currentState = this.getState();
        const { token } = currentState;
        const { email } = currentState;

        const reportedPet = await fetch(API_BASE_URL + "/report/mascot", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`,
            },
            body: JSON.stringify({ petName, _geoloc, ImageDataURL, email }),
        });
        await reportedPet.json();
        await console.log("Mascota reportada! :D");
        callback();
    },
    async allReportedPetsByAUser(callback) {
        const currentState = this.getState();
        const { token } = currentState;
        const { email } = currentState;

        if (email) {

            const allMascotsByAUser = await fetch(API_BASE_URL + "/user/reported-mascots" + "?email=" + email, {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `bearer ${token}`,
                }
            })
            const data = await allMascotsByAUser.json();
            if (data) {
                console.log("Esta es la data de todas las mascotas reportadas por un usuario: ", data);
                currentState["myReportedPets"] = data;

            } else {
                console.log("No reportaste mascotas");
            }
            callback();

        } else {
            console.error('Falta el email');
        }

    },
    async modifyUserInfo(oldEmail, newEmail?, password?) {
        const currentState = this.getState();
        const { token } = currentState;

        const updateUserInfo = await fetch(API_BASE_URL + "/user/data", {
            method: 'PATCH',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`,
            },
            body: JSON.stringify({ oldEmail: oldEmail, newEmail: newEmail, newPassword: password }),
        });
        const data = await updateUserInfo.json();
        console.log("Esta es la data de modifyUserInfo: " + data);
    },
    async signUpUser(password) {
        const currentState = this.getState();
        const { email } = currentState;

        if (!email) {
            console.error('falta el email!');
        } else {

            await fetch(API_BASE_URL + '/auth', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
        }
    },
    async checkIfUserExists(callback) {
        const currentState = this.getState();
        const { email } = currentState;

        if (email) {

            const verifyUser = await fetch(API_BASE_URL + "/verify/user", {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            const data = await verifyUser.json();
            console.log("User exists: ", data);
            currentState['userExists'] = data;
        }
        callback();
    },
    async signInUser(password, callback?) {
        const currentState = this.getState();
        const email = currentState['email'];

        if (email && password) {

            const authToken = await fetch(API_BASE_URL + '/auth/token', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            const token = await authToken.json();
            currentState["token"] = token;
            this.setState(currentState);

            callback();

        } else {
            if (callback) console.error('Falta email o contraseña');
        }

    },
    async getMe() {
        const currentState = this.getState();
        const { token } = currentState;

        if (token) {
            const res = await fetch(API_BASE_URL + "/me", {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorizaton': `bearer ${token}`,
                    'Content-type': 'application/json',
                }
            });
            const data = await res.json();
            console.log(data);
        }
    },
    setState(newState) {
        this.data = newState;
        for (const cb of this.listeners) {
            cb();
        }
        console.log("Esto es this.data: ", this.data);
        localStorage.setItem("data", JSON.stringify(newState));
        console.log("Soy el state, he cambiado:", newState);
    },
    suscribe(callback: (any) => any) {
        this.listeners.push(callback);
    }
}

export { state };