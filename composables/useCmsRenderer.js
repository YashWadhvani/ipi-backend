import { h } from 'vue'
import CmsSlider from '~/components/cms/CmsSlider.vue'
import CmsEventsFeed from '~/components/cms/CmsEventsFeed.vue'

export function renderBlock(block) {
  if (!block || !block.type) return null
  switch (block.type) {
    case 'slider': return h(CmsSlider, block.props || {})
    case 'events-feed': return h(CmsEventsFeed, block.props || {})
    case 'hero':
      return h('section', { class: 'hero section' }, [
        h('div', { class: 'container' }, [
          h('h1', block.props?.heading || 'Heading'),
          h('p', block.props?.sub || '')
        ])
      ])
    case 'rich-text':
      return h('section', { class: 'rt section', innerHTML: block.props?.html || '' })
    default:
      return h('div', `Unknown block: ${block.type}`)
  }
}
