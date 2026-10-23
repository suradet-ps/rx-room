<script setup lang="ts">
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Plus,
} from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const faqItems = [
  {
    question: 'ติดต่อกลุ่มงานเภสัชกรรมได้อย่างไร?',
    answer: 'โทร 036-776240 ต่อ 104 หรืออีเมล pharmacistsabot@gmail.com ในเวลาทำการ จันทร์ - ศุกร์ 08:00 - 16:00 น.',
  },
  {
    question: 'ขอเอกสารหรือแบบฟอร์มของกลุ่มงานได้ที่ไหน?',
    answer: 'ใช้ระบบดาวน์โหลดเอกสารในหน้ารวมเครื่องมือ เอกสารของกลุ่มงานถูกเก็บไว้ที่เดียวกันและอัปเดตจากต้นทางโดยตรง',
  },
  {
    question: 'ระบบใดบ้างที่ควรเปิดใช้เป็นประจำ?',
    answer: 'MedSafety Net สำหรับบันทึกความคลาดเคลื่อนทางยา, โปรแกรมคำนวณยา Warfarin, บัญชียาโรงพยาบาล และบัญชียา High-Alert Drugs',
  },
  {
    question: 'ต้องการความช่วยเหลือเรื่องการใช้งานระบบทำอย่างไร?',
    answer: 'ติดต่อกลุ่มงานเภสัชกรรมตามช่องทางด้านบน หรือแจ้งผู้ดูแลระบบของหน่วยงานเพื่อตรวจสอบสิทธิ์การใช้งาน',
  },
];

const openFaq = ref(0);

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? -1 : index;
}

function navigateTo(path: string) {
  void router.push(path);
}
</script>

