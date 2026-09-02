"""
AirDraw AI - High-Performance Windows OS Air Mouse Bridge
Uses Windows User32 kernel API (ctypes) + PyAutoGUI to directly control
the Windows OS mouse cursor, clicks, double clicks, dragging, scrolling,
and keyboard shortcuts across ALL software, games, browser tabs, and desktop.
"""

import asyncio
import json
import sys
import ctypes
from ctypes import wintypes
import pyautogui

# UTF-8 encoding for Windows console
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import websockets

# Windows Win32 API Constants for kernel-level mouse events
MOUSEEVENTF_MOVE = 0x0001
MOUSEEVENTF_LEFTDOWN = 0x0002
MOUSEEVENTF_LEFTUP = 0x0004
MOUSEEVENTF_RIGHTDOWN = 0x0008
MOUSEEVENTF_RIGHTUP = 0x0009
MOUSEEVENTF_MIDDLEDOWN = 0x0020
MOUSEEVENTF_MIDDLEUP = 0x0040
MOUSEEVENTF_WHEEL = 0x0800
MOUSEEVENTF_ABSOLUTE = 0x8000

user32 = ctypes.windll.user32

# Get actual virtual desktop resolution (including multiple monitors / DPI scaling)
screen_width = user32.GetSystemMetrics(0)
screen_height = user32.GetSystemMetrics(1)

pyautogui.FAILSAFE = False
pyautogui.PAUSE = 0.0001

print("================================================================")
print("🚀 [AirDraw AI] - System OS Mouse Controller Started")
print(f"💻 [Primary Display]: {screen_width} x {screen_height} pixels")
print("📡 [WebSocket]: Listening on ws://localhost:8765")
print("🎮 [Features]: Real-time cursor, Left/Right/Double Click, Drag, Scroll, Tab & App Switch")
print("================================================================")

is_dragging = False

def set_mouse_pos(x: int, y: int):
    """Directly sets Windows OS cursor position via User32 API (works in all software & games)"""
    user32.SetCursorPos(x, y)

def mouse_left_click():
    user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)

def mouse_double_click():
    user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)

def mouse_right_click():
    user32.mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0)
    user32.mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0)

def mouse_down():
    global is_dragging
    if not is_dragging:
        user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
        is_dragging = True

def mouse_up():
    global is_dragging
    if is_dragging:
        user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
        is_dragging = False

def mouse_scroll(delta: int):
    # Windows scroll wheel: 120 units per notch
    user32.mouse_event(MOUSEEVENTF_WHEEL, 0, 0, delta * 120, 0)

async def handle_client(websocket):
    global is_dragging
    print("[Connected] Web browser connected! System Air Mouse active.")

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                msg_type = data.get("type")

                if msg_type == "MOVE":
                    norm_x = data.get("x", 0.5)
                    norm_y = data.get("y", 0.5)

                    # Dynamic edge margin expansion for easy reaching to the corners of screen
                    margin_x = 0.06
                    margin_y = 0.08
                    scaled_x = (norm_x - margin_x) / (1.0 - 2 * margin_x)
                    scaled_y = (norm_y - margin_y) / (1.0 - 2 * margin_y)

                    target_x = int(max(0, min(screen_width - 1, scaled_x * screen_width)))
                    target_y = int(max(0, min(screen_height - 1, scaled_y * screen_height)))

                    set_mouse_pos(target_x, target_y)

                elif msg_type == "LEFT_CLICK":
                    mouse_left_click()
                    print("[OS Action] Left Click")

                elif msg_type == "DOUBLE_CLICK":
                    mouse_double_click()
                    print("[OS Action] Double Click (Open App/File)")

                elif msg_type == "RIGHT_CLICK":
                    mouse_right_click()
                    print("[OS Action] Right Click")

                elif msg_type == "MOUSE_DOWN":
                    mouse_down()
                    print("[OS Action] Mouse Drag Down")

                elif msg_type == "MOUSE_UP":
                    mouse_up()
                    print("[OS Action] Mouse Drag Up")

                elif msg_type == "SCROLL":
                    delta = data.get("delta", 0)
                    mouse_scroll(int(delta))

                elif msg_type == "SWITCH_TAB_NEXT":
                    pyautogui.hotkey('ctrl', 'tab')
                    print("[OS Action] Switch Tab Next (Ctrl+Tab)")

                elif msg_type == "SWITCH_TAB_PREV":
                    pyautogui.hotkey('ctrl', 'shift', 'tab')
                    print("[OS Action] Switch Tab Prev (Ctrl+Shift+Tab)")

                elif msg_type == "SWITCH_APP":
                    pyautogui.hotkey('alt', 'tab')
                    print("[OS Action] Switch Windows App (Alt+Tab)")

                elif msg_type == "HOTKEY":
                    keys = data.get("keys", [])
                    if keys:
                        pyautogui.hotkey(*keys)

            except Exception as ex:
                pass

    except websockets.exceptions.ConnectionClosed:
        if is_dragging:
            mouse_up()
        print("[Disconnected] Web browser disconnected.")

async def main():
    async with websockets.serve(handle_client, "0.0.0.0", 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopping System Mouse Bridge...")
