// const API_BASE_URL = "http://localhost:3011";
const API_BASE_URL = "https://desafio-final-dwf-m7.herokuapp.com";

const state = {
    data: {
        username: '',
        petName: '',
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
    },
    listeners: [],
    init() {
        const localData = JSON.parse(localStorage.getItem("geoloc"));
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
        const mascotId = currentState["mascotId"];

        if (mascotId) {

            const eliminatePet = fetch(API_BASE_URL + "/eliminate-mascot", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mascotId }),
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
            });
        }
        callback();
    },
    async updateMascotInfo(callback, petPhoto?, petName?, mascotLocation?) {
        const currentState = this.getState();
        const mascotId = currentState["mascotId"];

        if (mascotId && petName | petPhoto | mascotLocation) {

            const updatedData = await fetch(API_BASE_URL + "/update-mascot-info", {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mascotId, petName, petPhoto, mascotLocation }),
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("Se actualizó la info: ",data);
            });
        }
        callback();
    },
    async sendEmailWithInfo(petName, newLocation, userEmail, numeroDelUsuario) {

        const sendEmailToUser = await fetch(API_BASE_URL + "/send-email-to-user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail, petName, newLocation, numeroDelUsuario }),
        })
        .then(() => {
            console.log("Email enviado! :D");
        });

    },
    async mascotCloseFrom(callback) {
        const currentState = this.getState();
        const lat = currentState["_geoloc"]["lat"];
        const lng = currentState["_geoloc"]["lng"];

        const mascotsCloseFrom = await fetch(API_BASE_URL + "/mascots-close-from" + "?lat=" + lat + "&lng=" + lng, {
        })
        .then((res) => { return res.json() })
        .then((data) => {

            console.log("Esta es la data de mascotas cerca de: ", data);
            currentState["lostPetsAround"] = data;
        });

        callback();

    },
    async reportLostPet(petName, ImageDataURL, _geoloc, callback) {
        const currentState = this.getState();
        const email = currentState["email"];
        
        const reportedPet = await fetch(API_BASE_URL + "/report/mascot", {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({ petName, _geoloc, ImageDataURL, email }),
        })
        .then(() => {

            console.log("Mascota reportada! :D");
        });

        callback();
    },
    async allReportedPetsByAUser(callback) {
        const currentState = this.getState();
        const email = currentState['email'];

        if (email) {

            const allMascotsByAUser = await fetch(API_BASE_URL + "/user/reported-mascots" + "?email=" + email, {
            })
            .then((res) => { return res.json(); })
            .then((data) => {

                if (data) {

                    console.log("Esta es la data de todas las mascotas reportadas por un usuario: ", data);
                    currentState["myReportedPets"] = data;
                    
                } else {
                    console.log("No reportaste mascotas");
                }
            });
            
            callback();

        } else {
            console.error('Falta el email');
        }

    },
    async modifyUserInfo(password) {
        
        await fetch(API_BASE_URL + "/user/data", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log("Esta es la data de modifyUserInfo: " + data);
        });
    },
    async signUpUser(password) {
        const currentState = this.getState();
        const email = currentState["email"];

        if (!email) {
            console.error('falta el email!');
        } else {

            await fetch(API_BASE_URL + '/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
        }
    },
    async checkIfUserExists(callback) {
        const currentState = this.getState();
        const email = currentState['email'];

        if (email) {

            await fetch(API_BASE_URL + "/verify/user", {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("User exists: ", data);
                currentState['userExists'] = data;
            });
        }
        callback();
    },
    async signInUser(password, callback?) {
        const currentState = this.getState();
        const email = currentState['email'];

        if (email && password) {

            await fetch(API_BASE_URL + '/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                return data;
            });

            callback();

        } else {
            if (callback) console.error('Falta email o contraseña');
        }

    },
    setState(newState) {
        this.data = newState;
        for (const cb of this.listeners) {
            cb();
        }
        localStorage.setItem("geoloc", JSON.stringify(newState));
        console.log("Soy el state, he cambiado:", newState);
    },
    suscribe(callback: (any) => any) {
        this.listeners.push(callback);
    }
}

export { state };