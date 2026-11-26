const CHAVE_BANCO = 'voz_do_bairro_auth_v1';

function clonarDadosIniciais() {
  return structuredClone(DADOS_INICIAIS);
}

function getBanco() {
  const base = clonarDadosIniciais();
  try {
    const raw = localStorage.getItem(CHAVE_BANCO);
    if (!raw) return base;
    const parsed = JSON.parse(raw);

    return {
      ...base,
      ...parsed,
      sessaoUsuarioId: parsed.sessaoUsuarioId ?? null,
      usuarios: Array.isArray(parsed.usuarios) ? parsed.usuarios : base.usuarios,
      ocorrencias: Array.isArray(parsed.ocorrencias) ? parsed.ocorrencias : base.ocorrencias,
      eventosSamba: Array.isArray(parsed.eventosSamba) ? parsed.eventosSamba : base.eventosSamba,
      comercios: Array.isArray(parsed.comercios) ? parsed.comercios : base.comercios,
      equipe: Array.isArray(parsed.equipe) ? parsed.equipe : base.equipe,
      patrocinadores: Array.isArray(parsed.patrocinadores) ? parsed.patrocinadores : base.patrocinadores,
      acessibilidade: {
        ...base.acessibilidade,
        ...(parsed.acessibilidade && typeof parsed.acessibilidade === 'object' ? parsed.acessibilidade : {})
      }
    };
  } catch {
    return base;
  }
}

function setBanco(banco) {
  localStorage.setItem(CHAVE_BANCO, JSON.stringify(banco));
}

function getUsuarioLogado() {
  const db = getBanco();
  if (!db.sessaoUsuarioId) return null;
  return (db.usuarios || []).find(u => u.id === db.sessaoUsuarioId) || null;
}

function sairConta(redirecionarPara = 'login.html') {
  const db = getBanco();
  db.sessaoUsuarioId = null;
  setBanco(db);
  window.location.href = redirecionarPara;
}

function toggleAccessibilityDropdown(event) {
  event?.stopPropagation();
  const menu = document.getElementById('dropdown-acessibilidade');
  const btn = document.getElementById('btn-acessibilidade-nav');
  if (!menu) return;
  const aberto = !menu.classList.contains('hidden');
  menu.classList.toggle('hidden', aberto);
  btn?.setAttribute('aria-expanded', String(!aberto));
}

document.addEventListener('click', (e) => {
  const wrap = document.getElementById('nav-accessibility-wrap');
  const menu = document.getElementById('dropdown-acessibilidade');
  const btn = document.getElementById('btn-acessibilidade-nav');
  if (wrap && menu && !wrap.contains(e.target)) {
    menu.classList.add('hidden');
    btn?.setAttribute('aria-expanded', 'false');
  }
});

function aplicarAcessibilidade() {
  const db = getBanco();
  const a11y = db.acessibilidade || {};
  const fontScale = Number(a11y.fontScale) || 1;
  const highContrast = Boolean(a11y.highContrast);
  const underlineLinks = Boolean(a11y.underlineLinks);
  const reduceMotion = Boolean(a11y.reduceMotion);

  document.documentElement.style.setProperty('--site-font-scale', String(fontScale));
  document.body?.classList.toggle('high-contrast', highContrast);
  document.body?.classList.toggle('underline-links', underlineLinks);
  document.body?.classList.toggle('reduce-motion', reduceMotion);

  const sync = (btnId, lblId, ativo) => {
    const btn = document.getElementById(btnId);
    const lbl = document.getElementById(lblId);
    btn?.classList.toggle('bg-red-600', ativo);
    btn?.classList.toggle('text-white', ativo);
    btn?.classList.toggle('ativo', ativo);
    if (lbl) lbl.textContent = ativo ? 'ON' : 'OFF';
  };

  sync('toggle-contrast', 'label-contrast', highContrast);
  sync('toggle-underline', 'label-underline', underlineLinks);
  sync('toggle-motion', 'label-motion', reduceMotion);
}

