<template>
    <div class="card w-96 bg-white shadow-xl m-4">
        <div class="card-body items-center text-center">
            <h1 class="card-title text-primary lato">{{ title }}</h1>
            <ul>
                <li class="text-base-200" v-for="(bullet, b) in bullets" :key="b">
                    {{ bullet }}
                </li>
            </ul>
            <div class="card-actions justify-center mt-4">
                <NuxtLink :to="link" class="btn btn-primary">{{ cta }}</NuxtLink>
            </div>  
        </div>
    </div>
</template>

<script setup>
defineProps(['cta', 'title', 'bullets', "link"])
</script>