import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'
import { connect } from 'react-redux'

import { GlobalState } from '../store/redux'

interface SpinnerProps {
  isLoading: boolean
}

const Spinner = (props: SpinnerProps): React.ReactElement => {
  return (
    <div>
      <Backdrop sx={{ color: '#fff', zIndex: 5555 }} open={props.isLoading}>
        <CircularProgress
          sx={{
            color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
            animationDuration: '1s',
            position: 'absolute',
          }}
          size={100}
          thickness={5}
        />
      </Backdrop>
    </div>
  )
}

const mapStateToProps = ({ spinner }: GlobalState) => {
  return {
    isLoading: spinner.isLoading,
  }
}

export default connect(mapStateToProps, null)(Spinner)
