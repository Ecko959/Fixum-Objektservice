/**
 * Die Ablaufkette der Startseite als Parallax-Scroll-Sequenz.
 *
 * Technik und Bewegung folgen der Vorlage "parallax-scroll-feature-section":
 * Text und quadratisches Bild mittig nebeneinander, die Seiten wechseln von
 * Zeile zu Zeile. Drei Werte hängen am Scrollfortschritt:
 *
 *   opacity   0 -> 1                              über [0, 0.7]
 *   clipPath  inset(0 100% 0 0) -> inset(0 0 0 0) über [0, 0.7]
 *   y         -50 -> 0                            über [0, 1]
 *
 * Der y-Wert liegt sowohl auf dem Textblock als auch noch einmal auf dem
 * Absatz darin. Transformationen verschachteln sich, der Absatz läuft also
 * doppelt so weit - das ist der Versatz zwischen Überschrift und Fließtext.
 *
 * Gestaltung aus dem Design der Seite statt aus der Vorlage: Amber-Kreis mit
 * Schrittnummer wie im Ablauf der Ortsseiten, Navy-Verlauf mit blauem Schein
 * für die Anfragekarte wie im CTA-Band, Schreibschrift als Akzent.
 *
 * Drei Dinge weichen bewusst von der Vorlage ab:
 *
 * 1. Auf dem Handy stehen Bild und Text untereinander, das Bild füllt die
 *    Breite. Ein festes Quadrat neben Text passt auf 390 px nicht.
 *
 * 2. Bei prefers-reduced-motion und ohne JavaScript ist der Ausgangszustand
 *    der fertige. Die Vorlage startet mit opacity 0 und vollem clip - ohne
 *    Hydration bliebe die Sektion sonst dauerhaft leer.
 *
 * 3. Die Zeilen sind nicht bildschirmhoch. Der Scrollweg für den vollen
 *    Effektverlauf ist Fensterhöhe plus halbe Zeilenhöhe; die Fensterhöhe
 *    dominiert, die Animation verliert dadurch nichts.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";

export type AblaufSchritt = {
  titel: string;
  text: string;
  /** Fertige Bild-URL. Erzeugt astro:assets, übergibt die Astro-Seite. */
  bild: string;
  alt: string;
};

type Props = {
  steps: AblaufSchritt[];
  telHref: string;
  whatsappHref: string;
};

/**
 * Wahr, sobald die Animation laufen darf: breiter Viewport, echter Zeiger,
 * keine reduzierte Bewegung. Startet mit false, damit Server und erster
 * Client-Durchlauf dasselbe ergeben.
 */
function useAnimationErlaubt() {
  const reduziert = useReducedMotion();
  const [breit, setBreit] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px) and (pointer: fine)");
    const lies = () => setBreit(mq.matches);
    lies();
    mq.addEventListener("change", lies);
    return () => mq.removeEventListener("change", lies);
  }, []);

  return breit && !reduziert;
}

