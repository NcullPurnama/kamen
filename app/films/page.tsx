import { Suspense } from "react"
import FilmsContent from "./films-content"

export default function FilmsPage() {
  return (
    <Suspense fallback={null}>
      <FilmsContent />
    </Suspense>
  )
}