<template>
  <div class="department">
    <header class="dept-head rise-in" style="--delay: 30ms">
      <div>
        <p class="eyebrow">
          Room 03 · Department
        </p>
        <h1>กลุ่มงาน<br><span>เภสัชกรรม</span></h1>
      </div>
      <div class="dept-intro">
        <p>
          ประตูเดียวที่รวมงานเภสัชกรรมของโรงพยาบาลสระโบสถ์
          ทั้งงานบริการ เครื่องมือปฏิบัติงาน และข้อมูลที่ทีมใช้ทุกวัน
        </p>
        <div class="dept-tags">
          <span class="tag">โรงพยาบาลสระโบสถ์</span>
          <span class="tag">Pharmacy department</span>
        </div>
      </div>
    </header>

    <section class="dept-grid rise-in" style="--delay: 110ms" aria-label="ข้อมูลกลุ่มงาน">
      <article class="identity-card">
        <svg class="identity-art" viewBox="0 0 360 300" fill="none" aria-hidden="true">
          <circle cx="188" cy="140" r="108" stroke="currentColor" stroke-opacity="0.14" />
          <circle cx="188" cy="140" r="78" stroke="currentColor" stroke-dasharray="3 6" stroke-opacity="0.2" />
          <path d="M126 124h124v30c0 43-27 68-62 68s-62-25-62-68v-30Z" stroke="currentColor" stroke-width="1.5" />
          <path d="M126 124c0-9 124-9 124 0" stroke="currentColor" stroke-width="1.5" />
          <path d="M188 54v62" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <path d="M174 54h28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <path d="M98 250h180" stroke="currentColor" stroke-opacity="0.3" />
          <rect x="242" y="54" width="34" height="15" rx="7.5" transform="rotate(-24 242 54)" stroke="currentColor" stroke-width="1.4" />
          <path d="M257 47.5l15 6.7" stroke="currentColor" stroke-width="1.4" />
          <circle cx="84" cy="78" r="6" stroke="currentColor" stroke-width="1.4" />
          <circle cx="108" cy="58" r="3" fill="currentColor" fill-opacity="0.5" />
          <path d="M72 206c18 0 18 12 36 12s18-12 36-12" stroke="currentColor" stroke-opacity="0.25" />
        </svg>

        <div class="identity-copy">
          <p class="eyebrow eyebrow--plain">
            Our room
          </p>
          <h2>ยาที่ถูกต้อง<br>ถึงมือผู้ป่วย<br>ด้วยทีมเดียวกัน</h2>
          <p>
            เราดูแลความปลอดภัยด้านยาตั้งแต่การสั่งใช้ การจ่ายยา
            ไปจนถึงการติดตามผล เพื่อให้ทุกขั้นตอนในห้องยาชัดเจนและตรวจสอบได้
          </p>
        </div>

        <p class="identity-mark mono">
          Rx · SABOT
        </p>
      </article>

      <div class="contact-stack">
        <article class="contact-row">
          <span class="contact-icon">
            <Clock3 :size="20" :stroke-width="1.6" aria-hidden="true" />
          </span>
          <div>
            <h2>เวลาทำการ</h2>
            <p>จันทร์ - ศุกร์ 08:00 - 16:00 น.</p>
            <small>ติดต่อล่วงหน้าก่อนนอกเวลาทำการ</small>
          </div>
        </article>

        <article class="contact-row">
          <span class="contact-icon">
            <MapPin :size="20" :stroke-width="1.6" aria-hidden="true" />
          </span>
          <div>
            <h2>ที่ตั้ง</h2>
            <p>โรงพยาบาลสระโบสถ์</p>
            <small>ห้องจ่ายยาและพื้นที่บริการของกลุ่มงาน</small>
          </div>
        </article>

        <article class="contact-row">
          <span class="contact-icon">
            <Phone :size="20" :stroke-width="1.6" aria-hidden="true" />
          </span>
          <div>
            <h2>โทรศัพท์</h2>
            <a href="tel:036776240">036-776240 ต่อ 104</a>
            <small>ในเวลาทำการ</small>
          </div>
        </article>

        <article class="contact-row">
          <span class="contact-icon">
            <Mail :size="20" :stroke-width="1.6" aria-hidden="true" />
          </span>
          <div>
            <h2>อีเมล</h2>
            <a href="mailto:pharmacistsabot@gmail.com">pharmacistsabot@gmail.com</a>
            <small>สำหรับเอกสารและประสานงาน</small>
          </div>
        </article>
      </div>

      <aside class="visit-card">
        <div class="map-art" aria-hidden="true">
          <span class="map-line map-line--one" />
          <span class="map-line map-line--two" />
          <span class="map-line map-line--three" />
          <span class="map-pin">
            <span />
          </span>
          <span class="map-label mono">SABOT · 15.0 / 101.4</span>
        </div>
        <div class="visit-copy">
          <p class="eyebrow">
            Find us
          </p>
          <h2>แวะมาที่ห้องยา</h2>
          <p>
            หากต้องการติดต่อด้วยตนเอง
            เจ้าหน้าที่พร้อมให้คำปรึกษาเรื่องยาและการใช้งานระบบ
          </p>
          <a class="visit-link" href="tel:036776240">
            โทรหากลุ่มงาน
            <ArrowUpRight :size="16" :stroke-width="1.8" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </section>

    <section class="faq-section rise-in" style="--delay: 200ms" aria-labelledby="faq-title">
      <header class="faq-head">
        <p class="eyebrow">
          Questions
        </p>
        <h2 id="faq-title">
          คำถาม<br>ที่พบบ่อย
        </h2>
        <p>
          รวมคำตอบเรื่องการติดต่อ การขอเอกสาร
          และการใช้งานระบบที่ทีมถามเข้ามาบ่อยที่สุด
        </p>
      </header>

      <div class="faq-list">
        <article
          v-for="(item, index) in faqItems"
          :key="item.question"
          class="faq-item"
          :class="{ 'is-open': openFaq === index }"
        >
          <button
            type="button"
            class="faq-trigger"
            :aria-expanded="openFaq === index"
            @click="toggleFaq(index)"
          >
            <span class="faq-no mono">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="faq-question">{{ item.question }}</span>
            <span class="faq-toggle" aria-hidden="true">
              <Plus :size="17" :stroke-width="1.8" />
            </span>
          </button>
          <div v-show="openFaq === index" class="faq-answer">
            <p>{{ item.answer }}</p>
          </div>
        </article>
      </div>
    </section>

    <footer class="dept-foot rise-in" style="--delay: 280ms">
      <p class="mono">
        Rx Room · กลุ่มงานเภสัชกรรม โรงพยาบาลสระโบสถ์
      </p>
      <button type="button" class="btn btn--solid" @click="navigateTo('/tools')">
        เปิดหน้ารวมเครื่องมือ
        <ArrowUpRight :size="16" :stroke-width="1.8" aria-hidden="true" />
      </button>
    </footer>
  </div>
</template>

