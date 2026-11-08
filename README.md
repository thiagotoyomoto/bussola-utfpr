# Bússola

Aplicação React para explorar docentes, áreas de pesquisa e temas de TCC. As
telas e os dados atuais são demonstrativos.

## Desenvolvimento

```sh
npm install
npm run dev
```

## Validação

```sh
npm run typecheck
npm run lint
npm run build
```

## Rotas

- `/`: apresentação
- `/encontrar-orientacao`: redireciona à busca no grafo
- `/grafo`: busca de docentes, áreas de interesse e disponibilidade para TCC
- `/perfil-docente`: perfil docente
- `/candidatura`: formulário de candidatura
- `/docentes`: painel docente
- `/cadastrar-tema`: cadastro de tema
- `/gestao`: painel de coordenação
- `/403`, `/404` e `/500`: estados de erro

O roteamento usa React Router. Em hospedagem estática, configure o servidor para
redirecionar caminhos da aplicação para `index.html`; assim, URLs diretas e a
tela 404 do cliente continuam funcionando após recarregar.

Os nós e as conexões do grafo estão tipados em `src/pages/GrafoConhecimento/graphData.ts`
para permitir a futura integração com Reagraph. Os formulários e dados permanecem
demonstrativos e não são enviados a uma API.

## Observação de autenticação

O seletor de perfil e a tela 403 são demonstrações de interface, não autenticação
nem autorização. Em produção, aplique controle de acesso e validação no servidor
ou na API; o estado do cliente não protege dados ou operações.
