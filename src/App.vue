<script setup>
import RssFeed from './components/RssFeed.vue'
</script>

<template>
  <!-- RSS 2.0 -->
  <!-- <RssFeed feedUrl="http://rss.cnn.com/rss/cnn_topstories.rss" /> -->
  <!-- ATOM -->
  <RssFeed feedUrl="https://old.reddit.com/r/pics.xml" />
</template>

<style scoped></style>
