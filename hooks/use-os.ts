import { useEffect, useState } from 'react';
import { osName } from 'react-device-detect';

export function useOs(initialText: Record<string, string>) {
  const [os, setOs] = useState('default');

  useEffect(() => {
    const normalizedOs = osName?.toLowerCase() || 'default';
    if (normalizedOs.includes('win')) {
      setOs('windows');
    } else if (normalizedOs.includes('mac') || normalizedOs.includes('ios')) {
      setOs('mac');
    } else {
      setOs('default');
    }
  }, []);

  return { keyName: initialText[os as keyof typeof initialText], os };
}
