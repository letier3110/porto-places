import { FC } from 'react'
import { DataEntry } from './interfaces'

interface CardProps {
  cardData: DataEntry
  index: number
}

const Card: FC<CardProps> = ({ cardData, index }) => {
  // const [openFilters, setOpenFilters] = useState(false)

  // console.log(cardData)

  // const handleToggleChips = () => {
  //   setShowChips(!showChips)
  // }

  return (
    <div className='Card'>
      {cardData.mediaUrl && cardData.mediaUrl.length > 0 && <img src={cardData.mediaUrl[0]} className='CardBg' />}
      {cardData.mediaUrl && cardData.mediaUrl.length > 0 && <div className='CardBgCover' />}
      <div className='CardIndex'>{index}</div>
      <div className='CardName'>{cardData.name}</div>
      <div>456</div>
      <div className='CardOverlay'>
        <div className='CardOverlayContent'>
          <div className='CardOverlayContentTags flex flex-gap flex-wrap'>
            {cardData.tags.map((tag, index) => (
              <div key={index} className='CardOverlayContentTag'>
                {tag}
              </div>
            ))}
          </div>
          <div className='CardOverlayContentRating'>
            <div className='CardOverlayContentRatingStars'>
              <div
                className='CardOverlayContentRatingStarsFilled'
                style={{ width: `${(cardData.medianRating / 5) * 100}%` }}
              />

              <div className='CardOverlayContentRatingStarsEmpty' />

              <div className='CardOverlayContentRatingStarsTotal'>
                {cardData.numberOfRatings}

                <span>ratings</span>

                <span>•</span>

                {cardData.medianRating}

                <span>stars</span>

                <span>•</span>

                {cardData.hours.map((hour, index) => (
                  <span key={index}>
                    {hour.open} - {hour.close}
                  </span>
                ))}

                <span>•</span>

                <a href={cardData.gmaps} target='_blank' rel='noreferrer'>
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
