import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
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
