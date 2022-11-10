import { Parser } from 'acorn'
import jsx from 'acorn-jsx'
import { visit } from 'unist-util-visit'

const parser = Parser.extend(jsx())
/**
 * Code fence only pass code and language, this plugin can pass custom properties
 */
/** @type {import('unified').Plugin<[], import('mdast').Root>} */
export default function remarkMdxMetaToProps() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      console.log('node', node);
      if (!node.meta) return
      const code = JSON.stringify(`${node.value}`)
      const value = `<code className="language-${node.lang}" ${node.meta}>{${code}}</code>`
      const estree = parser.parse(value, { ecmaVersion: 'latest' })
      console.log('estree', estree);
      
      parent.children[index] = { type: 'mdxFlowExpression', value, data: { estree } }
    })
  }
}
