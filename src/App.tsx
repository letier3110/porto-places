import { FC, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Card from './Card'
import CardsData from '../public/data.json'
import { DataEntry } from './interfaces'

const data = CardsData as { data: Array<DataEntry> }
const cardsData = data.data

// const data = CardsData as { example: DataEntry }
// const cardsData = data.example as DataEntry

interface IFilter {
  search: string
  tags: string[]
  sort: string
}

const tags = ['Japanese', 'Korean', 'Dine-in']

const App: FC = () => {
  const [openFilters, setOpenFilters] = useState(false)
  const [showChips, setShowChips] = useState(false)
  const [filters, setFilters] = useState<IFilter>({
    search: '',
    tags: [],
    sort: 'rating'
  })

  const handleAddFilterTag = (tag: string) => {
    setFilters({
      ...filters,
      tags: filters.tags.find((t) => t === tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    })
  }

  const handleRemoveFilterTag = (tag: string) => {
    setFilters({
      ...filters,
      tags: filters.tags.filter((t) => t !== tag)
    })
  }

  const handleToggleFilters = () => {
    setOpenFilters(!openFilters)
  }

  const enableChips = () => {
    setShowChips(true)
  }

  const disableChips = () => {
    setShowChips(false)
  }

  const filteredContent = cardsData.filter((card) => {
    if (filters.tags.length > 0) {
      return filters.tags.every((tag) => card.tags.includes(tag))
    }
    return true
  })

  return (
    <div
      className='flex flex-column flex-gap AppContainer'
      onClick={() => {
        disableChips()
      }}
    >
      <div className='flex jc-between'>
        <div className='flex flex-gap'>
          <button className='filters' onClick={handleToggleFilters}>
            {openFilters ? 'Close Filters' : 'Filters'}
          </button>
          <div className='ChipsFather relative'>
            <input type='text' onFocus={enableChips} placeholder='Search' value={filters.tags.length > 0 ? ' ' : ''} onClick={e => e.stopPropagation()} />
            {filters.tags.length > 0 && (
              <div className='inputWrapper flex flex-gap'>
                {filters.tags.map((tag, index) => (
                  <div className='Chip flex relative' key={index}>
                    {tag}
                    <div className='ChipClose' onClick={() => handleRemoveFilterTag(tag)}>x</div>
                  </div>
                ))}
              </div>
            )}
            {showChips && (
              <div className='ChipsModal flex flex-column flex-gap'>
                {tags.map((tag, index) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddFilterTag(tag)
                    }}
                    key={index}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-gap'>
          <button>Grid View</button>
          <button className='flex flex-gap'>
            <div>Sort by</div>
            <div>^</div>
          </button>
        </div>
      </div>
      <div className='Cards'>
        {filteredContent.map((cardData, index) => (
          <Card cardData={cardData} index={index + 1} key={index} />
        ))}
      </div>
    </div>
  )
}

export default App
