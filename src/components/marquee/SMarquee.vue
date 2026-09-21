<template>
    <div
        class="s-marquee overflow-hidden"
        :class="pauseOnHover ? 's-marquee-pause' : ''"
        :aria-label="ariaLabel || undefined"
        :style="{ '--s-marquee-speed': `${speed}s`, '--s-marquee-gap': gap }"
    >
        <div class="s-marquee-track">
            <div class="s-marquee-half"><slot /></div>
            <div class="s-marquee-half" aria-hidden="true"><slot /></div>
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'SMarquee' })

defineProps({
    /** Seconds per loop. */
    speed: { type: Number, default: 40 },
    pauseOnHover: { type: Boolean, default: true },
    ariaLabel: { type: String, default: '' },
    gap: { type: String, default: '0.5rem' },
})
</script>

<style>
.s-marquee {
    mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
}
.s-marquee-track {
    display: inline-flex;
    white-space: nowrap;
    animation: s-marquee var(--s-marquee-speed, 40s) linear infinite;
    will-change: transform;
}
.s-marquee-half {
    display: inline-flex;
    align-items: center;
    gap: var(--s-marquee-gap, 0.5rem);
    padding-right: var(--s-marquee-gap, 0.5rem);
}
.s-marquee-pause:hover .s-marquee-track {
    animation-play-state: paused;
}
@keyframes s-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
    .s-marquee-track { animation: none; }
}
</style>
