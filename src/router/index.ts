import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Hausregeln from "../views/Hausregeln.vue";
import Pflege from "../views/Pflege.vue";
import Commander from "../views/Commander.vue";
import Turnier from "../views/Turnier.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/hausregeln", component: Hausregeln },
        { path: "/pflege", component: Pflege },
        { path: "/commander", component: Commander },
        { path: "/turnier", component: Turnier },
    ],
});

export default router;
