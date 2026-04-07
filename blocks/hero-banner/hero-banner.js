export default function decorate(block) {
  // hero-banner: no additional JS decoration needed
  const pic = block.querySelector('picture');
  if (!pic) {
    block.classList.add('no-image');
  }
}