function changeFontScale(delta) {
  const db = getBanco();
  const atual = Number(db.acessibilidade.fontScale) || 1;
  db.acessibilidade.fontScale = Math.min(1.4, Math.max(0.9, Number((atual + delta).toFixed(2))));
  setBanco(db);
  aplicarAcessibilidade();
}

function resetFontScale() {
  const db = getBanco();
  db.acessibilidade.fontScale = 1;
  setBanco(db);
  aplicarAcessibilidade();
}

function toggleA11y(chave) {
  const db = getBanco();
  db.acessibilidade[chave] = !Boolean(db.acessibilidade[chave]);
  setBanco(db);
  aplicarAcessibilidade();
}

function iconeCategoria(cat) {
  const mapa = {
    'Segurança': 'shield-alert',
    'Infraestrutura': 'construction',
    'Iluminação': 'lightbulb',
    'Limpeza': 'trash-2',
    'Enchentes': 'cloud-rain',
    'Animais': 'paw-print',
    'Outro': 'tag'
  };
  return mapa[cat] || 'tag';
}

function badgeSituacao(situacao) {
  if (situacao === 'Resolvida') return 'selo-preto';
  if (situacao === 'Em andamento') return 'selo';
  return 'selo-vermelho';
}

let callbackAtualizarModal = null;

function escFecharModal(event) {
  if (event.key === 'Escape') {
    fecharModalOcorrencia();
  }
}

function fecharModalSeClicarFora(event) {
  if (event.target && event.target.id === 'modal-ocorrencia') {
    fecharModalOcorrencia();
  }
}

