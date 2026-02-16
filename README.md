# 📡 Homelab Sentinel - Dashboard de Monitoreo Multi-Servidor

**Homelab Sentinel** es un dashboard moderno y ligero para monitorear el estado de múltiples servidores en tiempo real. Obtiene métricas clave como uso de CPU, memoria RAM, espacio en disco y uptime, tanto del equipo local como de servidores remotos vía SSH. Ideal para homelabs, pequeñas oficinas o entornos de desarrollo.

## ✨ Características

- 📊 **Métricas en tiempo real**: CPU, RAM, disco y uptime.
- 🖥️ **Soporte multi-servidor**: Monitorea tu máquina local y múltiples servidores remotos.
- 🎮 **Modo simulación integrado**: Si no tienes servidores reales, genera datos ficticios automáticamente para pruebas.
- 🔄 **Actualización automática**: Los datos se refrescan cada 30 segundos sin recargar la página.
- 🎨 **Interfaz limpia y responsive**: Construida con Bootstrap 5, se ve bien en cualquier dispositivo.
- 🛡️ **Preparado para producción**: Fácil de extender con autenticación, alertas, etc.
- ☁️ **Listo para desplegar en la nube**: Compatible con AWS, Google Cloud, o cualquier VPS.

---

## 🛠️ Tecnologías utilizadas

| Backend | Frontend | Otras |
|--------|----------|-------|
| Node.js | HTML5 | systeminformation (métricas locales) |
| Express | CSS3 | ssh2 (conexiones SSH - opcional) |
| JavaScript | Bootstrap 5 | dotenv (variables de entorno) |

---

## 📋 Requisitos previos

- **Node.js** (v14 o superior)
- **npm** (incluido con Node.js)
- (Opcional) Acceso SSH a servidores remotos para modo real

---

## 🚀 Instalación y uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/homelab-sentinel.git
cd homelab-sentinel
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar el dashboard

#### Modo simulación (sin servidores reales)
```bash
npm start
```
o directamente:
```bash
node app.js
```

Verás el mensaje:  
`🎮 Modo simulación activado. Los servidores remotos muestran datos ficticios.`

Abre tu navegador en `http://localhost:3000`

#### Modo real (con servidores SSH)
1. Crea un archivo `servers.json` en la raíz (basado en `servers.example.json`).
2. Asegúrate de que los servidores sean accesibles por SSH.
3. Ejecuta `npm start`.

---

## ⚙️ Configuración avanzada

### Añadir servidores reales
Crea un archivo `servers.json` con la siguiente estructura:

```json
[
  {
    "name": "Servidor Web",
    "host": "192.168.1.10",
    "port": 22,
    "username": "usuario",
    "password": "contraseña",
    "os": "linux"
  },
  {
    "name": "NAS",
    "host": "192.168.1.20",
    "port": 22,
    "username": "root",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
    "os": "linux"
  }
]
```

> ⚠️ **Nunca subas este archivo a GitHub**. Añádelo a tu `.gitignore`.

### Variables de entorno (recomendado para producción)
Crea un archivo `.env`:
```
PORT=3000
SSH_TIMEOUT=5000
```
Y usa `dotenv` para cargarlas.

---

## 📁 Estructura del proyecto

```
homelab-sentinel/
├── app.js                  # Servidor Express principal
├── package.json            # Dependencias y scripts
├── servers.json            # Configuración de servidores (opcional, ignorado por git)
├── .gitignore              # Archivos ignorados
├── public/                 # Archivos estáticos
│   └── index.html          # Interfaz de usuario
└── README.md               # Este archivo
```

---

## ☁️ Despliegue en AWS (u otro VPS)

### Opción 1: Usando el nivel gratuito de AWS (12 meses)

1. Lanza una instancia **t3.micro** (1 vCPU, 1 GB RAM) con Ubuntu.
2. Conéctate por SSH:
   ```bash
   ssh -i tu-clave.pem ubuntu@<IP_PUBLICA>
   ```
3. Instala Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs git
   ```
4. Clona el repositorio e instala:
   ```bash
   git clone https://github.com/tu-usuario/homelab-sentinel.git
   cd homelab-sentinel
   npm install
   ```
5. Ejecuta en segundo plano con **PM2**:
   ```bash
   sudo npm install -g pm2
   pm2 start app.js --name sentinel
   pm2 save
   pm2 startup
   ```
6. Abre el puerto 3000 en el grupo de seguridad de AWS.
7. ¡Accede a `http://<IP_PUBLICA>:3000`!

### Opción 2: Usando Docker (próximamente)
*Pendiente de implementar.*

---

## 🧪 Próximas mejoras (Roadmap)

- [ ] **Conexión SSH real**: Implementar `ssh2` para métricas reales de servidores remotos.
- [ ] **Alertas por Telegram**: Notificaciones cuando un servidor supere umbrales.
- [ ] **Gráficos históricos**: Chart.js para visualizar tendencias.
- [ ] **Autenticación básica**: Proteger el dashboard con usuario/contraseña.
- [ ] **Soporte para Windows**: Adaptar comandos para servidores Windows (PowerShell remoto).
- [ ] **Modo oscuro**: Tema claro/oscuro para la interfaz.

---

## 🤝 Contribuciones

¿Tienes ideas para mejorar Homelab Sentinel? ¡Las contribuciones son bienvenidas!

1. Haz un fork del proyecto.
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Haz commit de tus cambios (`git commit -am 'Añade nueva funcionalidad'`).
4. Sube la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 📬 Contacto

**Alejandro González Santana**  
- GitHub: [@AlejandroGlezSan](https://github.com/AlejandroGlezSan)  
- Email: alejandroglezsan1993@gmail.com  
- LinkedIn: https://www.linkedin.com/in/alejandro-gonzalez-santana-0233261a1/

---

**¡Si te gusta el proyecto, no olvides darle una ⭐ en GitHub!** 😊

---

## 📸 Capturas de pantalla

proximamente

## 🎉 Reconocimientos

- [systeminformation](https://www.npmjs.com/package/systeminformation) - Librería para métricas del sistema.
- [Bootstrap](https://getbootstrap.com/) - Framework CSS.
- [AWS Free Tier](https://aws.amazon.com/free/) - Infraestructura gratuita para pruebas.