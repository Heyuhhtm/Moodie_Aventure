const modal = document.getElementById('modal');
const signinBtn = document.querySelector('.signin-circle');
const closeBtn = document.getElementById('closeBtn');

// Open Modal
signinBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close Modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Background Video Controls
const video = document.getElementById('bg-video');
const videoBtn = document.getElementById('video-control-btn');

videoBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        videoBtn.innerHTML = '⏸';
        videoBtn.title = 'Pause Video';
    } else {
        video.pause();
        videoBtn.innerHTML = '▶️';
        videoBtn.title = 'Play Video';
    }
});