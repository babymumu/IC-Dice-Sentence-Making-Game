/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DieInstance, Die3D } from './Die3D';
import { VocabWord, CategoryMeta } from '../data/vocabData';
import { sound, readChineseSentence, stopSpeaking } from '../utils/audio';
import { Volume2, VolumeX, Trash2, HelpCircle, ArrowLeft, ArrowRight, X } from 'lucide-react';

export interface PunctuationTile {
  id: string;
  zh: string;
  pinyin: string;
  en: string;
}

export type SentenceSlotItem =
  | { type: 'die'; die: DieInstance }
  | { type: 'punct'; punct: PunctuationTile };

const PUNCTUATIONS: PunctuationTile[] = [
  { id: 'period', zh: '。', pinyin: 'jùhào', en: 'period' },
  { id: 'question', zh: '？', pinyin: 'wènhào', en: 'question mark' },
  { id: 'exclamation', zh: '！', pinyin: 'tànhào', en: 'exclamation mark' },
  { id: 'comma', zh: '，', pinyin: 'dòuhào', en: 'comma' },
];

interface SentenceLineProps {
  slots: (SentenceSlotItem | null)[];
  onUpdateSlots: (newSlots: (SentenceSlotItem | null)[]) => void;
  onRemoveSlot: (index: number) => void;
  onClearLine: () => void;
  onRollDieInSlot: (dieId: string) => void;
  showPinyin: boolean;
  onAddPunctuation: (punct: PunctuationTile) => void;
}

