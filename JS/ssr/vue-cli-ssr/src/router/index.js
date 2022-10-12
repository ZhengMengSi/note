import Vue from "vue";
import Router from "vue-router";
import Index from '@/components/index.vue'
import Detail from "@/components/detail.vue";

Vue.use(Router)

export default function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/',
                component: Index
            },
            {
                path: '/detail',
                component: Detail
            },
        ]
    });
}
