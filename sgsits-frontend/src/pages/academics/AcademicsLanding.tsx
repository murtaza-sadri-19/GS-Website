import React, { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'
import NavCategoryPage, { type NavCard } from '../../components/global/NavCategoryPage'
import {
  getAcademicsLandingCards,
  getAcademicsLandingMeta,
  academicsLandingCardsDefault,
  academicsLandingMetaDefault,
  type AcademicsLandingCard,
  type AcademicsLandingMeta,
} from '../../services/academicsService'

const ICON_SIZE = 18

function resolveCard(c: AcademicsLandingCard): NavCard {
  const Icon = (Icons as Record<string, React.ComponentType<{ size?: number }>>)[c.iconName] ?? Icons.BookOpen
  return {
    icon: <Icon size={ICON_SIZE} />,
    title: c.title,
    description: c.description,
    path: c.path,
    badge: c.badge,
  }
}

const AcademicsLanding: React.FC = () => {
  const [cards, setCards] = useState<NavCard[]>(academicsLandingCardsDefault.map(resolveCard))
  const [meta, setMeta] = useState<AcademicsLandingMeta>(academicsLandingMetaDefault)

  useEffect(() => {
    Promise.all([getAcademicsLandingCards(), getAcademicsLandingMeta()]).then(([rawCards, rawMeta]) => {
      if (rawCards.length > 0) setCards(rawCards.map(resolveCard))
      if (rawMeta.heroTitle || rawMeta.sectionLabel || rawMeta.heroSubtitle) {
        setMeta(m => ({ ...m, ...rawMeta }))
      }
    })
  }, [])

  return (
    <NavCategoryPage
      sectionLabel={meta.sectionLabel}
      heroTitle={meta.heroTitle ?? ''}
      heroSubtitle={meta.heroSubtitle ?? ''}
      breadcrumbs={[{ label: 'Academics' }]}
      cards={cards}
    />
  )
}

export default AcademicsLanding
