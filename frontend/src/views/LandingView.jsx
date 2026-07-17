import { Link } from 'react-router-dom';
import ParticlesBackground from '../components/lightswind/particles-background';

const fleetData = [
  {
    name: 'Flota Estándar',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#9c4400" strokeWidth="1.5">
        <rect x="4" y="14" width="32" height="16" rx="3" />
        <rect x="10" y="8" width="16" height="8" rx="2" />
        <circle cx="12" cy="32" r="4" stroke="#9c4400" fill="none" />
        <circle cx="28" cy="32" r="4" stroke="#9c4400" fill="none" />
        <line x1="16" y1="18" x2="16" y2="24" />
        <line x1="20" y1="18" x2="20" y2="24" />
        <line x1="24" y1="18" x2="24" y2="24" />
      </svg>
    ),
    desc: 'Vehículos particulares livianos totalmente verificados. Seguridad garantizada en traslados urbanos de punto A a punto B con asignación aleatoria inmediata.',
    features: ['Vehículos verificados', 'Asignación aleatoria', 'Traslados urbanos'],
  },
  {
    name: 'Requisitos del Chofer',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#E36852" strokeWidth="1.5">
        <circle cx="20" cy="14" r="6" />
        <path d="M10 34 c0 -8 4.5 -12 10 -12 s10 4 10 12" />
        <rect x="26" y="6" width="10" height="4" rx="1" />
        <line x1="28" y1="8" x2="34" y2="8" />
        <circle cx="31" cy="8" r="1.5" fill="#E36852" />
      </svg>
    ),
    desc: 'Conductores certificados con evaluación psicológica anual aprobatoria (mínimo 73/100 puntos) y datos bancarios validados para abonos directos.',
    features: ['Evaluación psicológica', 'Mínimo 73/100 puntos', 'Datos bancarios validados'],
  },
  {
    name: 'Control Vehicular',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#DE4B43" strokeWidth="1.5">
        <rect x="6" y="6" width="28" height="28" rx="3" />
        <line x1="12" y1="16" x2="28" y2="16" />
        <line x1="12" y1="22" x2="24" y2="22" />
        <line x1="12" y1="28" x2="20" y2="28" />
        <polyline points="26,26 28,28 32,22" />
      </svg>
    ),
    desc: 'Unidades sometidas a revisiones técnicas obligatorias una vez al año, exigiendo una calificación mínima de 65/100 puntos para garantizar la aptitud física.',
    features: ['Revisión técnica anual', 'Mínimo 65/100 puntos', 'Garantía de aptitud'],
  },
];

