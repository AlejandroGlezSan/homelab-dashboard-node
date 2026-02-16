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
        { name: 'Servidor Web (simulado)', host: '192.168.1.10', os: 'linux' },
        { name: 'Base de datos (simulado)', host: '192.168.1.20', os: 'linux' },
        { name: 'NAS (simulado)', host: '192.168.1.30', os: 'linux' }
    ];
}

// ============================================
// FUNCIÓN PARA GENERAR MÉTRICAS SIMULADAS
// ============================================
function getSimulatedMetrics(server) {
    // Generar valores aleatorios pero coherentes
    const cpu = (Math.random() * 100).toFixed(2);
    const totalMem = 8 + Math.floor(Math.random() * 8); // entre 8 y 16 GB
    const usedMem = (Math.random() * totalMem).toFixed(2);
    const disks = [
        { mount: '/', used: (Math.random() * 50).toFixed(2), size: 100 },
        { mount: '/home', used: (Math.random() * 200).toFixed(2), size: 250 }
    ];
    const uptime = Math.floor(Math.random() * 30 * 24 * 3600); // hasta 30 días

    return {
        name: server.name,
        host: server.host,
        cpu: cpu,
        memory: {
            total: totalMem.toFixed(2),
            used: usedMem
        },
        disk: disks.map(d => ({
            mount: d.mount,
            used: d.used,
            size: d.size.toFixed(2)
        })),
        uptime: uptime
    };
}

// ============================================
// ENDPOINT PRINCIPAL
// ============================================
app.get('/api/status', async (req, res) => {
    try {
        // 1. Métricas del equipo local (siempre reales)
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const disk = await si.fsSize();
        const uptime = await si.time();

        const localData = {
            name: '🏠 Localhost (real)',
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
            uptime: uptime.uptime
        };

        // 2. Datos de los otros servidores (reales simulados o simulados)
        let remoteData;
        if (useSimulation) {
            // Modo simulación: generamos datos ficticios
            remoteData = servers.map(s => getSimulatedMetrics(s));
        } else {
            // Modo real: aquí iría la lógica de conexión SSH (pendiente de implementar)
            // Por ahora, devolvemos un mensaje
            remoteData = servers.map(s => ({
                name: s.name,
                host: s.host,
                message: 'Conexión SSH no implementada aún. Usa simulación o implementa getRemoteMetrics().'
            }));
        }

        res.json({
            local: localData,
            remote: remoteData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    if (useSimulation) {
        console.log('🎮 Modo simulación activado. Los servidores remotos muestran datos ficticios.');
    }
});