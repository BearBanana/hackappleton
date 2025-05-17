const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const timerEl = document.getElementById('timer');

    let tug = { x: 640, y: 360, size: 30 };
    let clawRadius = 50;
    let debris = [], startTime = 0, gameRunning = false;
    const totalDebris = 10;

    function startGame() {
      document.getElementById('menu').style.display = 'none';
      canvas.style.display = 'block';
      debris = Array.from({ length: totalDebris }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 20,
        collected: false
      }));
      startTime = performance.now();
      gameRunning = true;
      requestAnimationFrame(gameLoop);
    }

    function drawTug() {
      ctx.fillStyle = '#0ff';
      ctx.beginPath();
      ctx.arc(tug.x, tug.y, tug.size, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawDebris() {
      for (let d of debris) {
        if (!d.collected) {
          const dx = d.x - tug.x, dy = d.y - tug.y, dist = Math.hypot(dx, dy);
          if (dist < clawRadius) {
            d.x -= dx * 0.1;
            d.y -= dy * 0.1;
            if (dist < 10) d.collected = true;
          }
          ctx.fillStyle = '#aaa';
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawClaw() {
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(tug.x, tug.y, clawRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    function updateTimer() {
      timerEl.textContent = ((performance.now() - startTime) / 1000).toFixed(2);
    }

    function gameLoop() {
      if (!gameRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateTimer();
      drawClaw();
      drawTug();
      drawDebris();
      if (debris.every(d => d.collected)) {
        gameRunning = false;
        alert("Mission Complete! Time: " + timerEl.textContent + "s");
        location.reload();
        return;
      }
      requestAnimationFrame(gameLoop);
    }

    window.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      tug.x = e.clientX - r.left;
      tug.y = e.clientY - r.top;
    });
