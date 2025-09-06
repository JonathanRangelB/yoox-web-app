import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: false,
})
export class LandingComponent {
  readonly #router = inject(Router);
  currentYear = new Date().getFullYear();

  carouselItems = [
    {
      imageUrl:
        'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      title: 'Créditos Personales',
    },
    {
      imageUrl:
        'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      title: 'Créditos Empresariales',
    },
    {
      imageUrl:
        'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      title: 'Créditos Hipotecarios',
    },
  ];

  constructor() {
    this.initAll();
  }

  initAll() {
    // Header scroll effect - Fixed for dark mode
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Video fallback handling
    document.addEventListener('DOMContentLoaded', function () {
      const video = document.querySelector('.hero-video') as HTMLVideoElement;
      const fallback = document.querySelector(
        '.hero-fallback'
      ) as HTMLHtmlElement;

      if (video && fallback) {
        // Set initial video opacity to 0 for smooth transition
        video.style.opacity = '0';
        video.style.transition = 'opacity 1s ease-in-out';

        // Show fallback initially
        fallback.style.opacity = '1';

        // Handle video load success
        video.addEventListener('canplay', function () {
          this.style.opacity = '1';
          fallback.style.opacity = '0';
        });

        // Handle video load error
        video.addEventListener('error', function () {
          this.style.display = 'none';
          fallback.style.opacity = '1';
        });

        // Timeout fallback in case video takes too long
        setTimeout(() => {
          if (video.readyState < 3) {
            // HAVE_FUTURE_DATA
            video.style.display = 'none';
            fallback.style.opacity = '1';
          }
        }, 5000);
      }
    });
  }

  navigateTo(path: string) {
    this.#router.navigate([path]);
  }
}
