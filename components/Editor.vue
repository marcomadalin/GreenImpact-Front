<template>
  <ClientOnly>
    <!-- Use the component in the right place of the template -->
    <tiptap-vuetify
      v-model="contentEditor"
      :extensions="extensions"
      :card-props="{ flat: flat, color }"
      @input="$emit('update:text', contentEditor)"
      @keydown="$emit('resetError', $htmlToText(contentEditor).length)"
    />

    <template #placeholder> {{ $t('loading') }}... </template>
  </ClientOnly>
</template>

<script>
// import the component and the necessary extensions
import {
  TiptapVuetify,
  Bold,
  Italic,
  Strike,
  Underline,
  Paragraph,
  Link,
  HardBreak,
  History,
} from 'tiptap-vuetify'

export default {
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify },
  props: {
    content: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'white',
    },
    flat: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    // declare extensions you want to use
    extensions: [
      History,
      Link,
      Underline,
      Strike,
      Italic,
      Bold,
      Paragraph,
      HardBreak,
    ],
    // starting editor's content    ,
    contentEditor: '',
  }),
  watch: {
    content: {
      immediate: true,
      handler(val, oldVal) {
        this.contentEditor = val
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.editor-header header.v-application .grey.lighten-4 {
  background-color: var(--v-darkGray-base) !important;
}
</style>
