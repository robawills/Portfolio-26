'use client'

import classNames from 'classnames/bind'

import {ProjectCard, type ProjectCardProps} from '@/components/ProjectCard'
import {useInViewAnimation} from '@/hooks/useInViewAnimation'
import styles from './ProjectGrid.module.scss'

const cx = classNames.bind(styles)

export interface ProjectGridProps {
  projects: ProjectCardProps[]
}

export const ProjectGrid = ({projects}: ProjectGridProps) => {
  const animationRef = useInViewAnimation<HTMLDivElement>()

  return (
    <div className={cx('projectGridWrap')}>
      <div ref={animationRef}>
        <div className={cx('projectGrid')} data-testid="project-grid">
          {projects.map((project, index) => (
            <div
              className={cx('gridItem')}
              key={index}
              data-testid="grid-item"
              style={{'--animation-index': index + 4} as React.CSSProperties}
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectGrid
