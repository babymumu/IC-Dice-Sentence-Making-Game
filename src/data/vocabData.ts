/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabWord {
  zh: string;
  pinyin: string;
  en: string;
}

export type CategoryKey = 'subject' | 'time' | 'location' | 'modifier' | 'verb' | 'object';

export interface DialogueVocab {
  subject: VocabWord[];
  time: VocabWord[];
  location: VocabWord[];
  modifier: VocabWord[];
  verb: VocabWord[];
  object: VocabWord[];
}

export interface LessonData {
  [dialogueName: string]: DialogueVocab;
}

export interface VocabBank {
  [lessonName: string]: LessonData;
}

export interface CategoryMeta {
  key: CategoryKey;
  zhName: string;
  enName: string;
  colorName: string;
  bgHex: string;
  accentHex: string;
  borderHex: string;
  textHex: string;
  lightBgHex: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: 'subject',
    zhName: '主语',
    enName: 'Subject',
    colorName: 'red',
    bgHex: '#EF4444',
    accentHex: '#DC2626',
    borderHex: '#B91C1C',
    textHex: '#FFFFFF',
    lightBgHex: '#FEF2F2',
    description: 'People, pronouns, names (人称、代词、名字)',
  },
  {
    key: 'time',
    zhName: '时间',
    enName: 'Time',
    colorName: 'orange',
    bgHex: '#F97316',
    accentHex: '#EA580C',
    borderHex: '#C2410C',
    textHex: '#FFFFFF',
    lightBgHex: '#FFF7ED',
    description: 'Days, months, time of day (日期、时间词)',
  },
  {
    key: 'location',
    zhName: '地点',
    enName: 'Location',
    colorName: 'green',
    bgHex: '#10B981',
    accentHex: '#059669',
    borderHex: '#047857',
    textHex: '#FFFFFF',
    lightBgHex: '#ECFDF5',
    description: 'Places, countries, facilities (地点、国家、场所)',
  },
  {
    key: 'modifier',
    zhName: '修饰语',
    enName: 'Modifier',
    colorName: 'purple',
    bgHex: '#8B5CF6',
    accentHex: '#7C3AED',
    borderHex: '#6D28D9',
    textHex: '#FFFFFF',
    lightBgHex: '#F5F3FF',
    description: 'Adverbs, prepositions, particles, measure words (副词、介词、助词、量词)',
  },
  {
    key: 'verb',
    zhName: '动词',
    enName: 'Verb',
    colorName: 'blue',
    bgHex: '#3B82F6',
    accentHex: '#2563EB',
    borderHex: '#1D4ED8',
    textHex: '#FFFFFF',
    lightBgHex: '#EFF6FF',
    description: 'Verbs, modal verbs, adjectives as verbs (动作、能愿动词、形容词谓语)',
  },
  {
    key: 'object',
    zhName: '宾语',
    enName: 'Object',
    colorName: 'pink',
    bgHex: '#EC4899',
    accentHex: '#DB2777',
    borderHex: '#BE185D',
    textHex: '#FFFFFF',
    lightBgHex: '#FDF2F8',
    description: 'Nouns that follow verbs (动词后的事物名词)',
  },
];

/**
 * EXACT Vocabulary Data from Lessons 1 to 11
 * Cleanly organized by lesson -> dialogue -> category
 */
