import type { NormalizedLandmark } from '../types/vision';
import type { SignDetection, SignDefinition } from '../types/signLanguage';
import { LANDMARK_INDEX } from '../types/vision';

// Dictionary of supported signs and explanations
export const SIGN_DICTIONARY: SignDefinition[] = [
  // Phrases & Common Signs
  {
    id: 'I_LOVE_YOU',
    name: 'I Love You',
    symbol: '🤟',
    category: 'phrase',
    spokenText: 'I love you',
    emoji: '🤟',
    description: 'Thumb, Index, and Pinky fingers extended; Middle and Ring curled.',
    tips: 'Extend thumb, index, and pinky while keeping middle and ring fingers down.',
  },
  {
    id: 'HELLO',
    name: 'Hello / Open Hand',
    symbol: '✋',
    category: 'phrase',
    spokenText: 'Hello',
    emoji: '✋',
    description: 'All 5 fingers extended open wide facing forward.',
    tips: 'Open your hand wide with all fingers straight up.',
  },
  {
    id: 'YES',
    name: 'Yes / Good',
    symbol: '👍',
    category: 'phrase',
    spokenText: 'Yes',
    emoji: '👍',
    description: 'Thumb pointing straight up with all other 4 fingers curled into a fist.',
    tips: 'Give a thumbs up with other fingers tightly closed.',
  },
  {
    id: 'NO',
    name: 'No / Bad',
    symbol: '👎',
    category: 'phrase',
    spokenText: 'No',
    emoji: '👎',
    description: 'Thumb pointing downwards with all other 4 fingers curled into a fist.',
    tips: 'Give a thumbs down with other fingers closed.',
  },
  {
    id: 'PEACE',
    name: 'Peace / Victory',
    symbol: '✌️',
    category: 'phrase',
    spokenText: 'Peace',
    emoji: '✌️',
    description: 'Index and Middle fingers extended in a V shape; Ring and Pinky curled.',
    tips: 'Form a V sign with index and middle fingers.',
  },
  {
    id: 'OK',
    name: 'OK / Perfect',
    symbol: '👌',
    category: 'phrase',
    spokenText: 'OK',
    emoji: '👌',
    description: 'Index fingertip touching thumb tip in a circle; remaining 3 fingers extended.',
    tips: 'Touch index and thumb together to make a circle, keep other fingers straight.',
  },
  {
    id: 'CALL_ME',
    name: 'Call Me / Aloha',
    symbol: '🤙',
    category: 'phrase',
    spokenText: 'Call me',
    emoji: '🤙',
    description: 'Thumb and Pinky extended; Middle 3 fingers curled down.',
    tips: 'Extend your thumb and pinky out like a phone or shaka sign.',
  },
  {
    id: 'ROCK_ON',
    name: 'Rock On',
    symbol: '🤘',
    category: 'phrase',
    spokenText: 'Rock on',
    emoji: '🤘',
    description: 'Index and Pinky extended; Middle and Ring curled; Thumb tucked in.',
    tips: 'Raise index and pinky while curling middle and ring fingers.',
  },
  {
    id: 'PINCH',
    name: 'Small / Little',
    symbol: '🤏',
    category: 'phrase',
    spokenText: 'A little bit',
    emoji: '🤏',
    description: 'Index finger and Thumb held close parallel.',
    tips: 'Hold thumb and index tips close together like holding something tiny.',
  },
  {
    id: 'GOOD_LUCK',
    name: 'Good Luck',
    symbol: '🤞',
    category: 'phrase',
    spokenText: 'Good luck',
    emoji: '🤞',
    description: 'Index and Middle fingers crossed.',
    tips: 'Cross your index and middle fingers together.',
  },

  // ASL Alphabet Letters
  {
    id: 'LETTER_A',
    name: 'Letter A',
    symbol: 'A',
    category: 'alphabet',
    spokenText: 'A',
    emoji: '🅰️',
    description: 'Fist with thumb resting alongside the index finger.',
    tips: 'Curl all fingers into a fist with thumb straight up alongside index.',
  },
  {
    id: 'LETTER_B',
    name: 'Letter B',
    symbol: 'B',
    category: 'alphabet',
    spokenText: 'B',
    emoji: '🅱️',
    description: 'Four fingers straight up touching together; thumb tucked across palm.',
    tips: 'Hold 4 fingers straight up together and tuck thumb across your palm.',
  },
  {
    id: 'LETTER_C',
    name: 'Letter C',
    symbol: 'C',
    category: 'alphabet',
    spokenText: 'C',
    emoji: '©️',
    description: 'Hand curved in a semi-circle resembling the letter C.',
    tips: 'Curve your fingers and thumb to form a C shape.',
  },
  {
    id: 'LETTER_D',
    name: 'Letter D',
    symbol: 'D',
    category: 'alphabet',
    spokenText: 'D',
    emoji: '🇩',
    description: 'Index finger straight up; thumb touching middle, ring, and pinky tips.',
    tips: 'Point index finger straight up, touch thumb to middle/ring/pinky tips in an O.',
  },
  {
    id: 'LETTER_E',
    name: 'Letter E',
    symbol: 'E',
    category: 'alphabet',
    spokenText: 'E',
    emoji: '🇪',
    description: 'All fingers curled in tightly with thumb tucked below fingertips.',
    tips: 'Curl all fingers down with tips touching the thumb tucked underneath.',
  },
  {
    id: 'LETTER_F',
    name: 'Letter F',
    symbol: 'F',
    category: 'alphabet',
    spokenText: 'F',
    emoji: '🇫',
    description: 'Index and thumb touching in a ring; middle, ring, pinky straight up.',
    tips: 'Touch thumb and index tips together, keep other 3 fingers straight up.',
  },
  {
    id: 'LETTER_I',
    name: 'Letter I',
    symbol: 'I',
    category: 'alphabet',
    spokenText: 'I',
    emoji: 'ℹ️',
    description: 'Pinky finger straight up; all other 4 fingers curled in a fist.',
    tips: 'Extend only your pinky finger straight up while curling other fingers.',
  },
  {
    id: 'LETTER_L',
    name: 'Letter L',
    symbol: 'L',
    category: 'alphabet',
    spokenText: 'L',
    emoji: '🇱',
    description: 'Thumb and Index extended at 90 degrees forming an L.',
    tips: 'Form an L shape with your index finger pointing up and thumb pointing sideways.',
  },
  {
    id: 'LETTER_O',
    name: 'Letter O',
    symbol: 'O',
    category: 'alphabet',
    spokenText: 'O',
    emoji: '⭕',
    description: 'All fingertips curved touching thumb tip to form an O.',
    tips: 'Touch all your fingertips to the thumb tip to form an O ring.',
  },
  {
    id: 'LETTER_U',
    name: 'Letter U',
    symbol: 'U',
    category: 'alphabet',
    spokenText: 'U',
    emoji: '🇺',
    description: 'Index and Middle fingers straight up and held together.',
    tips: 'Hold index and middle fingers straight up touching each other.',
  },
  {
    id: 'LETTER_V',
    name: 'Letter V',
    symbol: 'V',
    category: 'alphabet',
    spokenText: 'V',
    emoji: '✌️',
    description: 'Index and Middle fingers straight up and spread in a V.',
    tips: 'Hold index and middle fingers up and spread apart.',
  },
  {
    id: 'LETTER_W',
    name: 'Letter W',
    symbol: 'W',
    category: 'alphabet',
    spokenText: 'W',
    emoji: '🇼',
    description: 'Index, Middle, and Ring fingers straight up spread in a W.',
    tips: 'Hold index, middle, and ring fingers straight up like a W.',
  },
  {
    id: 'LETTER_Y',
    name: 'Letter Y',
    symbol: 'Y',
    category: 'alphabet',
    spokenText: 'Y',
    emoji: '🇾',
    description: 'Thumb and Pinky extended outwards; middle 3 curled.',
    tips: 'Extend thumb and pinky outwards while curling middle 3 fingers.',
  },
];

