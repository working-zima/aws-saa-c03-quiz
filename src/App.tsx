import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ConceptReadPage } from './pages/ConceptReadPage'
import { QuizPage } from './pages/QuizPage'
import { ReviewPage } from './pages/ReviewPage'
import { TopicListPage } from './pages/TopicListPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TopicListPage />} />
        <Route path="topic/:topicId" element={<ConceptReadPage />} />
        <Route path="topic/:topicId/quiz" element={<QuizPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return <HashRouter><AppRoutes /></HashRouter>
}

export default App
