function startMusic(file) {
  const music = new Audio();
  music.src = file;
  music.play();
}

export { startMusic };
