<template>
  <div class="card">
    <!-- title -->
    <div
      class="title d-flex flex-row flex-auto pa-4 flex-wrap align-start overflow-auto clickable"
      style="gap: 1rem; white-space: normal"
    >
      <div class="post-main-link">
        <a :href="this.postUrl.href" target="_blank" :title="this.postUrl.href">
          <div class="post-main-link-anchor">&#x1F517;</div>
        </a>
      </div>
      <div class="d-flex flex-column flex-auto flex-grow-1" @click="showFullPost = !showFullPost">
        <div
          v-if="isHtmlContent(post.postTitle)"
          v-dompurify-html="post.postTitle.value"
          class="post-html-frame"
          frameborder="0"
        />
        <div v-else class="post-text-frame">
          {{ post.postTitle.value }}
        </div>
        <div
          v-if="post.lastUpdatedTimestamp && post.lastUpdatedTimestamp !== post.publishTimestamp"
          class="d-flex flex-grow-1 justify-start align-center text-subtitle-2"
          style="font-weight: bold"
        >
          {{ t('updatedColon') }}
          {{ formatTimestamp(post.lastUpdatedTimestamp) }}
        </div>
        <div class="d-flex flex-grow-1 justify-start align-center text-subtitle-2">
          {{
            t('published', {
              time: formatTimestamp(post.publishTimestamp),
              feed: post.importerDesc
            })
          }}
        </div>
        <!-- post authors -->
        <div v-for="author of post.authors" :key="author" class="text-subtitle-2">
          {{ author.name ? author.name : author.email }}
        </div>
        <div class="post-comment-link-anchor text-subtitle-2">
          <a
            v-if="isUrl(post.postComment)"
            :href="post.postComment"
            target="_blank"
            :title="post.postComment"
            style="font-size: normal"
            @click.stop="false"
          >
            {{ t('postComments') }}
          </a>
        </div>
      </div>
    </div>
    <!-- description/contents -->
    <div class="text" v-if="showFullPost">
      <!-- description -->
      <div v-if="post.postDesc" class="text overflow-auto">
        <!-- post description (hidden w/no detials) -->
        <div class="pt-4">{{ t('description') }} ({{ post.postDesc.type }})</div>
        <!-- divider -->
        <hr class="divider" />
        <div
          v-if="isHtmlContent(post.postDesc)"
          v-dompurify-html="post.postDesc.value"
          class="post-html-frame"
          frameborder="0"
        />
        <div v-else class="post-text-frame">
          {{ post.postDesc.value }}
        </div>
      </div>
      <!-- contents -->
      <div v-if="post.postContents" class="text overflow-auto">
        <div v-for="(c, idx) in post.postContents" :key="c">
          <!-- post contents (hidden w/no detials) -->
          <div class="pt-4">
            {{ t('contentsNofM', { n: idx + 1, m: post.postContents.length }) }} ({{ c.type }})
          </div>
          <div v-if="isHtmlContent(c)" v-dompurify-html="c.value" class="post-html-frame" />
          <div v-else class="post-text-frame">
            {{ c.value }}
          </div>
        </div>
      </div>
    </div>
    <!-- actions -->
    <div
      v-if="(post.postCategories && post.postCategories.length > 0) || post.sharingOptions"
      class="actions d-flex flex-wrap"
      style="justify-content: start"
    >
      <!-- toggle post categories button -->
      <button
        class="show-post-btn"
        v-if="post.postCategories && post.postCategories.length > 0"
        size="small"
        :title="t('showPostCategories')"
        :aria-label="t('showPostCategories')"
        :icon="showPostCategories ? 'fa-compress' : 'fa-tags'"
        @click.stop="showPostCategories = !showPostCategories"
      >
        {{ t('showPostCategories') }}
      </button>
      <!-- post category buttons (the actual categories) -->
      <div
        class="category"
        v-for="postCategory in post.postCategories"
        v-show="showPostCategories"
        :key="postCategory"
      >
        {{ postCategory.label ? postCategory.label : postCategory.term }}
      </div>
      <!-- toggle sharing options button -->
      <button
        class="show-post-btn"
        v-if="post.sharingOptions"
        size="small"
        :title="t('showPostSharing')"
        :aria-label="t('showPostSharing')"
        :icon="showPostSharing ? 'fa-compress' : 'fa-share-alt'"
        @click.stop="showPostSharing = !showPostSharing"
      >
        {{ t('showPostSharing') }}
      </button>
      <!-- post sharing buttons (the actual sharing options) -->
      <button
        class="share-btn"
        v-for="sharingOption in sharingOptions"
        v-show="showPostSharing"
        :key="sharingOption"
        size="small"
        :title="t('shareWith_' + sharingOption.name)"
        :aria-label="t('shareWith_' + sharingOption.name + '_ariaLabel')"
        :icon="'fa-' + sharingOption.icon"
        @click.stop="$emit('share', { sharingOption: sharingOption, post: post })"
      >
        {{ t('shareWith_' + sharingOption.name) }}
      </button>
    </div>
  </div>
