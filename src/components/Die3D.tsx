/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { VocabWord, CategoryMeta } from '../data/vocabData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

export interface DieInstance {
  id: string; // unique ID, e.g. 'subject-0', 'verb-1'
  categoryKey: string;
  categoryMeta: CategoryMeta;
  copyIndex: number;
  words: VocabWord[]; // 6 faces
  currentFaceIndex: number; // 0 to 5
  isRolling: boolean;
  poolCount: number; // total words available in pool
}

interface Die3DProps {
  die: DieInstance;
  showPinyin: boolean;
  onRoll: (dieId: string) => void;
  onSelectWord?: (word: VocabWord, category: CategoryMeta, dieId: string) => void;
  onDragStart?: (e: React.DragEvent, die: DieInstance) => void;
  isCompact?: boolean; // when displayed inside sentence slot
  isInSentenceLine?: boolean;
}

export const Die3D: React.FC<Die3DProps> = ({
  die,
  showPinyin,
  onRoll,
  onSelectWord,
  onDragStart,
  isCompact = false,
  isInSentenceLine = false,
}) => {
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isWiggling, setIsWiggling] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const lastFaceRef = useRef(die.currentFaceIndex);
  const dieRef = useRef<HTMLDivElement>(null);

  // Target rotations to face each side directly to the camera:
  // Face 0 (Front): rx 0, ry 0
  // Face 1 (Back): rx 0, ry 180
  // Face 2 (Right): rx 0, ry -90
  // Face 3 (Left): rx 0, ry 90
  // Face 4 (Top): rx -90, ry 0
  // Face 5 (Bottom): rx 90, ry 0
  const getFaceRotation = (faceIndex: number) => {
    switch (faceIndex) {
      case 0: return { x: 0, y: 0 };
      case 1: return { x: 0, y: 180 };
      case 2: return { x: 0, y: -90 };
      case 3: return { x: 0, y: 90 };
      case 4: return { x: -90, y: 0 };
      case 5: return { x: 90, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  // Sync rotation whenever currentFaceIndex or isRolling changes
  useEffect(() => {
    const target = getFaceRotation(die.currentFaceIndex);
    if (die.isRolling) {
      sound.playTumble();
      // Add multiple full 360 spins for tumble effect
      const spinsX = (Math.floor(Math.random() * 2) + 2) * 360;
      const spinsY = (Math.floor(Math.random() * 2) + 3) * 360;
      setRotation({
        x: spinsX + target.x,
        y: spinsY + target.y,
      });

      // Squash and stretch landing timing
      const timer = setTimeout(() => {
        setIsLanding(true);
        sound.playLanding();

        // Sparkle effect if on table
        if (dieRef.current && !isInSentenceLine) {
          const rect = dieRef.current.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 16,
            spread: 45,
            origin: { x, y },
            colors: [die.categoryMeta.bgHex, '#ffffff', '#fef08a'],
            ticks: 80,
            gravity: 1.2,
            scalar: 0.7,
            shapes: ['circle', 'square'],
            disableForReducedMotion: true,
          });
        }

        setTimeout(() => setIsLanding(false), 300);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Direct set without rolling animation
      setRotation(target);
    }
  }, [die.currentFaceIndex, die.isRolling]);

  const currentWord = die.words[die.currentFaceIndex] || { zh: '—', pinyin: '', en: '' };

  // Calculate appropriate character sizing based on text length
  const getCharSizeClass = (zh: string, compact: boolean) => {
    const len = zh.length;
    if (compact) {
      if (len >= 5) return 'text-[11px] leading-[1.1] font-bold';
      if (len >= 4) return 'text-xs leading-tight font-bold';
      if (len >= 3) return 'text-sm font-bold';
      if (len >= 2) return 'text-base font-bold';
      return 'text-lg font-extrabold';
    }
    if (len >= 5) return 'text-xs sm:text-sm leading-tight font-bold px-1';
    if (len >= 4) return 'text-sm sm:text-base leading-tight font-bold px-1';
    if (len >= 3) return 'text-lg sm:text-xl font-bold';
    if (len >= 2) return 'text-2xl sm:text-3xl font-extrabold';
    return 'text-3xl sm:text-4xl font-black';
  };

  const handleDieClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (die.isRolling) return;

    if (isInSentenceLine) {
      // In sentence line: rolling it or inspecting
      onRoll(die.id);
    } else {
      // On table: rolling die
      onRoll(die.id);
    }
  };

  // 3D cube face definitions
  // cube size: 90px on table, 72px in compact/slot
  const size = isCompact ? 72 : 92;
  const half = size / 2;

  const faceTransforms = [
    `rotateY(0deg) translateZ(${half}px)`,      // Face 0: Front
    `rotateY(180deg) translateZ(${half}px)`,    // Face 1: Back
    `rotateY(90deg) translateZ(${half}px)`,     // Face 2: Right
    `rotateY(-90deg) translateZ(${half}px)`,    // Face 3: Left
    `rotateX(90deg) translateZ(${half}px)`,     // Face 4: Top
    `rotateX(-90deg) translateZ(${half}px)`,    // Face 5: Bottom
  ];

  // Friendly small warning if pool count is small
  const smallPoolNote = die.poolCount > 0 && die.poolCount < 6
    ? `仅 ${die.poolCount} 个词 (${die.poolCount} words)`
    : null;

  return (
    <div
      ref={dieRef}
      className={`relative inline-flex flex-col items-center justify-center select-none group touch-manipulation ${
        isInSentenceLine ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      }`}
      draggable={!die.isRolling}
      onDragStart={(e) => onDragStart && onDragStart(e, die)}
      onClick={handleDieClick}
      onMouseEnter={() => {
        setIsWiggling(true);
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setIsWiggling(false);
        setShowTooltip(false);
      }}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
      style={{
        width: `${size}px`,
        height: `${size + (isInSentenceLine ? 0 : 28)}px`,
      }}
    >
      {/* English Meaning Tooltip on Hover / Tap */}
      {showTooltip && currentWord.en && (
        <div
          className="absolute -top-11 z-50 px-2.5 py-1 text-xs font-medium text-white bg-slate-900/95 backdrop-blur-md rounded-md shadow-xl border border-white/20 whitespace-nowrap pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95"
          style={{ transform: 'translateX(-50%)', left: '50%' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-amber-300">{currentWord.zh}</span>
            <span className="text-slate-300">({currentWord.pinyin})</span>
            <span className="text-white">· {currentWord.en}</span>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}

      {/* 3D Scene Wrapper with Perspective */}
      <div
        className={`relative transition-transform duration-300 ${
          isWiggling && !die.isRolling ? 'animate-wiggle' : ''
        } ${isLanding ? 'animate-squash' : ''}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          perspective: '600px',
        }}
      >
        {/* Soft Drop Shadow on Table */}
        <div
          className="absolute rounded-full transition-all duration-300 pointer-events-none"
          style={{
            bottom: isCompact ? '-4px' : '-10px',
            left: '10%',
            width: '80%',
            height: isCompact ? '10px' : '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            filter: die.isRolling ? 'blur(10px)' : 'blur(4px)',
            opacity: die.isRolling ? 0.3 : 0.6,
            transform: die.isRolling ? 'scale(0.85) translateY(12px)' : 'scale(1)',
          }}
        />

        {/* 3D Cube Container */}
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: die.isRolling
              ? 'transform 1.1s cubic-bezier(0.18, 0.89, 0.32, 1.15)'
              : 'transform 0.4s ease-out',
          }}
        >
          {die.words.slice(0, 6).map((word, faceIdx) => (
            <div
              key={faceIdx}
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-1.5 text-center backface-visible overflow-hidden"
              style={{
                transform: faceTransforms[faceIdx],
                background: `linear-gradient(145deg, ${die.categoryMeta.bgHex}, ${die.categoryMeta.accentHex})`,
                border: `2px solid ${die.categoryMeta.borderHex}`,
                boxShadow: `
                  inset 2px 2px 5px rgba(255, 255, 255, 0.5),
                  inset -2px -2px 6px rgba(0, 0, 0, 0.35),
                  0 4px 10px rgba(0, 0, 0, 0.25)
                `,
                color: die.categoryMeta.textHex,
              }}
            >
              {/* Glossy top-left highlight glass shine */}
              <div
                className="absolute -top-6 -left-6 w-20 h-20 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
                }}
              />

              {/* Category Sticker at top */}
              <div
                className="px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight uppercase shadow-sm pointer-events-none whitespace-nowrap mb-0.5"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  color: die.categoryMeta.accentHex,
                  lineHeight: '1',
                }}
              >
                {die.categoryMeta.zhName}
              </div>

              {/* Chinese Word */}
              <div
                className={`tracking-normal select-none font-chinese drop-shadow-sm ${getCharSizeClass(
                  word.zh,
                  isCompact
                )}`}
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {word.zh}
              </div>

              {/* Pinyin Text (Toggleable) */}
              {showPinyin && word.pinyin && (
                <div
                  className="text-[10px] sm:text-[11px] font-semibold tracking-wide opacity-95 text-amber-100 whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-1"
                  style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                  }}
                >
                  {word.pinyin}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Die Footer Label on Table (Category + Small Pool Warning) */}
      {!isInSentenceLine && (
        <div className="mt-1.5 text-center flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: die.categoryMeta.bgHex }}
            />
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              {die.categoryMeta.zhName}
            </span>
            {die.copyIndex > 0 && (
              <span className="text-[10px] text-slate-500 font-medium">
                #{die.copyIndex + 1}
              </span>
            )}
          </div>
          {smallPoolNote && (
            <span className="text-[10px] text-amber-800 font-medium bg-amber-100/80 px-1 rounded mt-0.5 leading-tight">
              {smallPoolNote}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
