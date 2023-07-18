<template>
    <div class="card w-96 bg-secondary shadow-xl m-4">
        <figure class="px-10 pt-10">
        <img :src="image" :alt="title" class="rounded-xl" />
    </figure>
        <div class="card-body items-center text-center">
            <h2 class="card-title text-white lato">{{ title }}</h2>
            <p class="text-white">{{ blurb }}</p>
        </div>
    </div>
</template>

<script setup>
defineProps(['image', 'title', 'blurb'])
</script>