export const vocabBank: VocabBank = {
  "Lesson 1": {
    "Dialogue 1": {
      subject: [
        { zh: "你", pinyin: "nǐ", en: "you" },
        { zh: "我", pinyin: "wǒ", en: "I; me" },
        { zh: "小姐", pinyin: "xiǎojiě", en: "Miss; young lady" },
        { zh: "先生", pinyin: "xiānsheng", en: "Mr.; husband; teacher" },
        { zh: "李友", pinyin: "lǐ yǒu", en: "(a personal name)" },
        { zh: "王朋", pinyin: "wáng péng", en: "(a personal name)" }
      ],
      time: [],
      location: [],
      modifier: [
        { zh: "呢", pinyin: "ne", en: "(question particle)" }
      ],
      verb: [
        { zh: "好", pinyin: "hǎo", en: "fine; good; nice; O.K.; it's settled" },
        { zh: "请", pinyin: "qǐng", en: "please (polite form of request); to treat or invite someone" },
        { zh: "问", pinyin: "wèn", en: "to ask (a question)" },
        { zh: "贵", pinyin: "guì", en: "honorable; expensive" },
        { zh: "姓", pinyin: "xìng", en: "(one's) surname is...; to be surnamed; surname" },
        { zh: "叫", pinyin: "jiào", en: "to be called; to call" }
      ],
      object: [
        { zh: "什么", pinyin: "shénme", en: "what" },
        { zh: "名字", pinyin: "míngzi", en: "name" }
      ],
    },
    "Dialogue 2": {
      subject: [
        { zh: "老师", pinyin: "lǎoshī", en: "teacher" },
        { zh: "学生", pinyin: "xuésheng", en: "student" },
        { zh: "人", pinyin: "rén", en: "people; person" }
      ],
      time: [],
      location: [
        { zh: "在中国", pinyin: "zài zhōngguó", en: "in China" },
        { zh: "在北京", pinyin: "zài běijīng", en: "in Beijing" },
        { zh: "在美国", pinyin: "zài měiguó", en: "in America" },
        { zh: "在纽约", pinyin: "zài niǔyuē", en: "in New York" }
      ],
      modifier: [
        { zh: "吗", pinyin: "ma", en: "(question particle)" },
        { zh: "不", pinyin: "bù", en: "not; no" },
        { zh: "也", pinyin: "yě", en: "too; also" }
      ],
      verb: [
        { zh: "是", pinyin: "shì", en: "to be" }
      ],
      object: [
        { zh: "老师", pinyin: "lǎoshī", en: "teacher" },
        { zh: "学生", pinyin: "xuésheng", en: "student" }
      ],
    },
  },
  "Lesson 2": {
    "Dialogue 1": {
      subject: [
        { zh: "那", pinyin: "nà", en: "that" },
        { zh: "这", pinyin: "zhè", en: "this" },
        { zh: "爸爸", pinyin: "bàba", en: "father; dad" },
        { zh: "妈妈", pinyin: "māma", en: "mother; mom" },
        { zh: "孩子", pinyin: "háizi", en: "child" },
        { zh: "谁", pinyin: "shéi", en: "who" },
        { zh: "她", pinyin: "tā", en: "she; her" },
        { zh: "姐姐", pinyin: "jiějie", en: "older sister" },
        { zh: "弟弟", pinyin: "dìdi", en: "younger brother" },
        { zh: "他", pinyin: "tā", en: "he; him" },
        { zh: "大哥", pinyin: "dàgē", en: "oldest brother" },
        { zh: "儿子", pinyin: "érzi", en: "son" },
        { zh: "女儿", pinyin: "nǚ'ér", en: "daughter" },
        { zh: "高文中", pinyin: "gāo wénzhōng", en: "(a personal name)" }
      ],
      time: [],
      location: [],
      modifier: [
        { zh: "的", pinyin: "de", en: "(a possessive or descriptive particle)" },
        { zh: "个", pinyin: "ge", en: "(measure word for many common everyday objects)" },
        { zh: "没", pinyin: "méi", en: "not; have not" }
      ],
      verb: [
        { zh: "有", pinyin: "yǒu", en: "to have; to exist; there is; there are" },
        { zh: "高", pinyin: "gāo", en: "(a surname); tall; high" }
      ],
      object: [
        { zh: "照片", pinyin: "zhàopiàn", en: "picture; photo" }
      ],
    },
    "Dialogue 2": {
      subject: [
        { zh: "哥哥", pinyin: "gēge", en: "older brother" },
        { zh: "妹妹", pinyin: "mèimei", en: "younger sister" },
        { zh: "大姐", pinyin: "dàjiě", en: "oldest sister" },
        { zh: "二姐", pinyin: "èrjiě", en: "second oldest sister" },
        { zh: "白英爱", pinyin: "bái yīngài", en: "(a personal name)" },
        { zh: "律师", pinyin: "lǜshī", en: "lawyer" },
        { zh: "医生", pinyin: "yīshēng", en: "doctor; physician" },
        { zh: "大学生", pinyin: "dàxuéshēng", en: "college student" }
      ],
      time: [],
      location: [
        { zh: "在家", pinyin: "zài jiā", en: "at home" },
        { zh: "在大学", pinyin: "zài dàxué", en: "at university; at college" }
      ],
      modifier: [
        { zh: "口", pinyin: "kǒu", en: "(measure word for number of family members)" },
        { zh: "和", pinyin: "hé", en: "and" },
        { zh: "都", pinyin: "dōu", en: "both; all" }
      ],
      verb: [
        { zh: "做", pinyin: "zuò", en: "to do" },
        { zh: "工作", pinyin: "gōngzuò", en: "job; to work" }
      ],
      object: [
        { zh: "英文", pinyin: "yīngwén", en: "English (language)" },
        { zh: "律师", pinyin: "lǜshī", en: "lawyer" },
        { zh: "医生", pinyin: "yīshēng", en: "doctor; physician" },
        { zh: "大学生", pinyin: "dàxuéshēng", en: "college student" }
      ],
    },
  },
  "Lesson 3": {
    "Dialogue 1": {
      subject: [
        { zh: "我们", pinyin: "wǒmen", en: "we; us" }
      ],
      time: [
        { zh: "九月", pinyin: "jiǔyuè", en: "September" },
        { zh: "星期四", pinyin: "xīngqīsì", en: "Thursday" },
        { zh: "今年", pinyin: "jīnnián", en: "this year" },
        { zh: "晚上", pinyin: "wǎnshang", en: "evening; night" }
      ],
      location: [
        { zh: "在英国", pinyin: "zài yīngguó", en: "in Britain; in England" }
      ],
      modifier: [
        { zh: "号", pinyin: "hào", en: "(measure word for number in a series; day of the month)" },
        { zh: "多", pinyin: "duō", en: "how many; how much; to what extent; many" },
        { zh: "岁", pinyin: "suì", en: "years (of age)" },
        { zh: "怎么样", pinyin: "zěnmeyàng", en: "Is it OK?; How is that?; How does that sound?" },
        { zh: "太…了", pinyin: "tài…le", en: "too…; extremely…" },
        { zh: "还是", pinyin: "háishi", en: "or" },
        { zh: "可是", pinyin: "kěshì", en: "but" },
        { zh: "点", pinyin: "diǎn", en: "o'clock; dot; point" },
        { zh: "再", pinyin: "zài", en: "again" }
      ],
      verb: [
        { zh: "大", pinyin: "dà", en: "big; old" },
        { zh: "吃", pinyin: "chī", en: "to eat" },
        { zh: "谢谢", pinyin: "xièxie", en: "to thank" },
        { zh: "喜欢", pinyin: "xǐhuan", en: "to like" },
        { zh: "见", pinyin: "jiàn", en: "to see" }
      ],
      object: [
        { zh: "生日", pinyin: "shēngrì", en: "birthday" },
        { zh: "饭", pinyin: "fàn", en: "meal; (cooked) rice" },
        { zh: "菜", pinyin: "cài", en: "dishes; cuisine" }
      ],
    },
    "Dialogue 2": {
      subject: [
        { zh: "同学", pinyin: "tóngxué", en: "classmate" },
        { zh: "朋友", pinyin: "péngyou", en: "friend" }
      ],
      time: [
        { zh: "现在", pinyin: "xiànzài", en: "now" },
        { zh: "今天", pinyin: "jīntiān", en: "today" },
        { zh: "明天", pinyin: "míngtiān", en: "tomorrow" }
      ],
      location: [],
      modifier: [
        { zh: "很", pinyin: "hěn", en: "very" },
        { zh: "为什么", pinyin: "wèishénme", en: "why" },
        { zh: "为", pinyin: "wèi", en: "for" },
        { zh: "因为", pinyin: "yīnwèi", en: "because" },
        { zh: "还", pinyin: "hái", en: "also; too; as well" }
      ],
      verb: [
        { zh: "忙", pinyin: "máng", en: "busy" },
        { zh: "认识", pinyin: "rènshi", en: "to be acquainted with; to recognize; to know" }
      ],
      object: [
        { zh: "事儿", pinyin: "shì(r)", en: "matter; affair; event" },
        { zh: "晚饭", pinyin: "wǎnfàn", en: "dinner; supper" },
        { zh: "同学", pinyin: "tóngxué", en: "classmate" },
        { zh: "朋友", pinyin: "péngyou", en: "friend" }
      ],
    },
  },
  "Lesson 4": {
    "Dialogue 1": {
      subject: [],
      time: [
        { zh: "周末", pinyin: "zhōumò", en: "weekend" },
        { zh: "时候", pinyin: "shíhou", en: "(a point in) time; moment; (a duration of) time" },
        { zh: "昨天", pinyin: "zuótiān", en: "yesterday" }
      ],
      location: [
        { zh: "在外国", pinyin: "zài wàiguó", en: "abroad; in foreign countries" }
      ],
      modifier: [
        { zh: "有的", pinyin: "yǒude", en: "some" },
        { zh: "常常", pinyin: "chángcháng", en: "often" },
        { zh: "那", pinyin: "nà", en: "in that case; then" },
        { zh: "所以", pinyin: "suǒyǐ", en: "so" }
      ],
      verb: [
        { zh: "打球", pinyin: "dǎ qiú", en: "to play ball" },
        { zh: "打", pinyin: "dǎ", en: "to hit" },
        { zh: "看", pinyin: "kàn", en: "to watch; to look; to read" },
        { zh: "唱歌儿", pinyin: "chàng gē(r)", en: "to sing (a song)" },
        { zh: "唱", pinyin: "chàng", en: "to sing" },
        { zh: "跳舞", pinyin: "tiào wǔ", en: "to dance" },
        { zh: "跳", pinyin: "tiào", en: "to jump" },
        { zh: "听", pinyin: "tīng", en: "to listen" },
        { zh: "对", pinyin: "duì", en: "right; correct" },
        { zh: "去", pinyin: "qù", en: "to go" },
        { zh: "请客", pinyin: "qǐng kè", en: "to invite someone (to dinner, etc.); to play the host" }
      ],
      object: [
        { zh: "球", pinyin: "qiú", en: "ball" },
        { zh: "电视", pinyin: "diànshì", en: "television" },
        { zh: "歌", pinyin: "gē", en: "song" },
        { zh: "舞", pinyin: "wǔ", en: "dance" },
        { zh: "音乐", pinyin: "yīnyuè", en: "music" },
        { zh: "书", pinyin: "shū", en: "book" },
        { zh: "电影", pinyin: "diànyǐng", en: "movie" }
      ],
    },
    "Dialogue 2": {
      subject: [
        { zh: "别人", pinyin: "biérén", en: "other people; another person" }
      ],
      time: [],
      location: [],
      modifier: [
        { zh: "只", pinyin: "zhǐ", en: "only" },
        { zh: "别的", pinyin: "bié (de)", en: "other" },
        { zh: "好久", pinyin: "hǎo jiǔ", en: "a long time" },
        { zh: "好", pinyin: "hǎo", en: "very" }
      ],
      verb: [
        { zh: "想", pinyin: "xiǎng", en: "to want to; would like to; to think" },
        { zh: "觉得", pinyin: "juéde", en: "to feel; to think" },
        { zh: "有意思", pinyin: "yǒu yìsi", en: "interesting" },
        { zh: "睡觉", pinyin: "shuì jiào", en: "to sleep" },
        { zh: "睡", pinyin: "shuì", en: "to sleep" },
        { zh: "找", pinyin: "zhǎo", en: "to look for" },
        { zh: "小", pinyin: "xiǎo", en: "small; little" },
        { zh: "久", pinyin: "jiǔ", en: "long (of time)" },
        { zh: "不错", pinyin: "búcuò", en: "pretty good; not bad" },
        { zh: "错", pinyin: "cuò", en: "wrong" }
      ],
      object: [
        { zh: "意思", pinyin: "yìsi", en: "meaning" }
      ],
    },
  },
  "Lesson 5": {
    "Dialogue 1": {
      subject: [
        { zh: "高小音", pinyin: "gāo xiǎoyīn", en: "(a personal name)" }
      ],
      time: [],
      location: [
        { zh: "在哪儿", pinyin: "zài nǎr", en: "where; at where" },
        { zh: "在学校", pinyin: "zài xuéxiào", en: "at school" }
      ],
      modifier: [
        { zh: "呀", pinyin: "ya", en: "(interjectory particle used to soften a question)" },
        { zh: "快", pinyin: "kuài", en: "fast, quick; quickly" },
        { zh: "一下", pinyin: "yí xià", en: "once; a bit" },
        { zh: "在", pinyin: "zài", en: "at; in; on" },
        { zh: "点儿", pinyin: "diǎn(r)", en: "a little, a bit; some" },
        { zh: "吧", pinyin: "ba", en: "(a sentence-final particle)" },
        { zh: "瓶", pinyin: "píng", en: "(measure word for bottle of something); bottle" },
        { zh: "杯", pinyin: "bēi", en: "(measure word for a cup or glass of something)" }
      ],
      verb: [
        { zh: "可以", pinyin: "kěyǐ", en: "can; may" },
        { zh: "进", pinyin: "jìn", en: "to enter" },
        { zh: "进来", pinyin: "jìn lái", en: "to come in" },
        { zh: "来", pinyin: "lái", en: "to come" },
        { zh: "介绍", pinyin: "jièshào", en: "to introduce" },
        { zh: "高兴", pinyin: "gāoxìng", en: "happy, pleased" },
        { zh: "漂亮", pinyin: "piàoliang", en: "pretty" },
        { zh: "坐", pinyin: "zuò", en: "to sit" },
        { zh: "喝", pinyin: "hē", en: "to drink" },
        { zh: "要", pinyin: "yào", en: "to want" },
        { zh: "给", pinyin: "gěi", en: "to give" }
      ],
      object: [
        { zh: "茶", pinyin: "chá", en: "tea" },
        { zh: "咖啡", pinyin: "kāfēi", en: "coffee" },
        { zh: "可乐", pinyin: "kělè", en: "Coke; Pepsi; cola" },
        { zh: "水", pinyin: "shuǐ", en: "water" }
      ],
    },
    "Dialogue 2": {
      subject: [],
      time: [],
      location: [
        { zh: "在图书馆", pinyin: "zài túshūguǎn", en: "at the library" }
      ],
      modifier: [
        { zh: "了", pinyin: "le", en: "(a dynamic particle)" },
        { zh: "一起", pinyin: "yìqǐ", en: "together" },
        { zh: "才", pinyin: "cái", en: "not until, only then" }
      ],
      verb: [
        { zh: "玩儿", pinyin: "wán(r)", en: "to have fun; to play" },
        { zh: "聊天儿", pinyin: "liáotiān(r)", en: "to chat" },
        { zh: "聊", pinyin: "liáo", en: "to chat" },
        { zh: "回家", pinyin: "huí jiā", en: "to go home" },
        { zh: "回", pinyin: "huí", en: "to return" }
      ],
      object: [],
    },
  },
  "Lesson 6": {
    "Dialogue 1": {
      subject: [
        { zh: "您", pinyin: "nín", en: "you (honorific for 你)" },
        { zh: "常老师", pinyin: "cháng lǎoshī", en: "Teacher Chang" }
      ],
      time: [
        { zh: "下午", pinyin: "xiàwǔ", en: "afternoon" },
        { zh: "上午", pinyin: "shàngwǔ", en: "morning" },
        { zh: "以后", pinyin: "yǐhòu", en: "after; from now on; later on" }
      ],
      location: [
        { zh: "在办公室", pinyin: "zài bàngōngshì", en: "at the office" }
      ],
      modifier: [
        { zh: "给", pinyin: "gěi", en: "to; for" },
        { zh: "就", pinyin: "jiù", en: "precisely; exactly" },
        { zh: "位", pinyin: "wèi", en: "(polite measure word for people)" },
        { zh: "节", pinyin: "jié", en: "(measure word for class periods)" },
        { zh: "要是", pinyin: "yàoshi", en: "if" },
        { zh: "别", pinyin: "bié", en: "don't" }
      ],
      verb: [
        { zh: "要", pinyin: "yào", en: "will; be going to; to want to; to have a desire to" },
        { zh: "打电话", pinyin: "dǎ diànhuà", en: "to make a phone call" },
        { zh: "在", pinyin: "zài", en: "to be present; to be at (a place)" },
        { zh: "开会", pinyin: "kāi huì", en: "to have a meeting" },
        { zh: "开", pinyin: "kāi", en: "to open; to hold (a meeting, party, etc.)" },
        { zh: "考试", pinyin: "kǎo shì", en: "to give or take a test; test" },
        { zh: "考", pinyin: "kǎo", en: "to give or take a test" },
        { zh: "方便", pinyin: "fāngbiàn", en: "convenient" },
        { zh: "到", pinyin: "dào", en: "to go to; to arrive" },
        { zh: "行", pinyin: "xíng", en: "to be alright; to be OK" },
        { zh: "等", pinyin: "děng", en: "to wait; to wait for" },
        { zh: "客气", pinyin: "kèqi", en: "polite" }
      ],
      object: [
        { zh: "电话", pinyin: "diànhuà", en: "telephone" },
        { zh: "时间", pinyin: "shíjiān", en: "time" },
        { zh: "问题", pinyin: "wèntí", en: "question; problem" },
        { zh: "会", pinyin: "huì", en: "meeting" },
        { zh: "课", pinyin: "kè", en: "class; course; lesson" },
        { zh: "年级", pinyin: "niánjí", en: "grade in school" },
        { zh: "空儿", pinyin: "kòng(r)", en: "free time" }
      ],
    },
    "Dialogue 2": {
      subject: [],
      time: [
        { zh: "下个", pinyin: "xià ge", en: "the next one" }
      ],
      location: [],
      modifier: [
        { zh: "啊", pinyin: "a", en: "(a sentence-final particle of exclamation, interrogation, etc.)" },
        { zh: "但是", pinyin: "dànshì", en: "but" },
        { zh: "跟", pinyin: "gēn", en: "with" }
      ],
      verb: [
        { zh: "得", pinyin: "děi", en: "must; should; to have to" },
        { zh: "帮", pinyin: "bāng", en: "to help" },
        { zh: "准备", pinyin: "zhǔnbèi", en: "to prepare" },
        { zh: "练习", pinyin: "liànxí", en: "to practice" },
        { zh: "说", pinyin: "shuō", en: "to say; to speak" },
        { zh: "见面", pinyin: "jiàn miàn", en: "to meet up; to meet with" },
        { zh: "回来", pinyin: "huí lai", en: "to come back" }
      ],
      object: [
        { zh: "中文", pinyin: "Zhōngwén", en: "Chinese language" }
      ],
    },
  },
  "Lesson 7": {
    "Dialogue 1": {
      subject: [],
      time: [
        { zh: "上个", pinyin: "shàng ge", en: "the previous one; the last one" }
      ],
      location: [
        { zh: "在哪里", pinyin: "zài nǎli", en: "where; at where" }
      ],
      modifier: [
        { zh: "得", pinyin: "de", en: "(a structural particle)" },
        { zh: "枝", pinyin: "zhī", en: "(measure word for long, thin, inflexible objects like pens, rifles, etc.)" },
        { zh: "张", pinyin: "zhāng", en: "(measure word for flat objects like paper, pictures, etc.)" },
        { zh: "怎么", pinyin: "zěnme", en: "how; how come" },
        { zh: "真", pinyin: "zhēn", en: "really" },
        { zh: "第", pinyin: "dì", en: "(prefix for ordinal numbers)" }
      ],
      verb: [
        { zh: "说话", pinyin: "shuō huà", en: "to talk" },
        { zh: "复习", pinyin: "fùxí", en: "to review" },
        { zh: "写", pinyin: "xiě", en: "to write" },
        { zh: "慢", pinyin: "màn", en: "slow" },
        { zh: "教", pinyin: "jiāo", en: "to teach" },
        { zh: "懂", pinyin: "dǒng", en: "to understand" },
        { zh: "预习", pinyin: "yùxí", en: "to preview" },
        { zh: "学", pinyin: "xué", en: "to study; to learn" },
        { zh: "容易", pinyin: "róngyì", en: "easy" },
        { zh: "多", pinyin: "duō", en: "many; much" },
        { zh: "难", pinyin: "nán", en: "difficult" }
      ],
      object: [
        { zh: "话", pinyin: "huà", en: "word; speech" },
        { zh: "字", pinyin: "zì", en: "character" },
        { zh: "笔", pinyin: "bǐ", en: "pen" },
        { zh: "纸", pinyin: "zhǐ", en: "paper" },
        { zh: "语法", pinyin: "yǔfǎ", en: "grammar" },
        { zh: "生词", pinyin: "shēngcí", en: "new words; vocabulary" },
        { zh: "汉字", pinyin: "hànzì", en: "Chinese characters" }
      ],
    },
    "Dialogue 2": {
      subject: [
        { zh: "大家", pinyin: "dàjiā", en: "everybody" }
      ],
      time: [
        { zh: "平常", pinyin: "píngcháng", en: "usually" },
        { zh: "早上", pinyin: "zǎoshang", en: "morning" }
      ],
      location: [],
      modifier: [
        { zh: "这么", pinyin: "zhème", en: "so; this (late, etc.)" }
      ],
      verb: [
        { zh: "早", pinyin: "zǎo", en: "early" },
        { zh: "晚", pinyin: "wǎn", en: "late" },
        { zh: "上课", pinyin: "shàng kè", en: "to go to class; to start class; to be in class" },
        { zh: "开始", pinyin: "kāishǐ", en: "to begin; to start; beginning" },
        { zh: "念", pinyin: "niàn", en: "to read aloud" },
        { zh: "学习", pinyin: "xuéxí", en: "to study; to learn" },
        { zh: "酷", pinyin: "kù", en: "cool" },
        { zh: "帅", pinyin: "shuài", en: "handsome" }
      ],
      object: [
        { zh: "功课", pinyin: "gōngkè", en: "homework; schoolwork" },
        { zh: "课文", pinyin: "kèwén", en: "text of a lesson" },
        { zh: "录音", pinyin: "lùyīn", en: "sound recording; to record sound" }
      ],
    },
  },
  "Lesson 8": {
    "Dialogue 1": {
      subject: [],
      time: [
        { zh: "中午", pinyin: "zhōngwǔ", en: "noon" },
        { zh: "以前", pinyin: "yǐqián", en: "before" }
      ],
      location: [
        { zh: "在教室", pinyin: "zài jiàoshì", en: "in the classroom" },
        { zh: "在餐厅", pinyin: "zài cāntīng", en: "at the cafeteria; dining room" },
        { zh: "在宿舍", pinyin: "zài sùshè", en: "at the dormitory" },
        { zh: "在那儿", pinyin: "zài nàr", en: "there; over there" }
      ],
      modifier: [
        { zh: "篇", pinyin: "piān", en: "(measure word for essays, articles, etc.)" },
        { zh: "一边", pinyin: "yìbiān", en: "simultaneously; at the same time" },
        { zh: "正在", pinyin: "zhèngzài", en: "in the middle of (doing something)" },
        { zh: "已经", pinyin: "yǐjīng", en: "already" }
      ],
      verb: [
        { zh: "累", pinyin: "lèi", en: "tired" },
        { zh: "起床", pinyin: "qǐ chuáng", en: "to get up (from bed)" },
        { zh: "洗澡", pinyin: "xǐ zǎo", en: "to take a bath; to take a shower" },
        { zh: "新", pinyin: "xīn", en: "new" },
        { zh: "上网", pinyin: "shàng wǎng", en: "to go online; to surf the Internet" },
        { zh: "知道", pinyin: "zhīdao", en: "to know" },
        { zh: "告诉", pinyin: "gàosu", en: "to tell" }
      ],
      object: [
        { zh: "日记", pinyin: "rìjì", en: "diary" },
        { zh: "床", pinyin: "chuáng", en: "bed" },
        { zh: "早饭", pinyin: "zǎofàn", en: "breakfast" },
        { zh: "发音", pinyin: "fāyīn", en: "pronunciation" },
        { zh: "电脑", pinyin: "diànnǎo", en: "computer" },
        { zh: "午饭", pinyin: "wǔfàn", en: "lunch; midday meal" }
      ],
    },
    "Dialogue 2": {
      subject: [],
      time: [
        { zh: "最近", pinyin: "zuìjìn", en: "recently" },
        { zh: "学期", pinyin: "xuéqī", en: "school term; semester, quarter" },
        { zh: "后来", pinyin: "hòulái", en: "later" }
      ],
      location: [],
      modifier: [
        { zh: "封", pinyin: "fēng", en: "(measure word for letters)" },
        { zh: "最", pinyin: "zuì", en: "(of superlative degree, most, -est)" },
        { zh: "除了…以外", pinyin: "chúle…yǐwài", en: "in addition to; besides" }
      ],
      verb: [
        { zh: "会", pinyin: "huì", en: "can; know how to" },
        { zh: "能", pinyin: "néng", en: "can; to be able to" },
        { zh: "近", pinyin: "jìn", en: "close; near" },
        { zh: "希望", pinyin: "xīwàng", en: "to hope; hope" },
        { zh: "用", pinyin: "yòng", en: "to use" },
        { zh: "笑", pinyin: "xiào", en: "to laugh at; to laugh; to smile" },
        { zh: "祝", pinyin: "zhù", en: "to wish (well)" }
      ],
      object: [
        { zh: "信", pinyin: "xìn", en: "letter (correspondence)" },
        { zh: "专业", pinyin: "zhuānyè", en: "major (in college); specialty" },
        { zh: "音乐会", pinyin: "yīnyuèhuì", en: "concert" }
      ],
    },
  },
  "Lesson 9": {
    "Dialogue 1": {
      subject: [
        { zh: "售货员", pinyin: "shòuhuòyuán", en: "shop assistant; salesclerk" }
      ],
      time: [],
      location: [
        { zh: "在商店", pinyin: "zài shāngdiàn", en: "at the store; shop" }
      ],
      modifier: [
        { zh: "件", pinyin: "jiàn", en: "(measure word for shirts, dresses, jackets, coats, etc.)" },
        { zh: "条", pinyin: "tiáo", en: "(measure word for pants and long, thin objects)" },
        { zh: "号", pinyin: "hào", en: "size" },
        { zh: "如果…的话", pinyin: "rúguǒ…de huà", en: "if…" },
        { zh: "不用", pinyin: "búyòng", en: "need not" },
        { zh: "一共", pinyin: "yígòng", en: "altogether" },
        { zh: "多少", pinyin: "duōshao", en: "how much; how many" },
        { zh: "块", pinyin: "kuài", en: "(measure word for the basic Chinese monetary unit)" },
        { zh: "毛", pinyin: "máo", en: "(measure word for 1/10 of a kuài); dime" },
        { zh: "分", pinyin: "fēn", en: "(measure word for 1/100 of a kuài); cent" }
      ],
      verb: [
        { zh: "买", pinyin: "mǎi", en: "to buy" },
        { zh: "穿", pinyin: "chuān", en: "to wear; to put on" },
        { zh: "中", pinyin: "zhōng", en: "medium; middle" },
        { zh: "便宜", pinyin: "piányi", en: "cheap; inexpensive" },
        { zh: "长", pinyin: "cháng", en: "long" },
        { zh: "短", pinyin: "duǎn", en: "short" },
        { zh: "合适", pinyin: "héshì", en: "suitable" },
        { zh: "试", pinyin: "shì", en: "to try" },
        { zh: "找钱", pinyin: "zhǎo (qián)", en: "to give change" }
      ],
      object: [
        { zh: "东西", pinyin: "dōngxi", en: "thing; object" },
        { zh: "衣服", pinyin: "yīfu", en: "clothes" },
        { zh: "衬衫", pinyin: "chènshān", en: "shirt" },
        { zh: "颜色", pinyin: "yánsè", en: "color" },
        { zh: "黄", pinyin: "huáng", en: "yellow" },
        { zh: "红", pinyin: "hóng", en: "red" },
        { zh: "裤子", pinyin: "kùzi", en: "pants" },
        { zh: "长短", pinyin: "chángduǎn", en: "length" },
        { zh: "钱", pinyin: "qián", en: "money" },
        { zh: "售货员", pinyin: "shòuhuòyuán", en: "shop assistant; salesclerk" }
      ],
    },
    "Dialogue 2": {
      subject: [
        { zh: "它", pinyin: "tā", en: "it" }
      ],
      time: [],
      location: [
        { zh: "在这儿", pinyin: "zài zhèr", en: "here; at here" }
      ],
      modifier: [
        { zh: "双", pinyin: "shuāng", en: "(measure word for a pair of something)" },
        { zh: "虽然", pinyin: "suīrán", en: "although" },
        { zh: "种", pinyin: "zhǒng", en: "(measure word for kind, sort, type)" },
        { zh: "挺", pinyin: "tǐng", en: "very; rather" },
        { zh: "不过", pinyin: "búguò", en: "however; but" },
        { zh: "再", pinyin: "zài", en: "again" }
      ],
      verb: [
        { zh: "换", pinyin: "huàn", en: "to exchange; to change" },
        { zh: "一样", pinyin: "yíyàng", en: "same; alike" },
        { zh: "刷卡", pinyin: "shuā kǎ", en: "to pay with a credit card" },
        { zh: "刷", pinyin: "shuā", en: "to brush; to swipe" },
        { zh: "收", pinyin: "shōu", en: "to receive; to accept" },
        { zh: "付钱", pinyin: "fù qián", en: "to pay money" },
        { zh: "付", pinyin: "fù", en: "to pay" }
      ],
      object: [
        { zh: "鞋", pinyin: "xié", en: "shoe" },
        { zh: "大小", pinyin: "dàxiǎo", en: "size" },
        { zh: "咖啡色", pinyin: "kāfēisè", en: "brown; coffee color" },
        { zh: "黑", pinyin: "hēi", en: "black" },
        { zh: "样子", pinyin: "yàngzi", en: "style" },
        { zh: "卡", pinyin: "kǎ", en: "card" },
        { zh: "信用卡", pinyin: "xìnyòngkǎ", en: "credit card" }
      ],
    },
  },
  "Lesson 10": {
    "Dialogue 1": {
      subject: [],
      time: [
        { zh: "寒假", pinyin: "hánjià", en: "winter vacation" }
      ],
      location: [
        { zh: "在飞机场", pinyin: "zài (fēi)jīchǎng", en: "at the airport" }
      ],
      modifier: [
        { zh: "或者", pinyin: "huòzhě", en: "or" },
        { zh: "先", pinyin: "xiān", en: "first" },
        { zh: "站", pinyin: "zhàn", en: "(measure word for stops of bus, train, etc.)" },
        { zh: "然后", pinyin: "ránhòu", en: "then" },
        { zh: "最后", pinyin: "zuìhòu", en: "final; last" }
      ],
      verb: [
        { zh: "飞", pinyin: "fēi", en: "to fly" },
        { zh: "坐", pinyin: "zuò", en: "to travel by" },
        { zh: "走", pinyin: "zǒu", en: "to go by way of; to walk" },
        { zh: "下车", pinyin: "xià chē", en: "to get off (a bus, train, etc.)" },
        { zh: "麻烦", pinyin: "máfan", en: "troublesome" },
        { zh: "打车", pinyin: "dǎ chē", en: "to take a taxi" },
        { zh: "出租", pinyin: "chūzū", en: "to rent out; to let" },
        { zh: "租", pinyin: "zū", en: "to rent" },
        { zh: "开车", pinyin: "kāichē", en: "to drive a car" },
        { zh: "开", pinyin: "kāi", en: "to drive; to operate" },
        { zh: "送", pinyin: "sòng", en: "to see off or out; to take (someone or somewhere)" },
        { zh: "让", pinyin: "ràng", en: "to allow or cause (someone to do something)" },
        { zh: "花", pinyin: "huā", en: "to spend" },
        { zh: "不好意思", pinyin: "bù hǎoyìsi", en: "to feel embarrassed" }
      ],
      object: [
        { zh: "飞机", pinyin: "fēijī", en: "airplane" },
        { zh: "票", pinyin: "piào", en: "ticket" },
        { zh: "公共汽车", pinyin: "gōnggòng qìchē", en: "bus" },
        { zh: "汽车", pinyin: "qìchē", en: "car; automobile" },
        { zh: "车", pinyin: "chē", en: "vehicle" },
        { zh: "地铁", pinyin: "dìtiě", en: "subway" },
        { zh: "绿", pinyin: "lǜ", en: "green" },
        { zh: "线", pinyin: "xiàn", en: "line" },
        { zh: "蓝", pinyin: "lán", en: "blue" },
        { zh: "出租汽车", pinyin: "chūzū qìchē", en: "taxi" },
        { zh: "电子邮件", pinyin: "diànzǐ yóujiàn", en: "email" }
      ],
    },
    "Dialogue 2": {
      subject: [
        { zh: "自己", pinyin: "zìjǐ", en: "oneself" }
      ],
      time: [
        { zh: "新年", pinyin: "xīnnián", en: "New Year" }
      ],
      location: [
        { zh: "在城市", pinyin: "zài chéngshì", en: "in the city" },
        { zh: "在高速公路", pinyin: "zài gāosù gōnglù", en: "on the highway" },
        { zh: "在公路", pinyin: "zài gōnglù", en: "on the highway; public road" }
      ],
      modifier: [
        { zh: "每", pinyin: "měi", en: "every; each" },
        { zh: "特别", pinyin: "tèbié", en: "especially" }
      ],
      verb: [
        { zh: "紧张", pinyin: "jǐnzhāng", en: "nervous; anxious" },
        { zh: "发短信", pinyin: "fā duǎnxìn", en: "to send a text message; to send a short message" },
        { zh: "快乐", pinyin: "kuàilè", en: "happy" }
      ],
      object: [
        { zh: "手机", pinyin: "shǒujī", en: "cell phone" }
      ],
    },
  },
  "Lesson 11": {
    "Dialogue 1": {
      subject: [],
      time: [
        { zh: "刚才", pinyin: "gāngcái", en: "just now; a moment ago" }
      ],
      location: [
        { zh: "在公园", pinyin: "zài gōngyuán", en: "in the park; at the park" },
        { zh: "在网上", pinyin: "zài wǎng shàng", en: "online; on the Internet" }
      ],
      modifier: [
        { zh: "比", pinyin: "bǐ", en: "(comparison marker); to compare" },
        { zh: "更", pinyin: "gèng", en: "even more" },
        { zh: "不但…而且…", pinyin: "búdàn…érqiě…", en: "not only…, but also…" }
      ],
      verb: [
        { zh: "会", pinyin: "huì", en: "will" },
        { zh: "下雪", pinyin: "xià xuě", en: "to snow" },
        { zh: "约", pinyin: "yuē", en: "to make an appointment" },
        { zh: "滑冰", pinyin: "huá bīng", en: "to ice skate" },
        { zh: "预报", pinyin: "yùbào", en: "to forecast" },
        { zh: "暖和", pinyin: "nuǎnhuo", en: "warm" },
        { zh: "冷", pinyin: "lěng", en: "cold" },
        { zh: "办", pinyin: "bàn", en: "to handle; to do" }
      ],
      object: [
        { zh: "天气", pinyin: "tiānqì", en: "weather" },
        { zh: "碟", pinyin: "dié", en: "disc; small plate, dish, saucer" }
      ],
    },
    "Dialogue 2": {
      subject: [],
      time: [
        { zh: "冬天", pinyin: "dōngtiān", en: "winter" },
        { zh: "夏天", pinyin: "xiàtiān", en: "summer" },
        { zh: "春天", pinyin: "chūntiān", en: "spring" },
        { zh: "秋天", pinyin: "qiūtiān", en: "autumn; fall" }
      ],
      location: [
        { zh: "在加州", pinyin: "zài jiāzhōu", en: "in California" }
      ],
      modifier: [
        { zh: "那么", pinyin: "nàme", en: "(indicating degree) so, such" },
        { zh: "非常", pinyin: "fēicháng", en: "very, extremely, exceedingly" },
        { zh: "又", pinyin: "yòu", en: "again" }
      ],
      verb: [
        { zh: "好玩儿", pinyin: "hǎowán(r)", en: "fun, amusing, interesting" },
        { zh: "出去", pinyin: "chū qu", en: "to go out" },
        { zh: "糟糕", pinyin: "zāogāo", en: "in a terrible mess; how terrible" },
        { zh: "下雨", pinyin: "xià yǔ", en: "to rain" },
        { zh: "面试", pinyin: "miànshì", en: "to interview; interview" },
        { zh: "回去", pinyin: "huí qu", en: "to go back; to return" },
        { zh: "热", pinyin: "rè", en: "hot" },
        { zh: "舒服", pinyin: "shūfu", en: "comfortable" }
      ],
      object: [],
    },
  },
};
