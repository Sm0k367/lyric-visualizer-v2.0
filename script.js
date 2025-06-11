// ===== Epic Visualizer v2.1 Script =====

class EpicVisualizerV2 {
  constructor() {
    this.config = {
      audioFile: null,
      lyrics: [],
    };
    this.visualizerActive = false;
    this.animationFrameId = null;

    // DOM References
    this.setupScreen = document.getElementById('setup-screen');
    this.visualizerScreen = document.getElementById('visualizer-screen');
    this.audioUpload = document.getElementById('audio-upload');
    this.imageUpload = document.getElementById('image-upload');
    this.audioFileName = document.getElementById('audio-file-name');
    this.imageFileCount = document.getElementById('image-file-count');
    this.timestampConfig = document.getElementById('timestamp-config');
    this.launchBtn = document.getElementById('launch-btn');
    this.validationMessage = document.getElementById('validation-message');
    this.audio = document.getElementById('audio');
    this.lyricSlide = document.getElementById('lyric-slide');
    this.particleCanvas = document.getElementById('particle-canvas');
    this.playPauseBtn = document.getElementById('play-pause-btn');
    this.volumeBtn = document.getElementById('volume-btn');
    this.exitBtn = document.getElementById('exit-btn');
    this.progressBar = document.querySelector('.progress-bar');
    this.progressFill = document.querySelector('.progress-fill');
    this.currentTimeEl = document.getElementById('current-time');
    this.durationEl = document.getElementById('duration');

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.audioUpload.addEventListener('change', this.handleAudioUpload.bind(this));
    this.imageUpload.addEventListener('change', this.handleImageUpload.bind(this));
    this.launchBtn.addEventListener('click', this.launchVisualizer.bind(this));
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.exitBtn.addEventListener('click', this.exitVisualizer.bind(this));
    this.progressBar.addEventListener('click', (e) => this.seekAudio(e));
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('ended', () => this.handleAudioEnd());
  }

  handleAudioUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.config.audioFile = file;
      this.audioFileName.textContent = file.name;
      this.validateInputs();
    }
  }

  handleImageUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      this.config.lyrics = [];
      this.timestampConfig.innerHTML = '';
      const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));

      sortedFiles.forEach((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        this.config.lyrics.push({ time: 0, imageFile: file, imageUrl });

        const item = document.createElement('div');
        item.className = 'timestamp-item';
        item.innerHTML = `
          <img src="${imageUrl}" alt="Preview">
          <span class="file-info">${file.name}</span>
          <input type="number" class="timestamp-input" data-index="${index}" min="0" step="0.1" value="0">
        `;
        this.timestampConfig.appendChild(item);
      });

      this.imageFileCount.textContent = `${files.length} image(s) selected`;
      this.addTimestampInputListeners();
      this.validateInputs();
    }
  }

  addTimestampInputListeners() {
    const inputs = this.timestampConfig.querySelectorAll('.timestamp-input');
    inputs.forEach(input => {
      input.addEventListener('change', (event) => {
        const index = parseInt(event.target.dataset.index);
        const time = parseFloat(event.target.value);
        if (!isNaN(time)) {
          this.config.lyrics[index].time = time;
        }
      });
    });
  }

  validateInputs() {
    const audioReady = this.config.audioFile !== null;
    const imagesReady = this.config.lyrics.length > 0;

    if (audioReady && imagesReady) {
      this.launchBtn.disabled = false;
      this.validationMessage.textContent = '';
    } else {
      this.launchBtn.disabled = true;
      if (!audioReady) this.validationMessage.textContent = 'Please select an audio file.';
      else if (!imagesReady) this.validationMessage.textContent = 'Please select at least one image file.';
    }
  }

  launchVisualizer() {
    this.config.lyrics.sort((a, b) => a.time - b.time);
    this.audio.src = URL.createObjectURL(this.config.audioFile);
    this.audio.load();

    this.setupScreen.classList.remove('active');
    this.visualizerScreen.classList.add('active');
    this.visualizerActive = true;

    this.currentIndex = 0;
    this.showLyric(0);
    this.initParticleSystem();

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.playPauseBtn.classList.add('playing');
    }).catch(error => {
      console.error("Playback failed:", error);
      alert("Could not start audio playback. Please ensure your browser allows it.");
    });
  }

  exitVisualizer() {
    this.audio.pause();
    this.audio.src = '';
    this.isPlaying = false;
    this.visualizerActive = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    this.config.lyrics.forEach(lyric => URL.revokeObjectURL(lyric.imageUrl));
    if (this.config.audioFile) URL.revokeObjectURL(this.audio.src);

    this.visualizerScreen.classList.remove('active');
    this.setupScreen.classList.add('active');
  }

  showLyric(index) {
    if (!this.config.lyrics[index]) return;
    this.lyricSlide.classList.remove('active');
    setTimeout(() => {
      this.lyricSlide.src = this.config.lyrics[index].imageUrl;
      this.lyricSlide.classList.add('active');
    }, 500);
  }

  updateProgress() {
    if (!this.audio.duration) return;
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    this.progressFill.style.width = `${progress}%`;
    this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    this.checkLyricTiming();
  }

  checkLyricTiming() {
    const currentTime = this.audio.currentTime;
    while (
      this.currentIndex < this.config.lyrics.length - 1 &&
      currentTime >= this.config.lyrics[this.currentIndex + 1].time
    ) {
      this.currentIndex++;
      this.showLyric(this.currentIndex);
    }
  }

  updateDuration() {
    this.durationEl.textContent = this.formatTime(this.audio.duration);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      this.playPauseBtn.classList.remove('playing');
    } else {
      this.audio.play();
      this.isPlaying = true;
      this.playPauseBtn.classList.add('playing');
    }
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.volumeBtn.textContent = this.audio.muted ? '🔇' : '🔊';
  }

  seekAudio(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    this.audio.currentTime = percentage * this.audio.duration;

    for (let i = this.config.lyrics.length - 1; i >= 0; i--) {
      if (this.audio.currentTime >= this.config.lyrics[i].time) {
        this.currentIndex = i;
        this.showLyric(i);
        break;
      }
    }
  }

  handleAudioEnd() {
    this.isPlaying = false;
    this.playPauseBtn.classList.remove('playing');
    this.audio.currentTime = 0;
    this.currentIndex = 0;
    this.showLyric(0);
  }

  initParticleSystem() {
    const canvas = this.particleCanvas;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.particles = [];

    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`
      });
    }

    const animate = () => {
      if (!this.visualizerActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.epicVisualizerV2 = new EpicVisualizerV2();
});
