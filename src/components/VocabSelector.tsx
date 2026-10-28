/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  vocabBank,
  CATEGORIES,
  CategoryKey,
  VocabWord,
} from '../data/vocabData';
import { sound } from '../utils/audio';
import { ChevronDown, ChevronUp, CheckSquare, Square, SlidersHorizontal, BookOpen, Check } from 'lucide-react';

export interface SelectedDialoguesState {
  // Key format: "Lesson 1:Dialogue 1" -> boolean
  [dialogueKey: string]: boolean;
}

interface VocabSelectorProps {
  selectedDialogues: SelectedDialoguesState;
  onSelectionChange: (newSelection: SelectedDialoguesState) => void;
  onApply: () => void;
  useObjectDie: boolean;
  onToggleUseObjectDie: (val: boolean) => void;
  categoryWordCounts: Record<CategoryKey, number>;
}

export const VocabSelector: React.FC<VocabSelectorProps> = ({
  selectedDialogues,
  onSelectionChange,
  onApply,
  useObjectDie,
  onToggleUseObjectDie,
  categoryWordCounts,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate ordered list of all lesson/dialogue pairs dynamically from vocabBank
  const allDialogueList = useMemo(() => {
    const list: { key: string; label: string; lesson: string; dialogue: string }[] = [];
    Object.keys(vocabBank).forEach((lesson) => {
      Object.keys(vocabBank[lesson]).forEach((dialogue) => {
        list.push({
          key: `${lesson}:${dialogue}`,
          label: `${lesson} ${dialogue}`,
          lesson,
          dialogue,
        });
      });
    });
    return list;
  }, []);

  // Quick range state
  const [rangeFrom, setRangeFrom] = useState(allDialogueList[0]?.key || '');
  const [rangeTo, setRangeTo] = useState(allDialogueList[Math.min(3, allDialogueList.length - 1)]?.key || '');

  // Count how many dialogues are currently selected
  const selectedCount = useMemo(() => {
    return Object.values(selectedDialogues).filter(Boolean).length;
  }, [selectedDialogues]);

  // Total word count in current selection
  const totalWords = useMemo(() => {
    return Object.values(categoryWordCounts).reduce((acc, c) => acc + c, 0);
  }, [categoryWordCounts]);

  // Toggle individual dialogue
  const handleToggleDialogue = (key: string) => {
    sound.playClick();
    onSelectionChange({
      ...selectedDialogues,
      [key]: !selectedDialogues[key],
    });
  };

  // Toggle all dialogues in a specific lesson
  const handleToggleLesson = (lesson: string) => {
    sound.playClick();
    const dialogues = Object.keys(vocabBank[lesson] || {});
    const allChecked = dialogues.every((d) => selectedDialogues[`${lesson}:${d}`]);

    const updated = { ...selectedDialogues };
    dialogues.forEach((d) => {
      updated[`${lesson}:${d}`] = !allChecked;
    });
    onSelectionChange(updated);
  };

  // Select All
  const handleSelectAll = () => {
    sound.playClick();
    const updated: SelectedDialoguesState = {};
    allDialogueList.forEach((item) => {
      updated[item.key] = true;
    });
    onSelectionChange(updated);
  };

  // Clear All
  const handleClearAll = () => {
    sound.playClick();
    const updated: SelectedDialoguesState = {};
    allDialogueList.forEach((item) => {
      updated[item.key] = false;
    });
    onSelectionChange(updated);
  };

  // Quick Range Tool Apply
  const handleSelectRange = () => {
    sound.playClick();
    const fromIdx = allDialogueList.findIndex((item) => item.key === rangeFrom);
    const toIdx = allDialogueList.findIndex((item) => item.key === rangeTo);

    if (fromIdx === -1 || toIdx === -1) return;

    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);

    const updated = { ...selectedDialogues };
    allDialogueList.forEach((item, index) => {
      if (index >= start && index <= end) {
        updated[item.key] = true;
      }
    });
    onSelectionChange(updated);
  };

  return (
    <div className="w-full bg-amber-50/90 backdrop-blur border-b border-amber-200/80 shadow-sm transition-all duration-200">
      {/* Top Banner / Collapsible Trigger Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Summary and Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setIsOpen(!isOpen);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-semibold text-sm transition-colors border border-amber-300 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-800" />
            <span>Choose Vocabulary 选择词汇</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-amber-900 font-medium">
            <span className="bg-amber-200/60 px-2 py-0.5 rounded text-amber-900 font-bold">
              {selectedCount} Dialogues 对话
            </span>
            <span>·</span>
            <span>{totalWords} Unique Words 词汇</span>
          </div>
        </div>

        {/* Center: Live Category Counts */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {CATEGORIES.map((cat) => {
            if (cat.key === 'object' && !useObjectDie) return null;
            const count = categoryWordCounts[cat.key] || 0;
            return (
              <div
                key={cat.key}
                className="flex items-center gap-1 px-2 py-0.5 rounded border shadow-2xs font-medium"
                style={{
                  backgroundColor: cat.lightBgHex,
                  borderColor: cat.borderHex + '40',
                  color: cat.accentHex,
                }}
                title={`${cat.zhName} (${cat.enName}): ${count} words`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: cat.bgHex }}
                />
                <span className="font-bold">{cat.zhName}</span>
                <span className="font-mono tabular-nums opacity-90">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Fast Apply Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playSnap();
              onApply();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Start / Apply 开始</span>
          </button>
        </div>
      </div>

      {/* Expanded Vocabulary Selector Tray */}
      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 pb-5 pt-2 border-t border-amber-200/60 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Quick Range Tool & Global Select / Clear */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200 shadow-2xs mb-4 flex flex-wrap items-center justify-between gap-3">
            {/* Quick Range selection */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-medium text-slate-700">
              <span className="font-bold text-amber-950 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                Quick Range 快速范围:
              </span>
              <label className="flex items-center gap-1">
                <span>From 从</span>
                <select
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  className="bg-amber-50/80 border border-amber-300 rounded px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {allDialogueList.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-1">
                <span>To 到</span>
                <select
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  className="bg-amber-50/80 border border-amber-300 rounded px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {allDialogueList.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={handleSelectRange}
                className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Select Range 选择范围
              </button>
            </div>

            {/* Global Controls & Object Die Toggle */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Checkbox: Use Object die */}
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer bg-pink-50 hover:bg-pink-100/80 px-2.5 py-1 rounded border border-pink-200 transition-colors">
                <input
                  type="checkbox"
                  checked={useObjectDie}
                  onChange={(e) => {
                    sound.playClick();
                    onToggleUseObjectDie(e.target.checked);
                  }}
                  className="w-3.5 h-3.5 accent-pink-600 rounded"
                />
                <span className="text-pink-900">Use Object die 使用宾语骰子</span>
              </label>

              <div className="h-4 w-px bg-amber-300" />

              <button
                onClick={handleSelectAll}
                className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 transition-colors cursor-pointer"
              >
                Select All 全选
              </button>
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
              >
                Clear All 全不选
              </button>
            </div>
          </div>

          {/* Lessons & Dialogues Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {Object.keys(vocabBank).map((lesson) => {
              const dialogues = Object.keys(vocabBank[lesson]);
              const allCheckedInLesson = dialogues.every((d) => selectedDialogues[`${lesson}:${d}`]);
              const someCheckedInLesson = dialogues.some((d) => selectedDialogues[`${lesson}:${d}`]);

              return (
                <div
                  key={lesson}
                  className={`p-2.5 rounded-xl border transition-all ${
                    allCheckedInLesson
                      ? 'bg-amber-100/70 border-amber-400 shadow-xs'
                      : someCheckedInLesson
                      ? 'bg-white/90 border-amber-300'
                      : 'bg-white/60 border-slate-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-amber-200/60">
                    <span className="font-bold text-xs text-slate-800">{lesson}</span>
                    <button
                      onClick={() => handleToggleLesson(lesson)}
                      className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold hover:underline cursor-pointer"
                    >
                      {allCheckedInLesson ? 'Deselect all' : 'Select all 本课全选'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {dialogues.map((dialogue) => {
                      const key = `${lesson}:${dialogue}`;
                      const isChecked = !!selectedDialogues[key];
                      const dVocab = vocabBank[lesson][dialogue];
                      // Total count of words in dialogue
                      const wordCount = Object.values(dVocab).reduce(
                        (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
                        0
                      );

                      return (
                        <label
                          key={dialogue}
                          className={`flex items-center justify-between p-1.5 rounded text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-amber-200/70 text-slate-900 font-semibold'
                              : 'hover:bg-amber-100/50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleDialogue(key)}
                              className="w-3.5 h-3.5 accent-amber-600 rounded"
                            />
                            <span>{dialogue}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {wordCount} 词
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Confirmation Footer inside Tray */}
          <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between">
            <span className="text-xs text-slate-600">
              Words will be merged by category without duplicates. Selection is automatically saved.
            </span>
            <button
              onClick={() => {
                sound.playSnap();
                onApply();
                setIsOpen(false);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Close 应用并收起</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
