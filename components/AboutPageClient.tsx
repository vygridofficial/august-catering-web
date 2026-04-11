'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Award, Users, Clock, ChefHat, Star } from 'lucide-react';
import Image from 'next/image';

const STATS = [
  { icon: Clock, value: '21+', label: 'Years of Excellence' },
  { icon: Users, value: '5000+', label: 'Satisfied Clients' },
  { icon: ChefHat, value: '30+', label: 'Expert Chefs' },
  { icon: Star, value: '4.7★', label: 'Average Rating' },
];

const MILESTONES = [
  { year: '2003', title: 'Founded', desc: 'Gateway Kitchen was founded in Thiruvaniyoor, Ernakulam with a vision to elevate Kerala catering.' },
  { year: '2008', title: 'First Grand Wedding', desc: 'We catered our first 500-guest wedding, setting a new standard for premium Kerala catering.' },
  { year: '2012', title: 'Corporate Expansion', desc: 'Launched our corporate catering division, serving Tech Mahindra, InfoSys, and leading firms in Kochi.' },
  { year: '2018', title: 'Multi-Cuisine Launch', desc: 'Expanded our menu to include Continental, Chinese and Fusion cuisines alongside our authentic Kerala dishes.' },
  { year: '2024', title: 'Award for Excellence', desc: 'Awarded "Best Catering Service in Ernakulam" for three consecutive years by leading event management firms.' },
];

