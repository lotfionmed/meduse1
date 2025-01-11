import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  isDarkMode: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title, isDarkMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsAudioLoaded(true);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audio) {
          audio.currentTime = 0;
        }
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = async () => {
    if (!isAudioLoaded) return;
    
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error toggling play state:', error);
      }
    }
  };

  const handleTimeUpdate = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-102 ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center space-x-2">
            <FastForward className="h-4 w-4" />
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
              className={`w-24 h-2 rounded-lg appearance-none cursor-pointer ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              style={{
                backgroundImage: `linear-gradient(to right, ${
                  isDarkMode ? '#a855f7' : '#9333ea'
                } 0%, ${
                  isDarkMode ? '#a855f7' : '#9333ea'
                } ${(playbackRate - 0.5) * 100 / 1.5}%, ${
                  isDarkMode ? '#374151' : '#E5E7EB'
                } ${(playbackRate - 0.5) * 100 / 1.5}%)`,
              }}
            />
            <span className="text-sm font-semibold">{playbackRate.toFixed(1)}x</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between space-x-4">
          <button
            onClick={() => skip(-10)}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            disabled={!isAudioLoaded}
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!isAudioLoaded}
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isDarkMode 
                ? 'bg-primary-600 hover:bg-primary-500 text-white' 
                : 'bg-primary-500 hover:bg-primary-400 text-white'
            } ${!isAudioLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>

          <button
            onClick={() => skip(10)}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            disabled={!isAudioLoaded}
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => handleTimeUpdate(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}
            style={{
              backgroundImage: `linear-gradient(to right, ${
                isDarkMode ? '#a855f7' : '#9333ea'
              } 0%, ${
                isDarkMode ? '#a855f7' : '#9333ea'
              } ${(currentTime / duration) * 100}%, ${
                isDarkMode ? '#374151' : '#E5E7EB'
              } ${(currentTime / duration) * 100}%)`
            }}
            disabled={!isAudioLoaded}
          />
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            disabled={!isAudioLoaded}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className={`w-24 h-2 rounded-lg appearance-none cursor-pointer ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}
            style={{
              backgroundImage: `linear-gradient(to right, ${
                isDarkMode ? '#a855f7' : '#9333ea'
              } 0%, ${
                isDarkMode ? '#a855f7' : '#9333ea'
              } ${(isMuted ? 0 : volume) * 100}%, ${
                isDarkMode ? '#374151' : '#E5E7EB'
              } ${(isMuted ? 0 : volume) * 100}%)`
            }}
            disabled={!isAudioLoaded}
          />
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
