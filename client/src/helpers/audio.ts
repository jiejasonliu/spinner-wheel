export async function playDing(volume = 100) {
    return playSound('/audio/ding.mp3', volume);
}

export async function playApplause(volume = 100) {
    return playSound('/audio/applause.mp3', volume);
}

const soundFileCache: Map<string, Howl> = new Map();
async function playSound(file: string, volume: number) {
  await import("howler"); // load howler lazily
  const howlObject = soundFileCache.get(file);
  const decimalVolume = volume / 100;
  if (howlObject) {
    howlObject.volume(decimalVolume);
    howlObject.play();
  } else {
    const newHowlObject = new Howl({
      src: [file],
      autoplay: true,
      volume: decimalVolume,
    });
    soundFileCache.set(file, newHowlObject);
  }
}