export class SignLanguageDetector {
  private currentSignId: string | null = null;
  private signStartTime: number = 0;
  private readonly requiredHoldDurationMs: number = 650; // Fast and responsive 650ms hold
  private lastCommittedSignId: string | null = null;
  private commitCooldownUntil: number = 0;

  private getDist(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private cosineAngle(
    p1: NormalizedLandmark, 
    p2: NormalizedLandmark, 
    p3: NormalizedLandmark, 
    p4: NormalizedLandmark
  ): number {
    const v1x = p2.x - p1.x;
    const v1y = p2.y - p1.y;
    const v1z = (p2.z || 0) - (p1.z || 0);

    const v2x = p4.x - p3.x;
    const v2y = p4.y - p3.y;
    const v2z = (p4.z || 0) - (p3.z || 0);

    const dot = v1x * v2x + v1y * v2y + v1z * v2z;
    const mag1 = Math.sqrt(v1x * v1x + v1y * v1y + v1z * v1z);
    const mag2 = Math.sqrt(v2x * v2x + v2y * v2y + v2z * v2z);

    if (mag1 === 0 || mag2 === 0) return 1.0;
    return dot / (mag1 * mag2);
  }

  /**
   * Advanced 3D Geometric Sign Classifier
   */
  public detectSign(landmarks: NormalizedLandmark[]): SignDetection | null {
    if (!landmarks || landmarks.length < 21) {
      this.resetHold();
      return null;
    }

    const wrist = landmarks[LANDMARK_INDEX.WRIST];
    const thumbTip = landmarks[LANDMARK_INDEX.THUMB_TIP];
    const thumbIP = landmarks[LANDMARK_INDEX.THUMB_IP];
    const thumbMCP = landmarks[LANDMARK_INDEX.THUMB_MCP];
    const thumbCMC = landmarks[LANDMARK_INDEX.THUMB_CMC];

    const indexTip = landmarks[LANDMARK_INDEX.INDEX_TIP];
    const indexDIP = landmarks[LANDMARK_INDEX.INDEX_DIP];
    const indexPIP = landmarks[LANDMARK_INDEX.INDEX_PIP];
    const indexMCP = landmarks[LANDMARK_INDEX.INDEX_MCP];

    const middleTip = landmarks[LANDMARK_INDEX.MIDDLE_TIP];
    const middleDIP = landmarks[LANDMARK_INDEX.MIDDLE_DIP];
    const middlePIP = landmarks[LANDMARK_INDEX.MIDDLE_PIP];
    const middleMCP = landmarks[LANDMARK_INDEX.MIDDLE_MCP];

    const ringTip = landmarks[LANDMARK_INDEX.RING_TIP];
    const ringDIP = landmarks[LANDMARK_INDEX.RING_DIP];
    const ringPIP = landmarks[LANDMARK_INDEX.RING_PIP];
    const ringMCP = landmarks[LANDMARK_INDEX.RING_MCP];

    const pinkyTip = landmarks[LANDMARK_INDEX.PINKY_TIP];
    const pinkyDIP = landmarks[LANDMARK_INDEX.PINKY_DIP];
    const pinkyPIP = landmarks[LANDMARK_INDEX.PINKY_PIP];
    const pinkyMCP = landmarks[LANDMARK_INDEX.PINKY_MCP];

    // Palm size reference
    const palmScale = Math.max(this.getDist(wrist, middleMCP), 0.08);

    // 1. Joint Angle Cosines (Straightness)
    const indexStraight = this.cosineAngle(indexMCP, indexPIP, indexDIP, indexTip) > 0.55;
    const middleStraight = this.cosineAngle(middleMCP, middlePIP, middleDIP, middleTip) > 0.55;
    const ringStraight = this.cosineAngle(ringMCP, ringPIP, ringDIP, ringTip) > 0.55;
    const pinkyStraight = this.cosineAngle(pinkyMCP, pinkyPIP, pinkyDIP, pinkyTip) > 0.55;
    const thumbStraight = this.cosineAngle(thumbCMC, thumbMCP, thumbIP, thumbTip) > 0.65;

    // 2. Extension Ratios (Tip distance from wrist vs MCP/PIP distance from wrist)
    const isIndexExtended = indexStraight && (this.getDist(indexTip, wrist) > this.getDist(indexPIP, wrist) * 1.15);
    const isMiddleExtended = middleStraight && (this.getDist(middleTip, wrist) > this.getDist(middlePIP, wrist) * 1.15);
    const isRingExtended = ringStraight && (this.getDist(ringTip, wrist) > this.getDist(ringPIP, wrist) * 1.15);
    const isPinkyExtended = pinkyStraight && (this.getDist(pinkyTip, wrist) > this.getDist(pinkyPIP, wrist) * 1.15);

    const isThumbExtended = thumbStraight && (this.getDist(thumbTip, pinkyMCP) > this.getDist(thumbIP, pinkyMCP) * 1.12);

    // 3. Inter-finger and tip distances normalized by palm scale
    const thumbIndexDist = this.getDist(thumbTip, indexTip) / palmScale;
    const thumbMiddleDist = this.getDist(thumbTip, middleTip) / palmScale;
    const indexMiddleDist = this.getDist(indexTip, middleTip) / palmScale;
    const middleRingDist = this.getDist(middleTip, ringTip) / palmScale;
    const ringPinkyDist = this.getDist(ringTip, pinkyTip) / palmScale;

    const isThumbsUp = isThumbExtended && (thumbTip.y < thumbMCP.y - 0.04) && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;
    const isThumbsDown = isThumbExtended && (thumbTip.y > thumbMCP.y + 0.04) && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;

    let candidateId: string | null = null;
    let confidence = 0.90;

    // --- High-Precision ASL & Sign Matching ---

    // 1. I LOVE YOU (🤟): Thumb, Index, Pinky extended; Middle & Ring curled
    if (isThumbExtended && isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
      candidateId = 'I_LOVE_YOU';
      confidence = 0.98;
    }
    // 2. CALL ME / SHAKA (🤙): Thumb & Pinky extended; Index, Middle, Ring curled
    else if (isThumbExtended && !isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
      candidateId = 'CALL_ME';
      confidence = 0.96;
    }
    // 3. ROCK ON (🤘): Index & Pinky extended; Middle & Ring curled; Thumb folded
    else if (!isThumbExtended && isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
      candidateId = 'ROCK_ON';
      confidence = 0.95;
    }
    // 4. OK SIGN (👌) / LETTER F: Thumb & Index touching in circle; Middle, Ring, Pinky extended
    else if (thumbIndexDist < 0.32 && isMiddleExtended && isRingExtended && isPinkyExtended) {
      candidateId = 'OK';
      confidence = 0.96;
    }
    // 5. YES (👍)
    else if (isThumbsUp) {
      candidateId = 'YES';
      confidence = 0.97;
    }
    // 6. NO (👎)
    else if (isThumbsDown) {
      candidateId = 'NO';
      confidence = 0.96;
    }
    // 7. PEACE (✌️) vs LETTER V vs LETTER U:
    else if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      if (indexMiddleDist > 0.28) {
        candidateId = 'PEACE';
        confidence = 0.95;
      } else {
        candidateId = 'LETTER_U';
        confidence = 0.92;
      }
    }
    // 8. LETTER W (🇼): Index, Middle, Ring extended; Pinky curled
    else if (isIndexExtended && isMiddleExtended && isRingExtended && !isPinkyExtended) {
      candidateId = 'LETTER_W';
      confidence = 0.95;
    }
    // 9. LETTER L (🇱): Thumb & Index extended at 90 degrees, others curled
    else if (isThumbExtended && isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      candidateId = 'LETTER_L';
      confidence = 0.96;
    }
    // 10. HELLO (✋) vs LETTER B:
    else if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      if (!isThumbExtended && indexMiddleDist < 0.25 && middleRingDist < 0.25 && ringPinkyDist < 0.25) {
        candidateId = 'LETTER_B';
        confidence = 0.93;
      } else {
        candidateId = 'HELLO';
        confidence = 0.96;
      }
    }
    // 11. LETTER I (ℹ️): Only Pinky extended
    else if (!isThumbExtended && !isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
      candidateId = 'LETTER_I';
      confidence = 0.97;
    }
    // 12. LETTER D (🇩): Index extended straight, thumb touching middle/ring/pinky tips
    else if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended && thumbMiddleDist < 0.38) {
      candidateId = 'LETTER_D';
      confidence = 0.92;
    }
    // 13. LETTER O (⭕): All fingers curved touching thumb tip
    else if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended && thumbIndexDist < 0.35 && thumbMiddleDist < 0.35) {
      candidateId = 'LETTER_O';
      confidence = 0.90;
    }
    // 14. LETTER A (🅰️): Fist with thumb resting straight up alongside index
    else if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended && isThumbExtended && thumbTip.y < thumbMCP.y) {
      candidateId = 'LETTER_A';
      confidence = 0.90;
    }
    // 15. LETTER C (©️): Curved fingers forming C
    else if (thumbIndexDist > 0.35 && thumbIndexDist < 0.75 && !isIndexExtended && !isPinkyExtended && indexTip.x > thumbTip.x) {
      candidateId = 'LETTER_C';
      confidence = 0.86;
    }
    // 16. PINCH (🤏): Index and thumb tips parallel close
    else if (thumbIndexDist < 0.28 && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      candidateId = 'PINCH';
      confidence = 0.92;
    }
    // 17. GOOD LUCK (🤞): Index and Middle tips close & crossed
    else if (isIndexExtended && isMiddleExtended && indexMiddleDist < 0.18 && !isRingExtended && !isPinkyExtended) {
      candidateId = 'GOOD_LUCK';
      confidence = 0.91;
    }

    if (!candidateId) {
      this.resetHold();
      return null;
    }

    const definition = SIGN_DICTIONARY.find(s => s.id === candidateId);
    if (!definition) {
      this.resetHold();
      return null;
    }

    const now = performance.now();

    // Stability and hold progress tracking
    if (this.currentSignId === candidateId) {
      const elapsed = now - this.signStartTime;
      const holdProgress = Math.min(1.0, elapsed / this.requiredHoldDurationMs);
      const isReadyToCommit = holdProgress >= 1.0 && now > this.commitCooldownUntil && this.lastCommittedSignId !== candidateId;

      if (isReadyToCommit) {
        this.lastCommittedSignId = candidateId;
        this.commitCooldownUntil = now + 1000; // 1s cooldown before re-committing same sign
      }

      return {
        id: definition.id,
        name: definition.name,
        symbol: definition.symbol,
        spokenText: definition.spokenText,
        category: definition.category,
        emoji: definition.emoji,
        confidence,
        isStable: isReadyToCommit,
        holdProgress,
        rawLandmarks: landmarks,
      };
    } else {
      // Transition to new sign
      this.currentSignId = candidateId;
      this.signStartTime = now;
      this.lastCommittedSignId = null;

      return {
        id: definition.id,
        name: definition.name,
        symbol: definition.symbol,
        spokenText: definition.spokenText,
        category: definition.category,
        emoji: definition.emoji,
        confidence,
        isStable: false,
        holdProgress: 0.08,
        rawLandmarks: landmarks,
      };
    }
  }

  public resetHold(): void {
    this.currentSignId = null;
    this.signStartTime = 0;
  }
}

export const signLanguageDetector = new SignLanguageDetector();
