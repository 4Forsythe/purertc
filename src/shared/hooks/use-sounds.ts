'use client';

import React from 'react';

type SoundKey = 'join' | 'leave' | 'mute' | 'unmute' | 'message';

const sounds: Record<SoundKey, string> = {
  join: '/sounds/join.mp3',
  leave: '/sounds/leave.mp3',
  mute: '/sounds/mute.mp3',
  unmute: '/sounds/unmute.mp3',
  message: '/sounds/message.mp3',
};

export function useSounds() {
  const soundsRef = React.useRef<Partial<Record<SoundKey, HTMLAudioElement>>>(
    {}
  );

  React.useEffect(() => {
    (Object.entries(sounds) as [SoundKey, string][]).forEach(([key, path]) => {
      soundsRef.current[key] = new Audio(path);
    });
  }, []);

  const playSound = React.useCallback((key: SoundKey) => {
    const sound = soundsRef.current[key];
    if (sound) {
      sound.currentTime = 0;
      sound
        .play()
        .catch((error) =>
          console.warn(`Не удалось воспроизвести ${key}`, error)
        );
    }
  }, []);

  return { play: playSound };
}
