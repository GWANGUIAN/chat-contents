import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Foundations/Design Tokens',
}

export default meta

type Story = StoryObj

const colors = [
  '--accent',
  '--accent-hover',
  '--accent-soft',
  '--accent-softer',
  '--accent-text',
  '--accent-border',
  '--text-primary',
  '--text-secondary',
  '--text-muted',
  '--surface-panel',
  '--surface-panel-alt',
  '--surface-input',
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
          {colors.map((token) => (
            <div key={token} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 12,
                  background: `var(${token})`,
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
