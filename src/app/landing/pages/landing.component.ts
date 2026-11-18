import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NgParticlesService } from '@tsparticles/angular';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

interface TermOption {
  weeks: number;
  rate: number;
  label: string;
}

interface ProductFeature {
  text: string;
}

interface Product {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: ProductFeature[];
  exampleAmount: string;
  exampleTerm: string;
  examplePayment: string;
  exampleRate: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  title: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: false,
})
export class LandingComponent implements OnInit, OnDestroy {
  readonly #router = inject(Router);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #particlesService = inject(NgParticlesService);
  currentYear = new Date().getFullYear();
  scrolled = signal(false);

  readonly particlesId = 'tsparticles';
  readonly particlesOptions: ISourceOptions = {
    fullScreen: { enable: false },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: ['#ffffff', '#93c5fd'],
      },
      links: {
        color: '#93c5fd',
        distance: 130,
        enable: true,
        opacity: 0.12,
        width: 0.8,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: true,
        speed: 0.7,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 800,
          height: 800,
        },
        value: 30,
      },
      opacity: {
        value: { min: 0.2, max: 0.45 },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1.5, max: 3.5 },
      },
    },
    detectRetina: true,
  };

  readonly terms: TermOption[] = [
    { weeks: 14, rate: 0.4, label: '14 semanas' },
    { weeks: 28, rate: 0.82, label: '28 semanas' },
  ];

  // Hero calculator
  loanAmount = signal(25000);
  selectedTermIndex = signal(0);

  selectedTerm = computed(() => this.terms[this.selectedTermIndex()]);
  totalPayment = computed(() =>
    Math.round(this.loanAmount() * (1 + this.selectedTerm().rate))
  );
  interestAmount = computed(() =>
    Math.round(this.loanAmount() * this.selectedTerm().rate)
  );
  weeklyPayment = computed(() =>
    Math.round(this.totalPayment() / this.selectedTerm().weeks)
  );

  whatsappUrl = computed(() => {
    const amount = this.formatMoney(this.loanAmount());
    const weeks = this.selectedTerm().weeks;
    const text = `Hola, estoy interesado en un préstamo de ${amount} a ${weeks} semanas. ¿Me pueden ayudar con más información?`;
    return `https://wa.me/523321532540?text=${encodeURIComponent(text)}`;
  });

  readonly products: Product[] = [
    {
      id: 'personal',
      title: 'Préstamo Personal',
      icon: 'fa-user',
      description:
        'Financia tus proyectos personales, viajes, educación o consolidación de deudas con condiciones flexibles.',
      features: [
        { text: 'Montos desde $1,000' },
        { text: 'Plazos de 14 a 28 semanas' },
        { text: 'Tasa fija desde 40% sobre el monto' },
        { text: 'Respuesta en 24 horas' },
      ],
      exampleAmount: '$25,000',
      exampleTerm: '24 semanas',
      examplePayment: '$1,625',
      exampleRate: '56%',
    },
    {
      id: 'empresarial',
      title: 'Préstamo Empresarial',
      icon: 'fa-briefcase',
      description:
        'Impulsa el crecimiento de tu negocio con capital de trabajo, maquinaria o expansión.',
      features: [
        { text: 'Montos desde $1,000 hasta $150,000' },
        { text: 'Plazos de 12 semanas' },
        { text: 'Tasa fija desde 40% sobre el monto' },
        { text: 'Respuesta en 24 horas' },
        { text: 'Asesoría contable y financiera' },
      ],
      exampleAmount: '$50,000',
      exampleTerm: '24 semanas',
      examplePayment: '$3,250',
      exampleRate: '56%',
    },
  ];
  activeProduct = signal('personal');

  readonly testimonials: Testimonial[] = [
    {
      quote:
        'Desde el primer momento me atendieron con mucha amabilidad. El personal fue atento, paciente y siempre estuvo dispuesto a resolver mis dudas. Muy buena atención.',
      name: 'María G.',
      role: 'Cliente personal',
      title: 'Amabilidad del personal',
    },
    {
      quote:
        'Me gustó que desde el inicio me explicaron claramente cuánto iba a pagar, el plazo y los intereses. Todo fue transparente y fácil de entender, sin sorpresas.',
      name: 'Carlos R.',
      role: 'Agente de cobros',
      title: 'Claridad en pagos, plazos e intereses',
    },
    {
      quote:
        'El proceso fue rápido y sencillo. Me dieron respuesta en poco tiempo y todo el trámite fue muy ágil. Una excelente opción cuando buscas un crédito sin tantas complicaciones.',
      name: 'Ana L.',
      role: 'Emprendedora',
      title: 'Agilidad en el proceso',
    },
  ];
  currentTestimonial = signal(0);
  #rotationInterval: ReturnType<typeof setInterval> | null = null;

  readonly faqItems: FaqItem[] = [
    {
      question: '¿Qué documentación necesito para solicitar un préstamo?',
      answer:
        'Para la mayoría de nuestros préstamos necesitarás: identificación oficial vigente, comprobante de domicilio reciente, comprobante de ingresos. Los requisitos específicos varían según el tipo de préstamo.',
    },
    {
      question: '¿Cuánto tiempo tarda la aprobación del préstamo?',
      answer:
        'La aprobación preliminar toma menos de 24 horas en el 90% de los casos. Una vez aprobado, el desembolso de fondos se realiza en 2-5 dias hábiles, el tiempo de espera arranca una vez capturada la solicitud.',
    },
    {
      question: '¿La consulta afecta mi score crediticio?',
      answer:
        'No, nuestra consulta inicial es un "soft pull" que no afecta tu score crediticio. Solo realizamos una consulta completa cuando tú decides continuar con la solicitud formal.',
    },
    {
      question: '¿Puedo liquidar mi préstamo anticipadamente?',
      answer:
        'Sí, todos nuestros préstamos permiten prepago anticipado sin penalizaciones ni cargos adicionales. Puedes abonar capital extra en cualquier momento y reducir el plazo o la cuota.',
    },
    {
      question: '¿Que requisitos necesito para solicitar mi préstamo?',
      answer:
        'Evaluamos cada solicitud de manera integral. Si tienes historial crediticio limitado, consideramos otros factores como estabilidad laboral, ingresos y referencias personales.',
    },
  ];
  activeFaq = signal<number | null>(null);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (isPlatformBrowser(this.#platformId)) {
      this.scrolled.set(window.scrollY > 50);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.#platformId)) {
      void this.#particlesService.init(async (engine) => {
        await loadSlim(engine);
      });
      this.#rotationInterval = setInterval(() => this.nextTestimonial(), 6000);
    }
  }

  ngOnDestroy(): void {
    if (this.#rotationInterval) {
      clearInterval(this.#rotationInterval);
    }
  }

  navigateTo(path: string): void {
    this.#router.navigate([path]);
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatRate(rate: number): string {
    return `${Math.round(rate * 100)}%`;
  }

  selectTerm(index: number): void {
    this.selectedTermIndex.set(index);
  }

  updateLoanAmount(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.loanAmount.set(Number(input.value));
  }

  nextTestimonial(): void {
    this.currentTestimonial.update((i) =>
      i >= this.testimonials.length - 1 ? 0 : i + 1
    );
  }

  previousTestimonial(): void {
    this.currentTestimonial.update((i) =>
      i <= 0 ? this.testimonials.length - 1 : i - 1
    );
  }

  goToTestimonial(index: number): void {
    this.currentTestimonial.set(index);
  }

  toggleFaq(index: number): void {
    this.activeFaq.update((current) => (current === index ? null : index));
  }
}
