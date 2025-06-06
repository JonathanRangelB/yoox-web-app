import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: false,
  template: `
    <div class="terms-container">
      <h1>TÉRMINOS Y CONDICIONES DE USO</h1>
      <p class="update-date">Última actualización: 6 de junio de 2025</p>

      <p>
        Bienvenido a
        <a href="http://www.yooxgrupofinanciero.com/" target="_blank"
          >www.yooxgrupofinanciero.com</a
        >. Al acceder y utilizar este sitio web, aceptas cumplir con los
        presentes Términos y Condiciones de Uso. Si no estás de acuerdo con
        ellos, te pedimos que no utilices nuestros servicios.
      </p>

      <h2>1. Identidad del Responsable del Sitio</h2>
      <p>
        Este sitio es operado por <strong>Yoox Grupo Financiero</strong>, con
        domicilio en Guadalajara, Jalisco, México. Para cualquier consulta
        relacionada con estos Términos y Condiciones, puedes contactarnos a
        través del correo electrónico: contacto&#64;yooxgrupofinanciero.com.
      </p>

      <h2>2. Protección y Uso de Datos Personales</h2>
      <p>
        Al utilizar nuestro sitio, podrías proporcionarnos datos personales
        como:
      </p>
      <ul>
        <li>Nombre completo, correo electrónico y número telefónico.</li>
        <li>Dirección IP, datos de navegación y cookies.</li>
        <li>
          Información adicional contenida en formularios o comunicaciones que
          nos envíes.
        </li>
      </ul>

      <p>
        Dichos datos serán tratados de manera confidencial y utilizados
        exclusivamente para los siguientes fines:
      </p>
      <ul>
        <li>Gestión de usuarios y cuentas.</li>
        <li>
          Envío de comunicaciones informativas o promocionales relacionadas con
          nuestros servicios.
        </li>
        <li>Mejora continua del contenido y servicios ofrecidos.</li>
        <li>Cumplimiento de obligaciones legales y regulatorias.</li>
      </ul>

      <p><strong>Nos comprometemos a:</strong></p>
      <ul>
        <li>
          No vender, alquilar ni compartir tus datos con terceros no
          autorizados.
        </li>
        <li>
          Almacenar tu información en servidores seguros bajo medidas de
          protección tecnológica.
        </li>
        <li>
          Facilitar el acceso, rectificación, cancelación u oposición de tus
          datos personales previa solicitud formal.
        </li>
      </ul>

      <p>
        Para más detalles sobre el tratamiento de tus datos personales, te
        invitamos a consultar nuestro
        <a href="#">Aviso de Privacidad</a> disponible en el sitio web.
      </p>

      <h2>3. Consentimiento del Usuario</h2>
      <p>
        Al ingresar tus datos en nuestros formularios o continuar navegando en
        el sitio, otorgas tu consentimiento expreso para el tratamiento de tu
        información conforme a la normativa vigente en materia de protección de
        datos personales aplicable en México.
      </p>

      <h2>4. Uso Aceptable del Sitio</h2>
      <p>
        El usuario se compromete a utilizar este sitio exclusivamente con fines
        lícitos y personales. Queda estrictamente prohibido:
      </p>
      <ul>
        <li>
          Realizar actividades que puedan afectar el funcionamiento, seguridad o
          integridad del sitio.
        </li>
        <li>
          Acceder sin autorización a sistemas informáticos, bases de datos o
          cuentas de otros usuarios.
        </li>
        <li>
          Cargar, enviar o difundir contenido malicioso, difamatorio, ofensivo o
          que infrinja derechos de terceros.
        </li>
      </ul>

      <h2>5. Propiedad Intelectual</h2>
      <p>
        Todos los contenidos disponibles en este sitio, incluyendo pero no
        limitándose a textos, gráficos, logotipos, imágenes, códigos fuente y
        diseños, son propiedad exclusiva de
        <strong>Yoox Grupo Financiero</strong> o de sus respectivos
        licenciatarios.
      </p>
      <p>
        Está prohibida su reproducción, distribución, modificación, adaptación o
        uso para fines comerciales sin la autorización previa y por escrito de
        la empresa.
      </p>

      <h2>6. Modificaciones a los Términos y Condiciones</h2>
      <p>
        <strong>Yoox Grupo Financiero</strong> se reserva el derecho de
        modificar total o parcialmente estos Términos y Condiciones en cualquier
        momento. Cualquier cambio será publicado en este mismo sitio web. El uso
        continuado del sitio después de la publicación de los cambios implica la
        aceptación de los nuevos términos.
      </p>

      <h2>7. Legislación Aplicable y Jurisdicción</h2>
      <p>
        Estos Términos y Condiciones se rigen por las leyes aplicables en los
        Estados Unidos Mexicanos. Para cualquier controversia relacionada con la
        interpretación o cumplimiento de los mismos, las partes se someten a la
        jurisdicción de los tribunales competentes en Guadalajara, Jalisco,
        México, renunciando a cualquier otro fuero que pudiera corresponderles
        por razón de su domicilio presente o futuro.
      </p>

      <h2>8. Responsabilidad Limitada</h2>
      <p>
        <strong>Yoox Grupo Financiero</strong> no será responsable por daños o
        perjuicios que puedan derivarse del uso indebido del sitio web,
        interrupciones en el servicio, accesos no autorizados, ni por cualquier
        virus o componente dañino que pudiera afectar tu dispositivo.
      </p>
      <p>
        El usuario accede y utiliza el sitio bajo su propia responsabilidad.
      </p>

      <h2>9. Vigencia</h2>
      <p>
        Los presentes Términos y Condiciones estarán vigentes a partir de su
        última actualización, el <strong>6 de junio de 2025</strong>, y
        permanecerán en efecto mientras el sitio continúe activo o hasta que
        sean modificados oficialmente.
      </p>
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

    .terms-container {
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

    a {
      color: #2980b9;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .terms-container {
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
export class TermsComponent {}
