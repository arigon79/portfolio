import { useEffect, useState } from 'react';

const NAME = 'Ariji';
const GREETINGS = [
  { lang: 'en', text: 'Hi, I am Ariji' },
  { lang: 'zh', text: '你好，我是 Ariji' },
  { lang: 'ja', text: 'こんにちは、Arijiです' },
  { lang: 'ko', text: '안녕하세요, Ariji입니다' },
];

export default function TypingGreeting() {
  const [frame, setFrame] = useState({ index: 0, length: 0 });

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer;

    const start = () => {
      window.clearTimeout(timer);
      if (motion.matches) {
        setFrame({ index: 0, length: GREETINGS[0].text.length });
        return;
      }

      let index = 0;
      let length = 0;
      let deleting = false;
      setFrame({ index, length });

      const tick = () => {
        length += deleting ? -1 : 1;
        setFrame({ index, length });

        let delay = deleting ? 45 : 100;
        if (!deleting && length === GREETINGS[index].text.length) {
          deleting = true;
          delay = 2400;
        } else if (deleting && length === 0) {
          index = (index + 1) % GREETINGS.length;
          deleting = false;
          delay = 300;
        }
        timer = window.setTimeout(tick, delay);
      };

      timer = window.setTimeout(tick, 250);
    };

    start();
    motion.addEventListener('change', start);
    return () => {
      window.clearTimeout(timer);
      motion.removeEventListener('change', start);
    };
  }, []);

  const greeting = GREETINGS[frame.index];
  const typed = greeting.text.slice(0, frame.length);
  // The name is tinted inside every greeting, so it stays the focal point as it types.
  const nameStart = greeting.text.indexOf(NAME);
  const nameEnd = nameStart + NAME.length;
  return (
    <p className="research-greeting">
      <span className="research-greeting-wave" aria-hidden="true">👋</span>
      <span className="sr-only">{GREETINGS[0].text}</span>
      <span aria-hidden="true" lang={greeting.lang}>
        {typed.slice(0, nameStart)}
        <span className="research-greeting-name">{typed.slice(nameStart, nameEnd)}</span>
        {typed.slice(nameEnd)}
        <span className="research-greeting-cursor" />
      </span>
    </p>
  );
}
