// Wraps every `## Heading` and the content up to the next `##` in a
// <section class="md-section md-<slug>">. The article layout styles a few of
// them (for example "In D365FO today" becomes the dark box of the mockup).

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/\+\+/g, 'pp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function rehypeSections() {
  return (tree) => {
    const out = [];
    let current = null;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        const s = slug(textOf(node));
        current = {
          type: 'element',
          tagName: 'section',
          properties: { className: ['md-section', `md-${s}`] },
          children: [node],
        };
        out.push(current);
      } else if (current) {
        current.children.push(node);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}
