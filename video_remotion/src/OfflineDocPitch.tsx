import React from 'react';
import { Sequence, Audio, staticFile } from 'remotion';
import { Scene1Problem } from './scenes/Scene1Problem';
import { Scene2NoInternet } from './scenes/Scene2NoInternet';
import { Scene3Hero } from './scenes/Scene3Hero';
import { Scene4SpeechToText } from './scenes/Scene4SpeechToText';
import { Scene5StructuredRecord } from './scenes/Scene5StructuredRecord';
import { Scene6PdfAndReview } from './scenes/Scene6PdfAndReview';
import { Scene7Benefits } from './scenes/Scene7Benefits';
import { Scene8Outro } from './scenes/Scene8Outro';

export const OfflineDocPitch: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#f5f7fb', position: 'relative' }}>
      {/* Attached original voice audio */}
      <Audio src={staticFile('template_audio.wav')} />

      {/* Scene 1: 00:00 - 00:04 (0 to 120 frames) */}
      <Sequence from={0} durationInFrames={120}>
        <Scene1Problem />
      </Sequence>

      {/* Scene 2: 00:04 - 00:08 (120 to 240 frames) */}
      <Sequence from={120} durationInFrames={120}>
        <Scene2NoInternet />
      </Sequence>

      {/* Scene 3: 00:08 - 00:16 (240 to 480 frames) */}
      <Sequence from={240} durationInFrames={240}>
        <Scene3Hero />
      </Sequence>

      {/* Scene 4: 00:16 - 00:23.5 (480 to 705 frames) */}
      <Sequence from={480} durationInFrames={225}>
        <Scene4SpeechToText />
      </Sequence>

      {/* Scene 5: 00:23.5 - 00:31.5 (705 to 945 frames) */}
      <Sequence from={705} durationInFrames={240}>
        <Scene5StructuredRecord />
      </Sequence>

      {/* Scene 6: 00:31.5 - 00:38.5 (945 to 1155 frames) */}
      <Sequence from={945} durationInFrames={210}>
        <Scene6PdfAndReview />
      </Sequence>

      {/* Scene 7: 00:38.5 - 00:48.5 (1155 to 1455 frames) */}
      <Sequence from={1155} durationInFrames={300}>
        <Scene7Benefits />
      </Sequence>

      {/* Scene 8: 00:48.5 - 00:53.7 (1455 to 1611 frames) */}
      <Sequence from={1455} durationInFrames={156}>
        <Scene8Outro />
      </Sequence>
    </div>
  );
};