import { visit } from 'unist-util-visit'
import { h } from 'hastscript'

/** @type {import('unified').Plugin<[], import('mdast').Root>} */
export default function remarkNoteBlock() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        if (!['tip', 'warning', 'danger'].includes(node.name)) return

        const data = node.data || (node.data = {})
        const tagName = 'div'

        data.hName = tagName
        data.hProperties = h(tagName, { class: `note ${node.name}` }).properties
      }
    })
  }
}
