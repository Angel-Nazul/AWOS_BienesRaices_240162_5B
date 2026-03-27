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

// Estilos inspirados en Jinx (azul / morado / caótico)
const getEmailStyles = () => {
  return `
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #0a0f1a 0%, #0b0b2f 100%);
      font-family: 'Courier New', 'Monaco', monospace;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #110e1f;
      border-radius: 16px;
      border: 1px solid #8b5cf6;
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 10px rgba(59, 130, 246, 0.2);
      overflow: hidden;
      position: relative;
    }
    .container::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: radial-gradient(circle at 20% 40%, rgba(59,130,246,0.15), rgba(139,92,246,0.05));
      pointer-events: none;
      z-index: -1;
    }
    .header {
      background: #0f0a1a;
      padding: 20px;
      text-align: center;
      border-bottom: 3px solid #8b5cf6;
      position: relative;
      overflow: hidden;
    }
    .header h1 {
      margin: 0;
      background: linear-gradient(135deg, #a855f7, #3b82f6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-size: 32px;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-weight: 800;
      text-shadow: 0 0 5px rgba(59,130,246,0.3);
    }
    .header p {
      margin: 5px 0 0;
      color: #a78bfa;
      font-size: 12px;
      font-style: italic;
    }
    .content {
      padding: 30px 20px;
      color: #e2e8f0;
      font-size: 16px;
      line-height: 1.5;
    }
    .content strong {
      background: linear-gradient(135deg, #a855f7, #3b82f6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
      color: #fff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 40px;
      font-weight: bold;
      margin: 20px 0;
      border: none;
      transition: all 0.3s ease;
      font-family: inherit;
      box-shadow: 0 4px 15px rgba(59,130,246,0.3);
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139,92,246,0.4);
      background: linear-gradient(135deg, #7c3aed, #2563eb);
    }
    .footer {
      background: #070413;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #1e1a3a;
    }
    .jinx-symbol {
      font-size: 28px;
      margin: 15px 0;
      text-align: center;
      letter-spacing: 8px;
      color: #a855f7;
      filter: drop-shadow(0 0 3px #3b82f6);
    }
    a {
      color: #8b5cf6;
      text-decoration: none;
    }
    hr {
      border: none;
      height: 2px;
      background: linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, #8b5cf6, transparent);
      margin: 20px 0;
    }
    .chaos-quote {
      font-size: 14px;
      background: rgba(59,130,246,0.1);
      border-left: 3px solid #a855f7;
      padding: 10px 15px;
      margin: 20px 0;
      font-style: italic;
      color: #c084fc;
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

// Email de registro (confirmación de cuenta) – Estilo Jinx
const emailRegistro = async (datos) => {
  const transport = createTransporter()
  const { email, nombre, token } = datos

  await transport.sendMail({
    from: '¡BienesRaices - Loca del Cañón! <explosion@bienesraices.com>',
    to: email,
    subject: '💣 ¡BOOM! Bienvenida al caos – Confirma tu cuenta Jinx 💣',
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
            <h1>💙 💜 BIENES RAÍCES 💙 💜</h1>
            <p>▐  Jinx’s Realty – ¿Lista para la explosión?  ▐</p>
          </div>
          <div class="content">
            <p>¡Oye, <strong>${nombre}</strong>!</p>
            <div class="jinx-symbol">💣 ✨ 💙 ✨ 💜</div>
            <p>¡Boom! Acabas de inscribirte en el lugar más caótico para comprar propiedades. Tu cuenta está casi lista, solo necesito que confirmes que no eres un aburrido Enforcer.</p>
            <hr>
            <p style="text-align: center;">
              <a href="localhost:${process.env.PORT}/auth/confirma/${token}" class="button">💥 ¡CONFIRMA, CONFIRMA! 💥</a>
            </p>
            <div class="chaos-quote">
              “Si no confirmas, tu cuenta explota… ¡nah, es broma! Pero mejor hazlo rápido, que me aburro.”
            </div>
            <p>Si no pediste esto, ignora el mensaje. O diviértete imaginando qué pasaría si le dieras clic a todo.</p>
            <p><em>“¡Las reglas están para romperlas, y las casas para decorarlas con grafitis!”</em></p>
          </div>
          <div class="footer">
            BienesRaíces – La locura tiene dirección<br>
            Mensaje automático (como mis cohetes, pero más seguro).
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

// Email para restablecer contraseña – Versión Jinx
const emailResetearPassword = async (datos) => {
  const transport = createTransporter()
  const { email, nombre, token } = datos

  await transport.sendMail({
    from: 'BienesRaices - ¡Olvidadiza como yo! <olvido@bienesraices.com>',
    to: email,
    subject: '🔫 ¿Perdiste la contraseña? ¡Vamos, resetea esa cosa! 🔫',
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
            <h1>💣 RESETEO EXPLOSIVO 💣</h1>
            <p>▐  Protocolo “¿Qué contraseña?”  ▐</p>
          </div>
          <div class="content">
            <p>¡Ey, <strong>${nombre}</strong>!</p>
            <div class="jinx-symbol">⚡ 💙 💜 💣 ⚡</div>
            <p>Dicen por ahí que olvidaste tu clave. ¡Tranqui, me pasa seguido! Dale al botón y crea una nueva, pero que sea algo que no se te olvide otra vez (o sí, para seguir jugando).</p>
            <hr>
            <p style="text-align: center;">
              <a href="localhost:${process.env.PORT}/auth/actualizarPassword/${token}" class="button">🔨 ¡RESETEÁ YA! 🔨</a>
            </p>
            <div class="chaos-quote">
              “Si no pediste esto, alguien se está haciendo el gracioso. Mejor ignora y ponte una contraseña más fuerte… o más loca.”
            </div>
            <p><em>“¡Nada como una buena explosión para empezar de nuevo!”</em></p>
          </div>
          <div class="footer">
            BienesRaíces – Seguridad… ¿seguridad?<br>
            No compartas el enlace, a menos que quieras caos compartido.
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

// Email de desbloqueo de cuenta – Con estilo Jinx
const emailDesbloqueo = async (datos) => {
  const transport = createTransporter()
  const { email, nombre, token } = datos

  await transport.sendMail({
    from: 'BienesRaices - ¡Te bloquearon, qué pesados! <desbloqueo@bienesraices.com>',
    to: email,
    subject: '🚫 Desbloqueo de cuenta – ¡Rompe el candado! 🚫',
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
            <h1>💥 ¡CUENTA BLOQUEADA! 💥</h1>
            <p>▐  Demasiados intentos fallidos (¿estás borracho?)  ▐</p>
          </div>
          <div class="content">
            <p>¡Oye, <strong>${nombre}</strong>!</p>
            <div class="jinx-symbol">🔒 ⛓️ 💣 🔓</div>
            <p>Alguien estuvo jugando a adivinar tu contraseña (o vos mismo te equivocaste cinco veces). Para que puedas volver a hacer lío, dale al botón y desbloquea tu cuenta.</p>
            <hr>
            <p style="text-align: center;">
              <a href="localhost:${process.env.PORT}/auth/desbloquear/${token}" class="button">🔓 ¡DESBLOQUEA EL CAOS! 🔓</a>
            </p>
            <div class="chaos-quote">
              “Si no fuiste tú, cambia la contraseña y ponle una que ni el mismísimo Jayce pueda descifrar.”
            </div>
            <p><em>“Nadie me detiene, ni siquiera los candados.”</em></p>
          </div>
          <div class="footer">
            BienesRaíces – Sistema de “Desbloqueo Explosivo”<br>
            Si esto se repite, mejor cambia la clave.
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export { emailRegistro, emailResetearPassword, emailDesbloqueo }