export default function LandingView() {
  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#4A5568] overflow-x-hidden">
      <nav className="sticky top-0 z-50 bg-[#E0E5EC]/80 backdrop-blur-lg border-b border-[#B8BCC2]/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Cross-Roads Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#4A5568] tracking-tight">Cross-Roads</span>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#718096]">
              <a href="#routes" className="hover:text-[#4A5568] transition-colors">Rutas</a>
              <a href="#fleet" className="hover:text-[#4A5568] transition-colors">Flota</a>
              <a href="#roles" className="hover:text-[#4A5568] transition-colors">Roles</a>
            </div>
          </div>

          <Link
            to="/login"
            className="neo-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-[#4A5568]"
          >
            Iniciar Sesión
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </nav>

      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col lg:flex-row items-center gap-16">
        <ParticlesBackground
          colors={['#9c4400', '#f47d31', '#EA8559']}
          zIndex={0}
          height="100%"
        />
        <div className="flex-1 z-10">
          <h1 className="text-5xl lg:text-6xl font-black text-[#4A5568] leading-tight tracking-tight">
            Redefiniendo la
            <span className="block text-[#EA8559] mt-2">Movilidad Urbana</span>
          </h1>
          <p className="text-lg text-[#718096] mt-6 max-w-lg leading-relaxed">
            Conectamos tu destino con tecnología de punta. Experiencia de transporte suave, segura y digitalmente precisa.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/login"
              className="neo-btn px-8 py-3.5 rounded-full text-sm font-bold text-[#4A5568]"
            >
              Comenzar ahora
            </Link>
            <a
              href="#fleet"
              className="neo-btn px-8 py-3.5 rounded-full text-sm font-bold text-[#4A5568]"
            >
              Explorar flota
            </a>
          </div>
        </div>

        <div className="flex-1 z-10 flex justify-center">
          <div className="neo-extruded rounded-[3rem] p-10 w-full max-w-md relative">
            <img src="/logo.png" alt="Cross-Roads Logo" className="w-full h-56 object-contain mx-auto" />
            <div className="absolute bottom-6 right-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f47d31] animate-pulse" />
              <span className="text-xs font-semibold text-[#718096]">En línea</span>
            </div>
          </div>
        </div>
      </section>

      <section id="routes" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="neo-extruded rounded-[2.5rem] p-10 md:p-16 text-center">
          <h2 className="font-black text-3xl md:text-4xl text-[#171c21] tracking-tight mb-6">
            Ecosistema Inteligente de Transporte Urbano
          </h2>
          <p className="text-lg text-[#4A5568] max-w-3xl mx-auto leading-relaxed mb-8">
            Cross-Roads es una plataforma en línea diseñada para centralizar y optimizar las operaciones de transporte de pasajeros mediante flota liviana en la ciudad. El sistema unifica la gestión de solicitudes en tiempo real, auditoría contable y el control riguroso de aptitud de las unidades, garantizando un servicio eficiente, seguro y automatizado.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <svg className="w-8 h-8 text-[#9c4400] mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <p className="text-sm text-[#718096] leading-relaxed">
                <strong className="text-[#4A5568]">Asignación Aleatoria Inmediata:</strong> Procesamiento automatizado de solicitudes de traslado de un punto A a un punto B, validando el saldo disponible del cliente y asignando conductores activos al instante.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <svg className="w-8 h-8 text-[#9c4400] mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <line x1="6" y1="10" x2="10" y2="10" />
                <line x1="14" y1="10" x2="18" y2="10" />
                <circle cx="8" cy="18" r="2" />
                <circle cx="16" cy="18" r="2" />
              </svg>
              <p className="text-sm text-[#718096] leading-relaxed">
                <strong className="text-[#4A5568]">Monitoreo Contable Transparente:</strong> División automatizada de ingresos basada en reglas de negocio (30% para la empresa y 70% neto para el saldo a favor del chofer) con pasarela de recargas auditable.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <svg className="w-8 h-8 text-[#9c4400] mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              <p className="text-sm text-[#718096] leading-relaxed">
                <strong className="text-[#4A5568]">Control de Aptitud Anual:</strong> Supervisión estricta de vigencia de evaluaciones psicológicas de la plantilla de choferes y revisiones mecánicas exhaustivas de los vehículos registrados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="fleet" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-[#4A5568] tracking-tight">Nuestra Flota</h2>
          <p className="text-[#718096] mt-3 max-w-xl mx-auto">
            Conocé los pilares que conforman nuestro servicio de transporte de flota liviana.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {fleetData.map((item) => (
            <div key={item.name} className="neo-extruded rounded-[2.5rem] p-8 flex flex-col items-center text-center">
              <div className="neo-pressed rounded-2xl p-4 mb-5 inline-flex">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-[#4A5568] mb-2">{item.name}</h3>
              <p className="text-sm text-[#718096] leading-relaxed mb-6">{item.desc}</p>
              <ul className="w-full space-y-2">
                {item.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#4A5568]">
                    <svg className="w-4 h-4 text-[#EA8559] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="roles" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-[#171c21] tracking-tight">Estructura Operativa del Sistema</h2>
          <p className="text-[#718096] mt-3 max-w-xl mx-auto">
            Roles integrados y permisologías del núcleo de control urbano.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="neo-extruded rounded-[2rem] p-7 flex flex-col items-center text-center">
            <div className="neo-pressed rounded-full p-4 mb-5 inline-flex">
              <svg className="w-8 h-8 text-[#9c4400]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#4A5568] mb-2">Pasajero / Cliente</h3>
            <p className="text-sm text-[#718096] leading-relaxed">
              Gestión autónoma de cuenta personal. Módulo financiero integrado para recargas de saldo digital (banco, referencia y fecha) y solicitud de traslados punto A a punto B con asignación aleatoria y consulta en tiempo real de datos del conductor.
            </p>
          </div>

          <div className="neo-extruded rounded-[2rem] p-7 flex flex-col items-center text-center">
            <div className="neo-pressed rounded-full p-4 mb-5 inline-flex">
              <svg className="w-8 h-8 text-[#9c4400]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#4A5568] mb-2">Chofer / Conductor</h3>
            <p className="text-sm text-[#718096] leading-relaxed">
              Carga del perfil técnico y cuentas bancarias personales. Acceso al historial neto de traslados cobrados y pendientes por liquidar (70% del valor total del viaje). Registro y control de múltiples vehículos propios asignados a la flota.
            </p>
          </div>

          <div className="neo-extruded rounded-[2rem] p-7 flex flex-col items-center text-center">
            <div className="neo-pressed rounded-full p-4 mb-5 inline-flex">
              <svg className="w-8 h-8 text-[#9c4400]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="6" y="4" width="12" height="16" rx="2" />
                <line x1="9" y1="10" x2="15" y2="10" />
                <line x1="9" y1="14" x2="13" y2="14" />
                <polyline points="16,16 18,18 22,12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#4A5568] mb-2">Personal Administrativo</h3>
            <p className="text-sm text-[#718096] leading-relaxed">
              Operador central del sistema. Responsable de la carga de calificaciones anuales de aptitud (Prueba psicológica mínima 73/100 y revisión vehicular mínima 65/100). Módulo de liquidación de pagos a choferes y auditoría de recaudación (30% de comisión corporativa).
            </p>
          </div>

          <div className="neo-extruded rounded-[2rem] p-7 flex flex-col items-center text-center">
            <div className="neo-pressed rounded-full p-4 mb-5 inline-flex">
              <svg className="w-8 h-8 text-[#9c4400]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M12 2l3 7h7l-5.5 5 2 7L12 17l-5.5 4 2-7L3 9h7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#4A5568] mb-2">Administrador Global</h3>
            <p className="text-sm text-[#718096] leading-relaxed">
              Permisología de máximo nivel sobre el ecosistema. Monitoreo global de la bitácora de transacciones del negocio, control de estados de traslados cancelados/pendientes en períodos delimitables y visualización de reportes económicos agregados.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#B8BCC2]/30 bg-[#E0E5EC]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#718096]">
            &copy; {new Date().getFullYear()} Cross-Roads. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm text-[#718096]">
            <a href="#" className="hover:text-[#4A5568] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#4A5568] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#4A5568] transition-colors">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
