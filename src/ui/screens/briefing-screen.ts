const SCREENS = [
  {
    label: 'TRANSFER NOTICE',
    paragraphs: [
      'Steadward settlement, planet Sable. Population 200. Functional infrastructure. No functional governance.',
      'The founders built this place. They didn\'t build a system to run it without them.',
      'That\'s your job now.',
    ],
    button: 'Continue',
  },
  {
    label: 'SITUATION REPORT',
    paragraphs: [
      'Four departments. Five leaders. Limited attention. Every week follows the same cycle: observe, plan, execute, review.',
      'You have ten attention points per week. Spend them on what matters. Delegate the rest.',
      'The settlement doesn\'t need a hero. It needs a system that works when you\'re not watching.',
    ],
    button: 'Continue',
  },
  {
    label: 'STANDING ORDERS',
    paragraphs: [
      'Build autonomy. When the settlement can sustain itself for three consecutive weeks, your work here is done.',
      'If trust collapses or any critical resource runs dry, it\'s over.',
    ],
    secondaryText: 'Week 1. Two departments online. Two leaders on site. Begin when ready.',
    button: 'Begin Week 1',
  },
];

export function renderBriefingSequence(
  container: HTMLElement,
  onComplete: () => void,
): void {
  let currentScreen = 0;

  function renderScreen(index: number): void {
    const screen = SCREENS[index];
    const el = document.createElement('div');
    el.className = 'briefing-screen';

    el.innerHTML = `
      <div class="briefing-content">
        <span class="briefing-label">${screen.label}</span>
        ${screen.paragraphs.map((p) => `<p class="briefing-text">${p}</p>`).join('')}
        ${screen.secondaryText ? `<p class="briefing-text briefing-text--secondary">${screen.secondaryText}</p>` : ''}
        <button class="btn-primary briefing-advance" type="button">${screen.button}</button>
      </div>
    `;

    container.innerHTML = '';
    container.appendChild(el);

    el.querySelector('.briefing-advance')?.addEventListener('click', () => {
      currentScreen++;
      if (currentScreen >= SCREENS.length) {
        el.classList.add('briefing-screen--exiting');
        setTimeout(() => {
          container.innerHTML = '';
          onComplete();
        }, 300);
      } else {
        renderScreen(currentScreen);
      }
    });
  }

  renderScreen(0);
}
