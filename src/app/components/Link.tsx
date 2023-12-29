import { Link as MuiLink } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface LinkProps {
  text: string
  navigateToPage?: string
  onClick?: () => void
  href?: string
  target?: string
  color?: string
  underline?: 'none' | 'hover' | 'always'
}

const Link = (props: LinkProps) => {
  const navigate = useNavigate()
  const navigateTo = (page: string) => {
    navigate(page, {
      replace: true,
    })
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!props.href) {
      event.preventDefault()
    }
    props.onClick && props.onClick()
    props.navigateToPage && navigateTo(props.navigateToPage)
  }

  return (
    <MuiLink
      onClick={handleClick}
      href={props.href ? props.href : '#'}
      target={props.target ? props.target : ''}
      color={props.color ? props.color : 'primary'}
      underline={props.underline ? props.underline : 'hover'}
    >
      {props.text}
    </MuiLink>
  )
}

export default Link
