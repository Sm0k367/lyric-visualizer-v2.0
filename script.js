// ===== Epic Visualizer v3.0 Script =====

class EpicVisualizer {
  constructor() {
    this.audio = document.getElementById('audio');
    this.slide = document.getElementById('slide');
    this.audioUpload = document.getElementById('audio-upload');
    this.imageUpload = document.getElementById('image-upload');
    this.launchBtn = document.getElementById('launch-btn');
    this.playPauseBtn = document.getElementById('play-pause-btn');
    this.exitBtn = document.getElementById('exit-btn');
    this.audioFileName = document.getElementById('audio-file-name');
    this.imageFileCount = document.getElementById('image-file-count');

    this.audioFile = null;
    this.imageFiles = [];
    this.imageUrls = [];
    this.currentIndex = 0;
    this.timerId = null;
    this.slideDuration = 0;

    this.init();
  }

  init() {
    this.audioUpload.addEventListener('change', (e) => this.handleAudioUpload(e));
    this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
    this.launchBtn.addEventListener('click', () => this.launchVisualizer());
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    this.exitBtn.addEventListener('click', () => this.exitVisualizer());
  }

  handleAudioUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.audioFile = file;
      this.audioFileName.textContent = file.name;
      this.validateLaunch();
    }
  }

  handleImageUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      this.imageFiles = files.sort((a, b) => a.name.localeCompare(b.name));
      this.imageUrls = this.imageFiles.map(file => URL.createObjectURL(file));
      this.imageFileCount.textContent = `${files.length} image(s) selected`;
      this.validateLaunch();
    }
  }

  validateLaunch() {
    this.launchBtn.disabled = !(this.audioFile && this.imageFiles.length > 0);
  }

  launchVisualizer() {
    // Load audio
    this.audio.src = URL.createObjectURL(this.audioFile);
    this.audio.load();

    // When metadata is ready, start slideshow
    this.audio.onloadedmetadata = () => {
      const totalDuration = this.audio.duration;
      const totalImages = this.imageUrls.length;
      this.slideDuration = totalDuration / totalImages;
      this.startSlideshow();
    };

    // Show visualizer screen
    document.getElementById('setup-screen').classList.remove('active');
    document.getElementById('visualizer-screen').classList.add('active');
  }

  startSlideshow() {
    this.currentIndex = 0;
    this.audio.play();
    this.isPlaying = true;
    this.playPauseBtn.textContent = '⏸';

    this.showSlide(this.currentIndex);

    this.timerId = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.imageUrls.length) {
        clearInterval(this.timerId);
        return;
      }
      this.showSlide(this.currentIndex);
    }, this.slideDuration * 1000);
  }

  showSlide(index) {
    this.slide.classList.remove('fade-left', 'fade-right');
    this.slide.src = this.imageUrls[index];

    // Alternate fade direction
    const direction = index % 2 === 0 ? 'fade-left' : 'fade-right';
    setTimeout(() => {
      this.slide.classList.add(direction);
    }, 50);
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.audio.pause();
      clearInterval(this.timerId);
      this.playPauseBtn.textContent = '▶';
    } else {
      this.audio.play();
      this.resumeSlideshow();
      this.playPauseBtn.textContent = '⏸';
    }
    this.isPlaying = !this.isPlaying;
  }

  resumeSlideshow() {
    const remainingImages = this.imageUrls.length - this.currentIndex - 1;
    this.timerId = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.imageUrls.length) {
        clearInterval(this.timerId);
        return;
      }
      this.showSlide(this.currentIndex);
    }, this.slideDuration * 1000);
  }

  exitVisualizer() {
    this.audio.pause();
    clearInterval(this.timerId);
    this.audio.src = '';
    this.slide.src = '';
    this.currentIndex = 0;
    this.playPauseBtn.textContent = '▶';
    this.isPlaying = false;

    this.imageUrls.forEach(url => URL.revokeObjectURL(url));
    URL.revokeObjectURL(this.audio.src);

    document.getElementById('visualizer-screen').classList.remove('active');
    document.getElementById('setup-screen').classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new EpicVisualizer();
});
