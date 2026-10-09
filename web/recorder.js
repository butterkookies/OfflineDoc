/**
 * OfflineDoc - Mobile 16 kHz Mono WAV Audio Recorder
 * 100% Client-Side. Zero external CDNs.
 * Produces clean 16 kHz 16-bit linear PCM WAV format required by whisper.cpp.
 */

class WavAudioRecorder {
  constructor() {
    this.audioContext = null;
    this.mediaStream = null;
    this.processorNode = null;
    this.inputNode = null;
    this.pcmBuffers = [];
    this.totalSamples = 0;
    this.isRecording = false;
    this.startTime = 0;
    this.timerInterval = null;
    this.onLevelChange = null;
    this.onTick = null;
  }

  async start() {
    if (this.isRecording) return;

    // 1. Request microphone stream
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // 2. Initialize AudioContext at 16,000 Hz for whisper native intake
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass({ sampleRate: 16000 });
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    this.inputNode = this.audioContext.createMediaStreamSource(this.mediaStream);

    // 3. Audio buffer collector (using ScriptProcessor for zero-worker offline reliability)
    const bufferSize = 4096;
    this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    this.pcmBuffers = [];
    this.totalSamples = 0;

    this.processorNode.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      const bufferCopy = new Float32Array(inputData.length);
      bufferCopy.set(inputData);
      this.pcmBuffers.push(bufferCopy);
      this.totalSamples += bufferCopy.length;

      // Calculate RMS audio level for visual feedback
      if (this.onLevelChange) {
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        this.onLevelChange(Math.min(1.0, rms * 5.0)); // scaled for UI
      }
    };

    this.inputNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);

    this.isRecording = true;
    this.startTime = Date.now();

    if (this.onTick) {
      this.timerInterval = setInterval(() => {
        const elapsed = (Date.now() - this.startTime) / 1000;
        this.onTick(elapsed);
      }, 100);
    }
  }

  async stop() {
    if (!this.isRecording) return null;

    this.isRecording = false;
    clearInterval(this.timerInterval);

    // Stop tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
    }

    // Disconnect nodes
    if (this.processorNode) this.processorNode.disconnect();
    if (this.inputNode) this.inputNode.disconnect();
    if (this.audioContext) await this.audioContext.close();

    const durationSeconds = (Date.now() - this.startTime) / 1000;

    // Merge Float32 buffers
    const mergedSamples = new Float32Array(this.totalSamples);
    let offset = 0;
    for (const buf of this.pcmBuffers) {
      mergedSamples.set(buf, offset);
      offset += buf.length;
    }

    // Encode to 16-bit Mono 16 kHz WAV
    const wavBlob = this.encodeWAV(mergedSamples, 16000);

    return {
      blob: wavBlob,
      durationSeconds: durationSeconds,
      sampleCount: this.totalSamples,
    };
  }

  encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    this.writeString(view, 8, "WAVE");

    // "fmt " sub-chunk
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
    view.setUint16(22, 1, true); // NumChannels (1 = Mono)
    view.setUint32(24, sampleRate, true); // SampleRate (16000)
    view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
    view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
    view.setUint16(34, 16, true); // BitsPerSample (16 bits)

    // "data" sub-chunk
    this.writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    // Float32 to Int16 PCM samples
    let index = 44;
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      index += 2;
    }

    return new Blob([view], { type: "audio/wav" });
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

window.WavAudioRecorder = WavAudioRecorder;
