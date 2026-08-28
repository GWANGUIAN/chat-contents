import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Button } from './Button'
import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
}

export default meta

type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div style={{ position: 'relative', height: 320 }}>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="설정 초기화">
          <p style={{ margin: 0 }}>모든 설정을 기본값으로 되돌립니다. 되돌릴 수 없습니다.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setOpen(false)}>초기화</Button>
          </div>
        </Modal>
      </div>
    )
  },
}

/**
 * Modal은 Portal로 렌더링되므로, 이 스토리를 감싼 상위(Storybook preview)
 * ThemeProvider가 아니라 여기 중첩된 그린 테마 ThemeProvider의 토큰을 그대로
 * 상속해야 합니다(usePortalContainer로 Portal의 container를 그 ThemeProvider의
 * 실제 DOM 서브트리 안으로 맞춰주기 때문). 오버레이/보더/그림자가 핑크가 아니라
 * 그린으로 보이면 정상입니다.
 */
export const NestedThemeOverride: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <ThemeProvider
        accent="#10B981"
        tokens={{
          accentBorder: '#065F46',
          textPrimary: '#191C1A',
          surfacePanel: '#FFFFFF',
          shadowColor: '52, 211, 153',
          backdrop: '#064E3B99',
        }}
      >
        <div style={{ position: 'relative', height: 320 }}>
          <Button onClick={() => setOpen(true)}>모달 열기(그린 테마)</Button>
          <Modal open={open} onClose={() => setOpen(false)} title="그린 테마 모달">
            <p style={{ margin: 0 }}>보더/그림자/배경이 그린 테마를 따라야 합니다.</p>
          </Modal>
        </div>
      </ThemeProvider>
    )
  },
}
