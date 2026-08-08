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
  currentYear = new Date().getFullYear();
  scrolled = signal(false);

  readonly terms: TermOption[] = [
    { weeks: 14, rate: 0.4, label: '14 semanas' },
    { weeks: 24, rate: 0.56, label: '24 semanas' },
    { weeks: 28, rate: 0.82, label: '28 semanas' },
    { weeks: 35, rate: 1.1, label: '35 semanas' },
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
    return `https://wa.me/523315757197?text=${encodeURIComponent(text)}`;
  });

  readonly products: Product[] = [
    {
      id: 'personal',
      title: 'Préstamo Personal',
      icon: 'fa-user',
      description:
        'Financia tus proyectos personales, viajes, educación o consolidación de deudas con condiciones flexibles.',
      features: [
        { text: 'Montos desde $1,000 hasta lo que necesites' },
        { text: 'Plazos de 14 a 35 semanas' },
        { text: 'Tasa fija desde 40% sobre el monto' },
        { text: 'Desembolso en 24 horas' },
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
        { text: 'Montos desde $1,000 hasta lo que necesites' },
        { text: 'Plazos de 14 a 35 semanas' },
        { text: 'Tasa fija desde 40% sobre el monto' },
        { text: 'Desembolso en 24 horas' },
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
        'YOOX me ayudó a consolidar mis deudas en un solo préstamo con pagos semanales que puedo cumplir. El proceso fue rápido y transparente.',
      name: 'María G.',
      role: 'Cliente personal',
    },
    {
      quote:
        'Como agente, la plataforma me permite dar seguimiento claro a cada solicitud. Mis clientes valoran la claridad de los números.',
      name: 'Carlos R.',
      role: 'Agente de cobros',
    },
    {
      quote:
        'En menos de 24 horas tuve el capital para mi negocio. Las cuotas semanales se ajustan perfecto a mi flujo de efectivo.',
      name: 'Ana L.',
      role: 'Emprendedora',
    },
  ];
  currentTestimonial = signal(0);
  #rotationInterval: ReturnType<typeof setInterval> | null = null;

  readonly faqItems: FaqItem[] = [
    {
      question: '¿Qué documentación necesito para solicitar un préstamo?',
      answer:
        'Para la mayoría de nuestros préstamos necesitarás: identificación oficial vigente, comprobante de domicilio reciente, comprobante de ingresos (últimos 3 meses) y estado de cuenta bancario. Los requisitos específicos varían según el tipo de préstamo.',
    },
    {
      question: '¿Cuánto tiempo tarda la aprobación del préstamo?',
      answer:
        'La aprobación preliminar toma menos de 24 horas en el 90% de los casos. Una vez aprobado, el desembolso de fondos se realiza en 24-48 horas hábiles, dependiendo del producto financiero seleccionado.',
    },
    {
      question: '¿La consulta afecta mi score crediticio?',
      answer:
        'No, nuestra consulta inicial es un "soft pull" que no afecta tu score crediticio. Solo realizamos una consulta completa cuando tú decides continuar con la solicitud formal.',
    },
    {
      question: '¿Puedo pagar mi préstamo anticipadamente?',
      answer:
        'Sí, todos nuestros préstamos permiten prepago anticipado sin penalizaciones ni cargos adicionales. Puedes abonar capital extra en cualquier momento y reducir el plazo o la cuota.',
    },
    {
      question: '¿Qué pasa si tengo un historial crediticio limitado?',
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
