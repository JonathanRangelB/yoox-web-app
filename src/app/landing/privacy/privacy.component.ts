import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: false,
  template: `
    <div class="privacy-container">
      <h1>AVISO DE PRIVACIDAD</h1>
      <p class="update-date">Última actualización: 6 de junio de 2025</p>

      <h2>1. Identidad del Responsable</h2>
      <p>
        Yoox Grupo Financiero, con domicilio en Guadalajara, Jalisco, México, es
        responsable del tratamiento de los datos personales que se recaben a
        través del sitio web www.yooxgrupofinanciero.com.
      </p>

      <h2>2. Datos Personales Recabados</h2>
      <p>Podremos recabar y tratar los siguientes datos personales:</p>
      <ul>
        <li>Nombre completo.</li>
        <li>Correo electrónico.</li>
        <li>Número telefónico.</li>
        <li>Dirección IP y datos de navegación.</li>
        <li>
          Información proporcionada en formularios o comunicaciones
          electrónicas.
        </li>
      </ul>

      <h2>3. Finalidades del Tratamiento de Datos</h2>
      <p>
        Los datos personales que recabamos serán utilizados para las siguientes
        finalidades:
      </p>
      <ul>
        <li>Brindar acceso a nuestros servicios.</li>
        <li>Dar seguimiento a solicitudes, consultas o comentarios.</li>
        <li>
          Enviar información relacionada con nuestros productos y servicios.
        </li>
        <li>Cumplir con obligaciones legales y contractuales.</li>
        <li>Mejorar la experiencia del usuario en nuestro sitio web.</li>
      </ul>

      <h2>4. Transferencia de Datos Personales</h2>
      <p>
        Yoox Grupo Financiero no compartirá ni transferirá tus datos personales
        a terceros sin tu consentimiento previo, salvo en los casos legalmente
        permitidos o cuando sea necesario para el cumplimiento de obligaciones
        contractuales o legales.
      </p>

      <h2>5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
      <p>
        Tienes derecho a acceder a tus datos personales, rectificarlos cuando
        sean inexactos, cancelarlos u oponerte a su tratamiento para fines
        específicos. Para ejercer estos derechos, puedes enviar una solicitud al
        correo: solucionesfinancieras&#64;gmail.com, acompañada de una
        identificación oficial.
      </p>

      <h2>8. Medidas de Seguridad</h2>
      <p>
        Yoox Grupo Financiero implementa medidas administrativas, técnicas y
        físicas para proteger tus datos personales contra daño, pérdida,
        alteración, destrucción o el uso, acceso o tratamiento no autorizado.
      </p>

      <h2>9. Cambios al Aviso de Privacidad</h2>
      <p>
        Nos reservamos el derecho de efectuar en cualquier momento
        modificaciones o actualizaciones al presente Aviso de Privacidad.
        Cualquier cambio será publicado en nuestro sitio web
        www.yooxgrupofinanciero.com. El uso continuado del sitio implica tu
        aceptación de dichos cambios.
      </p>

      <h2>10. Legislación Aplicable y Jurisdicción</h2>
      <p>
        Este Aviso de Privacidad se rige por las leyes aplicables en los Estados
        Unidos Mexicanos. Cualquier controversia será sometida a los tribunales
        competentes de Guadalajara, Jalisco, México.
      </p>

      <div class="contact-info">
        <h2>Contacto</h2>
        <p>
          Si tienes dudas o deseas más información sobre el tratamiento de tus
          datos personales, puedes contactarnos al correo electrónico:
          <strong>solucionesfinancieras&#64;gmail.com</strong>.
        </p>
      </div>
    </div>
  `,
  styles: `
    * {
      margin: 0 auto;
      padding: 0;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    body {
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .privacy-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      max-width: 800px;
      width: 100%;
    }

    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
    }

    .update-date {
      text-align: right;
      color: #7f8c8d;
      margin-bottom: 20px;
      font-size: 14px;
    }

    h2 {
      color: #2c3e50;
      margin: 20px 0 10px 0;
      font-size: 18px;
    }

    p,
    ul {
      color: #34495e;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    ul {
      padding-left: 20px;
    }

    li {
      margin-bottom: 5px;
    }

    .contact-info {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }

    @media (max-width: 600px) {
      .privacy-container {
        padding: 20px;
      }

      h1 {
        font-size: 20px;
      }

      h2 {
        font-size: 16px;
      }
    }
  `,
})
export class PrivacyComponent {}
