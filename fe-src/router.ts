import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
    {path: "/", component: "give-location"},
    {path: "/home", component: "home-page"},
    {path: "/login-1", component: "login1-page"},
    {path: "/login-2", component: "login2-page"},
    {path: "/mis-datos/registrarse", component: "mis-datos"},
    {path: "/mis-mascotas-reportadas", component: "mis-mascotas-reportadas"},
    {path: "/reportar-mascota", component: "reportar-mascota"},
]);