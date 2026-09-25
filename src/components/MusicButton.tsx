import { useEffect, useRef, useState } from 'react';
import styles from './MusicButton.module.css';

type Track = {
  name: string;
  src: string;
};

const tracks: Track[] = [
  { name: 'BGM 01 · 따뜻한 피아노', src: '/music/proposal-bgm.mp3' },
  { name: 'BGM 02 · 감동적인 피아노', src: '/music/emotional-piano-demo.mp3' },
];

export default function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(1);

  useEffect(() => {
    const audio = new Audio(tracks[trackIndex].src);
    audio.loop = true;
    audio.volume = 0.34;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [trackIndex]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const changeTrack = async () => {
    const wasPlaying = playing;
    const nextIndex = (trackIndex + 1) % tracks.length;
    audioRef.current?.pause();
    setPlaying(false);
    setTrackIndex(nextIndex);

    if (wasPlaying) {
      window.setTimeout(async () => {
        try {
          await audioRef.current?.play();
          setPlaying(true);
        } catch {
          setPlaying(false);
        }
      }, 80);
    }
  };

  return (
    <div className={styles.wrap}>
      <button className={styles.button} onClick={toggle} aria-label={playing ? '음악 끄기' : '음악 켜기'}>
        <span className={playing ? styles.iconPlaying : styles.icon}>♫</span>
        <span>{playing ? 'Music On' : 'Music Off'}</span>
      </button>
      <button className={styles.trackButton} onClick={changeTrack} aria-label="다음 음악으로 변경">
        {tracks[trackIndex].name}
      </button>
    </div>
  );
}
