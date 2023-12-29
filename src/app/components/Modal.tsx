import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import React from 'react'

interface ModalProps {
  isOpen: boolean
  setIsOpen?: (value: boolean) => void
  setIsOpenExtra?: (value: string) => void
  cleanupOnClose?: () => void
  title: string
  contentText?: string
  content?: React.JSX.Element
  primaryButtonText: string
  primaryButtonCallback: () => void
  primaryButtonDisabled?: boolean
  secondaryButtonText?: string
  secondaryButtonCallback?: () => void
  secondaryButtonDisabled?: boolean
  resetButtonText?: string
  resetButtonCallback?: () => void
  resetButtonDisabled?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = (props: ModalProps) => {
  const maxWidth = props.maxWidth || 'sm'

  const handleClose = () => {
    props.setIsOpen && props.setIsOpen(false)
    props.setIsOpenExtra && props.setIsOpenExtra('')
    props.cleanupOnClose && props.cleanupOnClose()
  }

  const handlePrimaryButtonCallback = () => props.primaryButtonCallback()

  const handleSecondaryButtonCallback = () => props.secondaryButtonCallback && props.secondaryButtonCallback()

  const handleResetButtonCallback = () => props.resetButtonCallback && props.resetButtonCallback()

  return (
    <div>
      <Dialog open={props.isOpen} onClose={handleClose} maxWidth={maxWidth} fullWidth={true}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent dividers>
          {props.contentText && <DialogContentText>{props.contentText}</DialogContentText>}
          {props.content}
        </DialogContent>
        <DialogActions>
          {props.resetButtonText && (
            <Button disabled={props.resetButtonDisabled} onClick={handleResetButtonCallback}>
              {props.resetButtonText}
            </Button>
          )}
          {props.secondaryButtonText && (
            <Button disabled={props.secondaryButtonDisabled} onClick={handleSecondaryButtonCallback}>
              {props.secondaryButtonText}
            </Button>
          )}
          <Button disabled={props.primaryButtonDisabled} onClick={handlePrimaryButtonCallback} autoFocus>
            {props.primaryButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Modal
