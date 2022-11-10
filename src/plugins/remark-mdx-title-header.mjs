import { visit } from 'unist-util-visit'

export default () => (tree, file) => {
  visit(tree, 'heading', node => {
    visit(node, 'text', textNode => {
      const text = textNode.value ? textNode.value.trim() : '';
      textNode.value = text
    })
  })
}