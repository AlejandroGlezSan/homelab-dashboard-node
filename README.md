# 📡 Homelab Sentinel - Dashboard de Monitoreo Multi-Servidor

**Homelab Sentinel** es un dashboard moderno, ligero y visualmente atractivo para monitorear el estado de múltiples servidores en tiempo real. Obtiene métricas clave como uso de CPU, memoria RAM, espacio en disco, temperatura, tráfico de red y uptime, tanto del equipo local como de servidores remotos.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Características Principales

- 📊 **Gráficos en tiempo real**: Visualiza la evolución de CPU y RAM con Chart.js
- 🖥️ **Soporte multi-servidor**: Monitorea tu máquina local + hasta 5 servidores remotos
- 🎮 **Dos modos de operación**:
  - **Modo Simulación** (por defecto): Datos ficticios inteligentes para pruebas
  - **Modo Real**: Conexión SSH a servidores reales (requiere configuración)
- 🌡️ **Métricas avanzadas**: CPU, RAM, temperatura, procesos, red, disco y uptime
- 🎨 **Diseño profesional**: Interfaz responsive con Bootstrap 5 y modo oscuro automático
- 🔄 **Actualización automática**: Datos frescos cada 30 segundos sin recargar
- 🏷️ **Roles personalizados**: Comportamiento diferente según el tipo de servidor (web, DB, storage...)

---

## 🛠️ Tecnologías Utilizadas

| Backend | Frontend | Librerías Destacadas |
|---------|----------|----------------------|
| Node.js | HTML5 | systeminformation (métricas locales) |
| Express | CSS3 | chart.js (gráficos interactivos) |
| JavaScript | Bootstrap 5 | ssh2 (conexiones SSH) |

---

## 📋 Requisitos Previos

- **Node.js** (v14 o superior)
- **npm** (incluido con Node.js)
- **(Opcional)** Acceso SSH a servidores remotos para modo real

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/homelab-sentinel.git
cd homelab-sentinel
```

### 2. Instalar dependencias
```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- `express` - Servidor web
- `systeminformation` - Métricas del sistema local
- `chart.js` - Gráficos interactivos
- `nodemon` - Recarga automática en desarrollo

---

## 🎮 Modos de Operación

### 📊 MODO SIMULACIÓN (POR DEFECTO) - Para pruebas y desarrollo

El modo simulación es el que se activa automáticamente cuando **no existe** el archivo `servers.json`. Genera datos ficticios inteligentes que simulan el comportamiento de servidores reales.

#### Características del modo simulación:
- **5 servidores preconfigurados** con diferentes roles:
  - 🌐 Servidor Web (carga media-alta)
  - 🗄️ Base de datos (alto consumo de RAM)
  - 💾 NAS/Storage (discos grandes, CPU baja)
  - ⚙️ Servidor de aplicaciones (carga variable)
  - 🔒 Router/Firewall (métricas de red)
- **Patrones de carga según hora del día**:
  - Horario pico (9-18h): +30% de carga
  - Horario valle: -20% de carga
- **Métricas coherentes** entre sí (ej: RAM usada ≤ RAM total)
- **Temperaturas realistas** (35-65°C según carga)
- **Tráfico de red variable**

#### Ejecutar en modo simulación:
```bash
npm start
# o
node app.js
```

Verás en la consola:
```
🚀 Servidor corriendo en http://localhost:3000
📊 Dashboard mejorado con gráficos en tiempo real
🎮 Modo simulación activado. Métricas mejoradas con roles personalizados.
⚠️  No se encontró servers.json. Se usarán servidores simulados para pruebas.
```

Abre tu navegador en `http://localhost:3000` y disfruta del dashboard.

---

### 🖥️ MODO REAL - Para servidores físicos o VPS

El modo real requiere crear un archivo de configuración con los datos de tus servidores y establecer conexión SSH.

#### Configuración paso a paso:

1. **Crear archivo `servers.json`** en la raíz del proyecto:

```json
[
  {
    "name": "Servidor Web Producción",
    "host": "192.168.1.10",
    "port": 22,
    "username": "admin",
    "password": "tu_contraseña",
    "role": "web",
    "os": "linux"
  },
  {
    "name": "Base de Datos Principal",
    "host": "192.168.1.20",
    "port": 22,
    "username": "root",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----",
    "role": "database",
    "os": "linux"
  },
  {
    "name": "NAS Backup",
    "host": "192.168.1.30",
    "port": 22,
    "username": "backup",
    "password": "backup123",
    "role": "storage",
    "os": "linux"
  }
]
```

2. **Campos disponibles en `servers.json`**:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `name` | ✅ | Nombre descriptivo del servidor |
| `host` | ✅ | IP o dominio del servidor |
| `port` | ❌ | Puerto SSH (por defecto: 22) |
| `username` | ✅ | Usuario SSH |
| `password` | * | Contraseña (si no usas clave) |
| `privateKey` | * | Clave privada RSA (si no usas password) |
| `role` | ❌ | web/database/storage/network (para métricas personalizadas) |
| `os` | ❌ | linux/windows (por defecto: linux) |

> ⚠️ **IMPORTANTE**: Añade `servers.json` a tu `.gitignore` para no subir credenciales a GitHub. ¡Ya está incluido por defecto!

3. **Ejecutar en modo real**:
```bash
npm start
```

Verás:
```
✅ 3 servidor(es) real(es) cargado(s) desde servers.json
🚀 Servidor corriendo en http://localhost:3000
📊 Dashboard mejorado con gráficos en tiempo real
```

---

## 📊 Dashboard - Guía de Uso

### Elementos del dashboard:

1. **Cabecera superior**: Título y tiempo de actualización
2. **Tarjetas de servidor**: Una por cada máquina monitoreada
3. **Badges de estado**: CPU y RAM con colores indicativos
   - 🟢 Verde: < 50%
   - 🟡 Amarillo: 50-80%
   - 🔴 Rojo: > 80%
4. **Métricas en tiempo real**:
   - CPU % con barra de progreso
   - RAM usada/total con porcentaje
   - Temperatura (°C)
   - Número de procesos
   - Uso de disco por partición
   - Tráfico de red (RX/TX)
   - Uptime formateado
5. **Gráfico interactivo**: Evolución CPU y RAM (últimos 20 puntos)
6. **Indicador de actualización**: Esquina inferior derecha

### Controles:
- **Hover** sobre tarjetas: Efecto de elevación
- **Click** en badges: (futura funcionalidad)
- **Actualización automática**: Cada 30 segundos

---

## ⚙️ Configuración Avanzada

### Variables de entorno (recomendado para producción)
Crea un archivo `.env`:

```env
PORT=3000
SSH_TIMEOUT=5000
REFRESH_INTERVAL=30000
```

Luego instala dotenv:
```bash
npm install dotenv
```

Y modifica `app.js` para usarlo:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

---

## 📁 Estructura del Proyecto

```
homelab-sentinel/
├── app.js                  # Servidor Express con lógica principal
├── package.json            # Dependencias y scripts
├── servers.json            # Configuración de servidores (ignorado por git)
├── .gitignore              # Archivos ignorados
├── .env                    # Variables de entorno (opcional)
├── public/                 # Archivos estáticos
│   └── index.html          # Dashboard con gráficos
└── README.md               # Este archivo
```

---

## 🧪 Pruebas y Verificación

Ejecuta este script en la consola del navegador (F12) para verificar:

```javascript
(function quickTest() {
  console.log('🔍 HOMELAB SENTINEL - TEST RÁPIDO');
  
  // 1. Verificar elementos
  const servers = document.querySelectorAll('.server-card');
  const charts = document.querySelectorAll('canvas');
  console.log(`📊 Servidores: ${servers.length}, Gráficos: ${charts.length}`);
  
  // 2. Verificar API
  fetch('/api/status')
    .then(r => r.json())
    .then(data => {
      console.log('✅ API OK:', {
        modo: data.remote[0]?.name?.includes('simulado') ? 'SIMULACIÓN' : 'REAL',
        servidores: data.remote?.length,
        timestamp: data.timestamp
      });
    });
  
  // 3. Verificar actualización
  const lastUpdate = document.getElementById('last-update')?.textContent;
  console.log('⏱️', lastUpdate);
})();
```

---

## ☁️ Despliegue en Producción

### Opción 1: Servidor VPS (Ubuntu)

```bash
# Conectar por SSH
ssh usuario@tu-servidor

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

# Clonar e instalar
git clone https://github.com/tu-usuario/homelab-sentinel.git
cd homelab-sentinel
npm install

# Configurar PM2 (gestor de procesos)
sudo npm install -g pm2
pm2 start app.js --name sentinel
pm2 save
pm2 startup

# Configurar firewall (si aplica)
sudo ufw allow 3000/tcp
```

### Opción 2: Docker (próximamente)
```bash
# Dockerfile en desarrollo
```

---

## 🧩 Solución de Problemas

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| Error "chart.js not found" | Dependencia faltante | `npm install chart.js` |
| Puerto 3000 en uso | Otra app usando el puerto | `killall node` o cambiar puerto |
| No aparecen gráficos | Historial insuficiente | Espera 2 ciclos (60s) |
| Servidores en error | Conexión SSH falla | Verifica credenciales en servers.json |
| Datos no se actualizan | Error de red | F12 → Consola → Comparte el error |

---

## 🗺️ Roadmap

- [x] **Gráficos en tiempo real** (Chart.js)
- [x] **Modo simulación mejorado** (roles, horarios)
- [ ] **Conexión SSH real** con ssh2
- [ ] **Alertas por Telegram/Email**
- [ ] **Autenticación de usuarios**
- [ ] **Soporte para Windows** (PowerShell remoto)
- [ ] **Exportar datos a CSV**
- [ ] **Panel de administración**

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas y apreciadas:

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Distribuido bajo licencia MIT. Ver `LICENSE` para más información.

---

## 📬 Contacto

**Alejandro González Santana**
- GitHub: [@AlejandroGlezSan](https://github.com/AlejandroGlezSan)
- Email: alejandroglezsan1993@gmail.com
- LinkedIn: [Alejandro González Santana](https://www.linkedin.com/in/alejandro-gonzalez-santana-0233261a1/)

---

## ⭐ Reconocimientos

- [systeminformation](https://www.npmjs.com/package/systeminformation) - Librería de métricas
- [Chart.js](https://www.chartjs.org/) - Gráficos interactivos
- [Bootstrap](https://getbootstrap.com/) - Framework CSS
- [Express](https://expressjs.com/) - Servidor web

---

**¡Si te gusta el proyecto, no olvides darle una ⭐ en GitHub!** 😊

---

## 📸 Capturas de Pantalla

### Dashboard Principal
![Homelab Sentinel Dashboard](assets/screenshot.png)

*Vista principal del dashboard mostrando el servidor local y 5 servidores simulados con gráficos en tiempo real*

### Características visuales:
- **Tarjetas interactivas** con efecto hover
- **Gráficos dinámicos** de CPU y RAM
- **Badges de estado** con códigos de color
- **Modo oscuro automático** según preferencias del sistema
- **Diseño responsive** para móviles y tablets

---

> 💡 **Nota**: La captura muestra el modo simulación con datos de ejemplo. En modo real, verás las métricas reales de tus servidores.