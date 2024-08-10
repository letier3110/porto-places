import { FC, useState } from 'react'
import CardsData from '../../../public/data.json'
import { firebaseApp } from '../../lib/firebase/firebase'
import { DataEntry } from '../../lib/interfaces'
import './App.css'
import { DetailedView } from './DetailedView'
import { ListView } from './ListView'

const data = CardsData as { data: Array<DataEntry> }
const cardsData = data.data

const VIEW_MODES = {
  list: 'list',
  details: 'details'
} as const

const one = 1
let two = 0
two = 2

console.log(one === two - one ? 'yes' : firebaseApp)

const App: FC = () => {
  const loc = window.location.pathname
  const [viewMode, setViewMode] = useState<keyof typeof VIEW_MODES>(VIEW_MODES.list)
  const [selectedCard, setSelectedCard] = useState<DataEntry | null>(null)

  const handleGoBack = () => {
    setViewMode(VIEW_MODES.list)
    setSelectedCard(null)
    window.location.pathname = '/'
  }

  if (loc.startsWith('/details/') && viewMode !== 'details') {
    const id = loc.replace('/details/', '')
    const cardData = cardsData.find((card) => card.detailed === id)
    if (cardData) {
      setViewMode(VIEW_MODES.details)
      setSelectedCard(cardData)
    }
  }
  return selectedCard && viewMode === 'details' ? <DetailedView goBack={handleGoBack} place={selectedCard} /> : <ListView data={cardsData} />
}

export default App
