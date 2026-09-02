import { useState, useEffect, useRef, useCallback } from 'react';
import type { CameraState } from '../types/vision';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>({
    isStreaming: false,
    isLoading: true,
    error: null,
    selectedDeviceId: null,
    devices: [],
    videoWidth: 0,
    videoHeight: 0,
    isMirrored: true,
  });

  const streamRef = useRef<MediaStream | null>(null);

  // Enumerate connected cameras
  const updateDeviceList = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setCameraState(prev => ({ ...prev, devices: videoDevices }));
    } catch (e) {
      console.warn('Failed to enumerate media devices:', e);
    }
  }, []);

  // Stop active video track
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState(prev => ({
      ...prev,
      isStreaming: false,
    }));
  }, []);

  // Start video stream with selected device or default
  const startCamera = useCallback(async (deviceId?: string) => {
    setCameraState(prev => ({ ...prev, isLoading: true, error: null }));
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState(prev => ({
        ...prev,
        isLoading: false,
        isStreaming: false,
        error: 'Your browser does not support camera access via getUserMedia.',
      }));
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: deviceId ? undefined : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 60, min: 30 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return resolve();
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => resolve()).catch(() => resolve());
          };
        });

        const activeTrack = stream.getVideoTracks()[0];
        const settings = activeTrack.getSettings();

        setCameraState(prev => ({
          ...prev,
          isStreaming: true,
          isLoading: false,
          error: null,
          selectedDeviceId: settings.deviceId || deviceId || null,
          videoWidth: videoRef.current?.videoWidth || 1280,
          videoHeight: videoRef.current?.videoHeight || 720,
        }));
      }

      await updateDeviceList();
    } catch (err: unknown) {
      let errorMsg = 'Failed to access camera.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMsg = 'Camera permission was denied. Please allow camera access in your browser settings to use finger drawing.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMsg = 'No camera device found on this system.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMsg = 'Camera is already in use by another application.';
        } else {
          errorMsg = `Camera error: ${err.message}`;
        }
      }

      setCameraState(prev => ({
        ...prev,
        isStreaming: false,
        isLoading: false,
        error: errorMsg,
      }));
    }
  }, [stopStream, updateDeviceList]);

  // Toggle horizontal mirror mode
  const toggleMirror = useCallback(() => {
    setCameraState(prev => ({ ...prev, isMirrored: !prev.isMirrored }));
  }, []);

  // Switch camera device
  const selectDevice = useCallback((deviceId: string) => {
    startCamera(deviceId);
  }, [startCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  return {
    videoRef,
    cameraState,
    startCamera,
    stopStream,
    toggleMirror,
    selectDevice,
  };
}
