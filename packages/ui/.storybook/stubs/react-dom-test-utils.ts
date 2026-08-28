// React 19에서 react-dom/test-utils가 완전히 제거되면서, 이 서브패스를 정적으로
// import()하는 @storybook/react의 (실행되지 않는) 폴백 분기가 Vite dev 트랜스폼
// 단계에서 리졸브 실패로 통째로 깨집니다. 실제로 호출되지는 않지만 Vite가 정적
// 분석 시점에 리졸브는 해야 하므로, 최소한의 스텁으로 대체합니다.
import { act } from 'react'

export default { act }
export { act }
