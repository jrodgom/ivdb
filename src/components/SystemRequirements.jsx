import { Cpu, HardDrive, MemoryStick, Monitor } from "lucide-react";

export default function SystemRequirements({ minimum, recommended }) {
  // Si no hay requisitos, no mostrar el componente
  if (!minimum && !recommended) {
    return null;
  }

  const parseRequirements = (htmlString) => {
    if (!htmlString) return null;

    // Crear un elemento temporal para parsear el HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Extraer texto plano sin las etiquetas HTML
    const text = tempDiv.textContent || tempDiv.innerText;
    
    // Intentar extraer información clave
    const requirements = {};
    
    // Patrones comunes en los requisitos
    const patterns = {
      os: /OS[:\s]*(.+?)(?:\n|$|Processor)/i,
      processor: /Processor[:\s]*(.+?)(?:\n|$|Memory)/i,
      memory: /Memory[:\s]*(.+?)(?:\n|$|Graphics|Storage)/i,
      graphics: /Graphics[:\s]*(.+?)(?:\n|$|DirectX|Storage)/i,
      storage: /Storage[:\s]*(.+?)(?:\n|$|Sound)/i,
      directx: /DirectX[:\s]*(.+?)(?:\n|$)/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        requirements[key] = match[1].trim();
      }
    }

    return requirements;
  };

  const minReqs = parseRequirements(minimum);
  const recReqs = parseRequirements(recommended);

  // Si después de parsear no hay datos, no mostrar
  if ((!minReqs || Object.keys(minReqs).length === 0) && 
      (!recReqs || Object.keys(recReqs).length === 0)) {
    return null;
  }

  const RequirementItem = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    
    return (
      <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
        <Icon size={20} className="text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-sm text-gray-200 break-words">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-6">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-6">
        💻 Requisitos del Sistema
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requisitos Mínimos */}
        {minReqs && Object.keys(minReqs).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Mínimos
            </h3>
            <div className="space-y-2">
              <RequirementItem icon={Monitor} label="Sistema Operativo" value={minReqs.os} />
              <RequirementItem icon={Cpu} label="Procesador" value={minReqs.processor} />
              <RequirementItem icon={MemoryStick} label="Memoria RAM" value={minReqs.memory} />
              <RequirementItem icon={Monitor} label="Gráficos" value={minReqs.graphics} />
              <RequirementItem icon={HardDrive} label="Almacenamiento" value={minReqs.storage} />
              {minReqs.directx && (
                <RequirementItem icon={Monitor} label="DirectX" value={minReqs.directx} />
              )}
            </div>
          </div>
        )}

        {/* Requisitos Recomendados */}
        {recReqs && Object.keys(recReqs).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Recomendados
            </h3>
            <div className="space-y-2">
              <RequirementItem icon={Monitor} label="Sistema Operativo" value={recReqs.os} />
              <RequirementItem icon={Cpu} label="Procesador" value={recReqs.processor} />
              <RequirementItem icon={MemoryStick} label="Memoria RAM" value={recReqs.memory} />
              <RequirementItem icon={Monitor} label="Gráficos" value={recReqs.graphics} />
              <RequirementItem icon={HardDrive} label="Almacenamiento" value={recReqs.storage} />
              {recReqs.directx && (
                <RequirementItem icon={Monitor} label="DirectX" value={recReqs.directx} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fallback: Mostrar HTML original si el parseo no funcionó bien */}
      {(!minReqs || Object.keys(minReqs).length === 0) && minimum && (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-200 mb-2">Mínimos</h3>
          <div 
            className="text-sm text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: minimum }}
          />
        </div>
      )}
      {(!recReqs || Object.keys(recReqs).length === 0) && recommended && (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-200 mb-2">Recomendados</h3>
          <div 
            className="text-sm text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: recommended }}
          />
        </div>
      )}
    </div>
  );
}
