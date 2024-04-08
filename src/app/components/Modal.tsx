import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import React from 'react'

import { ActionTypes, CalendarTypes } from '../../constants'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  contentText?: string
  content?: React.JSX.Element
  primaryButtonText: ActionTypes | CalendarTypes
  primaryButtonCallback: () => void
  primaryButtonDisabled?: boolean
  secondaryButtonText?: ActionTypes | CalendarTypes
  secondaryButtonCallback?: () => void
  secondaryButtonDisabled?: boolean
  resetButtonText?: ActionTypes
  resetButtonCallback?: () => void
  resetButtonDisabled?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = (props: ModalProps) => {
  const maxWidth = props.maxWidth || 'sm'

  const cleanUpButtonText = (buttonText?: string) => buttonText && buttonText.replace("_", " ")

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose} maxWidth={maxWidth} fullWidth={true}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent dividers>
          {props.contentText && <DialogContentText>{props.contentText}</DialogContentText>}
          {props.content}
        </DialogContent>
        <DialogActions>
          {props.resetButtonText && (
            <Button
              disabled={props.resetButtonDisabled}
              onClick={() => props.resetButtonCallback && props.resetButtonCallback()}
            >
              {props.resetButtonText}
            </Button>
          )}
          {props.secondaryButtonText && (
            <Button
              disabled={props.secondaryButtonDisabled}
              onClick={() => props.secondaryButtonCallback && props.secondaryButtonCallback()}
            >
              {cleanUpButtonText(props.secondaryButtonText)}
            </Button>
          )}
          <Button disabled={props.primaryButtonDisabled} onClick={() => props.primaryButtonCallback()}>
            {cleanUpButtonText(props.primaryButtonText)}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Modal
