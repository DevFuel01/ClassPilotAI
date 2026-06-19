import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 6,
  className = '',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);
    if (!text) {
      setIsDone(true);
      return;
    }

    let currentIndex = 0;
    let accumulatedText = '';

    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        accumulatedText += text.charAt(currentIndex);
        setDisplayedText(accumulatedText);
        currentIndex++;
      } else {
        clearInterval(timer);
        setIsDone(true);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  const handleSkip = () => {
    if (!isDone) {
      setDisplayedText(text);
      setIsDone(true);
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }
  };

  return (
    <span 
      onClick={handleSkip} 
      className={`${className} ${!isDone ? 'cursor-pointer select-none hover:opacity-85' : ''}`}
      title={!isDone ? 'Click to show full text' : undefined}
    >
      {displayedText}
      {!isDone && (
        <span className="inline-block w-1.5 h-3.5 bg-brand-500 ml-0.5 animate-pulse align-middle"></span>
      )}
    </span>
  );
};
