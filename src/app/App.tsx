import { FC, useState } from 'react'
import './App.css'
import Card from '../card/Card'
import CardsData from '../../public/data.json'
import PlaceModeData from '../../public/mode.json'
import tagGroups from '../../public/filters.json'
import { DataEntry } from '../lib/interfaces'
import Map from '../maps/Map'
import { firebaseApp } from '../firebase/firebase'


const data = CardsData as { data: Array<DataEntry> }
const cardsData = data.data

interface IFilter {
  search: string
  tags: string[]
  sort: string
}

const one = 1
let two = 0;
two = 2;

console.log(one === two-one ? 'yes' : firebaseApp);

const App: FC = () => {
  // const [openFilters, setOpenFilters] = useState(false)
  const [mapMode, setMapMode] = useState(false)
  const [showChips, setShowChips] = useState(false)
  const [searchInFilters, setSearchInFilters] = useState('')
  const [mode, setMode] = useState(PlaceModeData[0].name)
  const [filters, setFilters] = useState<IFilter>({
    search: '',
    tags: [],
    sort: 'rating'
  })

  const currentMode = PlaceModeData.find((placeMode) => placeMode.name === mode)

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

  const handleToggleMode = () => {
    const nextModeIndex = PlaceModeData.findIndex((placeMode) => placeMode.name === mode) + 1;
    setMode(PlaceModeData[nextModeIndex % PlaceModeData.length].name)
  }

  const handleToggleMapMode = () => {
    setMapMode(!mapMode)
  }

  const enableChips = () => {
    setShowChips(true)
  }

  const disableChips = () => {
    setShowChips(false)
  }

  const filteredContent = cardsData
    .filter((card) => currentMode?.value.every((tag) => card.tags.includes(tag)))
    .filter((card) => {
      if (filters.tags.length > 0) {
        return filters.tags.every((tag) => card.tags.includes(tag))
      }
      return true
    })

  const maxTagItems = 3
  const unlimitedFilters = tagGroups
    .filter((group) => group.values.some((tag) => tag.value.toLowerCase().includes(searchInFilters.toLowerCase())))
    .map((group) => {
      const tags = group.values.filter((tag) => tag.value.toLowerCase().includes(searchInFilters.toLowerCase()))
      return {
        groupName: group.groupName,
        values: tags
      }
    })
    .map((group) => {
      const tags = group.values.filter((tag) => !filters.tags.includes(tag.value))
      return {
        groupName: group.groupName,
        values: tags.length > maxTagItems ? tags.slice(0, maxTagItems) : tags
      }
    })
  const filteredTagItems = unlimitedFilters.filter((group) => group.values.length > 0)

  const handleSubmitSearchInFilters = () => {
    if (filteredTagItems.length > 0 && filteredTagItems[0].values.length > 0) {
      setFilters({
        tags: filters.tags.concat(filteredTagItems[0].values[0].value),
        search: '',
        sort: 'rating'
      })
    }
  }

  const Modes = (<button className='filters' onClick={handleToggleMode}>
    {mode}
  </button>)

  const Filters = (<div className='ChipsFather relative'>
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
            <div className='filterValues'>
              {group.values.map((tag, index) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddFilterTag(tag.value)
                  }}
                  key={index}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>)

  const ViewMode = (<div className='ViewMode'>
    <button className='ViewModeBtn' onClick={handleToggleMapMode}>{mapMode ? 'Map View' : 'Grid View'}</button>
  </div>)

// suggest your favorite place and add emoji
  const Mailto = (
    <div className='MailLink'>
      <button>
      <a className='btn' href={`mailto:${(import.meta.env.VITE_EMAIL as string) || ''}?subject=Cool place in Porto`}>
        <span>💌</span>
        <span>Send us your favorite place</span>
        <span>💌</span>
      </a>
      </button>
    </div>
  )

  return (
    <div
      className='flex flex-column flex-gap AppContainer'
      onClick={() => {
        disableChips()
      }}
    >
      <div className='Header'>
        <div className='FiltersAndModes'>
          {Modes}
          {Filters}
        </div>
        <div className='flex flex-gap'>
          {ViewMode}
          {Mailto}
        </div>
      </div>
      <div className='MobileHeader'>
        {Modes}
        {Filters}
        {ViewMode}
        {Mailto}
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
      {!mapMode && (
        <div className='Cards'>
          {filteredContent.map((cardData, index) => (
            <Card cardData={cardData} index={index + 1} key={index} />
          ))}
        </div>
      )}
      {mapMode && (
        <div className='CardsWithMap'>
          <div className='MapContent'>
            {filteredContent.map((cardData, index) => (
              <Card cardData={cardData} index={index + 1} key={index} />
            ))}
          </div>
          <Map data={filteredContent} />
        </div>
      )}
    </div>
  )
}

export default App
