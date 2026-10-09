import React from 'react';
import { Composition } from 'remotion';
import { OfflineDocPitch } from './OfflineDocPitch';

export const Root: React.FC = () => {
  return (
    <Composition
      id="OfflineDocPitch"
      component={OfflineDocPitch}
      durationInFrames={1611}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};