export default function decorate(block) {
  // add parallax effect to hero images
  const picture = block.querySelector('picture');
  if (picture) {
    picture.classList.add('hero-image-parallax');
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      picture.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
  }
}
