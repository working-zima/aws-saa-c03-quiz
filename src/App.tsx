import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ConceptReadPage } from './pages/ConceptReadPage'
import { QuizPage } from './pages/QuizPage'
import { RandomQuizPage } from './pages/RandomQuizPage'
import { RandomStartPage } from './pages/RandomStartPage'
import { ReviewPage } from './pages/ReviewPage'
import { ReviewQuizPage } from './pages/ReviewQuizPage'
import { SearchPage } from './pages/SearchPage'
import { TopicListPage } from './pages/TopicListPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TopicListPage />} />
        <Route path="topic/:topicId" element={<ConceptReadPage />} />
        <Route path="topic/:topicId/quiz" element={<QuizPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="review/quiz" element={<ReviewQuizPage />} />
        <Route path="review/quiz/:topicId" element={<ReviewQuizPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="random" element={<RandomStartPage />} />
        <Route path="random/:count" element={<RandomQuizPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return <HashRouter><AppRoutes /></HashRouter>
}

export default App
