const goals = [
    {
      id: 'camas',
      tag: 'Moradia',
      title: 'Camas de casal para famílias acolhidas',
      desc: 'Cada cama equipada (colchão, estrutura e enxoval) custa R$ 450. A meta cobre 12 camas para o novo abrigo.',
      unit: 'R$',
      target: 5400,
      raised: 1800,
      chips: [500, 900, 1350]
    },
    {
      id: 'comida',
      tag: 'Alimentação',
      title: 'Quilos de alimento para a Casa Esperança',
      desc: 'Reforço de cesta básica para 80 famílias atendidas mensalmente pela instituição parceira.',
      unit: 'kg',
      target: 2000,
      raised: 650,
      chips: [100, 250, 500]
    },
    {
      id: 'geral',
      tag: 'Geral',
      title: 'Fundo livre de apoio ao Impacto Kids',
      desc: 'Uso flexível para as necessidades mais urgentes do mês: transporte, material escolar e emergências.',
      unit: 'R$',
      target: 50000,
      raised: 18200,
      chips: [1000, 2500, 5000]
    }
  ];

  const supportersLog = {}; // id -> [{name, amount}]
  goals.forEach(g => supportersLog[g.id] = []);

  function fmt(n, unit){
    const num = Number(n).toLocaleString('pt-BR', {maximumFractionDigits:0});
    return unit === 'R$' ? `R$ ${num}` : `${num} kg`;
  }

  function renderOverview(){
    const totalGoals = goals.length;
    const doneGoals = goals.filter(g => g.raised >= g.target).length;
    const moneyGoals = goals.filter(g => g.unit === 'R$');
    const totalTarget = moneyGoals.reduce((s,g)=>s+g.target,0);
    const totalRaised = moneyGoals.reduce((s,g)=>s+Math.min(g.raised,g.target),0);
    const pct = totalTarget ? Math.round((totalRaised/totalTarget)*100) : 0;

    document.getElementById('overviewStrip').innerHTML = `
      <div class="overview-cell">
        <span class="overview-num mono">${totalGoals}</span>
        <span class="overview-label">Metas ativas</span>
      </div>
      <div class="overview-cell">
        <span class="overview-num mono">${fmt(totalRaised,'R$')}</span>
        <span class="overview-label">Arrecadado em metas de dinheiro</span>
      </div>
      <div class="overview-cell">
        <span class="overview-num mono">${pct}%</span>
        <span class="overview-label">Do total financeiro coberto</span>
      </div>
    `;
    document.getElementById('goalsCount').textContent = `${totalGoals - doneGoals} em aberto · ${doneGoals} concluída${doneGoals===1?'':'s'}`;
  }

  function renderTicks(n){
    return Array.from({length:n}).map(()=>'<span></span>').join('');
  }

  function renderGoals(){
    const grid = document.getElementById('goalGrid');
    grid.innerHTML = goals.map(g => {
      const pct = Math.min(100, Math.round((g.raised/g.target)*100));
      const done = g.raised >= g.target;
      const remaining = Math.max(0, g.target - g.raised);
      const supporters = supportersLog[g.id];
      const supportersHtml = supporters.length
        ? supporters.slice().reverse().map(s => `<div class="supporter-row"><span>${s.name}</span><span class="amt">${fmt(s.amount,g.unit)}</span></div>`).join('')
        : `<div class="supporters-empty">Seja a primeira empresa a contribuir com esta meta.</div>`;

      return `
      <div class="goal-card ${done?'done':''}" data-id="${g.id}">
        ${done ? '<div class="ribbon">Meta concluída</div>' : ''}
        <div>
          <div class="goal-tag">${g.tag}</div>
          <h3 class="goal-title">${g.title}</h3>
          <p class="goal-desc">${g.desc}</p>
        </div>

        <div class="ruler">
          <div class="ruler-fill" style="width:${pct}%"></div>
          <div class="ruler-ticks">${renderTicks(10)}</div>
        </div>
        <div class="figures">
          <span class="raised mono">${fmt(g.raised, g.unit)} arrecadados</span>
          <span class="need mono">meta: ${fmt(g.target, g.unit)}</span>
        </div>
        <div class="remaining mono">${done ? '✓ Necessidade coberta — obrigado!' : `Faltam ${fmt(remaining, g.unit)}`}</div>

        ${!done ? `
        <div class="donate-row" data-role="chips">
          ${g.chips.map(c => `<button type="button" class="chip" data-amount="${c}">${g.unit==='R$' ? 'R$ '+c.toLocaleString('pt-BR') : c+' kg'}</button>`).join('')}
          <button type="button" class="chip" data-amount="custom">Outro valor</button>
        </div>
        <div class="company-field">
          <input type="text" class="company-input" placeholder="Nome da empresa (opcional)">
        </div>
        <div class="donate-form">
          <input type="text" inputmode="numeric" placeholder="${g.unit==='R$' ? 'Valor em R$' : 'Quilos'}" data-role="amount-input">
          <button type="button" data-role="confirm">Confirmar doação</button>
        </div>
        <div class="feedback" data-role="feedback"></div>
        ` : ''}

        <div class="supporters">${supportersHtml}</div>
      </div>`;
    }).join('');

    attachHandlers();
  }

  function attachHandlers(){
    document.querySelectorAll('.goal-card').forEach(card => {
      const id = card.dataset.id;
      const goal = goals.find(g => g.id === id);
      const amountInput = card.querySelector('[data-role="amount-input"]');
      const chips = card.querySelectorAll('.chip');
      const feedback = card.querySelector('[data-role="feedback"]');
      const confirmBtn = card.querySelector('[data-role="confirm"]');
      const companyInput = card.querySelector('.company-input');

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          if (chip.dataset.amount !== 'custom' && amountInput){
            amountInput.value = chip.dataset.amount;
          } else if (amountInput){
            amountInput.value = '';
            amountInput.focus();
          }
        });
      });

      if (confirmBtn){
        confirmBtn.addEventListener('click', () => {
          const raw = amountInput.value.replace(/\./g,'').replace(',', '.');
          const value = parseFloat(raw);
          if (!value || value <= 0){
            feedback.textContent = 'Digite um valor válido antes de confirmar.';
            feedback.style.color = 'var(--coral)';
            return;
          }
          const companyName = (companyInput.value || 'Empresa parceira').trim();

          goal.raised += value;
          supportersLog[id].push({ name: companyName, amount: value });

          renderGoals();
          renderOverview();

          requestAnimationFrame(() => {
            const updatedCard = document.querySelector(`.goal-card[data-id="${id}"]`);
            const fb = updatedCard?.querySelector('[data-role="feedback"]');
            if (fb){
              fb.textContent = `Obrigado, ${companyName}! Meta atualizada.`;
              fb.style.color = 'var(--sky-deep)';
            }
          });
        });
      }

      if (amountInput){
        amountInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') confirmBtn.click();
        });
      }
    });
  }

  renderOverview();
  renderGoals();