<style scoped>
.department {
  width: min(100%, 1460px);
  margin: 0 auto;
  padding: clamp(1.5rem, 3vw, 3rem) clamp(1rem, 3.6vw, 3.25rem) 4.5rem;
}

.dept-head {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: end;
  gap: clamp(1.5rem, 4vw, 4rem);
  padding-bottom: clamp(1.4rem, 2.6vw, 2.2rem);
  border-bottom: 1px solid var(--ink);
}

.dept-head h1 {
  margin-top: 0.7rem;
  font-size: clamp(2.8rem, 6vw, 5.8rem);
  letter-spacing: -0.05em;
  line-height: 0.94;
}

.dept-head h1 span {
  color: var(--ink-3);
  font-weight: 300;
}

.dept-intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: 0.35rem;
}

.dept-intro p {
  max-width: 42ch;
  color: var(--ink-2);
  font-size: clamp(0.86rem, 1.05vw, 0.96rem);
  line-height: 1.75;
}

.dept-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.dept-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  grid-template-rows: auto 1fr;
  gap: clamp(0.8rem, 1.5vw, 1.2rem);
  margin-top: clamp(1.2rem, 2.4vw, 2rem);
}

.identity-card {
  position: relative;
  grid-row: span 2;
  display: flex;
  min-height: 540px;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(1.4rem, 2.6vw, 2.2rem);
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--bottle);
  color: var(--paper-raised);
}

.identity-art {
  position: absolute;
  top: -2rem;
  right: -3.5rem;
  width: min(78%, 430px);
  color: var(--paper-raised);
  opacity: 0.9;
}

.identity-copy {
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 28rem;
  flex-direction: column;
  margin-top: auto;
  padding-top: 15rem;
}

.identity-copy .eyebrow {
  color: rgb(251 250 245 / 0.55);
}

.identity-copy h2 {
  margin-top: 0.65rem;
  font-size: clamp(2rem, 3.6vw, 3.4rem);
  letter-spacing: -0.045em;
  line-height: 1.02;
}

.identity-copy p:not(.eyebrow) {
  max-width: 38ch;
  margin-top: 1rem;
  color: rgb(251 250 245 / 0.76);
  font-size: 0.82rem;
  line-height: 1.75;
}

.identity-mark {
  position: relative;
  z-index: 1;
  margin-top: 2rem;
  color: rgb(251 250 245 / 0.56);
  font-size: 0.56rem;
  letter-spacing: 0.14em;
}

.contact-stack {
  display: grid;
  gap: clamp(0.8rem, 1.5vw, 1.2rem);
}

.contact-row {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.contact-row:hover {
  border-color: var(--ink-3);
  transform: translateX(3px);
}

.contact-icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: var(--paper);
  color: var(--bottle);
}

.contact-row h2 {
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0;
}

.contact-row p,
.contact-row a {
  display: block;
  margin-top: 0.12rem;
  color: var(--ink);
  font-size: 0.84rem;
  line-height: 1.5;
}

.contact-row a {
  width: fit-content;
  border-bottom: 1px solid transparent;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.contact-row a:hover {
  border-color: var(--signal);
  color: var(--signal-deep);
}

.contact-row small {
  display: block;
  margin-top: 0.18rem;
  color: var(--ink-3);
  font-size: 0.64rem;
}

.visit-card {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 1rem;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--mint);
}

.map-art {
  position: relative;
  min-height: 210px;
  overflow: hidden;
  border-right: 1px solid rgb(13 59 49 / 0.14);
  background:
    linear-gradient(90deg, rgb(13 59 49 / 0.06) 1px, transparent 1px),
    linear-gradient(rgb(13 59 49 / 0.06) 1px, transparent 1px);
  background-size: 26px 26px;
}

.map-line {
  position: absolute;
  height: 8px;
  border-radius: var(--radius-pill);
  background: rgb(13 59 49 / 0.14);
}

.map-line--one {
  top: 24%;
  left: -8%;
  width: 80%;
  transform: rotate(14deg);
}

.map-line--two {
  top: 62%;
  left: 8%;
  width: 96%;
  transform: rotate(-11deg);
}

.map-line--three {
  top: 8%;
  right: 24%;
  width: 8px;
  height: 84%;
}

.map-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50% 50% 50% 0;
  background: var(--signal);
  transform: translate(-50%, -60%) rotate(-45deg);
  box-shadow: 0 10px 20px rgb(239 90 47 / 0.3);
}