function Schritt({
  schritt,
  index,
  gesamt,
  animiert,
}: {
  schritt: AblaufSchritt;
  index: number;
  gesamt: number;
  animiert: boolean;
}) {
  const bereich = useRef<HTMLDivElement>(null);

  /* Wie in der Vorlage: von "Oberkante erreicht den unteren Fensterrand" bis
     "Mitte erreicht den oberen Fensterrand". Ein langer Weg, deshalb läuft
     die Aufdeckung ruhig statt sprunghaft. */
  const { scrollYProgress } = useScroll({
    target: bereich,
    offset: ["start end", "center start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const clip = useTransform(
    scrollYProgress,
    [0, 0.7],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);

  const gespiegelt = index % 2 === 1;
  const nummer = String(index + 1).padStart(2, "0");
  const letzter = index === gesamt - 1;

  return (
    <div
      className={[
        "relative flex flex-col items-center justify-center gap-8",
        "sm:gap-10",
        "md:min-h-[clamp(30rem,68vh,42rem)] md:flex-row md:gap-20 md:py-8 lg:gap-28",
        gespiegelt ? "md:flex-row-reverse" : "",
      ].join(" ")}
      ref={bereich}
    >
      {/* Textspalte */}
      <motion.div
        style={animiert ? { y } : undefined}
        className="w-full md:max-w-sm"
      >
        {/* Schrittmarke: Amber-Kreis plus Linie, wie im Ablauf der Ortsseiten */}
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-amber font-utility text-sm font-bold text-navy-deep">
            {nummer}
          </span>
          <span
            aria-hidden="true"
            className="h-px w-10 bg-gradient-to-r from-amber to-transparent"
          />
        </div>

        <h3 className="mt-4 font-display text-[1.75rem] font-extrabold leading-[1.1] text-navy sm:text-4xl md:text-5xl lg:text-6xl">
          {schritt.titel}
        </h3>
        <motion.p
          style={animiert ? { y } : undefined}
          className="mt-4 text-base leading-relaxed text-muted md:mt-8"
        >
          {schritt.text}
        </motion.p>
      </motion.div>

      {/* Bildspalte. Der Akzentblock liegt innerhalb der animierten Fläche,
          er wird also mit aufgedeckt statt vorweg sichtbar zu sein. */}
      <motion.div
        style={animiert ? { opacity, clipPath: clip } : undefined}
        className="relative w-full shrink-0 md:w-auto"
      >
        <span
          aria-hidden="true"
          className="absolute -bottom-3 -right-3 hidden rounded-2xl border border-blue/25 md:block md:size-[24rem] lg:size-[26rem]"
        />
        <img
          src={schritt.bild}
          alt={schritt.alt}
          width={832}
          height={832}
          loading="lazy"
          decoding="async"
          className="relative aspect-square w-full rounded-2xl object-cover shadow-[0_18px_50px_-24px_rgba(19,42,92,0.45)] md:size-[24rem] lg:size-[26rem]"
        />
      </motion.div>

      {/* Verbindung zum nächsten Schritt - macht aus vier Bildern eine Kette.
          Nur auf dem Handy, wo die Schritte wirklich untereinander stehen. */}
      {!letzter && (
        <span
          aria-hidden="true"
          className="h-10 w-px bg-gradient-to-b from-[#c6d5ea] to-transparent md:hidden"
        />
      )}
    </div>
  );
}

export default function AblaufScroll({ steps, telHref, whatsappHref }: Props) {
  const animiert = useAnimationErlaubt();

  return (
    <div className="flex flex-col">
      {steps.map((schritt, i) => (
        <Schritt
          key={schritt.titel}
          schritt={schritt}
          index={i}
          gesamt={steps.length}
          animiert={animiert}
        />
      ))}

      {/* Anfragekarte auf Navy, wie das CTA-Band am Seitenende */}
      <div className="relative mt-12 overflow-hidden rounded-[26px] bg-gradient-to-b from-navy-deep to-navy-mid px-6 py-10 text-center md:mt-16 md:px-10 md:py-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-1/2 h-[420px] bg-[radial-gradient(50%_100%_at_50%_100%,rgba(31,122,224,0.38),transparent_70%)]"
        />
        <div className="relative">
          <p className="font-script text-xl text-blue-light md:text-2xl">
            Ein Anruf genügt
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-white md:text-4xl">
            Kostenlose Besichtigung anfragen
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#d3e3f9]">
            Sie schildern kurz, worum es geht. Wir schauen uns das Objekt an und
            nennen danach einen Festpreis, der schriftlich gilt.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 font-utility text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-blue-bright"
            >
              <Phone size={17} aria-hidden="true" />
              Jetzt anrufen
            </a>
            <a
              href={whatsappHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-utility text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/60 hover:bg-white/5"
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp schreiben
            </a>
          </div>

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-utility text-[0.8125rem] font-semibold uppercase tracking-[0.07em] text-[#d3e3f9]">
            <span className="inline-flex items-center gap-1.5">
              <ArrowRight size={14} aria-hidden="true" className="text-amber" />
              Besichtigung kostenlos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowRight size={14} aria-hidden="true" className="text-amber" />
              Festpreis schriftlich
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
