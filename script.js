
/* ===== Epic Visualizer v2.1 Styles ===== */

/* Reset + Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #00ffff;
  --secondary-color: #ff00ff;
  --accent-color: #ffff00;
  --dark-bg: #0a0a0a;
  --light-bg: #1a1a2e;
  --glass-bg: rgba(22, 33, 62, 0.8);
  --text-light: #ffffff;
  --text-dim: rgba(255, 255, 255, 0.7);
  --gradient-primary: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  --shadow-glow: 0 0 20px rgba(0, 255, 255, 0.5);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body, html {
  height: 100%;
  font-family: 'Rajdhani', sans-serif;
  background: var(--dark-bg);
  color: var(--text-light);
  overflow: hidden;
}

.screen {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.screen.active {
  opacity: 1;
  visibility: visible;
}

/* Setup Screen */
#setup-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: radial-gradient(circle at center, var(--light-bg) 0%, #0f0f23 100%);
  overflow-y: auto;
}

.setup-container {
  max-width: 800px;
  width: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.setup-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.setup-header h1 {
  font-family: 'Orbitron', monospace;
  font-size: clamp(2rem, 5vw, 3.5rem);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 2s ease-in-out infinite alternate;
}

.setup-header p {
  color: var(--text-dim);
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.setup-step {
  margin-bottom: 2rem;
}

.setup-step h2 {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.file-label:hover {
  background: rgba(0, 0, 0, 0.5);
  border-color: var(--primary-color);
}

.file-label .file-icon {
  font-size: 2rem;
}

.file-label span {
  font-size: 1.1rem;
  color: var(--text-dim);
}

input[type="file"] {
  display: none;
}

.timestamp-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 1rem;
}

.timestamp-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.timestamp-item img {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
}

.timestamp-item .file-info {
  flex-grow: 1;
  font-size: 0.9rem;
  color: var(--text-dim);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.timestamp-item input[type="number"] {
  width: 80px;
  padding: 0.5rem;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--text-light);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
}

#launch-btn {
  width: 100%;
  padding: 1rem;
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  color: var(--dark-bg);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

#launch-btn:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: var(--shadow-glow);
}

#launch-btn:disabled {
  background: #555;
  color: #888;
  cursor: not-allowed;
}

.error-text {
  color: #ff6b6b;
  margin-top: 0.5rem;
  text-align: center;
  height: 1.2rem;
}

/* Visualizer Screen */
#visualizer-screen {
  background: var(--dark-bg);
}

#particle-canvas, #background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
}

#background-video {
  z-index: -1;
  object-fit: cover;
  opacity: 0.3;
  filter: blur(2px);
}

#audio-controls {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 15px 25px;
  z-index: 100;
  box-shadow: var(--shadow-glow);
}

.control-btn {
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: var(--transition-smooth);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-dim);
}

#visualizer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.lyric-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

#lyric-slide {
  max-width: 100%;
  max-height: 100%;
  opacity: 0;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.3));
  border-radius: 15px;
  transform: scale(0.9);
}

#lyric-slide.active {
  opacity: 1;
  transform: scale(1);
}

/* Animations */
@keyframes glow {
  from { text-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }
  to { text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(255, 0, 255, 0.3); }
}

/* Responsive */
@media (max-width: 768px) {
  .setup-container {
    padding: 1.5rem;
  }
  .setup-header h1 {
    font-size: clamp(1.8rem, 6vw, 2.5rem);
  }
  .file-label {
    flex-direction: column;
    text-align: center;
  }
}
