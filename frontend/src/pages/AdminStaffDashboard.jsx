import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? 'bg-white text-[#E36852] shadow-neu-sm'
          : 'text-[#718096] hover:text-[#4A5568] hover:bg-white/50'
      }`}
    >
      {children}
    </button>
  );
}

export default function AdminStaffDashboard() {
  const [activeTab, setActiveTab] = useState('evaluaciones');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#4A5568]">Panel Administrativo</h1>
        <p className="text-[#718096] text-sm mt-1">Gestión operativa del sistema</p>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { key: 'evaluaciones', label: 'Evaluaciones' },
          { key: 'pagos', label: 'Liquidaciones' },
          { key: 'reportes', label: 'Reportes' },
          { key: 'bancos', label: 'Bancos' },
        ].map((tab) => (
          <TabButton key={tab.key} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </TabButton>
        ))}
      </div>

      {activeTab === 'evaluaciones' && <EvaluacionesTab />}
      {activeTab === 'pagos' && <LiquidacionesTab />}
      {activeTab === 'reportes' && <ReportesTab />}
      {activeTab === 'bancos' && <BancosTab />}
    </div>
  );
}

function FormCard({ title, children }) {
  return <div className="neu-card p-6">{children}</div>;
}

function Input({ label, hint, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">
        {label} {hint && <span className="text-[#E36852]">({hint})</span>}
      </label>
      <input
        {...props}
        className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] placeholder-[#718096]/50 text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">{label}</label>
      <select
        {...props}
        className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
      >
        {children}
      </select>
    </div>
  );
}

function PrimaryButton({ loading, children, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full bg-[#E36852] hover:bg-[#EA8559] disabled:bg-[#E36852]/60 text-white font-bold py-3 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm"
    >
      {loading ? 'Procesando...' : children}
    </button>
  );
}

function MsgAlert({ msg }) {
  if (!msg) return null;
  return (
    <div className={`text-sm p-3 rounded-xl mb-4 flex items-center gap-2 ${
      msg.type === 'success' ? 'bg-[#E36852]/10 text-[#E36852]' : 'bg-[#DE4B43]/10 text-[#DE4B43]'
    }`}>
      <span>{msg.text}</span>
    </div>
  );
}

function EvaluacionesTab() {
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [psicoForm, setPsicoForm] = useState({ chofer_id: '', calificacion: '', fecha_prueba: '' });
  const [psicoLoading, setPsicoLoading] = useState(false);
  const [psicoMsg, setPsicoMsg] = useState(null);

  const [revForm, setRevForm] = useState({ vehiculo_id: '', calificacion: '', fecha_revision: '' });
  const [revLoading, setRevLoading] = useState(false);
  const [revMsg, setRevMsg] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, vRes] = await Promise.all([
          api.get('/choferes?limit=100'),
          api.get('/vehiculos?limit=100'),
        ]);
        setChoferes(cRes.data.data || []);
        setVehiculos(vRes.data.data || []);
      } catch {
      }
    };
    load();
  }, []);

  const handlePsicoSubmit = async (e) => {
    e.preventDefault();
    setPsicoMsg(null);
    const cal = parseFloat(psicoForm.calificacion);
    if (cal < 73 || cal > 100) {
      setPsicoMsg({ type: 'error', text: 'La calificación debe estar entre 73 y 100' });
      return;
    }
    setPsicoLoading(true);
    try {
      await api.post('/pruebas-psicologicas', {
        chofer_id: parseInt(psicoForm.chofer_id, 10),
        calificacion: cal,
        fecha_prueba: psicoForm.fecha_prueba,
      });
      setPsicoMsg({ type: 'success', text: 'Evaluación psicológica registrada' });
      setPsicoForm({ chofer_id: '', calificacion: '', fecha_prueba: '' });
    } catch (err) {
      const text = err.response?.data?.error || 'Error al registrar evaluación';
      setPsicoMsg({ type: 'error', text: Array.isArray(text) ? text.join(', ') : text });
    } finally {
      setPsicoLoading(false);
    }
  };

  const handleRevSubmit = async (e) => {
    e.preventDefault();
    setRevMsg(null);
    const cal = parseFloat(revForm.calificacion);
    if (cal < 65 || cal > 100) {
      setRevMsg({ type: 'error', text: 'La calificación debe estar entre 65 y 100' });
      return;
    }
    setRevLoading(true);
    try {
      await api.post('/revisiones-vehiculo', {
        vehiculo_id: parseInt(revForm.vehiculo_id, 10),
        calificacion: cal,
        fecha_revision: revForm.fecha_revision,
      });
      setRevMsg({ type: 'success', text: 'Revisión técnica registrada' });
      setRevForm({ vehiculo_id: '', calificacion: '', fecha_revision: '' });
    } catch (err) {
      const text = err.response?.data?.error || 'Error al registrar revisión';
      setRevMsg({ type: 'error', text: Array.isArray(text) ? text.join(', ') : text });
    } finally {
      setRevLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormCard>
        <h2 className="text-lg font-bold text-[#4A5568] mb-4">Evaluación Psicológica</h2>
        <MsgAlert msg={psicoMsg} />
        <form onSubmit={handlePsicoSubmit} className="space-y-4">
          <Select
            label="Chofer"
            value={psicoForm.chofer_id}
            onChange={(e) => setPsicoForm((p) => ({ ...p, chofer_id: e.target.value }))}
            required
          >
            <option value="">Seleccionar chofer</option>
            {choferes.map((c) => (
              <option key={c.id} value={c.id}>{c.user?.nombre} {c.user?.apellido} - {c.user?.cedula}</option>
            ))}
          </Select>
          <Input
            label="Calificación"
            hint="73 - 100"
            type="number"
            value={psicoForm.calificacion}
            onChange={(e) => setPsicoForm((p) => ({ ...p, calificacion: e.target.value }))}
            required
            min="73"
            max="100"
            step="0.1"
          />
          {psicoForm.calificacion && (parseFloat(psicoForm.calificacion) < 73 || parseFloat(psicoForm.calificacion) > 100) && (
            <p className="text-[#DE4B43] text-xs mt-1">La calificación debe estar entre 73 y 100</p>
          )}
          <Input
            label="Fecha de la Prueba"
            type="date"
            value={psicoForm.fecha_prueba}
            onChange={(e) => setPsicoForm((p) => ({ ...p, fecha_prueba: e.target.value }))}
            required
          />
          <PrimaryButton loading={psicoLoading}>Registrar Evaluación</PrimaryButton>
        </form>
      </FormCard>

      <FormCard>
        <h2 className="text-lg font-bold text-[#4A5568] mb-4">Revisión Técnica de Vehículo</h2>
        <MsgAlert msg={revMsg} />
        <form onSubmit={handleRevSubmit} className="space-y-4">
          <Select
            label="Vehículo"
            value={revForm.vehiculo_id}
            onChange={(e) => setRevForm((p) => ({ ...p, vehiculo_id: e.target.value }))}
            required
          >
            <option value="">Seleccionar vehículo</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.marca} {v.modelo} - {v.placa}</option>
            ))}
          </Select>
          <Input
            label="Calificación"
            hint="65 - 100"
            type="number"
            value={revForm.calificacion}
            onChange={(e) => setRevForm((p) => ({ ...p, calificacion: e.target.value }))}
            required
            min="65"
            max="100"
            step="0.1"
          />
          {revForm.calificacion && (parseFloat(revForm.calificacion) < 65 || parseFloat(revForm.calificacion) > 100) && (
            <p className="text-[#DE4B43] text-xs mt-1">La calificación debe estar entre 65 y 100</p>
          )}
          <Input
            label="Fecha de la Revisión"
            type="date"
            value={revForm.fecha_revision}
            onChange={(e) => setRevForm((p) => ({ ...p, fecha_revision: e.target.value }))}
            required
          />
          <PrimaryButton loading={revLoading}>Registrar Revisión</PrimaryButton>
        </form>
      </FormCard>
    </div>
  );
}

function LiquidacionesTab() {
  const [choferes, setChoferes] = useState([]);
  const [selectedChofer, setSelectedChofer] = useState('');
  const [choferSaldo, setChoferSaldo] = useState(0);
  const [form, setForm] = useState({ referencia: '', monto: '', fecha_pago: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get('/choferes?limit=100').then((res) => setChoferes(res.data.data || [])).catch(() => {});
  }, []);

  const handleChoferChange = (id) => {
    setSelectedChofer(id);
    const chofer = choferes.find((c) => c.id === parseInt(id, 10));
    setChoferSaldo(chofer?.saldo || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (parseFloat(form.monto) > choferSaldo) {
      setMsg({ type: 'error', text: `El monto excede el saldo disponible ($${choferSaldo.toFixed(2)})` });
      return;
    }
    setLoading(true);
    try {
      await api.post('/pagos', {
        chofer_id: parseInt(selectedChofer, 10),
        monto: parseFloat(form.monto),
        referencia: form.referencia,
      });
      setMsg({ type: 'success', text: 'Pago registrado exitosamente' });
      setForm({ referencia: '', monto: '', fecha_pago: '' });
      setChoferSaldo(0);
      setSelectedChofer('');
      const res = await api.get('/choferes?limit=100');
      setChoferes(res.data.data || []);
    } catch (err) {
      const text = err.response?.data?.error || 'Error al registrar pago';
      setMsg({ type: 'error', text: Array.isArray(text) ? text.join(', ') : text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <h2 className="text-lg font-bold text-[#4A5568] mb-4">Liquidación de Pagos a Choferes</h2>
      <MsgAlert msg={msg} />
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <Select
          label="Chofer"
          value={selectedChofer}
          onChange={(e) => handleChoferChange(e.target.value)}
          required
        >
          <option value="">Seleccionar chofer</option>
          {choferes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.user?.nombre} {c.user?.apellido} - Saldo: ${c.saldo?.toFixed(2)}
            </option>
          ))}
        </Select>
        {selectedChofer && (
          <div className="neu-card-sm p-3">
            <p className="text-sm text-[#718096]">
              Saldo acumulado pendiente: <span className="text-[#E36852] font-bold">${choferSaldo.toFixed(2)}</span>
            </p>
          </div>
        )}
        <Input
          label="Monto a Cancelar"
          type="number"
          value={form.monto}
          onChange={(e) => setForm((p) => ({ ...p, monto: e.target.value }))}
          required
          min="0.01"
          step="0.01"
          max={choferSaldo || undefined}
        />
        <Input
          label="Referencia Bancaria"
          type="text"
          value={form.referencia}
          onChange={(e) => setForm((p) => ({ ...p, referencia: e.target.value }))}
          required
        />
        <Input
          label="Fecha de Pago"
          type="date"
          value={form.fecha_pago}
          onChange={(e) => setForm((p) => ({ ...p, fecha_pago: e.target.value }))}
          required
        />
        <PrimaryButton loading={loading}>Registrar Pago</PrimaryButton>
      </form>
    </FormCard>
  );
}

function ReportesTab() {
  const [reportType, setReportType] = useState('ganancias');
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <TabButton active={reportType === 'ganancias'} onClick={() => setReportType('ganancias')}>
          Ganancias Empresa
        </TabButton>
        <TabButton active={reportType === 'liquidaciones'} onClick={() => setReportType('liquidaciones')}>
          Liquidaciones a Choferes
        </TabButton>
      </div>
      {reportType === 'ganancias' ? <GananciasReport /> : <LiquidacionesReport />}
    </div>
  );
}

function GananciasReport() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [totalGanancias, setTotalGanancias] = useState(0);
  const [totalViajes, setTotalViajes] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '1000' });
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);
      const res = await api.get(`/traslados?${params}`);
      const viajes = res.data.data || [];
      const ganancias = viajes.reduce((acc, v) => acc + (v.ganancia_empresa || 0), 0);
      setTotalGanancias(ganancias);
      setTotalViajes(viajes.length);
    } catch {
      setTotalGanancias(0);
      setTotalViajes(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <h3 className="text-lg font-bold text-[#4A5568] mb-4">Reporte de Ganancias (Comisión 30%)</h3>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
          />
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="bg-[#E36852] hover:bg-[#EA8559] disabled:bg-[#E36852]/60 text-white font-bold py-2.5 px-6 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="neu-card-sm p-5">
          <p className="text-[#718096] text-sm uppercase tracking-wider">Ganancias Totales</p>
          <p className="text-3xl font-bold text-[#4A5568] mt-1">${totalGanancias.toFixed(2)}</p>
        </div>
        <div className="neu-card-sm p-5">
          <p className="text-[#718096] text-sm uppercase tracking-wider">Total Viajes</p>
          <p className="text-3xl font-bold text-[#4A5568] mt-1">{totalViajes}</p>
        </div>
      </div>
    </FormCard>
  );
}

function LiquidacionesReport() {
  const [choferes, setChoferes] = useState([]);
  const [selectedChofer, setSelectedChofer] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [pagos, setPagos] = useState([]);
  const [totalPagado, setTotalPagado] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/choferes?limit=100').then((res) => setChoferes(res.data.data || [])).catch(() => {});
  }, []);

  const fetchReport = async () => {
    if (!selectedChofer) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);
      const res = await api.get(`/pagos/chofer/${selectedChofer}?${params}`);
      const data = res.data.data || [];
      setPagos(data);
      setTotalPagado(data.reduce((acc, p) => acc + (p.monto || 0), 0));
    } catch {
      setPagos([]);
      setTotalPagado(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <h3 className="text-lg font-bold text-[#4A5568] mb-4">Reporte de Liquidaciones a Choferes</h3>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <Select
          label="Chofer"
          value={selectedChofer}
          onChange={(e) => setSelectedChofer(e.target.value)}
        >
          <option value="">Seleccionar</option>
          {choferes.map((c) => (
            <option key={c.id} value={c.id}>{c.user?.nombre} {c.user?.apellido}</option>
          ))}
        </Select>
        <div>
          <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
          />
        </div>
        <button
          onClick={fetchReport}
          disabled={loading || !selectedChofer}
          className="bg-[#F3A85B] hover:bg-[#EA8559] disabled:bg-[#F3A85B]/60 text-white font-bold py-2.5 px-6 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>
      <div className="neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F0F3F8] text-[#718096] text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-semibold">Fecha</th>
                <th className="text-left p-4 font-semibold">Referencia</th>
                <th className="text-right p-4 font-semibold">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {pagos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-[#718096]">
                    {loading ? 'Cargando...' : 'No hay pagos registrados'}
                  </td>
                </tr>
              ) : (
                pagos.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F0F3F8] transition-colors">
                    <td className="p-4 text-[#718096]">{new Date(p.fecha_pago).toLocaleDateString('es-ES')}</td>
                    <td className="p-4 text-[#4A5568] font-mono text-xs">{p.referencia}</td>
                    <td className="p-4 text-[#E36852] font-semibold text-right">${p.monto?.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {pagos.length > 0 && (
              <tfoot>
                <tr className="bg-[#F0F3F8]">
                  <td colSpan={2} className="p-4 text-[#4A5568] font-bold text-right">Total</td>
                  <td className="p-4 text-[#E36852] font-bold text-right">${totalPagado.toFixed(2)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </FormCard>
  );
}

function BancosTab() {
  const [bancos, setBancos] = useState([]);
  const [form, setForm] = useState({ nombre: '', codigo: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchBancos = useCallback(async () => {
    try {
      const res = await api.get('/bancos');
      setBancos(res.data.data || []);
    } catch {
    }
  }, []);

  useEffect(() => { fetchBancos(); }, [fetchBancos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/bancos/${editId}`, form);
        setMsg({ type: 'success', text: 'Banco actualizado' });
      } else {
        await api.post('/bancos', form);
        setMsg({ type: 'success', text: 'Banco registrado' });
      }
      setForm({ nombre: '', codigo: '' });
      setEditId(null);
      fetchBancos();
    } catch (err) {
      const text = err.response?.data?.error || 'Error al guardar banco';
      setMsg({ type: 'error', text: Array.isArray(text) ? text.join(', ') : text });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banco) => {
    setEditId(banco.id);
    setForm({ nombre: banco.nombre, codigo: banco.codigo });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bancos/${id}`);
      fetchBancos();
    } catch {
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nombre: '', codigo: '' });
  };

  return (
    <FormCard>
      <h2 className="text-lg font-bold text-[#4A5568] mb-4">Mantenimiento de Bancos</h2>
      <MsgAlert msg={msg} />
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Nombre del Banco</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            required
            className="w-64 bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Código</label>
          <input
            type="text"
            value={form.codigo}
            onChange={(e) => setForm((p) => ({ ...p, codigo: e.target.value }))}
            required
            className="w-40 bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#E36852] hover:bg-[#EA8559] disabled:bg-[#E36852]/60 text-white font-bold py-2.5 px-6 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm"
        >
          {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Registrar'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white text-[#718096] font-semibold py-2.5 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm text-sm hover:text-[#DE4B43]"
          >
            Cancelar
          </button>
        )}
      </form>
      <div className="neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F0F3F8] text-[#718096] text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-semibold">ID</th>
                <th className="text-left p-4 font-semibold">Nombre</th>
                <th className="text-left p-4 font-semibold">Código</th>
                <th className="text-right p-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {bancos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#718096]">No hay bancos registrados</td>
                </tr>
              ) : (
                bancos.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F0F3F8] transition-colors">
                    <td className="p-4 text-[#718096]">{b.id}</td>
                    <td className="p-4 text-[#4A5568] font-medium">{b.nombre}</td>
                    <td className="p-4 text-[#718096] font-mono text-xs">{b.codigo}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEdit(b)}
                        className="text-[#F3A85B] hover:text-[#EA8559] text-sm font-medium mr-3 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-[#DE4B43] hover:text-[#DE4B43]/80 text-sm font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FormCard>
  );
}
