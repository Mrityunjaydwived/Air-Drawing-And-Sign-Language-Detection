import type { NormalizedLandmark, ScreenPoint } from '../types/vision';
import type { VirtualMouseState, MouseActionType, MouseSettings } from '../types/mouse';
import { LANDMARK_INDEX } from '../types/vision';

export class MouseController {
  private isPinchingLeft: boolean = false;
  private isPinchingRight: boolean = false;
  private pinchStartTime: number = 0;
  private lastLeftClickTime: number = 0;
  private lastScrollY: number = 0;
  private lastSwipeX: number = 0;
  private lastTabSwitchTime: number = 0;
  private fistStartTime: number = 0;
  private lastAppSwitchTime: number = 0;

  private getDist(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Evaluates hand pose for virtual and system-wide mouse gestures
   */
  public evaluateMouseState(
    landmarks: NormalizedLandmark[],
    smoothedPoint: ScreenPoint | null,
    settings: MouseSettings
  ): VirtualMouseState & { isDoubleClick: boolean; switchTabAction: 'next' | 'prev' | null; isAppSwitch: boolean } {
    if (!landmarks || landmarks.length < 21 || !smoothedPoint) {
      this.reset();
      return {
        point: null,
        action: 'IDLE',
        isLeftClicking: false,
        isRightClicking: false,
        isDoubleClick: false,
        isDragging: false,
        isScrolling: false,
        switchTabAction: null,
        isAppSwitch: false,
        clickProgress: 0,
        hoveredElementDescription: null,
        timestamp: performance.now(),
      };
    }

    const wrist = landmarks[LANDMARK_INDEX.WRIST];
    const thumbTip = landmarks[LANDMARK_INDEX.THUMB_TIP];
    const indexTip = landmarks[LANDMARK_INDEX.INDEX_TIP];
    const indexPIP = landmarks[LANDMARK_INDEX.INDEX_PIP];
    const middleTip = landmarks[LANDMARK_INDEX.MIDDLE_TIP];
    const middlePIP = landmarks[LANDMARK_INDEX.MIDDLE_PIP];
    const middleMCP = landmarks[LANDMARK_INDEX.MIDDLE_MCP];
    const ringTip = landmarks[LANDMARK_INDEX.RING_TIP];
    const ringPIP = landmarks[LANDMARK_INDEX.RING_PIP];
    const pinkyTip = landmarks[LANDMARK_INDEX.PINKY_TIP];
    const pinkyPIP = landmarks[LANDMARK_INDEX.PINKY_PIP];

    const palmScale = Math.max(this.getDist(wrist, middleMCP), 0.08);

    // 1. Pinch Distances
    const indexThumbDist = this.getDist(indexTip, thumbTip) / palmScale;
    const middleThumbDist = this.getDist(middleTip, thumbTip) / palmScale;

    // Thresholds
    const pinchThreshold = 0.32 * settings.pinchSensitivity;
    const isIndexThumbPinch = indexThumbDist < pinchThreshold;
    const isMiddleThumbPinch = middleThumbDist < pinchThreshold && indexThumbDist > pinchThreshold;

    // 2. Extension of fingers
    const isIndexExtended = this.getDist(indexTip, wrist) > this.getDist(indexPIP, wrist) * 1.15;
    const isMiddleExtended = this.getDist(middleTip, wrist) > this.getDist(middlePIP, wrist) * 1.15;
    const isRingExtended = this.getDist(ringTip, wrist) > this.getDist(ringPIP, wrist) * 1.15;
    const isPinkyExtended = this.getDist(pinkyTip, wrist) > this.getDist(pinkyPIP, wrist) * 1.15;

    const isRingCurled = !isRingExtended;
    const isPinkyCurled = !isPinkyExtended;

    // Two finger gesture for scrolling / horizontal tab swipe
    const isTwoFingerGesture = isIndexExtended && isMiddleExtended && isRingCurled && isPinkyCurled && indexThumbDist > pinchThreshold * 1.5;

    // Fist gesture (all curled) for App Switch (Alt+Tab)
    const isFist = !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;

    const now = performance.now();
    let action: MouseActionType = 'MOVE';
    let isLeftClick = false;
    let isDoubleClick = false;
    let isRightClick = false;
    let isDragging = false;
    let isScrolling = false;
    let switchTabAction: 'next' | 'prev' | null = null;
    let isAppSwitch = false;

    // --- State Machine ---

    // 1. Left Click & Double Click Detection
    if (isIndexThumbPinch) {
      if (!this.isPinchingLeft) {
        this.isPinchingLeft = true;
        this.pinchStartTime = now;
        
        // Double Click detection (2 pinches within 380ms)
        if (now - this.lastLeftClickTime < 380) {
          isDoubleClick = true;
          action = 'DOUBLE_CLICK';
          this.lastLeftClickTime = 0;
        } else {
          isLeftClick = true;
          action = 'LEFT_CLICK';
          this.lastLeftClickTime = now;
        }
      } else {
        const pinchDuration = now - this.pinchStartTime;
        if (pinchDuration > 220) {
          isDragging = true;
          action = 'DRAG';
        }
      }
    } else {
      this.isPinchingLeft = false;
    }

    // 2. Right Click
    if (isMiddleThumbPinch && !this.isPinchingLeft) {
      if (!this.isPinchingRight) {
        this.isPinchingRight = true;
        isRightClick = true;
        action = 'RIGHT_CLICK';
      }
    } else {
      this.isPinchingRight = false;
    }

    // 3. Two-Finger Scroll & Tab Switching
    if (isTwoFingerGesture && !this.isPinchingLeft && !this.isPinchingRight) {
      const currentY = smoothedPoint.y;
      const currentX = smoothedPoint.x;

      if (this.lastScrollY !== 0 && this.lastSwipeX !== 0) {
        const dy = currentY - this.lastScrollY;
        const dx = currentX - this.lastSwipeX;

        // Vertical Scroll
        if (Math.abs(dy) > Math.abs(dx) * 1.2) {
          if (dy < -6) {
            isScrolling = true;
            action = 'SCROLL_UP';
          } else if (dy > 6) {
            isScrolling = true;
            action = 'SCROLL_DOWN';
          }
        }
        // Horizontal Swipe for Browser Tab Switch (Ctrl+Tab / Ctrl+Shift+Tab)
        else if (Math.abs(dx) > 35 && now - this.lastTabSwitchTime > 700) {
          if (dx > 35) {
            switchTabAction = 'next';
            this.lastTabSwitchTime = now;
          } else if (dx < -35) {
            switchTabAction = 'prev';
            this.lastTabSwitchTime = now;
          }
        }
      }

      this.lastScrollY = currentY;
      this.lastSwipeX = currentX;
    } else {
      this.lastScrollY = 0;
      this.lastSwipeX = 0;
    }

    // 4. Windows App Switch (Alt+Tab) on sustained Fist
    if (isFist) {
      if (this.fistStartTime === 0) {
        this.fistStartTime = now;
      } else if (now - this.fistStartTime > 900 && now - this.lastAppSwitchTime > 1200) {
        isAppSwitch = true;
        this.lastAppSwitchTime = now;
        this.fistStartTime = 0;
      }
    } else {
      this.fistStartTime = 0;
    }

    // Identify hovered element under cursor
    let hoveredElementDescription: string | null = null;
    if (typeof document !== 'undefined' && smoothedPoint) {
      try {
        const el = document.elementFromPoint(smoothedPoint.x, smoothedPoint.y);
        if (el) {
          const tagName = el.tagName.toLowerCase();
          const role = el.getAttribute('role') || el.getAttribute('aria-label') || el.textContent?.slice(0, 20) || '';
          if (tagName === 'button') {
            hoveredElementDescription = `Button: ${role || 'Clickable'}`;
          } else if (tagName === 'input') {
            hoveredElementDescription = `Input: ${(el as HTMLInputElement).type}`;
          } else if (el.closest('.clickable, button, [role="button"]')) {
            hoveredElementDescription = `Interactive Element`;
          }
        }
      } catch {}
    }

    // Pinch progress (0.0 far to 1.0 touching)
    const clickProgress = Math.max(0, Math.min(1.0, 1.0 - (indexThumbDist / (pinchThreshold * 2.2))));

    return {
      point: smoothedPoint,
      action,
      isLeftClicking: isLeftClick,
      isRightClicking: isRightClick,
      isDoubleClick,
      isDragging,
      isScrolling,
      switchTabAction,
      isAppSwitch,
      clickProgress,
      hoveredElementDescription,
      timestamp: now,
    };
  }

  /**
   * Dispatch synthetic DOM click to real elements under the virtual mouse
   */
  public dispatchRealDomClick(x: number, y: number, isRightClick: boolean = false): void {
    if (typeof document === 'undefined') return;

    try {
      const target = document.elementFromPoint(x, y);
      if (!target) return;

      if (target.closest('#virtual-cursor-layer')) {
        return;
      }

      if (isRightClick) {
        target.dispatchEvent(new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
        }));
      } else {
        target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y }));
        target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y }));
        target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: x, clientY: y }));
        target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y }));

        if ('click' in target && typeof (target as HTMLElement).click === 'function') {
          (target as HTMLElement).click();
        } else {
          target.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
        }
      }
    } catch (err) {
      console.warn('Virtual mouse event warning:', err);
    }
  }

  public reset(): void {
    this.isPinchingLeft = false;
    this.isPinchingRight = false;
    this.pinchStartTime = 0;
    this.lastLeftClickTime = 0;
    this.lastScrollY = 0;
    this.lastSwipeX = 0;
    this.fistStartTime = 0;
  }
}

export const mouseController = new MouseController();
