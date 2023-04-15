const anime = require('animejs/lib/anime');

const animationContainer = document.getElementById('animation-container');

const sizes = [24, 36, 48, 72, 96, 120, 144, 180];
const positions = [10, 30, 50, 70, 90, 110, 130, 150];

sizes.forEach((size, index) => {
  const block = document.createElement('div');
  block.className = 'block';
  if (index % 2 === 1) {
    block.classList.add('back-block');
  }
  block.style.width = `${size}px`;
  block.style.height = `${size}px`;
  block.style.left = `${positions[index]}px`;
  animationContainer.appendChild(block);
});

const animationTimeline = anime.timeline({
  targets: '.block',
  easing: 'easeOutElastic(1, .8)',
});

animationTimeline.add({
  keyframes: [
    { translateY: '50vh', duration: 1000 },
    { translateY: '-50px', duration: 1000 },
    { translateY: '0px', duration: 1000 },
  ],
  delay: anime.stagger(100),
});

animationTimeline.add({
  rotate: '1turn',
  duration: 2000,
  offset: '-=1000',
});
