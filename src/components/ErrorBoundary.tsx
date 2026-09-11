import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  failed: boolean
}

/**
 * 렌더 중에 터진 예외를 받아 흰 화면 대신 안내를 보여 준다.
 *
 * `storage.ts`는 localStorage 읽기·쓰기를 try/catch로 감싸지만 **렌더 중에 나는 예외는
 * 막지 못한다.** 저장된 진행률이 손상됐거나 데이터와 화면의 가정이 어긋나면 React가
 * 트리 전체를 걷어내고 빈 화면을 남기는데, 그러면 학습자는 무엇이 잘못됐는지도
 * 다음에 무엇을 할지도 알 수 없다.
 *
 * 클래스 컴포넌트인 이유는 `componentDidCatch`·`getDerivedStateFromError`가 아직
 * 훅으로 대체되지 않았기 때문이다. 이 저장소에서 클래스를 쓰는 자리는 여기뿐이다.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 서버가 없으므로 보낼 곳이 없다. 사용자가 콘솔을 열어 알려 줄 수 있게 남기기만 한다.
    console.error('화면을 그리는 중 예외가 났다', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6" role="alert">
        <h1 className="text-xl font-semibold text-title">화면을 그리지 못했습니다</h1>
        <p className="text-body">
          학습 기록은 그대로 남아 있습니다. 다시 열어도 같은 화면에서 멈춘다면 브라우저의 저장 데이터가
          손상됐을 수 있습니다.
        </p>
        <button
          className="self-start rounded border border-border bg-panel px-4 py-2 text-title hover:bg-selected"
          onClick={() => window.location.reload()}
          type="button"
        >
          다시 열기
        </button>
      </div>
    )
  }
}
