import { useState, useEffect, useRef, useCallback } from 'react';
import { signLanguageDetector } from '../vision/signLanguageDetector';
import { speechManager } from '../utils/speechUtils';
import { ExportUtils } from '../utils/exportUtils';
import type { LiveTrackingData } from '../types/vision';
import type { 
  AppMode, 
  SignDetection, 
  SpeechSettings, 
  TranscriptItem 
} from '../types/signLanguage';

interface UseSignLanguageOptions {
  liveTrackingRef: React.RefObject<LiveTrackingData>;
  appMode: AppMode;
  speechSettings: SpeechSettings;
}

export function useSignLanguage({
  liveTrackingRef,
  appMode,
  speechSettings,
}: UseSignLanguageOptions) {
  const [activeSign, setActiveSign] = useState<SignDetection | null>(null);
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Stop speech if switching away from Sign mode
  useEffect(() => {
    if (appMode !== 'sign') {
      speechManager.stop();
      signLanguageDetector.resetHold();
      setActiveSign(null);
    }
  }, [appMode]);

  // Compute full text string
  const fullTranscriptText = transcriptItems
    .map(item => (item.type === 'space' ? ' ' : item.text))
    .join('');

  // Auto-pronounce committed sign ONLY when in Sign mode
  const handleCommitSign = useCallback((sign: SignDetection) => {
    if (appMode !== 'sign') return;

    const newItem: TranscriptItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: sign.symbol,
      type: sign.category === 'alphabet' ? 'letter' : 'phrase',
      timestamp: Date.now(),
      signId: sign.id,
      emoji: sign.emoji,
    };

    setTranscriptItems(prev => [...prev, newItem]);

    // Speak aloud using SpeechSynthesis ONLY in Sign mode
    if (speechSettings.enabled && speechSettings.autoPronounce) {
      speechManager.speak(sign.spokenText, speechSettings);
    }

    // Celebratory burst on phrases (like I Love You / Peace)
    if (sign.category === 'phrase') {
      ExportUtils.triggerCelebration();
    }
  }, [appMode, speechSettings]);

  // Sign detection loop active ONLY when in Sign mode
  const runSignLoop = useCallback(() => {
    if (appMode !== 'sign') {
      setActiveSign(null);
      signLanguageDetector.resetHold();
      animationFrameRef.current = requestAnimationFrame(runSignLoop);
      return;
    }

    const tracking = liveTrackingRef.current;
    if (tracking && tracking.handDetected && tracking.gestureResult.rawLandmarks.length >= 21) {
      const detection = signLanguageDetector.detectSign(tracking.gestureResult.rawLandmarks);
      setActiveSign(detection);

      if (detection && detection.isStable) {
        handleCommitSign(detection);
      }
    } else {
      signLanguageDetector.resetHold();
      setActiveSign(null);
    }

    animationFrameRef.current = requestAnimationFrame(runSignLoop);
  }, [appMode, liveTrackingRef, handleCommitSign]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(runSignLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [runSignLoop]);

  // Action methods
  const addSpace = useCallback(() => {
    setTranscriptItems(prev => [
      ...prev,
      {
        id: `space-${Date.now()}`,
        text: ' ',
        type: 'space',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const backspace = useCallback(() => {
    setTranscriptItems(prev => prev.slice(0, -1));
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscriptItems([]);
  }, []);

  const speakCurrentText = useCallback(() => {
    if (appMode !== 'sign') return;
    const text = fullTranscriptText.trim();
    if (!text) return;
    setIsSpeaking(true);
    speechManager.speak(text, speechSettings);
    setTimeout(() => setIsSpeaking(false), Math.max(1000, text.length * 80));
  }, [appMode, fullTranscriptText, speechSettings]);

  const speakCustomText = useCallback((text: string) => {
    if (appMode !== 'sign') return;
    speechManager.speak(text, speechSettings);
  }, [appMode, speechSettings]);

  const copyTranscript = useCallback(async (): Promise<boolean> => {
    const text = fullTranscriptText.trim();
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      ExportUtils.triggerCelebration();
      return true;
    } catch {
      return false;
    }
  }, [fullTranscriptText]);

  return {
    activeSign,
    transcriptItems,
    fullTranscriptText,
    isSpeaking,
    addSpace,
    backspace,
    clearTranscript,
    speakCurrentText,
    speakCustomText,
    copyTranscript,
  };
}