</template>

<script>
import { useTimestamp } from '@/composable/useTimestamp.js'
import { useI18n } from 'vue-i18n'

/**
 * Represents a card component displaying an RSS feed item.
 * @name RssItem
 * @component
 */
export default {
  name: 'RssItem',
  components: {},
  props: {
    /**
     * The RSS feed item to be displayed in the card.
     * @prop {Object} post
     * @prop {string} post.postTitle - The title of the RSS feed item.
     * @prop {string} post.postDesc - The description of the RSS feed item.
     * @prop {string} post.lastUpdatedTimestamp - The timestamp when the item was last updated.
     * @prop {string} post.publishTimestamp - The timestamp when the item was published.
     * @prop {string} post.importerDesc - The importer description of the RSS feed item.
     * @prop {Array} post.authors - An array of author objects containing name and email properties.
     * @prop {string} post.postComment - The URL to post comments.
     * @prop {Array} post.postUrls - An array of post URL objects containing href, title, rel, type, and hreflang properties.
     * @prop {Array} post.postCategories - An array of post categories.
     * @prop {Object} post.sharingOptions - An object representing sharing options.
     */
    post: { type: Object, required: true },
    /**
     * An array of sharing options to be displayed in the card.
     * @prop {Array} sharingOptions
     */
    sharingOptions: { type: Array, default: null },
    /**
     * Whether the card is initially collapsed or expanded.
     * @prop {boolean} collapsed
     */
    collapsed: { type: Boolean, default: false }
  },
  computed: {
    /**
     * The main URL of the RSS feed item.
     * @computed
     * @returns {Object} The main URL object.
     */
    postUrl: function () {
      return this.post.postUrls ? this.post.postUrls[0] : []
    },
    /**
     * Additional URLs of the RSS feed item (excluding the main URL).
     * @computed
     * @returns {Array} An array of additional URL objects.
     */
    postOtherUrls: function () {
      return this.post.postUrls && this.post.postUrls.length > 1
        ? this.post.postUrls.slice(1).filter((u) => u.href)
        : []
    }
  },
  emits: ['openPostUrl', 'share'],
  setup() {
    const { formatTimestamp } = useTimestamp()
    const { t } = useI18n()

    return {
      formatTimestamp,
      t /* i18n translator */
    }
  },
  data() {
    return {
      showPostCategories: false,
      showPostSharing: false,
      showFullPost: !this.collapsed,
      showFirstEnclosure: false
    }
  },
  methods: {
    /**
     * Checks if the given string is a URL.
     * @method isUrl
     * @param {string} str - The string to be checked.
     * @returns {boolean} True if the string is a URL; otherwise, false.
     */
    isUrl(str) {
      return str && str.trim().toLowerCase().indexOf('http') === 0
    },
    /**
     * Checks if the content object contains HTML content.
     * @method isHtmlContent
     * @param {Object} contentObj - The content object to be checked.
     * @returns {boolean} True if the content object contains HTML content; otherwise, false.
     */
    isHtmlContent(contentObj) {
      return (
        contentObj != null &&
        contentObj.type != null &&
        contentObj.type.toLowerCase().indexOf('html') >= 0
      )
    }
  }
}
</script>

<style scoped>
.post-html-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}

.post-text-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}

.clickable:hover {
  cursor: pointer;
  user-select: none;
}

/** */
.card {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0.5rem;
}

.title {
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
}

.title:hover {
  background-color: #f5f5f5;
}

.post-html-frame,
.post-text-frame {
  font-size: 1rem;
  line-height: 1.5;
  color: #333333;
}

.divider {
  background-color: lightgreen;
  border: 0;
  height: 1px;
}

.category {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666666;
}

.category:hover {
  background-color: #e0e0e0;
}

.post-link {
  margin-right: 1rem;
}

.post-link a {
  color: #007bff;
  text-decoration: none;
}

.post-link a:hover {
  text-decoration: underline;
}

.actions {
  margin-top: 1rem;
}

.actions button {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

.actions button:hover {
  background-color: #0056b3;
}

/* "showPostCategories" and "showPostSharing" buttons */
.show-post-btn {
  background-color: #f0f0f0;
  color: #333333;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

.show-post-btn:hover {
  background-color: #e0e0e0;
}

/* post sharing buttons */
.share-btn {
  background-color: #f0f0f0;
  color: #333333;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

.share-btn:hover {
  background-color: #e0e0e0;
}

.post-main-link-anchor {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.post-main-link-anchor:hover {
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
}

.post-main-link-anchor {
  min-height: 48px;
  min-width: 48px;
  border-radius: 8px;
}

.post-comment-link-anchor {
  display: flex;
  align-items: left;
  justify-content: flex-start;
  background-color: #ffffff;
  width: fit-content;
}

.post-comment-link-anchor:hover {
  text-decoration: underline;
}
</style>
