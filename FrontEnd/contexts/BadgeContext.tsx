// arquivo contexts/BadgeContext.tsx
// contexto global que mantém a contagem de reagendamentos pendentes
// assim o badge no sidebar do admin aparece em todas as telas sem sumir

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { listarPendenciasReagendamento } from '../services/api';
import { useAuth } from './AuthContext';

// formato dos dados expostos pelo contexto
interface BadgeContextData {
  // quantidade de reagendamentos pendentes aguardando aprovação do admin
  pendentesReagendamento: number;
  // força o recarregamento da contagem (chamar após aprovar/rejeitar)
  recarregarBadge: () => void;
}

const BadgeContext = createContext<BadgeContextData>({
  pendentesReagendamento: 0,
  recarregarBadge: () => {},
});

// hook para usar o contexto nos componentes
export function useBadge(): BadgeContextData {
  return useContext(BadgeContext);
}

// provider que envolve o app e disponibiliza o badge para todas as telas
export function BadgeProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  // quantidade de reagendamentos pendentes
  const [pendentesReagendamento, setPendentesReagendamento] = useState(0);

  // busca a contagem do backend
  const recarregarBadge = useCallback(async () => {
    if (!token) return;
    try {
      const resultado = await listarPendenciasReagendamento(token, 'pendente');
      const lista = resultado.dados?.pendencias ?? resultado.dados ?? [];
      const quantidade = Array.isArray(lista) ? lista.length : 0;
      setPendentesReagendamento(quantidade);
    } catch {
      // falha silenciosa — badge fica com o último valor
    }
  }, [token]);

  // carrega ao iniciar e toda vez que o token mudar (login/logout)
  useEffect(() => {
    recarregarBadge();
  }, [recarregarBadge]);

  return (
    <BadgeContext.Provider value={{ pendentesReagendamento, recarregarBadge }}>
      {children}
    </BadgeContext.Provider>
  );
}