function abrirModalOcorrencia(id, onAfterSave) {
  callbackAtualizarModal = typeof onAfterSave === 'function' ? onAfterSave : null;
  const db = getBanco();
  const oc = db.ocorrencias.find(item => item.id === id);
  if (!oc) return;

  const modal = document.getElementById('modal-ocorrencia');
  const box = document.getElementById('modal-ocorrencia-box');
  if (!modal || !box) return;

  box.style.position = 'relative';

  const atualizacoes = Array.isArray(oc.atualizacoes) ? oc.atualizacoes : [];

  box.innerHTML = `
    <button
      type="button"
      onclick="fecharModalOcorrencia()"
      aria-label="Fechar ocorrência"
      style="position:absolute; top:12px; right:12px; width:34px; height:34px; display:inline-flex; align-items:center; justify-content:center; font-size:22px; font-weight:800; line-height:1; color:#09090b; background:#ffffff; border:1px solid #09090b; border-radius:3px; cursor:pointer;"
      onmouseover="this.style.background='#dc2626'; this.style.borderColor='#dc2626'; this.style.color='#ffffff';"
      onmouseout="this.style.background='#ffffff'; this.style.borderColor='#09090b'; this.style.color='#09090b';"
    >&times;</button>

    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; padding-right:42px;">
      ${oc.codigo ? `<span class="selo selo-preto">${esc(oc.codigo)}</span>` : ''}
      <span class="selo">${esc(oc.categoria)}</span>
      <span class="selo ${badgeSituacao(oc.situacao)}">${esc(oc.situacao)}</span>
    </div>

    <h2 class="titulo" style="font-size:24px;">${esc(oc.titulo)}</h2>
    <p class="subtitulo" style="font-size:12px; font-weight:700;">${esc(oc.local)} · ${oc.anonimo ? 'Anônimo' : 'Por ' + esc(oc.autor)}</p>
    ${oc.imagem ? `<img src="${escAttr(oc.imagem)}" alt="${escAttr(oc.titulo)}" style="margin-top:16px; width:100%; max-height:260px; object-fit:cover; border:1px solid #d4d4d8;" />` : ''}
    <p class="subtitulo" style="font-size:14px; color:#27272a; margin-top:14px;">${esc(oc.descricao)}</p>

    <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e4e4e7;">
      <h3 class="titulo" style="font-size:16px; text-transform:uppercase; margin-bottom:12px;">Atualizações (${atualizacoes.length})</h3>
      <div style="display:grid; gap:8px; max-height:190px; overflow-y:auto; margin-bottom:16px;">
        ${atualizacoes.length === 0
          ? `<p class="subtitulo" style="font-size:12px;">Ainda não há atualizações neste registro.</p>`
          : atualizacoes.map(a => `
            <div style="background:#fafafa; border:1px solid #e4e4e7; padding:12px; font-size:13px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; color:#52525b; margin-bottom:4px;">
                <span>${esc(a.autor)}</span>
                <span>${esc(a.data)}</span>
              </div>
              <p style="margin:0; color:#18181b;">${esc(a.texto)}</p>
            </div>
          `).join('')}
      </div>

      <form onsubmit="salvarAtualizacaoModal(event, '${escAttr(oc.id)}')" class="form-box" style="margin-top:0; background:#fafafa;">
        <p class="kicker" style="color:#09090b;">Atualizar andamento ou situação</p>
        <div class="linha-2" style="margin-bottom:12px;">
          <input name="autor" placeholder="Seu nome (opcional)" />
          <select name="situacao">
            ${SITUACOES.map(s => `<option value="${escAttr(s)}" ${oc.situacao === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}
          </select>
        </div>
        <div class="campo-grupo">
          <textarea name="texto" rows="2" required placeholder="O que aconteceu ou mudou nesse caso?"></textarea>
        </div>
        <button type="submit" class="btn btn-vermelho">Salvar atualização</button>
      </form>
    </div>
  `;

  modal.onclick = fecharModalSeClicarFora;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.addEventListener('keydown', escFecharModal);
  if (window.lucide) lucide.createIcons();
}

function fecharModalOcorrencia() {
  const modal = document.getElementById('modal-ocorrencia');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.removeEventListener('keydown', escFecharModal);
}

function salvarAtualizacaoModal(e, id) {
  e.preventDefault();
  const db = getBanco();
  const oc = db.ocorrencias.find(item => item.id === id);
  if (!oc) return;

  const fd = new FormData(e.target);
  const texto = (fd.get('texto') || '').toString().trim();
  if (!texto) return;

  const logado = getUsuarioLogado();
  oc.situacao = fd.get('situacao').toString();
  oc.atualizacoes = Array.isArray(oc.atualizacoes) ? oc.atualizacoes : [];
  oc.atualizacoes.push({
    autor: (fd.get('autor') || '').toString().trim() || logado?.nome || 'Morador(a)',
    texto,
    data: new Date().toLocaleDateString('pt-BR')
  });

  setBanco(db);
  abrirModalOcorrencia(id, callbackAtualizarModal);
  if (typeof callbackAtualizarModal === 'function') callbackAtualizarModal();
}

function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(v) {
  return esc(v).replace(/'/g, '&#39;');
}

aplicarAcessibilidade();
if (window.lucide) lucide.createIcons();


//BOTÃO POLICIA NA NAV

(function inserirBotaoPoliciaNoTopo() {
  document.addEventListener("DOMContentLoaded", function () {
    const acoes = document.querySelector(".topo .acoes");
    if (!acoes || acoes.querySelector(".btn-policia")) return;

    const btnEntrar = Array.from(acoes.querySelectorAll("a, button")).find(
      (el) => el.textContent && el.textContent.trim().toLowerCase() === "entrar",
    );

    const linkPolicia = document.createElement("a");
    linkPolicia.href = "tel:190";
    linkPolicia.className = "btn-policia";
    linkPolicia.setAttribute("aria-label", "Polícia — Emergência 190");
    linkPolicia.setAttribute("title", "Polícia (190)");
    linkPolicia.innerHTML = `<i data-lucide="shield"></i>`;

    if (btnEntrar && btnEntrar.parentElement === acoes) {
      btnEntrar.insertAdjacentElement("beforebegin", linkPolicia);
    } else {
      acoes.prepend(linkPolicia);
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  });
})();