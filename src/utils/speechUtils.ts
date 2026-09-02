import type { SpeechSettings } from '../types/signLanguage';

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSupported: boolean = false;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();

      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.voices.length > 0 && !this.selectedVoice) {
      // Default to preferred English natural or standard voice
      this.selectedVoice = 
        this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Microsoft'))) ||
        this.voices.find(v => v.lang.startsWith('en')) ||
        this.voices[0];
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  public setVoice(voiceURI: string): void {
    const voice = this.voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      this.selectedVoice = voice;
    }
  }

  public speak(text: string, settings: Partial<SpeechSettings> = {}): void {
    if (!this.isSupported || !this.synth || !text.trim()) return;

    try {
      // Cancel previous speech if needed for instant responsiveness
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = settings.rate ?? 1.0;
      utterance.pitch = settings.pitch ?? 1.0;
      utterance.volume = 1.0;

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isAvailable(): boolean {
    return this.isSupported;
  }
}

export const speechManager = new SpeechManager();
