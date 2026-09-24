import React, { useState, useRef } from 'react';

interface AudioPlayerProps {
  moduleText: string;
}

export default function AudioPlayer({ moduleText }: AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerateAudio = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: moduleText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      setAudioUrl(data.audioUrl);
      
      // Auto play after generating
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Audio Module</h3>
      
      {!audioUrl ? (
        <button
          onClick={handleGenerateAudio}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-blue-400"
        >
          {isLoading ? 'Generating Audio...' : 'Generate Audio'}
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            className="w-full"
          >
            Your browser does not support the audio element.
          </audio>
          <button
            onClick={() => setAudioUrl(null)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 self-start"
          >
            Regenerate Audio
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-4 text-sm">{error}</p>
      )}
    </div>
  );
}
