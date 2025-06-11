// ===== EPIC TECH AI LYRIC VISUALIZER (v2) SCRIPT =====
// This version provides a user interface for uploading custom media.

class EpicVisualizerV2 {
  constructor() {
    // --- State Management ---
    this.config = {
      audioFile: null,
      lyrics: [], // Will be populated with { time, imageFile, imageUrl }
    };
    this.visualizerActive = false;
    this.animationFrameId = null;

    // --- Screen Elements ---
    this.setupScreen = document.getElementById('setup-screen');
    this.visualizerScreen = document.getElementById('visualizer-screen');

    // --- Setup Screen UI ---
    this.audioUpload = document.getElementById('audio-upload');
    this.imageUpload = document.getElementById('image-upload');
    this.audioFileName = document.getElementById('audio-file-name');
    this.imageFileCount = document.getElementById('image-file-count');
    this.timestampConfig = document.getElementById('timestamp-config');
    this.autoTimestampBtn = document.getElementById('auto-timestamp-btn'); // Added for auto-timestamp generation
    this.launchBtn = document.getElementById('launch-btn');
    this.validationMessage = document.getElementById('validation-message');

    // --- Visualizer Screen UI ---
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

  // --- INITIALIZATION ---
  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Setup Screen Listeners
    this.audioUpload.addEventListener('change', this.handleAudioUpload.bind(this));
    this.imageUpload.addEventListener('change', this.handleImageUpload.bind(this));
    this.autoTimestampBtn.addEventListener('click', this.autoGenerateTimestamps.bind(this)); // Added for auto-timestamp generation
    this.launchBtn.addEventListener('click', this.launchVisualizer.bind(this));

    // Visualizer Screen Listeners
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.exitBtn.addEventListener('click', this.exitVisualizer.bind(this));
    this.progressBar.addEventListener('click', (e) => this.seekAudio(e));
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('ended', () => this.handleAudioEnd());
  }

  // --- SETUP SCREEN LOGIC ---
  handleAudioUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.config.audioFile = file;
      this.audioFileName.textContent = file.name;
      this.validateInputs();
    }
  }

  handleImageUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
      this.config.lyrics = []; // Reset lyrics
      this.timestampConfig.innerHTML = ''; // Clear previous items
      
      // Sort files alphabetically for consistent order
      const sortedFiles = Array.from(files).sort((a, b) => a.name.localeCompare(b.name));

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

  autoGenerateTimestamps() {
    if (!this.config.audioFile || !this.audio.duration) {
      alert('Please upload an audio file first to determine its duration.');
      return;
    }
    if (this.config.lyrics.length === 0) {
      alert('Please upload images first.');
      return;
    }

    const audioDuration = this.audio.duration;
    const numberOfImages = this.config.lyrics.length;

    if (numberOfImages === 0) return; // Should be caught by above check, but good practice

    const stepDuration = audioDuration / numberOfImages;

    // First, update the time property in the config
    this.config.lyrics.forEach((lyric, index) => {
      lyric.time = index * stepDuration;
    });

    // Then, update the UI input fields
    // The lyrics array might be sorted differently than the UI elements if timestamps were previously edited.
    // It's safer to update UI inputs based on their data-index, assuming this.config.lyrics
    // is kept in the original upload order (or sorted alphabetically) until just before launch.
    // Let's re-fetch the inputs and update them.
    // The `handleImageUpload` sorts files alphabetically and creates lyrics and inputs in that order.
    // So, this.config.lyrics should match the order of inputs if not manually sorted yet by time.

    const timestampInputs = this.timestampConfig.querySelectorAll('.timestamp-input');

    // Assuming this.config.lyrics is currently sorted as it was upon image upload (e.g., alphabetically)
    // which matches the order of `timestampInputs` creation.
    // If `this.config.lyrics` could have been pre-sorted by time by another operation before this,
    // this direct loop might be problematic. However, `launchVisualizer` is the main place it's sorted by time.
    // For safety, let's assume `this.config.lyrics` is in the order that inputs were created.
    // (Alphabetical sort from `handleImageUpload`)

    this.config.lyrics.forEach((lyric, index) => {
      const inputElement = this.timestampConfig.querySelector(`.timestamp-input[data-index="${index}"]`);
      if (inputElement) {
        // Format to a reasonable number of decimal places, e.g., 1 or 2
        inputElement.value = lyric.time.toFixed(1);
      }
    });

    // Optional: Provide feedback to the user
    // console.log('Timestamps auto-generated:', this.config.lyrics);
    alert('Timestamps have been auto-generated based on audio duration and number of images.');
  }

  // --- TRANSITION & LAUNCH LOGIC ---
  launchVisualizer() {
    // Sort lyrics by timestamp before launching
    this.config.lyrics.sort((a, b) => a.time - b.time);

    // Set up the visualizer with user-provided data
    this.audio.src = URL.createObjectURL(this.config.audioFile);
    this.audio.load();

    // Switch screens
    this.setupScreen.classList.remove('active');
    this.visualizerScreen.classList.add('active');
    this.visualizerActive = true;

    // Initialize visualizer state
    this.currentIndex = 0;
    this.showLyric(0);
    this.initParticleSystem();

    // Start playback
    this.audio.play().then(() => {
        this.isPlaying = true;
        this.playPauseBtn.classList.add('playing');
    }).catch(error => {
        console.error("Playback failed:", error);
        alert("Could not start audio playback. Please ensure your browser allows it.");
    });
  }

  exitVisualizer() {
    // Cleanup visualizer state
    this.audio.pause();
    this.audio.src = '';
    this.isPlaying = false;
    this.visualizerActive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Revoke Object URLs to prevent memory leaks
    this.config.lyrics.forEach(lyric => URL.revokeObjectURL(lyric.imageUrl));
    if (this.config.audioFile) URL.revokeObjectURL(this.audio.src);

    // Switch back to setup screen
    this.visualizerScreen.classList.remove('active');
    this.setupScreen.classList.add('active');
  }

  // --- VISUALIZER LOGIC ---
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
    if (this.currentIndex < this.config.lyrics.length - 1 && currentTime >= this.config.lyrics[this.currentIndex + 1].time) {
      this.currentIndex++;
      this.showLyric(this.currentIndex);
    }
  }
  
  // --- All other visualizer methods (togglePlayPause, formatTime, etc.) are largely the same ---
  // (Re-including them for completeness)

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
    
    // Find the correct lyric for the new time
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
    this.animateParticles(ctx);
  }

  animateParticles(ctx) {
    const canvas = this.particleCanvas;
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

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.epicVisualizerV2 = new EpicVisualizerV2();
});