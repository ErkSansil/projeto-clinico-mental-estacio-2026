// arquivo contexts/AuthContext.tsx
// contexto global de autenticação e estado compartilhado entre telas

// importação principal do React para criar o contexto e hooks
import React, { createContext, useContext, useState, ReactNode } from 'react';

// tipo que representa o usuário autenticado retornado pelo backend
type Usuario = {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'profissional';
};

// tipo que guarda os dados do formulário de cadastro entre as etapas
// compartilhado entre as telas cadastro.tsx, dados-pessoais.tsx e dados-acesso.tsx
type DadosCadastro = {
  tipo: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  celular: string;
  endereco?: string;
  responsavelNome?: string;
  responsavelContato?: string;
};

// tipo com todas as propriedades disponíveis no contexto
type AuthContextType = {
  // token JWT retornado pelo backend após o login
  token: string | null;
  // dados do usuário logado
  usuario: Usuario | null;
  // dados do formulário de cadastro em andamento
  dadosCadastro: Partial<DadosCadastro>;
  // função para salvar o token e o usuário após o login
  salvarLogin: (token: string, usuario: Usuario) => void;
  // função para limpar os dados do login (logout)
  sairLogin: () => void;
  // função para atualizar os dados do formulário de cadastro
  atualizarDadosCadastro: (dados: Partial<DadosCadastro>) => void;
  // função para limpar os dados do cadastro após a conclusão
  limparDadosCadastro: () => void;
};

// criação do contexto com valor inicial nulo
const AuthContext = createContext<AuthContextType | null>(null);

// props aceitas pelo provider do contexto
type AuthProviderProps = {
  children: ReactNode;
};

// provider que envolve a aplicação e disponibiliza o contexto para todas as telas
export function AuthProvider({ children }: AuthProviderProps) {

  // estado do token JWT, começa nulo (não autenticado)
  const [token, setToken] = useState<string | null>(null);

  // estado do usuário autenticado, começa nulo
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // estado dos dados de cadastro em andamento
  const [dadosCadastro, setDadosCadastro] = useState<Partial<DadosCadastro>>({});

  // salva o token e os dados do usuário após login bem-sucedido
  function salvarLogin(novoToken: string, novoUsuario: Usuario) {
    setToken(novoToken);
    setUsuario(novoUsuario);
  }

  // limpa todos os dados de autenticação (logout)
  function sairLogin() {
    setToken(null);
    setUsuario(null);
  }

  // atualiza parcialmente os dados do formulário de cadastro
  // permite acumular dados entre as múltiplas etapas do cadastro
  function atualizarDadosCadastro(dados: Partial<DadosCadastro>) {
    setDadosCadastro((anterior) => ({ ...anterior, ...dados }));
  }

  // limpa todos os dados do formulário após a conclusão do cadastro
  function limparDadosCadastro() {
    setDadosCadastro({});
  }

  return (
    // disponibiliza todos os valores e funções para os componentes filhos
    <AuthContext.Provider
      value={{
        token,
        usuario,
        dadosCadastro,
        salvarLogin,
        sairLogin,
        atualizarDadosCadastro,
        limparDadosCadastro,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// hook personalizado para acessar o contexto de autenticação
// lança erro se usado fora do AuthProvider
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return contexto;
}
