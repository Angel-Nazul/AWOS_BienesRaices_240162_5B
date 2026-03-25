import nodemailer from 'nodemailer'

// Configuración centralizada del transporte
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Función auxiliar para estilos comunes (Arcane + Rojo/Negro)
const getEmailStyles = () => {
  return `
    body {
      margin: 0;
      padding: 0;
      background-color: #0a0a0a;
      font-family: 'Courier New', 'Garamond', 'Georgia', monospace;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #0f0f0f;
      border-radius: 12px;
      border: 1px solid #d32f2f;
      box-shadow: 0 0 20px rgba(211, 47, 47, 0.2);
      overflow: hidden;
    }
    .header {
      background: #1a1a1a;
      padding: 20px;
      text-align: center;
      border-bottom: 2px solid #d32f2f;
    }
    .header h1 {
      margin: 0;
      color: #d32f2f;
      font-size: 28px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .header p {
      margin: 5px 0 0;
      color: #aaa;
      font-size: 12px;
    }
    .content {
      padding: 30px 20px;
      color: #e0e0e0;
      font-size: 16px;
      line-height: 1.5;
    }
    .content strong {
      color: #d32f2f;
    }
    .button {
      display: inline-block;
      background: #d32f2f;
      color: #fff !important;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 30px;
      font-weight: bold;
      margin: 20px 0;
      border: none;
      transition: background 0.3s;
      font-family: inherit;
    }
    .button:hover {
      background: #b71c1c;
    }
    .footer {
      background: #0a0a0a;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #222;
    }
    .arcane-symbol {
      font-size: 24px;
      margin: 10px 0;
      color: #d32f2f;
      text-align: center;
      letter-spacing: 4px;
    }
    a {
      color: #d32f2f;
      text-decoration: none;
    }
    hr {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent, #d32f2f, transparent);
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 10px;
      }
      .content {
        padding: 20px;
      }
    }
  `
}

// Email de registro (confirmación de cuenta)
const emailRegistro = async (datos) => {
  const transport = createTransporter()
  const { email, nombre, token } = datos

  await transport.sendMail({
    from: 'BienesRaices - Sistema Hextech <no-reply@bienesraices.com>',
    to: email,
    subject: '⚡ Bienvenido a la Orden de Bienes Raíces – Confirma tu cuenta ⚡',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${getEmailStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏛️ BIENES RAÍCES</h1>
            <p>▐  Hextech Realty  ▐</p>
          </div>
          <div class="content">
            <p>Hola, <strong>${nombre}</strong>.</p>
            <div class="arcane-symbol">⛧ ◈ ⚡ ◈ ⛧</div>
            <p>Tu cuenta ha sido inscrita en los registros arcanos. Para activar tu acceso al <strong>Hexgate</strong> de propiedades, solo falta un paso:</p>
            <hr>
            <p style="text-align: center;">
              <a href="localhost:${process.env.PORT}/auth/confirma/${token}" class="button">✨ Confirmar cuenta ✨</a>
            </p>
            <p>Si no has solicitado este vínculo, ignora este mensaje. Los archivos de la ciudad subterránea no serán afectados.</p>
            <p><em>"La magia es evolución, la propiedad es poder."</em></p>
          </div>
          <div class="footer">
            BienesRaíces – Matrícula Hextech<br>
            Este es un mensaje automático, por favor no responder.
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

// Email para restablecer contraseña
const emailResetearPassword = async (datos) => {
  const transport = createTransporter()
  const { email, nombre, token } = datos

  await transport.sendMail({
    from: 'BienesRaices - Guardián de Llaves <no-reply@bienesraices.com>',
    to: email,
    subject: '🔮 Restauración de acceso – Arcane Security 🔮',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${getEmailStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 RESTABLECER CONTRASEÑA</h1>
            <p>▐  Protocolo Hextech  ▐</p>
          </div>
          <div class="content">
            <p>Hola, <strong>${nombre}</strong>.</p>
            <div class="arcane-symbol">⚡ ⟡ ✦ ⟡ ⚡</div>
            <p>Hemos recibido una solicitud de restauración de acceso. Si fuiste tú, utiliza el siguiente enlace para crear una nueva clave de acceso:</p>
            <hr>
            <p style="text-align: center;">
              <a href="localhost:${process.env.PORT}/auth/actualizarPassword/${token}" class="button">⚙️ Restablecer contraseña ⚙️</a>
            </p>
            <p>Si no realizaste esta petición, simplemente ignora este correo. Tu cuenta permanece bajo la protección de los runas de Zaun.</p>
            <p><em>"El conocimiento es el arma más poderosa."</em></p>
          </div>
          <div class="footer">
            BienesRaíces – Seguridad Arcana<br>
            No compartas este enlace con nadie.
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

// Email de desbloqueo de cuenta tras 5 intentos fallidos
const emailDesbloqueo = async (datos) => {
  const transport = createTransporter()
  const { email, nombre, token } = datos

  await transport.sendMail({
    from: 'BienesRaices - Seguridad Hextech <no-reply@bienesraices.com>',
    to: email,
    subject: '⚠️ Bloqueo de seguridad – Desbloqueo Arcane ⚠️',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${getEmailStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ CUENTA BLOQUEADA</h1>
            <p>▐  Acceso suspendido temporalmente  ▐</p>
          </div>
          <div class="content">
            <p>Hola, <strong>${nombre}</strong>.</p>
            <div class="arcane-symbol">⛔ ◈ ⚠️ ◈ ⛔</div>
            <p>Tu cuenta ha sido bloqueada debido a múltiples intentos fallidos de inicio de sesión (5 intentos). Para recuperar el acceso, haz clic en el siguiente botón:</p>
            <hr>
            <p style="text-align: center;">
              <a href="localhost:${process.env.PORT}/auth/desbloquear/${token}" class="button">🔓 Desbloquear mi cuenta 🔓</a>
            </p>
            <p>Si no fuiste tú quien intentó acceder, te recomendamos cambiar tu contraseña de inmediato y revisar tus dispositivos. La magia arcana protege tus datos.</p>
            <p><em>"La seguridad es el cimiento de todo hogar."</em></p>
          </div>
          <div class="footer">
            BienesRaíces – Sistema de Defensa Hextech<br>
            Si no reconoces esta actividad, contacta soporte.
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export { emailRegistro, emailResetearPassword, emailDesbloqueo }