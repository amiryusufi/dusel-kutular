const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Oyun parametreleri
const player = { x: canvas.width / 2 - 50, y: canvas.height - 30, width: 100, height: 20, dx: 5 };
const boxes = [];
let score = 0;
let lives = 3;
let isGameOver = false;

// Klavye kontrolü
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") rightPressed = true;
  if (e.code === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") rightPressed = false;
  if (e.code === "ArrowLeft") leftPressed = false;
});

// Kutular oluştur
function createBox() {
  const x = Math.random() * (canvas.width - 20);
  boxes.push({ x: x, y: 0, width: 20, height: 20, dy: 2 + Math.random() * 3 });
}

// Oyun döngüsü
function update() {
  if (isGameOver) return;

  // Oyuncuyu hareket ettir
  if (rightPressed && player.x + player.width < canvas.width) {
    player.x += player.dx;
  }
  if (leftPressed && player.x > 0) {
    player.x -= player.dx;
  }

  // Kutuları hareket ettir ve kontrol et
  for (let i = boxes.length - 1; i >= 0; i--) {
    boxes[i].y += boxes[i].dy;

    // Kutunun oyuncu ile çarpışmasını kontrol et
    if (
      boxes[i].x < player.x + player.width &&
      boxes[i].x + boxes[i].width > player.x &&
      boxes[i].y + boxes[i].height > player.y
    ) {
      boxes.splice(i, 1); // Kutuyu kaldır
      score++; // Skoru artır
    }

    // Kutunun alt kenara ulaşmasını kontrol et
    else if (boxes[i].y > canvas.height) {
      boxes.splice(i, 1); // Kutuyu kaldır
      lives--; // Bir can kaybet
      if (lives === 0) {
        isGameOver = true;
      }
    }
  }

  // Yeni kutu oluştur
  if (Math.random() < 0.02) {
    createBox();
  }
}

// Çizim işlemleri
function draw() {
  // Arkaplanı temizle
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Oyuncuyu çiz
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Kutuları çiz
  ctx.fillStyle = "red";
  boxes.forEach((box) => {
    ctx.fillRect(box.x, box.y, box.width, box.height);
  });

  // Skoru çiz
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 10, 20);

  // Canları çiz
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 20);

  // Oyun bitti mesajı
  if (isGameOver) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Refresh to Restart", canvas.width / 2 - 100, canvas.height / 2 + 40);
  }
}

// Ana oyun döngüsü
function gameLoop() {
  update();
  draw();
  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Oyunu başlat
gameLoop();
