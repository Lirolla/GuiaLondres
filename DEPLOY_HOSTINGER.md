# 🚀 Guia de Deploy na Hostinger

Este guia explica como fazer o deploy completo do Guia Londres Awards na Hostinger.

---

## 📋 Pré-requisitos

1. Conta na Hostinger com plano que suporte Node.js
2. Acesso ao painel de controle (hPanel)
3. Acesso ao phpMyAdmin
4. Git instalado no servidor

---

## 🗄️ PASSO 1: Configurar Banco de Dados MySQL

### 1.1. Criar Banco de Dados

1. Acesse o **hPanel** da Hostinger
2. Vá em **Banco de Dados MySQL**
3. Clique em **Criar Novo Banco de Dados**
4. Nome sugerido: `guia_londres_awards`
5. Anote as credenciais:
   - **Host**: geralmente `localhost`
   - **Usuário**: criado automaticamente
   - **Senha**: defina uma senha forte
   - **Nome do Banco**: `guia_londres_awards`

### 1.2. Importar Estrutura do Banco

1. No hPanel, clique em **phpMyAdmin**
2. Selecione o banco `guia_londres_awards`
3. Clique na aba **Importar**
4. Escolha o arquivo `database.sql` (localizado na raiz do projeto)
5. Clique em **Executar**

✅ **Pronto!** Todas as tabelas e dados iniciais foram criados.

---

## 🔧 PASSO 2: Configurar Backend API

### 2.1. Fazer Upload dos Arquivos

**Opção A: Via Git (Recomendado)**
```bash
# No servidor Hostinger via SSH
cd ~/domains/seudominio.com/public_html
git clone https://github.com/Lirolla/GuiaLondres.git
cd GuiaLondres/api
```

**Opção B: Via FTP**
- Use FileZilla ou o File Manager da Hostinger
- Faça upload da pasta `api` para `public_html/api`

### 2.2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cd ~/public_html/GuiaLondres/api
cp .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:
```env
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=guia_londres_awards
DB_PORT=3306

JWT_SECRET=gere_uma_chave_super_secreta_aqui_123456

PORT=3001
```

**Dica:** Para gerar um JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.3. Instalar Dependências

```bash
cd ~/public_html/GuiaLondres/api
npm install
```

### 2.4. Iniciar API

**Opção A: PM2 (Recomendado para produção)**
```bash
npm install -g pm2
pm2 start server.js --name guia-londres-api
pm2 save
pm2 startup
```

**Opção B: Nodemon (Desenvolvimento)**
```bash
npm run dev
```

### 2.5. Testar API

```bash
curl http://localhost:3001/api/health
```

Resposta esperada:
```json
{"status":"OK","message":"Guia Londres Awards API is running"}
```

---

## 🌐 PASSO 3: Configurar Frontend

### 3.1. Fazer Build de Produção

No seu computador local:
```bash
cd GuiaLondres
npm run build
```

### 3.2. Upload dos Arquivos

**Via FTP/File Manager:**
1. Faça upload da pasta `dist` para `public_html`
2. Renomeie `dist` para o nome do seu domínio ou deixe como está

**Via Git:**
```bash
cd ~/public_html/GuiaLondres
npm install
npm run build
```

### 3.3. Configurar .htaccess (Para React Router)

Crie um arquivo `.htaccess` na pasta `dist` (ou raiz do site):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔗 PASSO 4: Conectar Frontend com Backend

### 4.1. Atualizar URLs da API

No código do frontend, atualize a URL base da API:

**Arquivo:** `src/config/api.js` (criar se não existir)
```javascript
export const API_BASE_URL = 'https://seudominio.com/api';
```

### 4.2. Configurar CORS

No arquivo `api/server.js`, certifique-se que o CORS permite seu domínio:

```javascript
app.use(cors({
  origin: ['https://seudominio.com', 'http://localhost:3000'],
  credentials: true
}));
```

---

## ✅ PASSO 5: Verificações Finais

### 5.1. Checklist de Testes

- [ ] Banco de dados criado e populado
- [ ] API respondendo em `/api/health`
- [ ] Frontend carregando corretamente
- [ ] Login funcionando (contato@lirolla.com / Pagotto24)
- [ ] Páginas de Vídeos e Parceiros carregando
- [ ] Sistema de agendamento do estúdio funcional

### 5.2. Monitoramento

```bash
# Ver logs da API
pm2 logs guia-londres-api

# Ver status
pm2 status

# Reiniciar se necessário
pm2 restart guia-londres-api
```

---

## 🔐 Segurança

### Recomendações:

1. **Altere a senha do usuário admin** no banco de dados
2. **Use HTTPS** (SSL/TLS) - a Hostinger oferece SSL grátis
3. **Proteja o arquivo `.env`** - nunca faça commit dele no Git
4. **Configure firewall** para permitir apenas portas necessárias
5. **Faça backups regulares** do banco de dados

---

## 🆘 Problemas Comuns

### API não inicia
```bash
# Verificar logs
pm2 logs

# Verificar se a porta está em uso
netstat -tulpn | grep 3001
```

### Erro de conexão com banco
- Verifique as credenciais no `.env`
- Teste a conexão: `mysql -u usuario -p -h localhost`

### Frontend não carrega
- Verifique o `.htaccess`
- Limpe cache do navegador
- Verifique permissões dos arquivos (644 para arquivos, 755 para pastas)

---

## 📞 Suporte

Para dúvidas sobre a Hostinger:
- Suporte 24/7: https://www.hostinger.com.br/contato

Para dúvidas sobre o código:
- Abra uma issue no GitHub

---

**Desenvolvido com ❤️ para a comunidade brasileira em Londres**
