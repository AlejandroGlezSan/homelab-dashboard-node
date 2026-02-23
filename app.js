const express = require('express');
const path = require('path');
const si = require('systeminformation');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// CONFIGURACIÓN DE SERVIDORES (reales o simulados)
// ============================================
let servers = [];
let useSimulation = false;

// Intentar cargar servidores reales desde servers.json
try {
    const data = fs.readFileSync('./servers.json', 'utf8');
    servers = JSON.parse(data);
    console.log(`✅ ${servers.length} servidor(es) real(es) cargado(s) desde servers.json`);
} catch (err) {
    console.log('⚠️  No se encontró servers.json. Se usarán servidores simulados para pruebas.');
    useSimulation = true;
    // Generar algunos servidores de prueba
    servers = [
        { name: 'Servidor Web (simulado)', host: '192.168.1.10', os: 'linux', role: 'web' },
        { name: 'Base de datos (simulado)', host: '192.168.1.20', os: 'linux', role: 'database' },
        { name: 'NAS (simulado)', host: '192.168.1.30', os: 'linux', role: 'storage' },
        { name: 'Servidor de aplicaciones (simulado)', host: '192.168.1.40', os: 'linux', role: 'app' },
        { name: 'Router/Firewall (simulado)', host: '192.168.1.1', os: 'linux', role: 'network' }
    ];
}

// ============================================
// FUNCIÓN PARA GENERAR MÉTRICAS SIMULADAS MEJORADAS
// ============================================
function getSimulatedMetrics(server) {
    // Personalizar métricas según el rol del servidor
    const role = server.role || 'generic';
    
    // Valores base con variación según rol
    let cpuBase, memBase, diskBase;
    
    switch(role) {
        case 'web':
            cpuBase = 30 + Math.random() * 40; // 30-70%
            memBase = 4 + Math.random() * 8;    // 4-12 GB
            break;
        case 'database':
            cpuBase = 20 + Math.random() * 60; // 20-80%
            memBase = 8 + Math.random() * 16;   // 8-24 GB
            break;
        case 'storage':
            cpuBase = 10 + Math.random() * 30; // 10-40%
            memBase = 2 + Math.random() * 4;    // 2-6 GB
            break;
        default:
            cpuBase = 15 + Math.random() * 45; // 15-60%
            memBase = 4 + Math.random() * 12;   // 4-16 GB
    }
    
    // Añadir variación temporal (simular picos)
    const hour = new Date().getHours();
    const isPeakHour = hour >= 9 && hour <= 18;
    const peakMultiplier = isPeakHour ? 1.3 : 0.8;
    
    const cpu = Math.min(100, cpuBase * peakMultiplier).toFixed(2);
    const totalMem = memBase;
    const usedMem = (Math.random() * totalMem * 0.9).toFixed(2); // Máx 90% uso
    
    // Discos según rol
    let disks = [];
    if (role === 'storage' || role === 'database') {
        disks = [
            { mount: '/', used: (Math.random() * 50).toFixed(2), size: 100 },
            { mount: '/data', used: (Math.random() * 400).toFixed(2), size: 500 },
            { mount: '/backup', used: (Math.random() * 800).toFixed(2), size: 1000 }
        ];
    } else {
        disks = [
            { mount: '/', used: (Math.random() * 40).toFixed(2), size: 80 },
            { mount: '/var', used: (Math.random() * 30).toFixed(2), size: 50 },
            { mount: '/home', used: (Math.random() * 100).toFixed(2), size: 200 }
        ];
    }
    
    const uptime = Math.floor(Math.random() * 60 * 24 * 3600); // hasta 60 días
    
    // Métricas adicionales
    const processes = Math.floor(50 + Math.random() * 150); // 50-200 procesos
    const loadAvg = (Math.random() * 8).toFixed(2); // Carga del sistema 0-8
    const temperature = Math.floor(35 + Math.random() * 30); // 35-65°C
    const network = {
        rx: (Math.random() * 20).toFixed(2), // Recepción 0-20 MB/s
        tx: (Math.random() * 10).toFixed(2)  // Transmisión 0-10 MB/s
    };
    
    return {
        name: server.name,
        host: server.host,
        role: role,
        cpu: cpu,
        memory: {
            total: totalMem.toFixed(2),
            used: usedMem
        },
        disk: disks,
        uptime: uptime,
        processes: processes,
        loadAvg: loadAvg,
        temperature: temperature,
        network: network
    };
}

// ============================================
// ENDPOINT PRINCIPAL
// ============================================
app.get('/api/status', async (req, res) => {
    try {
        // 1. Métricas del equipo local (siempre reales con systeminformation)
        const [cpu, mem, disk, uptime, processes, networkStats] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.time(),
            si.processes(),
            si.networkStats()
        ]);

        const localData = {
            name: '🏠 Localhost (real)',
            host: 'localhost',
            role: 'local',
            cpu: cpu.currentLoad.toFixed(2),
            memory: {
                total: (mem.total / 1024 / 1024 / 1024).toFixed(2),
                used: (mem.used / 1024 / 1024 / 1024).toFixed(2)
            },
            disk: disk.map(d => ({
                mount: d.mount,
                used: (d.used / 1024 / 1024 / 1024).toFixed(2),
                size: (d.size / 1024 / 1024 / 1024).toFixed(2)
            })),
            uptime: uptime.uptime,
            processes: processes.all,
            loadAvg: (cpu.avgLoad || 0).toFixed(2),
            temperature: Math.floor(40 + Math.random() * 20), // Simulado para local
            network: {
                rx: networkStats[0] ? (networkStats[0].rx_bytes / 1024 / 1024).toFixed(2) : '0',
                tx: networkStats[0] ? (networkStats[0].tx_bytes / 1024 / 1024).toFixed(2) : '0'
            }
        };

        // 2. Datos de los otros servidores (simulados mejorados)
        let remoteData;
        if (useSimulation) {
            // Modo simulación: generamos datos ficticios mejorados
            remoteData = servers.map(s => getSimulatedMetrics(s));
        } else {
            // Modo real: aquí iría la lógica de conexión SSH
            remoteData = servers.map(s => ({
                name: s.name,
                host: s.host,
                message: 'Conexión SSH no implementada aún. Usa simulación o implementa getRemoteMetrics().'
            }));
        }

        res.json({
            local: localData,
            remote: remoteData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error en /api/status:', error);
        res.status(500).json({ 
            error: error.message,
            local: null,
            remote: []
        });
    }
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        mode: useSimulation ? 'simulation' : 'real',
        servers: servers.length,
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Dashboard mejorado con gráficos en tiempo real`);
    if (useSimulation) {
        console.log('🎮 Modo simulación activado. Métricas mejoradas con roles personalizados.');
    }
});