let music;

function startMusic(file) {
  music = new Audio();
  music.src = file;
  music.play();
}

function stopMusic() {
  music.pause();
}
export { startMusic, stopMusic };
// export { stopMusic };