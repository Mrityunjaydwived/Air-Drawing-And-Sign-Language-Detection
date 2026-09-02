# 🖐️ AirDraw AI - Real-Time AI Finger Drawing & Sign Language Translator

**AirDraw AI** is a real-time computer vision application powered by **Google MediaPipe HandLandmarker**, **React 19**, **TypeScript**, and the **Web Speech API**. It features 2 dedicated, distraction-free modes:

1. 🎨 **Air Draw Mode**: Real-time virtual air canvas with 7 brush engines and 1€ jitter filtering (isolated pure drawing experience with no speech interruption).
2. 🤟 **Sign Language Mode**: Accurate 3D ASL letter & phrase recognition, hold-to-type live transcription, and text-to-speech voice pronunciation.

---

## 🚀 2 Dedicated Modes

### 🎨 1. Air Draw Mode
- **☝️ Draw in the Air**: Raise your index finger to paint smooth lines directly in the air.
- **⚡ 60+ FPS Real-Time Vision**: Continuous MediaPipe WebAssembly + WebGL hand tracking.
- **🎯 1€ (One-Euro) Jitter Filter**: Smooth curves with ultra-low latency.
- **🖌️ 7 Studio Brushes**: *Neon Glow*, *Rainbow Spectrum*, *Solid Line*, *Laser Star*, *Sketch Pencil*, *Highlighter*, and *Eraser*.
- **🔇 Quiet Drawing**: Speech recognition and voice synthesis are completely dormant in this mode.

### 🤟 2. Sign Language & Voice Pronunciation Mode
- **Accurate 3D Joint Angle Classifier**: Evaluates vector dot products, finger curl ratios, and palm orientation to detect:
  - **ASL Letters**: `A`, `B`, `C`, `D`, `E`, `F`, `I`, `L`, `O`, `U`, `V`, `W`, `Y`
  - **Universal Phrases**: `🤟 I Love You`, `✋ Hello`, `👍 Yes`, `👎 No`, `✌️ Peace`, `👌 OK`, `🤙 Call Me`, `🤘 Rock On`, `🤏 Little`, `🤞 Good Luck`
- **✍️ Hold-to-Type Live Transcription**: Hold any sign steady for ~0.65s to automatically type it into the live subtitle bar.
- **🔊 Voice Pronunciation**: Web Speech API (`window.speechSynthesis`) automatically pronounces letters and sentences aloud.
- **📖 ASL Dictionary**: Built-in visual dictionary with hand instructions and audio previews.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl` + `Z` / `Cmd` + `Z` | Undo last stroke |
| `Ctrl` + `Y` / `Cmd` + `Y` | Redo last undone stroke |
| `C` | Clear drawing canvas |
| `S` | Save drawing to in-app gallery |
| `E` | Open Export / Download modal |
| `M` | Toggle camera mirror flip |
| `B` | Toggle Hand Skeleton overlay |
| `H` | Toggle HUD status panels |
| `P` | Pronounce current transcribed text aloud (Sign mode) |
| `1` - `7` | Quick switch brush mode (Neon, Rainbow, Solid, Laser, Pencil, Highlighter, Eraser) |

---

## 🚀 How to Run

1. Start the Vite development server:
   ```bash
   npm run dev
   ```
2. Open **`http://localhost:5173`** in your browser.
3. Allow camera access and enjoy Air Drawing and Sign Language Translation!
