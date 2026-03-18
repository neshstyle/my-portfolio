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

});
