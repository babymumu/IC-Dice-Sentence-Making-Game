/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  vocabBank,
  CATEGORIES,
  CategoryKey,
  VocabWord,
  CategoryMeta,
} from './data/vocabData';
import { DieInstance, Die3D } from './components/Die3D';
import { VocabSelector, SelectedDialoguesState } from './components/VocabSelector';
import { SentenceLine, SentenceSlotItem, PunctuationTile } from './components/SentenceLine';
import { sound } from './utils/audio';
import {
  Dices,
  RefreshCw,
  Trash2,
  Volume2,
  VolumeX,
  Type,
  Plus,
  Minus,
  Sparkles,
  Info,
  Download,
} from 'lucide-react';

const STORAGE_KEY_DIALOGUES = 'sentence_dice_selected_dialogues_v2';
const STORAGE_KEY_USE_OBJECT = 'sentence_dice_use_object_v2';
const STORAGE_KEY_PINYIN = 'sentence_dice_show_pinyin';

export default function App() {
  // 1. Selection State (Persisted in localStorage)
  const [selectedDialogues, setSelectedDialogues] = useState<SelectedDialoguesState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIALOGUES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial selection: Lesson 1 Dialogues 1 & 2, Lesson 2 Dialogue 1
    return {
      'Lesson 1:Dialogue 1': true,
      'Lesson 1:Dialogue 2': true,
      'Lesson 2:Dialogue 1': true,
    };
  });

  const [useObjectDie, setUseObjectDie] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USE_OBJECT);
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return true; // Default ON
  });

  const [showPinyin, setShowPinyin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PINYIN);
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return true;
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // 2. Number of copies for each category die (1 to 3 copies)
  const [diceCopies, setDiceCopies] = useState<Record<CategoryKey, number>>({
    subject: 1,
    time: 1,
    location: 1,
    modifier: 1,
    verb: 1,
    object: 1,
  });

  // 3. Dice list state
  const [diceList, setDiceList] = useState<DieInstance[]>([]);

  // 4. Sentence Line Slots (8 slots default, responsive)
  const [slots, setSlots] = useState<(SentenceSlotItem | null)[]>(() =>
    Array(8).fill(null)
  );

  // Helper to deduplicate words by Chinese character
  const dedupeWords = (words: VocabWord[]): VocabWord[] => {
    const map = new Map<string, VocabWord>();
    words.forEach((w) => {
      if (!map.has(w.zh)) {
        map.set(w.zh, w);
      }
    });
    return Array.from(map.values());
  };

  // Helper to shuffle an array
  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Compute pooled words per category based on active selectedDialogues
  const pooledWordsByCategory = useMemo<Record<CategoryKey, VocabWord[]>>(() => {
    const pooled: Record<CategoryKey, VocabWord[]> = {
      subject: [],
      time: [],
      location: [],
      modifier: [],
      verb: [],
      object: [],
    };

    Object.entries(selectedDialogues).forEach(([key, isSelected]) => {
      if (!isSelected) return;
      const [lesson, dialogue] = key.split(':');
      const dVocab = vocabBank[lesson]?.[dialogue];
      if (dVocab) {
        CATEGORIES.forEach((cat) => {
          const words = dVocab[cat.key];
          if (Array.isArray(words)) {
            pooled[cat.key].push(...words);
          }
        });
      }
    });

    // Deduplicate within each category
    const deduped: Record<CategoryKey, VocabWord[]> = {
      subject: dedupeWords(pooled.subject),
      time: dedupeWords(pooled.time),
      location: dedupeWords(pooled.location),
      modifier: dedupeWords(pooled.modifier),
      verb: dedupeWords(pooled.verb),
      object: dedupeWords(pooled.object),
    };

    return deduped;
  }, [selectedDialogues]);

  // Word counts summary
  const categoryWordCounts = useMemo<Record<CategoryKey, number>>(() => {
    return {
      subject: pooledWordsByCategory.subject.length,
      time: pooledWordsByCategory.time.length,
      location: pooledWordsByCategory.location.length,
      modifier: pooledWordsByCategory.modifier.length,
      verb: pooledWordsByCategory.verb.length,
      object: pooledWordsByCategory.object.length,
    };
  }, [pooledWordsByCategory]);

  // Build 6 faces for a die according to small pool rules
  const buildFacesForCategory = useCallback(
    (catKey: CategoryKey): { faces: VocabWord[]; poolCount: number } => {
      const pool = pooledWordsByCategory[catKey];
      const count = pool.length;

      if (count === 0) {
        return { faces: [], poolCount: 0 };
      }

      if (count >= 6) {
        // Pick 6 distinct words randomly
        const shuffled = shuffle(pool);
        return { faces: shuffled.slice(0, 6), poolCount: count };
      }

      // count < 6: use every available word at least once, fill remaining by randomly repeating
      const faces: VocabWord[] = [...pool];
      while (faces.length < 6) {
        const randomPick = pool[Math.floor(Math.random() * pool.length)];
        faces.push(randomPick);
      }
      return { faces: shuffle(faces), poolCount: count };
    },
    [pooledWordsByCategory]
  );

  // Generate / Regenerate all dice instances
  const generateDice = useCallback(() => {
    const newDice: DieInstance[] = [];

    CATEGORIES.forEach((cat) => {
      if (cat.key === 'object' && !useObjectDie) return;

      const numCopies = diceCopies[cat.key] || 1;
      const { faces, poolCount } = buildFacesForCategory(cat.key);

      if (faces.length === 0) {
        // Pool is empty, skip generating die instance
        return;
      }

      for (let i = 0; i < numCopies; i++) {
        // Each copy draws its own 6 faces from the pool for maximum variety!
        const copyFaces =
          i === 0 ? faces : buildFacesForCategory(cat.key).faces;
        newDice.push({
          id: `${cat.key}-${i}`,
          categoryKey: cat.key,
          categoryMeta: cat,
          copyIndex: i,
          words: copyFaces,
          currentFaceIndex: Math.floor(Math.random() * 6),
          isRolling: false,
          poolCount,
        });
      }
    });

    setDiceList(newDice);
  }, [useObjectDie, diceCopies, buildFacesForCategory]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DIALOGUES, JSON.stringify(selectedDialogues));
    } catch {
      // ignore
    }
  }, [selectedDialogues]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USE_OBJECT, String(useObjectDie));
    } catch {
      // ignore
    }
  }, [useObjectDie]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PINYIN, String(showPinyin));
    } catch {
      // ignore
    }
  }, [showPinyin]);

  // Initial build and whenever vocabulary selection applies
  useEffect(() => {
    generateDice();
  }, [generateDice]);

  // Roll a single die
  const handleRollDie = (dieId: string) => {
    setDiceList((prev) =>
      prev.map((d) => {
        if (d.id === dieId) {
          // Choose a new random face (ensuring it feels dynamic)
          let newFace = Math.floor(Math.random() * 6);
          if (newFace === d.currentFaceIndex) {
            newFace = (newFace + 1 + Math.floor(Math.random() * 5)) % 6;
          }
          return {
            ...d,
            currentFaceIndex: newFace,
            isRolling: true,
          };
        }
        return d;
      })
    );

    // Stop rolling flag after 1.1s
    setTimeout(() => {
      setDiceList((prev) =>
        prev.map((d) => (d.id === dieId ? { ...d, isRolling: false } : d))
      );
    }, 1100);
  };

  // Roll All dice
  const handleRollAll = () => {
    sound.playTumble();
    setDiceList((prev) =>
      prev.map((d, index) => {
        const newFace = (d.currentFaceIndex + 1 + Math.floor(Math.random() * 5)) % 6;
        return {
          ...d,
          currentFaceIndex: newFace,
          isRolling: true,
        };
      })
    );

    // Also update any dice in the sentence line
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot && slot.type === 'die') {
          const newFace = (slot.die.currentFaceIndex + 1 + Math.floor(Math.random() * 5)) % 6;
          return {
            ...slot,
            die: {
              ...slot.die,
              currentFaceIndex: newFace,
              isRolling: true,
            },
          };
        }
        return slot;
      })
    );

    setTimeout(() => {
      setDiceList((prev) => prev.map((d) => ({ ...d, isRolling: false })));
      setSlots((prev) =>
        prev.map((slot) => {
          if (slot && slot.type === 'die') {
            return {
              ...slot,
              die: { ...slot.die, isRolling: false },
            };
          }
          return slot;
        })
      );
    }, 1150);
  };

  // New Words: redraw 6 words from pool for every die
  const handleNewWords = () => {
    sound.playClick();
    generateDice();
  };

  // Clear Sentence Line
  const handleClearLine = () => {
    setSlots(Array(8).fill(null));
  };

  // Toggle Pinyin
  const handleTogglePinyin = () => {
    sound.playClick();
    setShowPinyin(!showPinyin);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const newMute = sound.toggleMute();
    setIsMuted(newMute);
  };

  // Add / Remove die copy count
  const handleUpdateCopies = (catKey: CategoryKey, delta: number) => {
    sound.playClick();
    setDiceCopies((prev) => {
      const current = prev[catKey] || 1;
      const next = Math.max(1, Math.min(3, current + delta));
      return { ...prev, [catKey]: next };
    });
  };

  // Drag Start for a die from table
  const handleDragStartDie = (e: React.DragEvent, die: DieInstance) => {
    e.dataTransfer.setData('text/die-id', die.id);
    e.dataTransfer.setData('application/json', JSON.stringify(die));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  // Tap a die on table to append to first empty slot
  const handleDieTableTap = (die: DieInstance) => {
    // If not rolling, roll it AND check if user wants to place it
    handleRollDie(die.id);
  };

  const handleDieAddToSentence = (e: React.MouseEvent, die: DieInstance) => {
    e.stopPropagation();
    sound.playSnap();
    const firstEmpty = slots.findIndex((s) => s === null);
    if (firstEmpty !== -1) {
      const updated = [...slots];
      updated[firstEmpty] = { type: 'die', die };
      setSlots(updated);
    } else {
      // Expand slot array
      setSlots([...slots, { type: 'die', die }]);
    }
  };

  // Add punctuation to first empty slot
  const handleAddPunctuation = (punct: PunctuationTile) => {
    const firstEmpty = slots.findIndex((s) => s === null);
    if (firstEmpty !== -1) {
      const updated = [...slots];
      updated[firstEmpty] = { type: 'punct', punct };
      setSlots(updated);
    } else {
      setSlots([...slots, { type: 'punct', punct }]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    const updated = [...slots];
    updated[index] = null;
    setSlots(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-950/20 font-sans text-slate-800">
      {/* 1. TOP BAR: Title & Action Toolbar */}
      <header className="bg-amber-900 text-amber-50 px-4 py-2.5 sm:py-3 shadow-md border-b-2 border-amber-950 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-inner border border-amber-400">
              <Dices className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                Sentence Dice
                <span className="font-chinese text-amber-300 font-extrabold text-base sm:text-lg">
                  句子骰子
                </span>
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Roll All */}
            <button
              onClick={handleRollAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              title="Roll all dice simultaneously (Space)"
            >
              <Dices className="w-4 h-4" />
              <span>Roll All 全部掷骰子</span>
            </button>

            {/* New Words */}
            <button
              onClick={handleNewWords}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm border border-amber-700 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Draw 6 new words from pool for every die"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Words 换新词</span>
            </button>

            {/* Pinyin Toggle */}
            <button
              onClick={handleTogglePinyin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-2xs active:scale-95 cursor-pointer ${
                showPinyin
                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                  : 'bg-amber-900/60 text-amber-200 border-amber-800'
              }`}
              title="Toggle Pinyin pronunciation display"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Pinyin 拼音: {showPinyin ? 'ON' : 'OFF'}</span>
            </button>

            {/* Download Offline Game ZIP */}
            <a
              href="/sentence-dice-game.zip"
              download="sentence-dice-game.zip"
              onClick={() => sound.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm border border-emerald-500 shadow-sm active:scale-95 transition-all cursor-pointer no-underline"
              title="Download standalone offline HTML & game ZIP package"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP 下载压缩包</span>
            </a>

            {/* Audio Mute Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg bg-amber-900/80 hover:bg-amber-800 text-amber-200 hover:text-white border border-amber-700 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. VOCABULARY SELECTOR PANEL (Teacher Control) */}
      <VocabSelector
        selectedDialogues={selectedDialogues}
        onSelectionChange={setSelectedDialogues}
        onApply={generateDice}
        useObjectDie={useObjectDie}
        onToggleUseObjectDie={(val) => {
          setUseObjectDie(val);
        }}
        categoryWordCounts={categoryWordCounts}
      />

      {/* 3. MIDDLE: FELT GAME TABLE (Tactile 3D Dice Stage) */}
      <main className="flex-1 felt-table relative min-h-[360px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
        {/* Table Felt Surface Subtle Ambient Glow & Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/10 to-black/40" />

        {/* Dice Stations Grid on the Felt Table */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Subtle instruction line */}
          <div className="flex items-center justify-between mb-3 text-emerald-100/75 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Click/Tap a die to roll it · Drag into Sentence Line or click "+ To Line"
            </span>
            <span className="hidden md:inline text-emerald-200/60">
              Open-ended practice · Build Chinese sentences freely
            </span>
          </div>

          {/* Categories Grid Container */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              if (cat.key === 'object' && !useObjectDie) return null;

              const poolCount = categoryWordCounts[cat.key] || 0;
              const isPoolEmpty = poolCount === 0;
              const copiesCount = diceCopies[cat.key] || 1;
              const activeDiceForCat = diceList.filter((d) => d.categoryKey === cat.key);

              return (
                <div
                  key={cat.key}
                  className={`rounded-2xl p-3 flex flex-col items-center justify-between transition-all backdrop-blur-xs ${
                    isPoolEmpty
                      ? 'bg-black/25 border border-white/10 opacity-60'
                      : 'bg-white/10 hover:bg-white/15 border border-white/20 shadow-lg'
                  }`}
                >
                  {/* Category Header with + / - Copies Control */}
                  <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/15">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-2xs"
                        style={{ backgroundColor: cat.bgHex }}
                      />
                      <span className="text-xs font-bold text-white tracking-tight">
                        {cat.zhName}
                      </span>
                    </div>

                    {/* + and - buttons to adjust copies up to 3 */}
                    {!isPoolEmpty && (
                      <div className="flex items-center gap-1 bg-black/30 rounded-md p-0.5 border border-white/10">
                        <button
                          onClick={() => handleUpdateCopies(cat.key, -1)}
                          disabled={copiesCount <= 1}
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                            copiesCount > 1
                              ? 'text-white hover:bg-white/20 cursor-pointer'
                              : 'text-white/30 cursor-not-allowed'
                          }`}
                          title={`Decrease ${cat.zhName} dice count`}
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>

                        <span className="text-[11px] font-bold text-amber-200 px-1 font-mono">
                          {copiesCount}
                        </span>

                        <button
                          onClick={() => handleUpdateCopies(cat.key, 1)}
                          disabled={copiesCount >= 3}
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                            copiesCount < 3
                              ? 'text-white hover:bg-white/20 cursor-pointer'
                              : 'text-white/30 cursor-not-allowed'
                          }`}
                          title={`Add another ${cat.zhName} die (up to 3)`}
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Die Display Stage */}
                  <div className="py-2 flex flex-col items-center justify-center min-h-[140px] w-full">
                    {isPoolEmpty ? (
                      /* Zero words in category note */
                      <div className="text-center p-3">
                        <span className="text-xs font-semibold text-rose-300 block mb-1">
                          无词汇 (0 words)
                        </span>
                        <span className="text-[11px] text-white/60 block leading-tight">
                          Select lessons with {cat.zhName} in vocabulary menu.
                        </span>
                      </div>
                    ) : (
                      /* Render all active copies of this die */
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {activeDiceForCat.map((die) => (
                          <div
                            key={die.id}
                            className="flex flex-col items-center group relative"
                          >
                            <Die3D
                              die={die}
                              showPinyin={showPinyin}
                              onRoll={handleRollDie}
                              onDragStart={handleDragStartDie}
                            />

                            {/* Direct "+ To Line" Quick Button for Touch / Smartboard users */}
                            <button
                              onClick={(e) => handleDieAddToSentence(e, die)}
                              className="mt-1 px-2 py-0.5 rounded bg-emerald-500/80 hover:bg-emerald-500 text-white text-[10px] font-bold tracking-tight shadow-sm opacity-90 group-hover:opacity-100 transition-all cursor-pointer active:scale-95"
                              title="Add to Sentence Line"
                            >
                              + To Line 入句
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Description Tag */}
                  <div className="w-full text-center pt-1.5 border-t border-white/10 text-[10px] text-emerald-100/70 truncate">
                    {cat.enName} · {poolCount} words
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Felt table bottom accent line */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-3" />
      </main>

      {/* 4. BOTTOM: SENTENCE LINE & ASSEMBLED SENTENCE DISPLAY */}
      <SentenceLine
        slots={slots}
        onUpdateSlots={setSlots}
        onRemoveSlot={handleRemoveSlot}
        onClearLine={handleClearLine}
        onRollDieInSlot={handleRollDie}
        showPinyin={showPinyin}
        onAddPunctuation={handleAddPunctuation}
      />
    </div>
  );
}