export const SentenceLine: React.FC<SentenceLineProps> = ({
  slots,
  onUpdateSlots,
  onRemoveSlot,
  onClearLine,
  onRollDieInSlot,
  showPinyin,
  onAddPunctuation,
}) => {
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [draggedSlotIndex, setDraggedSlotIndex] = useState<number | null>(null);
  const [hoveredWord, setHoveredWord] = useState<{
    zh: string;
    pinyin: string;
    en: string;
    type?: string;
  } | null>(null);

  // Extract non-null items in sentence
  const filledItems = slots.filter((item): item is SentenceSlotItem => item !== null);

  // Build full sentence text for display and speech
  const fullSentenceZh = filledItems
    .map((item) => (item.type === 'die' ? item.die.words[item.die.currentFaceIndex]?.zh || '' : item.punct.zh))
    .join('');

  // Handle Read Aloud
  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setActiveSpeechIndex(null);
      return;
    }

    if (!fullSentenceZh.trim()) return;

    sound.playClick();
    setIsSpeaking(true);

    // Read full sentence
    readChineseSentence(
      fullSentenceZh,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        setActiveSpeechIndex(null);
      },
      () => {
        setIsSpeaking(false);
        setActiveSpeechIndex(null);
      }
    );
  };

  // Drag over slot
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Drop onto a specific slot index
  const handleDropOnSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    // Check if dragging another slot within the sentence line
    const fromSlotStr = e.dataTransfer.getData('text/sentence-slot');
    if (fromSlotStr !== '') {
      const fromIndex = parseInt(fromSlotStr, 10);
      if (!isNaN(fromIndex) && fromIndex !== targetIndex) {
        sound.playSnap();
        const updated = [...slots];
        const temp = updated[fromIndex];
        updated[fromIndex] = updated[targetIndex];
        updated[targetIndex] = temp;
        onUpdateSlots(updated);
        setDraggedSlotIndex(null);
        return;
      }
    }

    // Check if dropping a punctuation tile
    const punctId = e.dataTransfer.getData('text/punct-id');
    if (punctId) {
      const punct = PUNCTUATIONS.find((p) => p.id === punctId);
      if (punct) {
        sound.playSnap();
        const updated = [...slots];
        updated[targetIndex] = { type: 'punct', punct };
        onUpdateSlots(updated);
        return;
      }
    }

    // Check if dropping a die from the table
    const dieId = e.dataTransfer.getData('text/die-id');
    if (dieId) {
      // Find die passed via custom event payload or data
      const dieDataStr = e.dataTransfer.getData('application/json');
      if (dieDataStr) {
        try {
          const dieObj: DieInstance = JSON.parse(dieDataStr);
          sound.playSnap();
          const updated = [...slots];
          updated[targetIndex] = { type: 'die', die: dieObj };
          onUpdateSlots(updated);
        } catch {
          // fallback
        }
      }
    }
  };

  // Swap adjacent slots
  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    sound.playClick();
    const updated = [...slots];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onUpdateSlots(updated);
  };

  const handleMoveRight = (index: number) => {
    if (index >= slots.length - 1) return;
    sound.playClick();
    const updated = [...slots];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onUpdateSlots(updated);
  };

  return (
    <div className="w-full bg-amber-950/20 backdrop-blur-sm border-t-2 border-amber-900/30 pt-3 pb-6 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Sentence Line Header & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base text-amber-950 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
              Sentence Line 句子线
            </span>
            <span className="text-xs text-amber-900/70 hidden sm:inline">
              (Drag dice and punctuation into slots · Snap to reorder)
            </span>
          </div>

          {/* Right Tools: Punctuation Tray + Read Aloud + Clear */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Draggable Punctuation Tray */}
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur px-2 py-1 rounded-lg border border-amber-300/80 shadow-2xs">
              <span className="text-[11px] font-bold text-amber-950 px-1">
                Punctuation 标点:
              </span>
              {PUNCTUATIONS.map((punct) => (
                <button
                  key={punct.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/punct-id', punct.id);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => {
                    sound.playSnap();
                    onAddPunctuation(punct);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-amber-100 hover:bg-amber-200 active:scale-95 text-base font-black text-amber-950 border border-amber-300 shadow-2xs cursor-grab active:cursor-grabbing transition-all"
                  title={`Add ${punct.zh} (${punct.en}) to sentence line`}
                >
                  {punct.zh}
                </button>
              ))}
            </div>

            {/* Read Aloud Button */}
            <button
              onClick={handleReadAloud}
              disabled={!fullSentenceZh.trim()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${
                fullSentenceZh.trim()
                  ? isSpeaking
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                  : 'bg-amber-200/50 text-amber-800/40 cursor-not-allowed'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Stop 停止' : 'Read Aloud 朗读'}</span>
            </button>

            {/* Clear Line Button */}
            <button
              onClick={() => {
                sound.playClear();
                onClearLine();
              }}
              disabled={filledItems.length === 0}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-2xs active:scale-95 cursor-pointer ${
                filledItems.length > 0
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-slate-100/50 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Line 清空</span>
            </button>
          </div>
        </div>

        {/* The Slots Horizontal Strip */}
        <div className="relative p-3.5 rounded-2xl bg-amber-900/10 border-2 border-dashed border-amber-900/25 min-h-[120px] overflow-x-auto flex items-center gap-2.5 scrollbar-thin">
          {slots.map((slotItem, index) => {
            const isFilled = slotItem !== null;

            return (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, index)}
                className={`relative shrink-0 rounded-2xl transition-all flex flex-col items-center justify-center ${
                  isFilled
                    ? 'w-[84px] h-[100px] bg-white/90 shadow-md border-2 border-amber-300 group'
                    : 'w-[84px] h-[100px] border-2 border-dashed border-amber-900/30 hover:border-amber-600 hover:bg-amber-200/30'
                }`}
              >
                {/* Slot Number */}
                <span className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-900 text-amber-100 shadow-2xs pointer-events-none">
                  {index + 1}
                </span>

                {/* Empty Slot Placeholder */}
                {!isFilled && (
                  <div className="text-center p-1 pointer-events-none">
                    <span className="text-[11px] font-semibold text-amber-900/50 block">
                      Slot {index + 1}
                    </span>
                    <span className="text-[9px] text-amber-900/40 block">
                      Drop here
                    </span>
                  </div>
                )}

                {/* Filled Slot: Die or Punctuation */}
                {isFilled && (
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/sentence-slot', String(index));
                      setDraggedSlotIndex(index);
                    }}
                    className="w-full h-full flex flex-col items-center justify-center p-1 cursor-grab active:cursor-grabbing relative"
                  >
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onRemoveSlot(index);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 active:scale-95 transition-all z-20 cursor-pointer"
                      title="Remove from slot"
                    >
                      <X className="w-3 h-3 stroke-[3]" />
                    </button>

                    {/* Left/Right reorder arrows on hover */}
                    <div className="absolute -bottom-2.5 flex items-center gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLeft(index);
                          }}
                          className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center shadow hover:bg-slate-900"
                          title="Move left"
                        >
                          <ArrowLeft className="w-2.5 h-2.5" />
                        </button>
                      )}
                      {index < slots.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveRight(index);
                          }}
                          className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center shadow hover:bg-slate-900"
                          title="Move right"
                        >
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>

                    {slotItem.type === 'die' ? (
                      <div className="scale-95 flex flex-col items-center justify-center">
                        <Die3D
                          die={slotItem.die}
                          showPinyin={showPinyin}
                          onRoll={onRollDieInSlot}
                          isCompact={true}
                          isInSentenceLine={true}
                        />
                      </div>
                    ) : (
                      /* Punctuation Tile */
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <span className="text-3xl font-black text-amber-950 font-chinese drop-shadow-sm">
                          {slotItem.punct.zh}
                        </span>
                        <span className="text-[10px] text-amber-800/70 font-semibold mt-1">
                          {slotItem.punct.en}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Assembled Sentence Display (Classroom Shared Reading) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
              <span>Assembled Sentence 完整句子:</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Hover or tap any word for English definition (悬停/轻触查看英文释义)
            </span>
          </div>

          {filledItems.length === 0 ? (
            <div className="py-6 text-center text-amber-800/50 font-medium italic text-sm">
              拖入骰子或点击标点，在这里组成句子... / Drag dice or punctuation here to build your sentence!
            </div>
          ) : (
            <div className="flex items-end flex-wrap gap-x-3 gap-y-2 py-2">
              {filledItems.map((item, idx) => {
                const word =
                  item.type === 'die'
                    ? item.die.words[item.die.currentFaceIndex]
                    : { zh: item.punct.zh, pinyin: item.punct.pinyin, en: item.punct.en };
                const isDie = item.type === 'die';
                const colorHex = isDie ? item.die.categoryMeta.accentHex : '#78350f';

                return (
                  <div
                    key={idx}
                    onMouseEnter={() =>
                      setHoveredWord({
                        zh: word.zh,
                        pinyin: word.pinyin,
                        en: word.en,
                        type: isDie ? item.die.categoryMeta.zhName : '标点',
                      })
                    }
                    onMouseLeave={() => setHoveredWord(null)}
                    onClick={() => {
                      sound.playClick();
                      readChineseSentence(word.zh);
                      setHoveredWord({
                        zh: word.zh,
                        pinyin: word.pinyin,
                        en: word.en,
                        type: isDie ? item.die.categoryMeta.zhName : '标点',
                      });
                    }}
                    className="inline-flex flex-col items-center cursor-pointer group relative px-1 py-0.5 rounded-lg hover:bg-amber-100/80 transition-colors"
                  >
                    {/* Pinyin above text */}
                    {showPinyin && word.pinyin && (
                      <span className="text-xs sm:text-sm font-semibold text-amber-900/80 tracking-wide select-none">
                        {word.pinyin}
                      </span>
                    )}

                    {/* Chinese characters */}
                    <span
                      className={`font-black font-chinese tracking-wide transition-all ${
                        isDie
                          ? 'text-2xl sm:text-4xl hover:scale-105'
                          : 'text-2xl sm:text-4xl text-amber-950'
                      }`}
                      style={{ color: colorHex }}
                    >
                      {word.zh}
                    </span>

                    {/* Underline bar indicating category color */}
                    {isDie && (
                      <span
                        className="w-full h-1 rounded-full mt-0.5"
                        style={{ backgroundColor: item.die.categoryMeta.bgHex }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Word Inspector Bar */}
          {hoveredWord && (
            <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center justify-between text-xs text-slate-700 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 font-chinese">
                  {hoveredWord.zh}
                </span>
                <span className="font-semibold text-amber-800">
                  [{hoveredWord.pinyin}]
                </span>
                <span className="text-slate-600">· {hoveredWord.en}</span>
              </div>
              {hoveredWord.type && (
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                  {hoveredWord.type}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
