import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import MusicButton from './components/MusicButton';
import { beginningImage, futureCards, memories } from './data/story';
import styles from './App.module.css';

const fadeUp = {
  initial: { opacity: 0, y: 44 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.9, ease: 'easeOut' as const },
};

const galleryVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 24, scale: 1.06 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

function App() {
  const [answered, setAnswered] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const autoScrollState = useRef({
    sectionIndex: 0,
    phase: 'idle' as 'idle' | 'waiting' | 'scrolling',
    timer: 0 as number | 0,
    animationFrame: 0 as number | 0,
    resumeTimer: 0 as number | 0,
    lastScrollY: 0,
    userInteracting: false,
  });

  const registerSection = (element: HTMLElement | null) => {
    if (!element) return;
    if (!sectionRefs.current.includes(element)) sectionRefs.current.push(element);
  };

  useEffect(() => {
    const state = autoScrollState.current;

    const clearAutoScroll = () => {
      window.clearTimeout(state.timer);
      window.clearTimeout(state.resumeTimer);
      window.cancelAnimationFrame(state.animationFrame);
      state.timer = 0;
      state.resumeTimer = 0;
      state.phase = 'idle';
    };

    if (!autoScroll || sectionRefs.current.length === 0) {
      clearAutoScroll();
      return;
    }

    // 이 컴포넌트가 직접 프레임별 위치를 제어할 때 전역 smooth scrolling과
    // 충돌하지 않도록 자동 스크롤 세션 동안만 native auto로 고정한다.
    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    const getSections = () => sectionRefs.current.filter(Boolean);
    const getMaxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    type Bounds = { top: number; bottom: number; end: number };
    const boundsCache = new Map<HTMLElement, Bounds>();

    const measureSections = () => {
      const maxScroll = getMaxScroll();
      getSections().forEach((section) => {
        const rect = section.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = rect.bottom + window.scrollY;
        const end = Math.max(top, Math.min(bottom - window.innerHeight, maxScroll));
        boundsCache.set(section, { top, bottom, end });
      });
    };

    const getBounds = (section: HTMLElement) => {
      const cached = boundsCache.get(section);
      if (cached) return cached;
      measureSections();
      return boundsCache.get(section) ?? { top: 0, bottom: 0, end: 0 };
    };

    // 이미지 로딩으로 레이아웃 높이가 변할 때만 다시 측정한다.
    const resizeObserver = new ResizeObserver(() => {
      measureSections();
    });
    getSections().forEach((section) => resizeObserver.observe(section));
    measureSections();

    const getCurrentSectionIndex = () => {
      const sections = getSections();
      if (!sections.length) return 0;

      const y = window.scrollY;
      let index = 0;

      // 현재 스크롤 위치보다 위에 있는 가장 마지막 섹터를 찾는다.
      // 화면 중앙을 기준으로 찾지 않기 때문에 섹터 높이가 제각각이어도
      // 중간에서 위로 올렸을 때 해당 섹터가 정확히 선택된다.
      for (let i = 0; i < sections.length; i += 1) {
        const { top } = getBounds(sections[i]);
        if (top <= y + 2) index = i;
        else break;
      }

      return Math.min(index, sections.length - 1);
    };

    const wait = (callback: () => void, ms: number) => {
      window.clearTimeout(state.timer);
      state.phase = 'waiting';
      state.timer = window.setTimeout(() => {
        state.timer = 0;
        callback();
      }, ms);
    };

    const moveTo = (getTarget: () => number, duration: number, done: () => void) => {
      window.cancelAnimationFrame(state.animationFrame);
      const startY = window.scrollY;
      const startedAt = performance.now();
      state.phase = 'scrolling';

      const frame = (now: number) => {
        if (!autoScroll || state.userInteracting) return;

        const progress = Math.min(1, (now - startedAt) / duration);
        // easeInOutCubic: 섹터 사이 이동이 갑자기 튀지 않도록 한다.
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        const target = Math.max(0, Math.min(getTarget(), getMaxScroll()));
        const y = startY + (target - startY) * eased;

        window.scrollTo(0, y);

        if (progress < 1) {
          state.animationFrame = window.requestAnimationFrame(frame);
        } else {
          window.scrollTo(0, target);
          done();
        }
      };

      state.animationFrame = window.requestAnimationFrame(frame);
    };

    const goToNextSection = () => {
      const sections = getSections();
      if (!autoScroll || state.userInteracting) return;

      if (state.sectionIndex >= sections.length - 1) {
        state.phase = 'idle';
        return;
      }

      // 섹터 끝에서 정확히 2초 멈춘 뒤 다음 섹터로 이동한다.
      wait(() => {
        if (!autoScroll || state.userInteracting) return;

        const nextIndex = state.sectionIndex + 1;
        const nextSection = getSections()[nextIndex];
        if (!nextSection) return;

        state.sectionIndex = nextIndex;
        moveTo(
          () => getBounds(nextSection).top,
          1300,
          () => startSectionScroll(),
        );
      }, 2000);
    };

    const startSectionScroll = () => {
      const sections = getSections();
      const section = sections[state.sectionIndex];
      if (!section || !autoScroll || state.userInteracting) return;

      const bounds = getBounds(section);
      const currentY = window.scrollY;

      // 현재 섹터의 실제 화면 시작점부터 시작한다.
      // 사용자가 중간에서 위로 올린 경우에는 그 위치에서 이어간다.
      const startY = Math.max(bounds.top, Math.min(currentY, bounds.end));

      // 섹터 전체가 현재 화면 안에 들어오는 경우.
      // 내부 스크롤은 하지 않고 바로 섹터 끝에서 2초 대기 후 다음 섹터로 간다.
      if (bounds.end - bounds.top <= 2) {
        window.scrollTo(0, bounds.top);
        goToNextSection();
        return;
      }

      // 이미 섹터 끝에 도착한 경우에도 내부 스크롤을 다시 시작하지 않고
      // 2초 후 다음 섹터로 넘어간다.
      if (bounds.end - startY <= 2) {
        window.scrollTo(0, bounds.end);
        goToNextSection();
        return;
      }

      window.cancelAnimationFrame(state.animationFrame);
      state.phase = 'scrolling';

      // 섹터 내부는 '시간'이 아니라 실제 이동 거리 기준의 일정한 속도로 이동한다.
      // 화면/섹터 크기가 달라도 동일한 체감 속도를 유지한다.
      const SPEED = 70; // px/sec
      let lastTime = performance.now();

      const frame = (now: number) => {
        if (!autoScroll || state.userInteracting) return;

        const dt = Math.min(64, now - lastTime) / 1000;
        lastTime = now;

        // 매 프레임 레이아웃을 다시 읽지 않는다. ResizeObserver가 높이 변경 때만
        // boundsCache를 갱신하므로 이미지가 많은 섹터에서도 강제 reflow를 피한다.
        const liveBounds = getBounds(section);
        const current = window.scrollY;
        const remaining = liveBounds.end - current;

        if (remaining <= 2) {
          window.scrollTo({ top: liveBounds.end, behavior: 'auto' });
          goToNextSection();
          return;
        }

        const nextY = Math.min(liveBounds.end, current + SPEED * dt);
        window.scrollTo({ top: nextY, behavior: 'auto' });
        state.animationFrame = window.requestAnimationFrame(frame);
      };

      state.animationFrame = window.requestAnimationFrame(frame);
    };

    // 사용자 입력이 들어오면 자동 스크롤의 RAF/대기 타이머를 즉시 끊는다.
    // passive wheel 이벤트이므로 브라우저의 실제 수동 스크롤은 막지 않는다.
    const stopForUserInteraction = () => {
      if (!autoScroll) return;

      state.userInteracting = true;
      window.cancelAnimationFrame(state.animationFrame);
      window.clearTimeout(state.timer);
      window.clearTimeout(state.resumeTimer);
      state.animationFrame = 0;
      state.timer = 0;
      state.phase = 'idle';

      // 사용자가 계속 움직이는 동안에는 이 타이머를 계속 뒤로 미룬다.
      state.resumeTimer = window.setTimeout(() => {
        if (!autoScroll) return;

        state.userInteracting = false;
        state.resumeTimer = 0;
        state.sectionIndex = getCurrentSectionIndex();
        startSectionScroll();
      }, 900);
    };

    // 자동 재생 시작 전에 페이지의 이미지를 가능한 한 미리 디코드한다.
    // 스크롤 도중 이미지 디코딩이 몰리는 현상을 줄인다.
    const images = Array.from(document.images);
    images.forEach((img) => {
      if (img.loading === 'lazy') img.loading = 'eager';
    });
    void Promise.all(images.map((img) => img.decode?.().catch(() => undefined))).then(() => {
      if (autoScroll && !state.userInteracting && state.phase === 'idle') {
        measureSections();
        state.sectionIndex = getCurrentSectionIndex();
        startSectionScroll();
      }
    });

    state.sectionIndex = getCurrentSectionIndex();
    state.userInteracting = false;
    startSectionScroll();

    window.addEventListener('wheel', stopForUserInteraction, { passive: true });
    window.addEventListener('touchstart', stopForUserInteraction, { passive: true });
    window.addEventListener('touchmove', stopForUserInteraction, { passive: true });
    window.addEventListener('keydown', stopForUserInteraction);

    return () => {
      window.removeEventListener('wheel', stopForUserInteraction);
      window.removeEventListener('touchstart', stopForUserInteraction);
      window.removeEventListener('touchmove', stopForUserInteraction);
      window.removeEventListener('keydown', stopForUserInteraction);
      resizeObserver.disconnect();
      boundsCache.clear();
      html.style.scrollBehavior = previousScrollBehavior;
      clearAutoScroll();
    };
  }, [autoScroll]);

  return (
    <main className={styles.page}>
      <button
        type="button"
        className={`${styles.autoScrollButton} ${autoScroll ? styles.autoScrollButtonOn : ''}`}
        onClick={() => setAutoScroll((value) => !value)}
        aria-pressed={autoScroll}
      >
        AUTO SCROLL {autoScroll ? 'ON' : 'OFF'}
      </button>
      <MusicButton />

      <section ref={registerSection} className={`${styles.hero} ${styles.dark}`}>
        <div className={styles.grain} />
        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
        >
          <p className={styles.eyebrow}>FOR YOU, WITH LOVE</p>
          <h1>
            사랑하는
            <br />
            <em>현이에게</em>
          </h1>
          <p className={styles.heroSub}>오늘은 현이에게 꼭 하고 싶은 이야기가 있어.</p>
          <motion.span
            className={styles.scroll}
            animate={{ y: [0, 8, 0], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            SCROLL TO BEGIN ↓
          </motion.span>
        </motion.div>
      </section>

      <section ref={registerSection} className={styles.textSection}>
        <motion.div {...fadeUp} className={styles.narrow}>
          <span className={styles.number}>01</span>
          <h2>
            우리가 처음 만난 순간부터
            <br />
            지금까지.
          </h2>
          <p className={styles.beginningDate}>2025.08.22</p>
          <p>
            처음에는 그저 한 사람을 만났을 뿐이라고 생각했어.
            <br />
            그런데 시간이 지나고 돌아보니, 내 하루의 많은 장면에 현이가 있더라.
          </p>

          <motion.button
            className={styles.beginningPhoto}
            onClick={() => setLightbox(beginningImage)}
            whileHover={{ y: -8, scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
          >
            <img src={beginningImage} alt="우리의 시작을 담은 사진" decoding="async" fetchPriority="high" />
          </motion.button>
        </motion.div>
      </section>

      <section ref={registerSection} className={styles.statement}>
        <motion.p {...fadeUp}>
          어느새 나는
          <br />
          <strong>현이와 함께하는 것</strong>이
          <br />
          너무 자연스러워졌어.
        </motion.p>
      </section>

      <section ref={registerSection} className={styles.memories}>
        <div className={styles.sectionHead}>
          <span className={styles.number}>02</span>
          <p>OUR TIME</p>
          <h2>
            시간이 쌓이고,
            <br />
            <em>우리의 이야기가 되었어.</em>
          </h2>
        </div>

        {memories.map((memory, index) => (
          <motion.article
            className={styles.memory}
            key={`${memory.place}-${index}`}
            {...fadeUp}
          >
            <div className={styles.memoryCopy}>
              <span className={styles.memoryIndex}>0{index + 1}</span>
              <span className={styles.memoryPlace}>{memory.place}</span>
              <h3>{memory.title}</h3>
              <p>{memory.text}</p>
            </div>

            <motion.div
              className={styles.gallery}
              variants={galleryVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.18 }}
            >
              {memory.images.map((src, imageIndex) => (
                <motion.button
                  key={`${src}-${imageIndex}`}
                  className={styles.galleryItem}
                  variants={imageVariants}
                  onClick={() => setLightbox(src)}
                  whileHover={{ y: -7 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <img src={src} alt={`${memory.alt} ${imageIndex + 1}`} loading="eager" decoding="async" />
                  <span>0{imageIndex + 1}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.article>
        ))}
      </section>

      <section ref={registerSection} className={styles.darkSection}>
        <motion.div {...fadeUp} className={styles.narrow}>
          <span className={styles.number}>03</span>
          <p className={styles.bigQuote}>
            좋은 곳에 가면
            <br />
            <em>같이 오고 싶고,</em>
            <br />
            좋은 일이 생기면
            <br />
            <em>제일 먼저 말해주고 싶어.</em>
          </p>
        </motion.div>
      </section>

      <section ref={registerSection} className={styles.textSection}>
        <motion.div {...fadeUp} className={styles.narrow}>
          <span className={styles.number}>04</span>
          <h2>
            현이와 함께하면서
            <br />
            알게 된 것들.
          </h2>
          <div className={styles.traits}>
            <p>
              평범한 하루도
              <br />
              <strong>누구와 함께하느냐에 따라</strong>
              <br />
              특별해질 수 있다는 것.
            </p>
            <p>
              멀리 가지 않아도
              <br />
              <strong>같이 웃을 사람이 있다는 것</strong>만으로
              <br />
              충분히 행복하다는 것.
            </p>
            <p>
              그리고 내가 생각했던 것보다
              <br />
              <strong>현이를 훨씬 더 오래</strong>
              <br />
              내 곁에 두고 싶다는 것.
            </p>
          </div>
        </motion.div>
      </section>

      <section ref={registerSection} className={styles.gratitude}>
        <motion.div {...fadeUp}>
          <span className={styles.number}>05</span>
          <h2>고마워.</h2>
          <p>
            내 일상에 들어와줘서.
            <br />
            함께 웃어줘서.
            <br />
            좋은 날에도, 그렇지 않은 날에도
            <br />
            내 옆에 있어줘서.
          </p>
        </motion.div>
      </section>

      <section ref={registerSection} className={styles.future}>
        <div className={styles.sectionHead}>
          <span className={styles.number}>06</span>
          <p>FROM NOW ON</p>
          <h2>
            그리고 이제는
            <br />
            <em>앞으로의 이야기도</em> 만들고 싶어.
          </h2>
          <p className={styles.futureIntro}>
            내가 그리는 미래에 현이가 함께 있었으면 좋겠어.
          </p>
        </div>
        <div className={styles.futureGrid}>
          {futureCards.map((card, index) => (
            <motion.div
              key={card.label}
              className={styles.futureCard}
              {...fadeUp}
              transition={{ duration: 0.8, delay: index * 0.08 }}
            >
              <span>{card.label}</span>
              <p>{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section ref={registerSection} className={styles.blankFrames}>
        <motion.div {...fadeUp}>
          <span className={styles.number}>07</span>
          <p className={styles.framesLead}>
            아직 찍지 않은 사진들이
            <br />
            <em>더 많이 남아 있잖아.</em>
          </p>
          <div className={styles.frames}>
            {[1, 2, 3].map((n) => (
              <motion.div
                className={styles.frame}
                key={n}
                whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,.35)' }}
              >
                <span>OUR NEXT MOMENT</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section ref={registerSection} className={styles.finalWords}>
        <motion.div {...fadeUp}>
          <span className={styles.number}>08</span>
          <p>
            여행도
            <br />
            평범한 하루도
            <br />
            좋은 날도
            <br />
            힘든 날도.
          </p>
          <h2>
            앞으로의 모든 계절을
            <br />
            <em>현이와 함께하고 싶어.</em>
          </h2>
          <motion.p
            className={styles.yesMan}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.25 }}
          >
            앞으로는 현이의 <strong>YES맨</strong>이 되려고 노력할게.
          </motion.p>

          <p className={styles.small}>지금까지처럼, 앞으로도 내 옆에 있어줄래?</p>
        </motion.div>
      </section>

      <section ref={registerSection} className={styles.proposal}>
        <div className={styles.proposalGlow} />
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="question"
              className={styles.proposalInner}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              <span className={styles.number}>09</span>
              <p className={styles.questionLead}>
                그리고 한 가지 더
                <br />
                물어보고 싶어.
              </p>
              <h2>
                나와
                <br />
                <em>결혼해줄래?</em>
              </h2>
              <motion.button
                className={styles.yesButton}
                onClick={() => setAnswered(true)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
              >
                <span>YES</span>
                <b>♥</b>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              className={styles.answer}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.heartBurst} aria-hidden="true">
                {[
                  { x: -210, y: -115, r: -18, d: 0.05, s: 0.72 },
                  { x: -150, y: -175, r: 12, d: 0.12, s: 0.52 },
                  { x: -75, y: -215, r: -8, d: 0.18, s: 0.62 },
                  { x: 85, y: -215, r: 10, d: 0.16, s: 0.58 },
                  { x: 160, y: -165, r: -14, d: 0.1, s: 0.5 },
                  { x: 220, y: -100, r: 18, d: 0.06, s: 0.7 },
                  { x: -235, y: 35, r: -25, d: 0.2, s: 0.48 },
                  { x: 235, y: 35, r: 22, d: 0.22, s: 0.55 },
                  { x: -170, y: 125, r: 14, d: 0.25, s: 0.62 },
                  { x: 175, y: 125, r: -12, d: 0.28, s: 0.52 },
                ].map((heart, index) => (
                  <motion.span
                    key={index}
                    className={styles.burstHeart}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: heart.x,
                      y: heart.y,
                      scale: [0, heart.s, heart.s * 0.75],
                      rotate: [0, heart.r, heart.r * 1.5],
                    }}
                    transition={{ duration: 1.7, delay: heart.d, ease: 'easeOut' }}
                  >
                    ♥
                  </motion.span>
                ))}
              </div>

              <motion.div
                className={styles.heartHalo}
                initial={{ opacity: 0, scale: 0.35 }}
                animate={{ opacity: [0, 0.7, 0], scale: [0.35, 1.7, 2.1] }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
              />

              <motion.div
                className={styles.heart}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: [0, 1.2, 0.96, 1], rotate: [-15, 8, -3, 0] }}
                transition={{ duration: 0.95, ease: 'easeOut' }}
              >
                ♥
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
              >
                고마워.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
              >
                앞으로의 모든 순간,
                <br />
                함께 만들어가자.
              </motion.p>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                WITH LOVE, FOREVER
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className={styles.footer}>From. 영훈 · To. 사랑하는 현이에게</footer>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt="확대된 추억 사진"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.35 }}
              onClick={(event) => event.stopPropagation()}
            />
            <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>
              CLOSE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
