'use client';

import React from 'react';

type UserMicroStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

export function useMicroStatus() {
  const [status, setStatus] = React.useState<UserMicroStatus>('unknown');

  React.useEffect(() => {
    if (!navigator.permissions.query) {
      setStatus('denied');
      console.error('Полномочия UserMedia не поддерживаются в браузере');
      return;
    }

    navigator.permissions
      .query({ name: 'microphone' as PermissionName })
      .then((permissionStatus) => {
        setStatus(permissionStatus.state);

        permissionStatus.onchange = () => {
          setStatus(permissionStatus.state);
        };
      })
      .catch((error) => {
        setStatus('denied');
        console.error('Пользователь не дал доступ к микрофону:', error);
      });
  }, []);

  return { status };
}
