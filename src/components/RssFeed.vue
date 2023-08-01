<template>
  <div class="rss-feed" v-if="feedStore">
    <div v-if="feedStore.feed">
      <RssItem v-for="item in feedStore.feed.items" :key="item.guid" :post="item" />
    </div>
    <div v-else-if="feedStore.feedLoading">
      <p>{{ t('loading') }}</p>
    </div>
    <div v-else-if="feedStore.feedError">
      <p>{{ t('errorColon', { error: feedStore.feedError }) }}</p>
    </div>
  </div>
</template>

<script setup>
import RssItem from '@/components/RssItem.vue'
import { useFeedStore } from '@/stores/useFeedStore'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  /**
   * The URL of the RSS feed to be fetched and displayed.
   * @prop {String} feedUrl - The URL of the RSS feed.
   */
  feedUrl: {
    type: String,
    required: true
  }
})

const feedStore = useFeedStore()

const { t } = useI18n()

feedStore.fetchRSSData(props.feedUrl)
</script>

<style scoped>
.rss-feed {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>
