# Desafio Play For A Cause

Você foi contratado para implementar uma aplicação de chat. Esta solução deverá prover um mecanismo de autenticação simples, contando com o cadastro do usuário indicando um email, nome de usuário e senha. A aplicação deverá armazenar as mensagens enviadas pelos usuários, que também deverão receber em tempo real as mensagens enviadas pelos demais usuários.

Aplicação na versel: https://desafio-play-for-a-cause-natanborges5s-projects.vercel.app/ <br><br>
O back-end da aplicação está rodando na [**Railway**](https://railway.app/) <br><br>

• Desenvolvimento: Durante o desenvolvimento tive dificuldades para usar websockets, então decidi trocar por SSE(Server Sent Event), foi a primeira vez que implementei essa tecnologia que possibilita o cliente receber atualizações da API por HTTP. <br>
Desenvolvi o back-end com os fundamentos do DDD e Clean Architecture, também criei testes unitários e End-to-End conforme o desenvolvimento dos casos de uso.

• Plano de continuidade: Para melhorar a aplicação poderia ser implementado o envio de imagens com AWS S3.

Recomendações

- Linguagem: NodeJS + Typescript
- Banco de Dados:
    - Postgres
    - Redis
- Backend:
    - NestJS
    - Prisma ORM
    - SocketIO ou websocket para realtime
- Frontend:
    - NextJS (Page Routing ou App Routing),
    - opções: Chakra UI, Mantine Dev e/ou TailwindCSS
    - React Context API e / ou React Hook Form
    - Axios e React Query
    - Zod, ou alternativas para validação de objetos
    - Referências para a implementação da interface: https://dribbble.com/search/chat/chat
- Publicação em Vercel, Railway, ou similares

Opcionais

- Gerenciamento de estados via zustand
- **Cloudinary**, **AWS** **S3** ou alternativas para upload de imagens
- Estratégias para otimizar a integração entre backend e frontend se apropriando da geração de códigos, como o **tRPC** ou geradores de código baseados em **Swagger**

Observações

- Prepare o desafio de forma que possa fazer parte do seu portfólio
- A qualidade dos commits será avaliada
- Destaque os novos conhecimentos que aprendeu, assim como o aproveitamento de abordagens
- Outras documentações e justificativas para a troca de bibliotecas ou abordagens é bem vinda
- Identifique o plano de continuidade e melhorias, principalmente em casos de entrega parcial
- 3 a 5 dias para a entrega
