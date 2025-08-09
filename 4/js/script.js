// GitHub Projects Integration
const GITHUB_USERNAME = 'Special-Srit';

// Language to icon mapping
const languageIcons = {
    'JavaScript': 'fab fa-js-square',
    'TypeScript': 'fab fa-js-square',
    'Python': 'fab fa-python',
    'React': 'fab fa-react',
    'Vue': 'fab fa-vuejs',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'Java': 'fab fa-java',
    'PHP': 'fab fa-php',
    'Ruby': 'fas fa-gem',
    'Go': 'fas fa-code',
    'Rust': 'fas fa-cog',
    'C++': 'fas fa-code',
    'C': 'fas fa-code',
    'Shell': 'fas fa-terminal',
    'Jupyter Notebook': 'fas fa-chart-bar',
    'default': 'fas fa-code'
};

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);

        if (!response.ok) {
            throw new Error('GitHub API request failed');
        }

        const repos = await response.json();
        displayProjects(repos);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        displayFallbackProjects();
    }
}

function displayProjects(repos) {
    const container = document.getElementById('projects-container');
    const loading = document.getElementById('loading');

    loading.remove();

    const filteredRepos = repos
        .filter(repo => !repo.fork && repo.description)
        .slice(0, 3);

    filteredRepos.forEach(repo => {
        const projectCard = createProjectCard(repo);
        container.appendChild(projectCard);
    });
}

