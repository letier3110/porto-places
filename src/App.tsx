import { FC, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Card from './Card'
import CardsData from '../public/data.json'
import tagGroups from '../public/filters.json'
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

// const tags = ['Japanese', 'Korean', 'Dine-in']

const App: FC = () => {
  const [openFilters, setOpenFilters] = useState(false)
  const [showChips, setShowChips] = useState(false)
  const [searchInFilters, setSearchInFilters] = useState('')
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

  const maxTagItems = 3
  const unlimitedFilters = tagGroups
    .filter((group) => group.values.some((tag) => tag.toLowerCase().includes(searchInFilters.toLowerCase())))
    .map((group) => {
      const tags = group.values.filter((tag) => tag.toLowerCase().includes(searchInFilters.toLowerCase()))
      return {
        groupName: group.groupName,
        values: tags
      }
    })
    .map((group) => {
      const tags = group.values.filter((tag) => !filters.tags.includes(tag))
      return {
        groupName: group.groupName,
        values: tags.length > maxTagItems ? tags.slice(0, maxTagItems) : tags
      }
    })
  const filteredTagItems = unlimitedFilters.filter((group) => group.values.length > 0)

  const handleSubmitSearchInFilters = () => {
    if(filteredTagItems.length > 0 && filteredTagItems[0].values.length > 0) {
      setFilters({
        tags: filters.tags.concat(filteredTagItems[0].values[0]),
        search: '',
        sort: 'rating'
      })
    }
  }

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
            <input
              type='text'
              onFocus={enableChips}
              placeholder='Search'
              value={searchInFilters}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmitSearchInFilters()
                }
              }}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSearchInFilters(e.target.value)}
              onSubmit={handleSubmitSearchInFilters}
            />
            {showChips && (
              <div className='ChipsModal'>
                {filteredTagItems.map((group, index) => (
                  <div className='filterGroup' key={index}>
                    <div className='filterName'>{group.groupName}</div>
                    <div className='flex flex-column flex-gap'>
                      {group.values.map((tag, index) => (
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
                  </div>
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
      <div className='flex flex-gap'>
        {filters.tags.length > 0 && (
          <div className='inputWrapper flex flex-gap'>
            {filters.tags.map((tag, index) => (
              <div className='Chip flex relative' key={index} onClick={() => handleRemoveFilterTag(tag)}>
                {tag}
                <div className='ChipClose'>x</div>
              </div>
            ))}
          </div>
        )}
        {filters.tags.length > 0 && (
          <div className='inputWrapper flex flex-gap'>
            <div
              className='Chip ChipDelete flex relative'
              onClick={() => {
                setSearchInFilters('')
                setFilters({
                  tags: [],
                  search: '',
                  sort: 'rating'
                })
              }}
            >
              Clear {filteredContent.length} results
            </div>
          </div>
        )}
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
