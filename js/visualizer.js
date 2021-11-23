const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

/* Audio Settings */

const fftSize = 512;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("DOMContentLoaded", function () {
  console.log("load");
});

class Bar {
  constructor(x, y, width, height, color, index) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.index = index;
  }

  update(microphoneVolume) {
    const originalMicrophoneVolume = microphoneVolume * 1000;

    if (originalMicrophoneVolume > this.height)
      this.height = originalMicrophoneVolume;
    else this.height -= this.height * 0.03;
  }

  draw(volume) {
    context.strokeStyle = this.color;
    context.save();
    context.translate(0, 0);
    context.rotate(this.index * 0.03);
    context.scale(1 + volume * 0.2, 1 + volume * 0.2);

    context.beginPath();
    // context.moveTo(this.x, this.y);
    // context.lineTo(this.y, this.height);
    context.bezierCurveTo(0, 0, this.height, this.height, this.x, this.y);
    context.stroke();

    context.rotate(this.index * 0.02);
    // context.strokeRect(
    //   this.y + this.index * 1.5,
    //   this.height,
    //   this.height / 2,
    //   5
    // );

    context.beginPath();
    context.arc(
      this.x + this.index * 2.5,
      this.y,
      this.height * 0.5,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }
}

const microphone = new Microphone(fftSize);

const bars = [];
const barWidth = canvas.width / (fftSize / 2);

let angle = 0;
let softVolume = 0;

for (let i = 0; i < fftSize / 2; i++) {
  const color = `hsl(${i * 2}, 100%, 50%)`;
  bars.push(new Bar(0, i * 1.25, 5, 50, color, i));
}

function animate() {
  if (microphone.initialized) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const samples = microphone.getSamples();
    const volume = microphone.getVolume();

    angle -= 0.0001 + volume * 0.05;

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(angle);

    bars.forEach((bar, index) => {
      bar.update(samples[index]);
      bar.draw(volume);
    });

    context.restore();
    softVolume *= 0.9 + volume * 0.1;
  }
  requestAnimationFrame(animate);
}

// Start animate
animate();
