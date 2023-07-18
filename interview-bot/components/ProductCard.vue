<template>
    <div class="card w-96 bg-white shadow-xl m-4">
        <figure class="px-10 pt-10">
        <img :src="image" :alt="title" class="rounded-xl" />
    </figure>
        <div class="card-body items-center text-center">
            <h2 class="card-title text-primary">{{ title }}</h2>
            <p class="text-primary">{{ blurb }}</p>
        </div>
    </div>
</template>

<script setup>
defineProps(['image', 'title', 'blurb'])
</script>