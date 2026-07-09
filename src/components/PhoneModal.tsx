/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MessageSquare, Users, Image as ImageIcon, FileText, 
  Smartphone, Send, Check, ShieldAlert, Sparkles, CheckCircle2,
  Clock, ArrowRight, User
} from 'lucide-react';
import { GameState, Character } from '../types';
import { CHARACTERS } from '../data/characters';
import { sound } from './SoundManager';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
}

type PhoneTab = 'chat' | 'contacts' | 'gallery' | 'notes';

export default function PhoneModal({ isOpen, onClose, gameState }: PhoneModalProps) {
  const [activeTab, setActiveTab] = useState<PhoneTab>('chat');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Sound handlers
  const handleTabChange = (tab: PhoneTab) => {
    sound.playClick();
    setActiveTab(tab);
    setSelectedChatId(null);
  };

  const handleOpenChat = (charId: string) => {
    sound.playSwipe();
    setSelectedChatId(charId);
  };

  const handleCloseChat = () => {
    sound.playClick();
    setSelectedChatId(null);
  };

  const handleExpandImage = (url: string) => {
    sound.playClick();
    setExpandedImage(url);
  };

  const handleCloseImage = () => {
    sound.playClick();
    setExpandedImage(null);
  };

  // Determine decisions made by player to reflect in chat dialogue
  const decisions = gameState.decisions || [];
  const choseTeachers = decisions.includes('ch21_c2_go_teachers');
  const choseTherapists = decisions.includes('ch21_c2_go_therapists');
  const choseDeleteData = decisions.includes('ch22_c2_delete');
  const choseSaveData = decisions.includes('ch22_c2_save');

  // Dynamic chats definition based on chapter & decisions
  const chatMessages = useMemo(() => {
    const messages: { [charId: string]: { sender: 'them' | 'me', text: string, time: string }[] } = {
      basia: [
        { sender: 'them', text: 'Hej! Jak się trzymasz w tych ciemnościach? To przerażające, co ten Kierownik zrobił!', time: '20:05' },
        { sender: 'me', text: 'Zabezpieczam teren, Basiu. Czy dzieci są bezpieczne?', time: '20:06' },
        { sender: 'them', text: 'Tak, zrobiliśmy ze świeczek małe ogniska w bezpiecznej sali. Hania opowiada im legendy, żeby się nie bały.', time: '20:08' },
      ],
      calm: [
        { sender: 'them', text: 'Asystentko. Wszelkie procedury awaryjne zostały uruchomione. Kluczowa jest dyscyplina.', time: '20:02' },
        { sender: 'me', text: 'Pani Calm, co z systemami zapasowymi?', time: '20:03' },
        { sender: 'them', text: 'Kierownik zablokował węzły rygorem cyfrowym z poziomu serwerowni. Agregaty nie ruszą bez resetu ręcznego.', time: '20:05' },
      ],
      system: [
        { sender: 'them', text: 'Błyszczące iskry tańczą w ciemności... Czy czujesz ich ciepło?', time: '20:00' },
        { sender: 'me', text: 'Koloryduszku! Czy to Ty wgrałeś tę aplikację na mój telefon?', time: '20:01' },
        { sender: 'them', text: 'Światło w Twojej dłoni jest kluczem do serc przedszkola. Podejmuj decyzje z odwagą i miłością.', time: '20:03' },
      ]
    };

    // Inject chapter 21 decisions
    if (choseTeachers) {
      messages.basia.push({ sender: 'them', text: 'Dziękuję, że pobiegłaś do nas do sali! Razem jesteśmy nie do zatrzymania! Tworzymy plan sabotażu kamer.', time: '20:15' });
      messages.calm.push({ sender: 'them', text: 'Zauważyłam, że wybrałaś pomoc nauczycielkom w ich salonie. Mam nadzieję, że zdajesz sobie sprawę z ryzyka utraty stabilności budynku.', time: '20:17' });
    } else if (choseTherapists) {
      messages.calm.push({ sender: 'them', text: 'Wspaniale, że dołączyłaś do mnie w gabinecie. Twoja dojrzałość ułatwi nam wyciszenie paniki.', time: '20:16' });
      messages.basia.push({ sender: 'them', text: 'Szkoda, że poszłaś z Calm... Rozumiem, że boisz się ciemności, ale nauczycielki nigdy się nie poddają!', time: '20:18' });
    }

    // Inject chapter 22 decisions
    if (gameState.currentChapterId >= 22) {
      messages.basia.push({ sender: 'them', text: 'Dotarliście do serwerowni? Musimy raz na zawsze uwolnić dzieci od tych strasznych profili badawczych!', time: '21:10' });
      messages.calm.push({ sender: 'them', text: 'Terminal serwerowy jest przed Wami. Baza danych to jedyny dowód prawny. Nie daj się ponieść emocjom.', time: '21:12' });
      messages.system.push({ sender: 'them', text: 'W sercu maszyn drży prawda i kłamstwo. Co wybierzesz, gdy zapłonie rdzeń?', time: '21:15' });
    }

    if (choseDeleteData) {
      messages.basia.push({ sender: 'me', text: 'Skasowałam całą bazę danych Kierownika. Profile dzieci zniknęły na zawsze.', time: '21:40' });
      messages.basia.push({ sender: 'them', text: 'JESTEŚ CUDOWNA! O tym właśnie marzyłam! Wolność dzieci jest najważniejsza!', time: '21:42' });
      messages.calm.push({ sender: 'me', text: 'Zdecydowałam się usunąć bazę danych, by chronić prywatność dzieci.', time: '21:41' });
      messages.calm.push({ sender: 'them', text: 'To był lekkomyślny krok emocjonalny. Skasowałaś kluczowe dowody prawne przeciwko syndykatowi. Konsekwencje będą dotkliwe.', time: '21:44' });
    } else if (choseSaveData) {
      messages.calm.push({ sender: 'me', text: 'Pobrałam i zabezpieczyłam pełną bazę danych dla kuratorium.', time: '21:40' });
      messages.calm.push({ sender: 'them', text: 'Bardzo rozsądna decyzja. Teraz prawo jest po naszej stronie. Sprawiedliwość zwycięży.', time: '21:42' });
      messages.basia.push({ sender: 'me', text: 'Zabezpieczyłam bazę danych jako dowód prawny. Nie skasowałam jej.', time: '21:41' });
      messages.basia.push({ sender: 'them', text: 'No dobrze, rozumiem... Ale mam nadzieję, że te raporty nigdy więcej nie zostaną użyte przeciwko dzieciakom.', time: '21:44' });
    }

    // Chapter 23 additions
    if (gameState.currentChapterId >= 23) {
      messages.basia.push({ sender: 'them', text: 'Kierownik czeka w sali gimnastycznej. To ostateczne starcie! Bądźmy silni!', time: '22:00' });
      messages.calm.push({ sender: 'them', text: 'Nadszedł moment prawdy. Nawet my, terapeutki, staniemy przeciwko niemu. Dołącz do nas w sali gimnastycznej.', time: '22:02' });
    }

    return messages;
  }, [gameState.currentChapterId, choseTeachers, choseTherapists, choseDeleteData, choseSaveData]);

  // Gallery items defined statically matching existing backgrounds
  const galleryItems = [
    { title: 'Okładka Koloryduszek', desc: 'Sercem i tęczą', url: '/assets/images/game_cover_1783451874065.jpg' },
    { title: 'Nauczycielki', desc: 'Ruch Oporu', url: '/assets/images/teachers_trio_1783451887451.jpg' },
    { title: 'Terapeutki', desc: 'Zakon Ładu', url: '/assets/images/therapists_trio_1783451898546.jpg' },
    { title: 'Tęczowy Zakątek', desc: 'Nasz Ogród', url: '/assets/images/kindergarten_garden_1783451914603.jpg' },
    { title: 'Plany Budynku', desc: 'Archiwum lat 70.', url: '/assets/images/blueprints_bg_1783533350195.jpg' },
    { title: 'Centrum Sterowania', desc: 'Cyber Rdzeń', url: '/assets/images/control_center_1783531596202.jpg' },
    { title: 'Ciemna Sala', desc: 'Awaria zasilania', url: '/assets/images/dark_kinder_bg_1783533364360.jpg' }
  ];

  // Notebook content
  const notesAndTasks = useMemo(() => {
    const activeTasks = [];
    if (gameState.currentChapterId === 21) {
      activeTasks.push({ text: 'Zbadaj zablokowany budynek', done: choseTeachers || choseTherapists });
      activeTasks.push({ text: 'Podejmij decyzję o sojuszu z Nauczycielkami lub Terapeutkami', done: choseTeachers || choseTherapists });
    } else if (gameState.currentChapterId === 22) {
      activeTasks.push({ text: 'Włam się do terminalu serwerowni', done: true });
      activeTasks.push({ text: 'Rozwiąż dylemat bazy danych (Skasuj lub Pobierz)', done: choseDeleteData || choseSaveData });
    } else if (gameState.currentChapterId === 23) {
      activeTasks.push({ text: 'Idź do sali gimnastycznej', done: false });
      activeTasks.push({ text: 'Pokonaj Łysego Kierownika', done: false });
    }

    const assistanceNotes = [
      'NOTATKA ASYSTENTKI:',
      '• Przedszkole zostało odcięte od zasilania przez zdalne systemy rygoru Kierownika.',
      '• Moja nowa aplikacja w smartfonie korzysta z energii Koloryduszka i pozwala omijać cyfrowe blokady.',
      choseTeachers ? '• Sojusz: NAUCZYCIELKI. Basia, Hania i Zosia stawiają na kreatywną walkę i lampiony.' : '',
      choseTherapists ? '• Sojusz: TERAPEUTKI. Calm, Whisper i Harmony stawiają na symetrię, procedury i ciszę.' : '',
      choseDeleteData ? '• Decyzja z Ch22: Skasowano bazę danych. Dzieci są wolne, ale brak nam dowodów dla kuratorium.' : '',
      choseSaveData ? '• Decyzja z Ch22: Pobrano dane jako dowód. Terapeutki zachwycone, lecz wciąż mamy na dyskach twarde raporty o dzieciach.' : '',
    ].filter(Boolean);

    return { tasks: activeTasks, notes: assistanceNotes };
  }, [gameState.currentChapterId, choseTeachers, choseTherapists, choseDeleteData, choseSaveData]);

  // Chat contacts list details
  const chatContacts = [
    { id: 'basia', name: 'Pani Basia', role: 'Nauczycielki', color: '#fbbf24', avatar: '🌈' },
    { id: 'calm', name: 'Pani Calm', role: 'Terapeutki', color: '#60a5fa', avatar: '🔷' },
    { id: 'system', name: 'Koloryduszek', role: 'Duch Przedszkola', color: '#ec4899', avatar: '✨' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="relative w-full max-w-sm aspect-[9/19] max-h-[820px] bg-[#0c0806] rounded-[48px] border-[10px] border-slate-800 shadow-[0_0_50px_rgba(251,191,36,0.15)] overflow-hidden flex flex-col justify-between"
        style={{ boxShadow: '0 0 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)' }}
      >
        {/* Notch / Speaker cutout */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-12 h-1 bg-black rounded-full" />
        </div>

        {/* Home indicator bar at the bottom */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-30" />

        {/* Screen Background Layer */}
        <div className="absolute inset-0 bg-[#0c0806] z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-amber-500/5 to-cyan-500/5 z-0" />
        
        {/* Status Bar */}
        <div className="pt-7 px-6 flex justify-between items-center text-[10px] font-mono text-white/60 z-20 select-none">
          <span>20:21</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-[#fbbf24] animate-pulse">✨ KOLORYDUSZEK LTE</span>
            <div className="w-4 h-2.5 border border-white/40 rounded-sm p-[1px] flex items-center">
              <div className="h-full w-4/5 bg-emerald-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Header App Title */}
        <div className="px-6 py-2 border-b border-white/5 z-10 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-[11px] uppercase font-black tracking-wider text-amber-100 font-mono">DuszFon v2.0</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 transition text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screen Body Viewport */}
        <div className="flex-1 overflow-y-auto px-4 py-3 z-10 font-sans">
          <AnimatePresence mode="wait">
            {selectedChatId ? (
              // Active Chat Conversation Screen
              <motion.div 
                key="chat-messages"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="h-full flex flex-col justify-between"
              >
                {/* Back to chat list */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                  <button 
                    onClick={handleCloseChat}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    ← Wiadomości
                  </button>
                  <span className="text-xs font-bold text-white font-mono">
                    {chatContacts.find(c => c.id === selectedChatId)?.name}
                  </span>
                  <div className="w-6" /> {/* Spacer */}
                </div>

                {/* Message logs */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[380px] pr-1 scrollbar-thin">
                  {chatMessages[selectedChatId]?.map((msg, index) => (
                    <div 
                      key={`msg-${selectedChatId}-${index}`}
                      className={`flex flex-col max-w-[85%] ${msg.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div 
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'me' 
                            ? 'bg-amber-500 text-black font-semibold rounded-tr-none' 
                            : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-white/30 font-mono mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated message input */}
                <div className="pt-2 border-t border-white/5 flex gap-1.5 mt-3">
                  <div className="flex-1 bg-white/5 rounded-full px-3 py-1.5 text-[10px] text-white/40 border border-white/5 italic flex items-center">
                    Aplikacja zablokowana przez prąd...
                  </div>
                  <button className="p-2 rounded-full bg-white/5 text-white/40 cursor-not-allowed">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              // Navigation Views depending on active tab
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {activeTab === 'chat' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black tracking-widest uppercase text-white/40 font-mono mb-2">Komunikator</h3>
                    {chatContacts.map(contact => {
                      const msgs = chatMessages[contact.id] || [];
                      const lastMsg = msgs[msgs.length - 1];
                      return (
                        <div 
                          key={`contact-item-${contact.id}`}
                          onClick={() => handleOpenChat(contact.id)}
                          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition duration-200 cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner shrink-0" style={{ backgroundColor: `${contact.color}20`, border: `1px solid ${contact.color}40` }}>
                            {contact.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white truncate">{contact.name}</span>
                              <span className="text-[8px] text-white/40 font-mono">{lastMsg?.time || 'Teraz'}</span>
                            </div>
                            <p className="text-[10px] text-white/60 truncate mt-0.5">{lastMsg?.text || 'Brak wiadomości'}</p>
                          </div>
                          <ChevronRightIcon className="w-3.5 h-3.5 text-white/30 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'contacts' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black tracking-widest uppercase text-white/40 font-mono mb-2">Aktywne Kontakty</h3>
                    {Object.values(CHARACTERS)
                      .filter(char => char.id !== 'system' && char.id !== 'player')
                      .map(char => {
                        const isUnlocked = (char.requiredChapter || 1) <= gameState.currentChapterId;
                        return (
                          <div 
                            key={`contact-profile-${char.id}`}
                            className={`p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 ${isUnlocked ? '' : 'opacity-30'}`}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-white/10 shrink-0 flex items-center justify-center">
                              {isUnlocked && char.portraitUrl ? (
                                <img src={char.portraitUrl} alt={char.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-5 h-5 text-white/40" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-white block truncate">{isUnlocked ? char.name : 'Nieznany Profil'}</span>
                              <span className="text-[9px] uppercase font-bold tracking-widest block font-mono mt-0.5" style={{ color: char.accentColor }}>
                                {isUnlocked ? char.role : 'Profil Zablokowany'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black tracking-widest uppercase text-white/40 font-mono mb-2">Baza Obrazów</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {galleryItems.map((item, idx) => (
                        <div 
                          key={`gallery-idx-${idx}`}
                          onClick={() => handleExpandImage(item.url)}
                          className="rounded-xl overflow-hidden bg-white/5 border border-white/5 cursor-pointer hover:border-amber-400/40 transition group"
                        >
                          <div className="aspect-square bg-slate-800 overflow-hidden relative">
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                          </div>
                          <div className="p-1.5 text-center">
                            <span className="text-[9px] font-bold text-white block truncate">{item.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-black tracking-widest uppercase text-white/40 font-mono mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Cele Fabularne
                      </h3>
                      <div className="space-y-2 bg-amber-500/5 rounded-2xl p-3.5 border border-amber-500/15">
                        {notesAndTasks.tasks.map((task, idx) => (
                          <div key={`task-${idx}`} className="flex items-start gap-2 text-[11px] leading-relaxed">
                            {task.done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0 mt-1" />
                            )}
                            <span className={task.done ? 'text-white/40 line-through' : 'text-amber-100 font-medium'}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                        {notesAndTasks.tasks.length === 0 && (
                          <div className="text-[10px] text-white/40 italic">Brak zadań w tym rozdziale.</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black tracking-widest uppercase text-white/40 font-mono mb-2">Notatnik Asystentki</h3>
                      <div className="bg-white/5 rounded-2xl p-3 border border-white/5 font-mono text-[9px] text-white/80 space-y-2 max-h-[180px] overflow-y-auto">
                        {notesAndTasks.notes.map((note, idx) => (
                          <p key={`note-${idx}`} className={note.startsWith('NOTATKA') ? 'text-amber-400 font-extrabold' : ''}>{note}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Expanded Gallery Image Overlay */}
        <AnimatePresence>
          {expandedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseImage}
              className="absolute inset-0 z-40 bg-black/95 flex flex-col justify-center items-center p-3 cursor-zoom-out"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                <img src={expandedImage} alt="Expanded Artwork" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] text-white/60 font-mono mt-4 text-center">Naciśnij obrazek, aby powrócić</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tab Bar */}
        <div className="px-4 pb-6 pt-2 bg-black/40 border-t border-white/5 z-20 flex justify-around items-center select-none shrink-0">
          <button 
            onClick={() => handleTabChange('chat')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'chat' ? 'text-amber-400 scale-105' : 'text-white/50 hover:text-white/80'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[8px] font-bold tracking-wider font-mono">Chat</span>
          </button>

          <button 
            onClick={() => handleTabChange('contacts')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'contacts' ? 'text-amber-400 scale-105' : 'text-white/50 hover:text-white/80'}`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[8px] font-bold tracking-wider font-mono">Kontakty</span>
          </button>

          <button 
            onClick={() => handleTabChange('gallery')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'gallery' ? 'text-amber-400 scale-105' : 'text-white/50 hover:text-white/80'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-[8px] font-bold tracking-wider font-mono">Galeria</span>
          </button>

          <button 
            onClick={() => handleTabChange('notes')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'notes' ? 'text-amber-400 scale-105' : 'text-white/50 hover:text-white/80'}`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[8px] font-bold tracking-wider font-mono">Zadania</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Sub-icons used internally
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
