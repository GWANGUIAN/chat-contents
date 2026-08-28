import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Foundations/Design Tokens',
}

export default meta

type Story = StoryObj

const colors: { token: string; background?: string }[] = [
  { token: '--accent' },
  { token: '--accent-hover' },
  { token: '--accent-soft' },
  { token: '--accent-softer' },
  { token: '--accent-text' },
  { token: '--accent-border' },
  { token: '--text-primary' },
  { token: '--text-secondary' },
  { token: '--text-muted' },
  { token: '--surface-panel' },
  { token: '--surface-panel-alt' },
  { token: '--surface-input' },
  { token: '--bg-base' },
  { token: '--bg-gradient-1' },
  { token: '--bg-gradient-2' },
  { token: '--bg-gradient-3' },
  { token: '--dot-color' },
  { token: '--dot-color-accent' },
  { token: '--border-faint' },
  { token: '--border-default' },
  { token: '--border-strong' },
  { token: '--backdrop' },
  { token: '--success' },
  { token: '--danger' },
  // --shadow-color is a bare "R, G, B" triplet (consumed as rgba(var(--shadow-color), alpha)),
  // not a paintable color on its own — wrap it in rgb() to render a swatch.
  { token: '--shadow-color', background: 'rgb(var(--shadow-color))' },
]
const spaces = [
  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-5',
  '--space-6',
  '--space-7',
  '--space-8',
]
const radii = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-pill']
const fontSizes = [
  '--font-size-sm',
  '--font-size-md',
  '--font-size-lg',
  '--font-size-xl',
  '--font-size-xxl',
]

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section>
        <h3>Colors</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {colors.map(({ token, background }) => (
            <div key={token} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 12,
                  background: background ?? `var(${token})`,
                  border: '1px solid rgba(0,0,0,0.15)',
                }}
              />
              <div style={{ fontSize: 11, marginTop: 4 }}>{token}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Spacing</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          {spaces.map((token) => (
            <div key={token} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: `var(${token})`,
                  height: `var(${token})`,
                  background: 'var(--accent)',
                }}
              />
              <div style={{ fontSize: 11, marginTop: 4 }}>{token}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Radius</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {radii.map((token) => (
            <div key={token} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: `var(${token})`,
                  background: 'var(--accent-soft)',
                  border: '2px solid var(--accent-border)',
                }}
              />
              <div style={{ fontSize: 11, marginTop: 4 }}>{token}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Motion</h3>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          --stepper-transition-duration (Stepper 단계 전환 애니메이션 길이, 기본 0.3s)
        </div>
      </section>

      <section>
        <h3>Typography</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fontSizes.map((token) => (
            <div key={token} style={{ fontSize: `var(${token})`, fontWeight: 700 }}>
              {token} — 가나다라 Aa
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