function createProjectCard(repo) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';

    const iconClass = languageIcons[repo.language] || languageIcons['default'];
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();

    col.innerHTML = `
                <div class="card project-card">
                    <div class="project-img">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="project-content">
                        <h4 class="mb-3" style="color: var(--lavender-accent);">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <p class="mb-3">${repo.description || 'No description available.'}</p>
                        <div class="project-stats">
                            <i class="fas fa-star"></i>${repo.stargazers_count}
                            <i class="fas fa-code-branch ms-3"></i>${repo.forks_count}
                            <i class="fas fa-clock ms-3"></i>Updated ${updatedDate}
                        </div>
                        ${repo.language ? `<div class="mb-3"><span class="language-badge">${repo.language}</span></div>` : ''}
                        <div class="project-meta">
                            <a href="${repo.html_url}" target="_blank" class="btn-lavender me-2">
                                <i class="fab fa-github me-1"></i>View Code
                            </a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn-lavender">Live Demo</a>` : ''}
                        </div>
                    </div>
                </div>
            `;

    return col;
}

function displayFallbackProjects() {
    const container = document.getElementById('projects-container');
    const loading = document.getElementById('loading');

    loading.innerHTML = `
                <div class="col-12 text-center">
                    <p style="color: var(--text-secondary);">
                        Unable to load projects from GitHub. Please check the username or try again later.
                    </p>
                </div>
            `;
}

// Audio Visualizer
class AudioVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.audio = document.getElementById('audio-player');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.isInitialized = false;
        this.animationId = null;
        this.visualizationType = 'circle';

        this.setupCanvas();
        this.setupEventListeners();
        this.generateDemoAudio();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * window.devicePixelRatio;
            this.canvas.height = rect.height * window.devicePixelRatio;
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    async initializeAudio() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing audio context:', error);
        }
    }

    generateDemoAudio() {
        this.demoTracks = {
            'demo1': {
                title: 'Clearscapes',
                artist: 'Srit',
                url: 'Asset/Music/[Custom 1]-Clearscapes.mp3'
            },
            'demo2': {
                title: 'The Hermit',
                artist: 'Srit',
                url: 'Asset/Music/[Custom 2]-The Hermit.mp3'
            },
            'demo3': {
                title: '[Old] Wingbeats of flying',
                artist: 'Srit',
                url: 'Asset/Music/[Old]-Wingbeats of flying.mp3'
            }
        };
    }

    generateSineWave(frequency, duration) {
        const sampleRate = 44100;
        const numSamples = sampleRate * duration;
        const audioBuffer = new AudioBuffer({
            numberOfChannels: 1,
            length: numSamples,
            sampleRate: sampleRate
        });

        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < numSamples; i++) {
            channelData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
        }

        return this.audioBufferToBlob(audioBuffer);
    }

    generateComplexWave(baseFreq, duration) {
        const sampleRate = 44100;
        const numSamples = sampleRate * duration;
        const audioBuffer = new AudioBuffer({
            numberOfChannels: 1,
            length: numSamples,
            sampleRate: sampleRate
        });

        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            channelData[i] = (
                Math.sin(2 * Math.PI * baseFreq * t) * 0.3 +
                Math.sin(2 * Math.PI * baseFreq * 1.5 * t) * 0.2 +
                Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.1
            );
        }

        return this.audioBufferToBlob(audioBuffer);
    }

    generatePulseWave(frequency, duration) {
        const sampleRate = 44100;
        const numSamples = sampleRate * duration;
        const audioBuffer = new AudioBuffer({
            numberOfChannels: 1,
            length: numSamples,
            sampleRate: sampleRate
        });

        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const pulse = Math.sin(2 * Math.PI * frequency * t) > 0 ? 0.3 : -0.3;
            channelData[i] = pulse * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.5 * t));
        }

        return this.audioBufferToBlob(audioBuffer);
    }

    audioBufferToBlob(audioBuffer) {
        const length = audioBuffer.length;
        const arrayBuffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(arrayBuffer);


        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, audioBuffer.sampleRate, true);
        view.setUint32(28, audioBuffer.sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);


        const channelData = audioBuffer.getChannelData(0);
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }

        return URL.createObjectURL(new Blob([arrayBuffer], { type: 'audio/wav' }));
    }

    setupEventListeners() {

        this.audio.addEventListener('play', async () => {
            await this.initializeAudio();
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.startVisualization();
        });

        this.audio.addEventListener('pause', () => {
            this.stopVisualization();
        });

        // Visualization type buttons
        document.getElementById('bars-btn').addEventListener('click', () => {
            this.setVisualizationType('bars');
        });
        document.getElementById('wave-btn').addEventListener('click', () => {
            this.setVisualizationType('wave');
        });
        document.getElementById('circle-btn').addEventListener('click', () => {
            this.setVisualizationType('circle');
        });
        document.getElementById('particles-btn').addEventListener('click', () => {
            this.setVisualizationType('particles');
        });

        // Demo track buttons
        document.getElementById('demo-track-1').addEventListener('click', () => {
            this.loadTrack('demo1');
        });
        document.getElementById('demo-track-2').addEventListener('click', () => {
            this.loadTrack('demo2');
        });
        document.getElementById('demo-track-3').addEventListener('click', () => {
            this.loadTrack('demo3');
        });
    }

    setVisualizationType(type) {
        this.visualizationType = type;


        document.querySelectorAll('.visualizer-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${type}-btn`).classList.add('active');
    }

    loadTrack(trackId) {
        const track = this.demoTracks[trackId];
        if (track) {
            this.audio.src = track.url;
            document.getElementById('track-title').textContent = track.title;
            document.getElementById('track-artist').textContent = track.artist;
        }
    }

    startVisualization() {
        if (this.animationId) return;
        this.visualize();
    }

    stopVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    visualize() {
        this.animationId = requestAnimationFrame(() => this.visualize());

        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(this.dataArray);
        this.clearCanvas();

        switch (this.visualizationType) {
            case 'bars':
                this.drawBars();
                break;
            case 'wave':
                this.drawWave();
                break;
            case 'circle':
                this.drawCircle();
                break;
            case 'particles':
                this.drawParticles();
                break;
        }
    }

    clearCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
    }

    drawBars() {
        const rect = this.canvas.getBoundingClientRect();
        const barWidth = rect.width / this.dataArray.length * 2;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = (this.dataArray[i] / 255) * rect.height * 0.8;

            const hue = (i / this.dataArray.length) * 360;
            this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;

            this.ctx.fillRect(x, rect.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    drawWave() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.strokeStyle = '#7c3aed';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        const sliceWidth = rect.width / this.dataArray.length;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            const v = this.dataArray[i] / 255;
            const y = rect.height / 2 + (v - 0.5) * rect.height * 0.6;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.ctx.stroke();
    }

    drawCircle() {
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radius = Math.min(rect.width, rect.height) / 4;

        this.ctx.strokeStyle = '#7c3aed';
        this.ctx.lineWidth = 2;

        for (let i = 0; i < this.dataArray.length; i++) {
            const angle = (i / this.dataArray.length) * Math.PI * 2;
            const amplitude = (this.dataArray[i] / 255) * radius;

            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + amplitude);
            const y2 = centerY + Math.sin(angle) * (radius + amplitude);

            const hue = (i / this.dataArray.length) * 360;
            this.ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    drawParticles() {
        const rect = this.canvas.getBoundingClientRect();

        if (!this.particles) {
            this.particles = [];
            for (let i = 0; i < 100; i++) {
                this.particles.push({
                    x: Math.random() * rect.width,
                    y: Math.random() * rect.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1
                });
            }
        }

        const avgFreq = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;
        const intensity = avgFreq / 255;

        this.particles.forEach((particle, index) => {
            particle.x += particle.vx * (1 + intensity);
            particle.y += particle.vy * (1 + intensity);

            if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1;

            particle.x = Math.max(0, Math.min(rect.width, particle.x));
            particle.y = Math.max(0, Math.min(rect.height, particle.y));

            const hue = (index / this.particles.length) * 360;
            this.ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${intensity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * (1 + intensity), 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {
    fetchGitHubProjects();
    new AudioVisualizer();
});