const marquee = document.querySelector('.marquee div');

// Pause on hover
marquee.addEventListener('mouseover', () => {
  marquee.classList.add('paused');
});

marquee.addEventListener('mouseout', () => {
  marquee.classList.remove('paused');
});

// Pause on click
marquee.addEventListener('click', () => {
  marquee.classList.toggle('paused');
});