import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from './Panel'

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel',
  component: Panel,
}

export default meta

type Story = StoryObj<typeof Panel>

export const Default: Story = {
  render: () => (
    <Panel style={{ width: 320 }}>
      <p style={{ margin: 0 }}>진한 accent 보더 + 글래스모피즘 배경의 기본 패널입니다.</p>
    </Panel>
  ),
}

export const Subtle: Story = {
  render: () => (
    <Panel variant="subtle" style={{ width: 320 }}>
      <p style={{ margin: 0 }}>패널 안에 중첩할 때 쓰는 은은한 버전입니다.</p>
    </Panel>
  ),
}

export const Scrollable: Story = {
  render: () => (
    // 스크롤바는 overflow-y:auto가 걸린 요소 자신의 padding에 영향받지 않고 항상
    // 그 요소의 박스 전체 높이를 그대로 차지합니다. 그래서 "위아래는 둥근 모서리
    // 앞에서 멈추게" 하려면 스크롤이 걸리는 안쪽 래퍼가 아니라 바깥 Panel(패딩이
    // 있는 쪽)에 위아래 padding을 둬야 합니다. 좌우는 0으로 없애서 안쪽 래퍼가
    // 보더에 딱 붙게 하고(너비 = 부모와 동일), 안쪽 래퍼의 padding은 텍스트
    // 가독성용일 뿐입니다.
    <Panel
      style={{
        width: 320,
        maxHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: '0 var(--space-5)',
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: 0 }}>
            스크롤 테스트용 항목 {i + 1}
          </p>
        ))}
      </div>
    </Panel>
  ),
}
