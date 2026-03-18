// ============================================
// Anesh Maharaj — Portfolio
// script.js — Main JavaScript File
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('// Portfolio initialized');

  // ============================================
  // LOADING SCREEN
  // ============================================
  const loader   = document.getElementById('loader');
  const fillEl   = document.getElementById('progress-fill');
  const pctEl    = document.getElementById('pct');
  const skipBtn  = document.querySelector('.skip-btn');

  // Matrix rain on loader
  const lmc   = document.getElementById('loader-matrix');
  const lmctx = lmc.getContext('2d');
  lmc.width   = window.innerWidth;
  lmc.height  = window.innerHeight;

  const katakana  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
  const lFontSize = 14;
  const lCols     = Math.floor(lmc.width / lFontSize);
  const lDrops    = Array(lCols).fill(1);

  function drawLoaderMatrix() {
    lmctx.fillStyle = 'rgba(8,8,8,0.05)';
    lmctx.fillRect(0, 0, lmc.width, lmc.height);
    lDrops.forEach(function(y, i) {
      var char = Math.random() > 0.3
        ? katakana[Math.floor(Math.random() * katakana.length)]
        : Math.floor(Math.random() * 10).toString();
      var b = Math.random();
      if (b > 0.96) {
        lmctx.fillStyle = 'rgba(220,255,220,0.95)';
        lmctx.font = 'bold ' + lFontSize + 'px JetBrains Mono';
      } else if (b > 0.75) {
        lmctx.fillStyle = 'rgba(0,255,65,0.9)';
        lmctx.font = lFontSize + 'px JetBrains Mono';
      } else if (b > 0.45) {
        lmctx.fillStyle = 'rgba(0,200,50,0.6)';
        lmctx.font = lFontSize + 'px JetBrains Mono';
      } else {
        lmctx.fillStyle = 'rgba(0,130,30,0.35)';
        lmctx.font = lFontSize + 'px JetBrains Mono';
      }
      lmctx.fillText(char, i * lFontSize, y * lFontSize);
      if (y * lFontSize > lmc.height && Math.random() > 0.975) lDrops[i] = 0;
      lDrops[i]++;
    });
  }

  var matrixInterval = setInterval(drawLoaderMatrix, 40);

  // percentage counter
  var pct = 0;
  var pctTimer = setInterval(function() {
    if (pct < 25)      pct += 2;
    else if (pct < 60) pct += 1.5;
    else if (pct < 80) pct += 0.8;
    else if (pct < 95) pct += 0.3;
    else if (pct < 100) pct += 0.1;
    if (pct >= 100) {
      pct = 100;
      clearInterval(pctTimer);
    }
    pctEl.textContent = Math.floor(pct) + '%';
  }, 40);

  // auto hide after 3.4s
  var loaderTimer = setTimeout(function() {
    hideLoader();
  }, 3400);

  function hideLoader() {
    clearInterval(matrixInterval);
    clearTimeout(loaderTimer);
    loader.classList.add('hide');
    if (skipBtn) skipBtn.style.display = 'none';
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', function() {
      hideLoader();
    });
  }

  window.skipLoader = hideLoader;
// ============================================
  // PARTICLE CONSTELLATION — HERO
  // ============================================
  var pc     = document.getElementById('particle-canvas');
  if (pc) {
    var pctx   = pc.getContext('2d');
    pc.width   = window.innerWidth;
    pc.height  = window.innerHeight;

    var mouse = { x: pc.width / 2, y: pc.height / 2 };

    var particles = [];

    function Particle() {
      this.x      = Math.random() * pc.width;
      this.y      = Math.random() * pc.height;
      this.r      = Math.random() * 1.8 + 0.4;
      this.dx     = (Math.random() - 0.5) * 0.4;
      this.dy     = (Math.random() - 0.5) * 0.4;
      this.alpha  = Math.random() * 0.6 + 0.2;
      this.exploding  = false;
      this.explodeDx  = 0;
      this.explodeDy  = 0;
      this.life       = 1;
    }

    Particle.prototype.update = function() {
      if (this.exploding) {
        this.x += this.explodeDx;
        this.y += this.explodeDy;
        this.explodeDx *= 0.92;
        this.explodeDy *= 0.92;
        this.life -= 0.02;
        if (this.life <= 0) {
          this.x     = Math.random() * pc.width;
          this.y     = Math.random() * pc.height;
          this.exploding = false;
          this.life  = 1;
        }
        return;
      }
      this.x += this.dx;
      this.y += this.dy;

      // mouse repulsion
      var mdx   = this.x - mouse.x;
      var mdy   = this.y - mouse.y;
      var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 100) {
        var force = (100 - mdist) / 100;
        this.x += (mdx / mdist) * force * 2;
        this.y += (mdy / mdist) * force * 2;
      }

      if (this.x < 0 || this.x > pc.width)  this.dx *= -1;
      if (this.y < 0 || this.y > pc.height) this.dy *= -1;
    };

    Particle.prototype.draw = function() {
      var a = this.exploding ? this.alpha * this.life : this.alpha;
      pctx.beginPath();
      pctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      pctx.fillStyle = 'rgba(201,168,76,' + a + ')';
      pctx.fill();

      // glow
      var grad = pctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      grad.addColorStop(0, 'rgba(201,168,76,' + (a * 0.3) + ')');
      grad.addColorStop(1, 'rgba(201,168,76,0)');
      pctx.beginPath();
      pctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      pctx.fillStyle = grad;
      pctx.fill();
    };

    Particle.prototype.explode = function() {
      this.exploding  = true;
      var angle       = Math.random() * Math.PI * 2;
      var speed       = Math.random() * 8 + 3;
      this.explodeDx  = Math.cos(angle) * speed;
      this.explodeDy  = Math.sin(angle) * speed;
      this.life       = 1;
      this.alpha      = Math.random() * 0.8 + 0.4;
      this.r          = Math.random() * 2.5 + 0.8;
    };

    // init 220 particles (dense)
    for (var i = 0; i < 220; i++) {
      particles.push(new Particle());
    }

    function drawLines() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx   = particles[i].x - particles[j].x;
          var dy   = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            var alpha = (1 - dist / 130) * 0.12;
            pctx.beginPath();
            pctx.moveTo(particles[i].x, particles[i].y);
            pctx.lineTo(particles[j].x, particles[j].y);
            pctx.strokeStyle = 'rgba(201,168,76,' + alpha + ')';
            pctx.lineWidth = 0.6;
            pctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      pctx.clearRect(0, 0, pc.width, pc.height);
      drawLines();
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // mouse move
    document.getElementById('hero').addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // click explode
    document.getElementById('hero').addEventListener('click', function(e) {
      for (var i = 0; i < particles.length; i++) {
        var dist = Math.sqrt(
          Math.pow(particles[i].x - e.clientX, 2) +
          Math.pow(particles[i].y - e.clientY, 2)
        );
        if (dist < 180) particles[i].explode();
      }
      // burst at click
      for (var b = 0; b < 20; b++) {
        var burst  = new Particle();
        burst.x    = e.clientX;
        burst.y    = e.clientY;
        burst.explode();
        particles.push(burst);
      }
      if (particles.length > 280) particles.splice(220, particles.length - 220);
    });

    window.addEventListener('resize', function() {
      pc.width  = window.innerWidth;
      pc.height = window.innerHeight;
    });
  }
});
