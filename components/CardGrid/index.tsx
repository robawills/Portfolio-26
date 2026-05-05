'use client'

import classNames from 'classnames/bind'

import {Card, type CardProps} from '@/components/Card'
import {useInViewAnimation} from '@/hooks/useInViewAnimation'
import styles from './CardGrid.module.scss'

const cx = classNames.bind(styles)

export interface CardGridProps {
  cards: CardProps[]
}

export const CardGrid = ({cards}: CardGridProps) => {
  const animationRef = useInViewAnimation<HTMLDivElement>()

  return (
    <div className={cx('cardGridWrap')}>
      <div ref={animationRef}>
        <div className={cx('cardGrid')} data-testid="card-grid">
          {cards.map((card, index) => (
            <div
              className={cx('gridItem')}
              key={index}
              data-testid="grid-item"
              style={{'--animation-index': index + 4} as React.CSSProperties}
            >
              <Card {...card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardGrid
