import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextInput } from './TextInput'

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  args: { placeholder: '답변을 입력하세요' },
}

export default meta

type Story = StoryObj<typeof TextInput>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: '초등학교 때' } }
