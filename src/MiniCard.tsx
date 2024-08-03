import { FC } from 'react'
import { DataEntry } from './interfaces'

interface MiniCardProps {
  cardData: DataEntry
  index?: number
}

const MiniCard: FC<MiniCardProps> = ({ cardData, index }) => {
  return (
    <div className='MiniCard'>
      {cardData.mediaUrl && cardData.mediaUrl.length > 0 && <img src={cardData.mediaUrl[0]} className='MiniCardBg' />}
      {cardData.mediaUrl && cardData.mediaUrl.length > 0 && <div className='MiniCardBgCover' />}
      {index && (<div className='MiniCardIndex'>{index}</div>)}
      <div className='MiniCardName'>{cardData.name}</div>
      <a href={cardData.gmaps} className='MiniCardDirections' target='_blank' rel='noreferrer'>
        Directions
      </a>
    </div>
  )
}

export default MiniCard