.map-pin span {
  width: 0.7rem;
  height: 0.7rem;
  border: 2px solid var(--paper-raised);
  border-radius: 50%;
}

.map-label {
  position: absolute;
  bottom: 0.7rem;
  left: 0.8rem;
  color: rgb(13 59 49 / 0.5);
  font-size: 0.5rem;
  letter-spacing: 0.1em;
}

.visit-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 1.2rem 1.2rem 1.2rem 0.2rem;
}

.visit-copy .eyebrow {
  color: var(--ink-3);
}

.visit-copy h2 {
  margin-top: 0.5rem;
  font-size: 1.35rem;
}

.visit-copy p:not(.eyebrow) {
  margin-top: 0.5rem;
  color: var(--ink-2);
  font-size: 0.74rem;
  line-height: 1.65;
}

.visit-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.9rem;
  padding-bottom: 0.15rem;
  border-bottom: 1px solid var(--ink);
  font-size: 0.7rem;
  font-weight: 500;
  transition:
    gap 0.2s ease,
    color 0.2s ease;
}

.visit-link:hover {
  gap: 0.55rem;
  color: var(--signal-deep);
}

.faq-section {
  display: grid;
  grid-template-columns: minmax(0, 0.62fr) minmax(0, 1.38fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  margin-top: clamp(2rem, 4vw, 3.5rem);
  padding-top: clamp(1.2rem, 2.4vw, 2rem);
  border-top: 1px solid var(--ink);
}

.faq-head h2 {
  margin-top: 0.6rem;
  font-size: clamp(1.9rem, 3.4vw, 3rem);
  letter-spacing: -0.04em;
}

.faq-head p:not(.eyebrow) {
  max-width: 34ch;
  margin-top: 0.9rem;
  color: var(--ink-3);
  font-size: 0.8rem;
  line-height: 1.7;
}

.faq-list {
  border-top: 1px solid var(--line);
}

.faq-item {
  border-bottom: 1px solid var(--line);
}

.faq-trigger {
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr) 2rem;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1rem 0.2rem;
  border: 0;
  background: transparent;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease;
}

.faq-trigger:hover {
  color: var(--signal-deep);
}

.faq-no {
  color: var(--ink-3);
  font-size: 0.6rem;
}

.faq-question {
  font-size: clamp(0.86rem, 1vw, 0.96rem);
  font-weight: 500;
  line-height: 1.5;
}

.faq-toggle {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border: 1px solid var(--line);
  border-radius: 50%;
  transition:
    transform 0.25s var(--ease-out),
    background-color 0.2s ease,
    color 0.2s ease;
}

.faq-item.is-open .faq-toggle {
  background: var(--bottle);
  color: var(--paper-raised);
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 2.2rem 1.1rem 3rem;
}

.faq-answer p {
  max-width: 64ch;
  color: var(--ink-2);
  font-size: 0.82rem;
  line-height: 1.75;
}

.dept-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: clamp(2rem, 4vw, 3.5rem);
  padding-top: 1.2rem;
  border-top: 1px solid var(--line);
}

.dept-foot p {
  color: var(--ink-3);
  font-size: 0.56rem;
  letter-spacing: 0.06em;
}

@media (max-width: 980px) {
  .dept-head {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  .dept-grid {
    grid-template-columns: 1fr;
  }

  .identity-card {
    grid-row: auto;
    min-height: 460px;
  }

  .identity-copy {
    padding-top: 11rem;
  }

  .faq-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .department {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .dept-head h1 {
    font-size: clamp(2.5rem, 12vw, 3.4rem);
  }

  .identity-card {
    min-height: 420px;
  }

  .identity-art {
    top: -1rem;
    right: -4rem;
    width: 82%;
  }

  .identity-copy {
    padding-top: 9rem;
  }

  .identity-copy h2 {
    font-size: clamp(1.9rem, 9vw, 2.5rem);
  }

  .visit-card {
    grid-template-columns: 1fr;
  }

  .map-art {
    min-height: 150px;
    border-right: 0;
    border-bottom: 1px solid rgb(13 59 49 / 0.14);
  }

  .visit-copy {
    padding: 0.2rem 1.1rem 1.2rem;
  }

  .faq-answer {
    padding: 0 0.5rem 1.1rem 2.8rem;
  }

  .dept-foot {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
