// arquivo app/index.tsx
// aqui a tela inicial do app redirecionando para o login
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/login" />;
}