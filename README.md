# Impacto Kids 💙💚

Aplicação web full-stack desenvolvida para apoiar uma organização sem fins lucrativos voltada a crianças em situação de vulnerabilidade social. A plataforma permite que doadores se cadastrem, façam doações (inclusive de forma anônima) e acompanhem o impacto da instituição, enquanto administradores gerenciam o sistema.

## 📖 Sobre o projeto

O Impacto Kids nasceu como um projeto acadêmico (originalmente um layout Figma convertido em HTML/CSS) e evoluiu para uma aplicação full-stack completa, com backend em Spring Boot e frontend em HTML, CSS e JavaScript puro.

O objetivo é oferecer uma experiência simples e confiável tanto para quem quer contribuir financeiramente quanto para a equipe da ONG que precisa gerenciar cadastros, doações e conteúdo do site.

## ✨ Funcionalidades

- Cadastro e autenticação de usuários (doadores e administradores)
- Login com JWT e senhas protegidas via BCrypt
- Doações anônimas, com possibilidade de vínculo posterior à conta via e-mail
- Formulário de contato integrado à API
- Formulário de doação com validação e sem armazenamento de dados de cartão (conformidade com boas práticas de PCI-DSS)
- Emissão de dados fiscais (CPF/CNPJ) somente quando solicitado, para recibo
- Interface responsiva, seguindo uma escala de espaçamento de 8px, fonte Inter e paleta azul/verde

## 🛠️ Tecnologias utilizadas

**Backend**
- Java 21
- Spring Boot
- Spring Security (sessão stateless, pronta para JWT)
- MySQL
- Bean Validation (DTOs)
- BCrypt (hash de senhas)

**Frontend**
- HTML5 semântico
- CSS3 (variáveis de tema, layout responsivo)
- JavaScript (fetch API, async/await)

**Ferramentas**
- IntelliJ IDEA
- Postman (testes de API)
- Git/GitHub

## 🏗️ Arquitetura

```
impacto-kids/
├── backend/
│   ├── src/main/java/com/impactokids/
│   │   ├── controller/
│   │   │   └── AuthController.java
│   │   ├── service/
│   │   │   └── UsuarioService.java
│   │   ├── repository/
│   │   │   └── UsuarioRepository.java
│   │   ├── dto/
│   │   │   └── RegistroDTO.java
│   │   ├── model/
│   │   │   └── Usuario.java
│   │   └── config/
│   │       └── SecurityConfig.java
│   └── pom.xml
│
└── frontend/
    ├── index.html
    ├── login.html
    ├── metas.html
    ├── css/
    ├── js/
    │   └── auth.js
    │    ├── script.js
    └── assets/
```

## 🌐 Deploy

O projeto está disponível online:

🔗 **[impacto-kids](https://6a4471144b2aaba8d61a97ea--clinquant-mandazi-7f54c9.netlify.app/)**

## 🔑 Endpoints principais

| Método | Rota                  | Descrição                          |
|--------|------------------------|-------------------------------------|
| POST   | `/api/auth/registro`   | Cadastra um novo usuário            |
| POST   | `/api/auth/login`      | Autentica e retorna o token JWT     |
| POST   | `/api/contato`         | Envia mensagem de contato           |
| POST   | `/api/doacao`          | Registra uma doação                 |

> Endpoints sujeitos a alteração conforme o projeto evolui — ajuste esta tabela conforme sua API real.


## 📌 Decisões de modelagem

- Doações podem ser feitas anonimamente, com vínculo posterior à conta via correspondência de e-mail
- CPF/CNPJ só são coletados no momento da emissão de recibo fiscal, não no cadastro
- Papéis de usuário (`ADMIN` / `DOADOR`) são definidos no momento do registro

## 🤝 Contribuindo

Este é um projeto acadêmico em desenvolvimento ativo. Sugestões e melhorias são bem-vindas via issues ou pull requests.

## 📄 Licença

Este projeto é distribuído sob **todos os direitos reservados**. O código está disponível publicamente apenas para fins de visualização e avaliação acadêmica — não é permitido copiar, modificar, redistribuir ou utilizar este código, no todo ou em parte, sem autorização expressa dos autores. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 👥 Autores

Desenvolvido por **Gabriel Gonçalves** e **Ana Julia** — estudantes de programação e desenvolvimento web no IFSul (Instituto Federal Sul-rio-grandense).
