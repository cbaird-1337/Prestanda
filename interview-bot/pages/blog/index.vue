<template>
  <div class="bg-base-100 p-4">
    <h1 class="text-3xl font-bold mb-4 text-neutral">Blogs Page</h1>
    <div class="card">
      <div 
        id="retainable-rss-embed" 
        data-rss="https://medium.com/feed/@prestanda.io" 
        data-maxcols="3" 
        data-layout="grid" 
        data-poststyle="inline" 
        data-readmore="Read the rest" 
        data-buttonclass="btn btn-primary" 
        data-offset="-100"
      >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let rssScript = document.createElement('script');
    rssScript.setAttribute('src', 'https://www.twilik.com/assets/retainable/rss-embed/retainable-rss-embed.js');
    document.head.appendChild(rssScript);
  }
}
</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

</style>