const FAQS = [
  {
    question: 'What kind of food does Gateway Kitchen Catering Service serve?',
    answer: 'Gateway Kitchen Catering Service in Thiruvaniyoor is dedicated to making food that suits your palate. So, please inform them about your guests\' preferences, religious dietary restrictions, and allergies if any in advance.',
  },
  {
    question: 'For what kind of occasions can I hire Gateway Kitchen Catering Service?',
    answer: 'You can hire Gateway Kitchen Catering Service in Ernakulam for various occasions such as birthdays, anniversaries, ceremonies, religious occasions & festivities, month\'s mind, etc.',
  },
  {
    question: 'Will Gateway Kitchen Catering Service be able to fully customise my menu?',
    answer: 'Please speak with Gateway Kitchen Catering Service to fully understand their offerings and menu. They will try their best to match your taste and preference. But, you must have a discussion with them seeking clarity regarding this.',
  },
  {
    question: 'Do I need to book the caterers in advance?',
    answer: 'As is the case with most caterers, bookings work on a first-come, first-serve basis. So, to avoid any disappointment, contact them as soon as you have confirmed your date, venue, guest count, etc.',
  },
  {
    question: 'What are the operational hours of Gateway Kitchen Catering Service?',
    answer: 'Gateway Kitchen Catering Service is open during Monday:- 6:00 am - 11:00 pm, Tuesday:- 6:00 am - 11:00 pm, Wednesday:- 6:00 am - 11:00 pm, Thursday:- 6:00 am - 11:00 pm, Friday:- 6:00 am - 11:00 pm, Saturday:- 6:00 am - 11:00 pm, Sunday:- 6:00 am - 11:00 pm.',
  },
  {
    question: 'What is the maximum number of guests they can cater to?',
    answer: 'Please check with the caterers regarding this if you intend on inviting a large crowd.',
  },
];

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 18 } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export function AboutPageClient() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <svg className="w-full h-full"><filter id="noiseAbout"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseAbout)"/></svg>
        </div>
        <motion.div
           className="absolute top-8 left-0 right-0 text-center opacity-[0.04] pointer-events-none select-none"
           animate={{ x: [0, -20, 0] }}
           transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <span className="text-[18vw] font-heading font-black uppercase whitespace-nowrap">GATEWAY KITCHEN</span>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.p variants={item} className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-6">Our Story</motion.p>
            <motion.h1 variants={item} className="text-4xl md:text-6xl lg:text-8xl font-heading font-extrabold tracking-tighter leading-[1] text-balance">
              The Art of <span className="text-primary italic">Gastronomy.</span>
            </motion.h1>
            <motion.p variants={item} className="mt-8 text-xl text-background/70 font-light leading-relaxed max-w-2xl">
              For over two decades, Gateway Kitchen has been transforming gatherings into unforgettable culinary experiences. Based in Thiruvaniyoor, Ernakulam, we are the trusted name in premium catering across Kerala.
            </motion.p>
            <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                  Contact Us →
                </button>
              </Link>
              <Link href="/menu">
                <button className="px-6 py-3 sm:px-8 sm:py-4 border border-background/20 text-background rounded-full font-medium text-sm sm:text-base hover:bg-white/10 transition-all">
                  View Our Menu
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={item} className="text-center p-8 rounded-[2rem] bg-secondary/40 border border-border">
                <stat.icon className="mx-auto mb-4 text-primary" size={32} />
                <p className="text-4xl md:text-5xl font-heading font-extrabold text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight">
                Food That <span className="text-primary italic">Tells a Story.</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground font-light leading-relaxed">
                At Gateway Kitchen, we believe every meal is a narrative. Our skilled chefs blend traditional Kerala techniques with global influences to create dishes that don&apos;t just satisfy the palate — they elevate the entire occasion.
              </p>
              <p className="mt-4 text-lg text-muted-foreground font-light leading-relaxed">
                Whether it&apos;s an intimate family gathering of 20 or a grand corporate gala for 2000, our commitment to quality, freshness, and presentation never wavers.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Wedding Catering', 'Corporate Events', 'Birthday Parties', 'Private Dining', 'Cultural Feasts'].map(tag => (
                  <span key={tag} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">{tag}</span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-primary/20"
            >
              <Image
                src="/images/gateway-kitchen-catering-service-venkida-ernakulam-caterers-cdy4hpmdwh.webp"
                alt="Food that tells a story"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-3">Food That Tells a Story</p>
                <p className="text-2xl md:text-3xl font-heading font-bold leading-tight">Crafted plates. Real emotion. Memorable tables.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      {/* <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">Our Journey</p>
            <h2 className="text-4xl md:text-6xl font-heading font-bold">
              Milestones That <span className="text-primary italic">Matter.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              This timeline highlights the key moments that shaped Gateway Kitchen into a trusted name for weddings, corporate events, and large-scale celebrations.
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border" />
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative flex items-start gap-8 mb-16 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1 p-6 rounded-[2rem] bg-secondary/40 border border-border hover:border-primary/30 transition-colors">
                  <p className="text-primary font-black text-2xl font-heading">{m.year}</p>
                  <h3 className="text-xl font-heading font-bold text-foreground mt-1">{m.title}</h3>
                  <p className="text-muted-foreground mt-2 font-light">{m.desc}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">Frequently Asked Questions</p>
            <h2 className="text-4xl md:text-6xl font-heading font-bold">
              Common Questions <span className="text-primary italic">Answered.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Here are a few useful details about the way we work, what we serve, and how bookings are handled.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {FAQS.map((faq, index) => (
              <motion.details
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-[2rem] border border-border bg-background/70 backdrop-blur-xl p-6 shadow-sm open:shadow-md"
              >
                <summary className="cursor-pointer list-none font-heading font-bold text-lg text-foreground flex items-center justify-between gap-4">
                  <span className="pr-4">{faq.question}</span>
                  <span className="text-primary text-2xl leading-none group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="mx-auto mb-6 text-primary" size={48} />
            <h2 className="text-4xl md:text-6xl font-heading font-bold">Ready to Create a <span className="text-primary italic">Memory?</span></h2>
            <p className="mt-6 text-xl text-background/60 font-light max-w-2xl mx-auto">
              Let Gateway Kitchen transform your next event into an unforgettable experience. Reach out to our team today.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <button className="px-6 py-3.5 sm:px-10 sm:py-5 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-sm sm:text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                  Contact Us →
                </button>
              </Link>
              <Link href="/services">
                <button className="px-6 py-3.5 sm:px-10 sm:py-5 border border-background/20 text-background rounded-full font-medium text-sm sm:text-lg hover:bg-white/10 transition-all">
                  Our Services
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
