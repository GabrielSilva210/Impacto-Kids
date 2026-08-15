const tabsWrap     = document.querySelector('.tabs');
const tabLogin      = document.getElementById('tab-login');
const tabCadastro   = document.getElementById('tab-cadastro');
const panelLogin    = document.getElementById('panel-login');
const panelCadastro = document.getElementById('panel-cadastro');
const toast         = document.getElementById('toast');

function irPara(destino) {
  const isLogin = destino === 'login';

  tabLogin.classList.toggle('is-active', isLogin);
  tabCadastro.classList.toggle('is-active', !isLogin);
  tabLogin.setAttribute('aria-selected', isLogin);
  tabCadastro.setAttribute('aria-selected', !isLogin);

  panelLogin.classList.toggle('is-active', isLogin);
  panelCadastro.classList.toggle('is-active', !isLogin);

  tabsWrap.dataset.active = destino;
  limparToast();
}

tabLogin.addEventListener('click', () => irPara('login'));
tabCadastro.addEventListener('click', () => irPara('cadastro'));

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => irPara(btn.dataset.goto));
});

document.querySelectorAll('.field__toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    const isSenhaVisivel = input.type === 'text';
    input.type = isSenhaVisivel ? 'password' : 'text';
    btn.textContent = isSenhaVisivel ? '👁' : '🙈';
  });
});

function mostrarErro(input, mensagem) {
  input.classList.add('is-invalid');
  const errorEl = input.closest('.field')?.querySelector('.field__error');
  if (errorEl) errorEl.textContent = mensagem;
}

function limparErro(input) {
  input.classList.remove('is-invalid');
  const errorEl = input.closest('.field')?.querySelector('.field__error');
  if (errorEl) errorEl.textContent = '';
}

function limparToast() {
  toast.textContent = '';
  toast.classList.remove('is-visible', 'is-error');
}

function mostrarToast(mensagem, erro = false) {
  toast.textContent = mensagem;
  toast.classList.toggle('is-error', erro);
  toast.classList.add('is-visible');
}

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

panelLogin.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const email = panelLogin.email;
  const senha = panelLogin.senha;
  let valido = true;

  limparErro(email);
  limparErro(senha);

  if (!emailValido(email.value)) {
    mostrarErro(email, 'Digite um e-mail válido.');
    valido = false;
  }
  if (senha.value.length < 6) {
    mostrarErro(senha, 'A senha deve ter no mínimo 6 caracteres.');
    valido = false;
  }

  if (!valido) return;

  mostrarToast(`Bem-vindo(a) de volta, ${email.value}!`);
});

panelCadastro.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nome            = panelCadastro.nome;
  const email           = panelCadastro.email;
  const senha           = panelCadastro.senha;
  const confirmarSenha  = panelCadastro.confirmarSenha;
  const termos          = panelCadastro.termos;
  let valido = true;

  [nome, email, senha, confirmarSenha].forEach(limparErro);

  if (nome.value.trim().length < 3) {
    mostrarErro(nome, 'Informe seu nome completo.');
    valido = false;
  }
  if (!emailValido(email.value)) {
    mostrarErro(email, 'Digite um e-mail válido.');
    valido = false;
  }
  if (senha.value.length < 6) {
    mostrarErro(senha, 'A senha deve ter no mínimo 6 caracteres.');
    valido = false;
  }
  if (confirmarSenha.value !== senha.value) {
    mostrarErro(confirmarSenha, 'As senhas não coincidem.');
    valido = false;
  }
  if (!termos.checked) {
    mostrarToast('Você precisa aceitar os termos de uso.', true);
    valido = false;
  }

  if (!valido) return;

  mostrarToast(`Cadastro criado com sucesso, ${nome.value.split(' ')[0]}! Faça login para continuar.`);
  panelCadastro.reset();
  setTimeout(() => irPara('login'), 1400);
});