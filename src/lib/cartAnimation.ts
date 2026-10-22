/**
 * Wihyfe Cart Flying Animation Utility
 * Ultra-smooth, 60/120fps hardware-accelerated flying cart animation
 * powered by Web Animations API and GPU compositing.
 */
export function animateFlyToCart(sourceElement: HTMLElement) {
  if (typeof window === 'undefined' || !sourceElement) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const cartBtn = document.getElementById('header-cart-btn');

  // Fallback target: top right header area if button not mounted
  let targetX = window.innerWidth - 75;
  let targetY = 32;

  if (cartBtn) {
    const cartRect = cartBtn.getBoundingClientRect();
    targetX = cartRect.left + cartRect.width / 2;
    targetY = cartRect.top + cartRect.height / 2;
  }

  // Center coordinates of clicked button
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;

  // Arc apex calculation (parabolic smooth rise)
  const midX = startX + (targetX - startX) * 0.45;
  const arcLift = Math.max(35, Math.min(85, Math.abs(startX - targetX) * 0.12));
  const midY = Math.min(startY, targetY) - arcLift;

  // Create flyer element
  const flyer = document.createElement('div');
  flyer.className = 'flying-cart-item';
  flyer.setAttribute('aria-hidden', 'true');
  flyer.innerHTML = `
    <div class="flying-cart-bubble">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </div>
  `;

  document.body.appendChild(flyer);

  // Check if Web Animations API is supported
  if (typeof flyer.animate === 'function') {
    const keyframes: Keyframe[] = [
      {
        transform: `translate3d(${startX}px, ${startY}px, 0) scale(1)`,
        opacity: 1,
      },
      {
        offset: 0.45,
        transform: `translate3d(${midX}px, ${midY}px, 0) scale(1.12)`,
        opacity: 1,
      },
      {
        offset: 0.85,
        transform: `translate3d(${targetX}px, ${targetY}px, 0) scale(0.65)`,
        opacity: 0.9,
      },
      {
        transform: `translate3d(${targetX}px, ${targetY}px, 0) scale(0.18)`,
        opacity: 0,
      },
    ];

    const animation = flyer.animate(keyframes, {
      duration: 440,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });

    animation.onfinish = () => {
      flyer.remove();

      if (cartBtn && typeof cartBtn.animate === 'function') {
        cartBtn.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.22) translateY(-2px)', offset: 0.35 },
            { transform: 'scale(0.96)', offset: 0.7 },
            { transform: 'scale(1)' },
          ],
          {
            duration: 340,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }
        );
      }
    };
  } else {
    // Graceful fallback for older engines
    flyer.remove();
  }
}

