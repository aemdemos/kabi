export default function decorate(block) {
  // hero-landing: no additional JS decoration needed
  // The block checks for picture element and adds no-image class if absent
  const pic = block.querySelector('picture');
  if (!pic) {
    block.classList.add('no-image');
  }
}
