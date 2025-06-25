import { UIImprovementDemo } from '../components/UIImprovementDemo'

export default function UIDemoPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UIImprovementDemo />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'UI Improvements Demo - It From Bit',
  description: 'Interactive demonstration of the enhanced design system and user interface improvements.',
}