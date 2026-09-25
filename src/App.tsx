import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
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

  return (
    <main className={styles.page}>
      <MusicButton />

      <section className={`${styles.hero} ${styles.dark}`}>
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

      <section className={styles.textSection}>
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

      <section className={styles.statement}>
        <motion.p {...fadeUp}>
          어느새 나는
          <br />
          <strong>현이와 함께하는 것</strong>이
          <br />
          너무 자연스러워졌어.
        </motion.p>
      </section>

      <section className={styles.memories}>
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
                  <img src={src} alt={`${memory.alt} ${imageIndex + 1}`} loading="lazy" decoding="async" />
                  <span>0{imageIndex + 1}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.article>
        ))}
      </section>

      <section className={styles.darkSection}>
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

      <section className={styles.textSection}>
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

      <section className={styles.gratitude}>
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

      <section className={styles.future}>
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

      <section className={styles.blankFrames}>
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

      <section className={styles.finalWords}>
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

      <section className={styles.proposal}>
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
              <motion.div
                className={styles.heart}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: [0, 1.18, 1], rotate: [ -15, 8, 0 ] }}
                transition={{ duration: 0.8 }}
              >
                ♥
              </motion.div>
              <h2>고마워.</h2>
              <p>
                그럼 우리 이야기는
                <br />
                이제부터가 진짜 시작이네.
              </p>
              <span>WITH LOVE, FOREVER</span>
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
