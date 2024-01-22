import { SelectChangeEvent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid, { GridDirection } from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField, { TextFieldVariants } from '@mui/material/TextField'
import React, { ReactNode } from 'react'

import { STATES_LIST } from '../../constants'

interface FormWrapperProps {
  isSmallScreen?: boolean
  isShowOne?: boolean
  flexDirection?: GridDirection
  alignItems?: string
  justifyContent?: string
  spacing?: number
  children: ReactNode
}

interface FormTextFieldProps {
  component: string
  label: string
  required?: boolean
  autoFocus?: boolean
  fullWidth?: boolean
  variant?: TextFieldVariants
  margin?: 'dense' | 'normal' | 'none' | undefined
  maxLength?: number
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  sx?: object
  multiline?: boolean
  maxRows?: number
}

interface FormSelectFieldProps {
  component: string
  required?: boolean
  formControlSx?: object
  error?: boolean
  inputLabelSx?: object
  inputLabel: string
  variant?: TextFieldVariants
  value: number | string
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
  selectOptions: unknown[]
  menuItems: React.ReactNode[]
}

interface StateSelectProps {
  component: string
  required?: boolean
  formControlSx?: object
  error?: boolean
  inputLabelSx?: object
  inputLabel: string
  variant?: TextFieldVariants
  value: string
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
}

interface StatusSelectProps {
  component: string
  required?: boolean
  formControlSx?: object
  error?: boolean
  inputLabelSx?: object
  inputLabel?: string
  variant?: TextFieldVariants
  value: string
  statusList: string[]
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
}

interface FormCommentFieldProps {
  component: string
  label?: string
  required?: boolean
  autoFocus?: boolean
  fullWidth?: boolean
  variant?: TextFieldVariants
  margin?: 'dense' | 'normal' | 'none' | undefined
  maxLength?: number
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  sx?: object
  multiline?: boolean
  maxRows?: number
}

export const GridFormWrapper: React.FC<FormWrapperProps> = ({
  isSmallScreen = false,
  isShowOne = false,
  flexDirection = 'row',
  alignItems = 'center',
  justifyContent = 'center',
  spacing = 2,
  children,
}) => {
  return (
    <div style={{ width: isSmallScreen || !isShowOne ? '100%' : '50%' }}>
      <Grid
        container
        direction={flexDirection}
        justifyContent={justifyContent}
        alignItems={alignItems}
        spacing={spacing ? spacing : isSmallScreen ? 1 : 2}
      >
        {children}
      </Grid>
    </div>
  )
}

const convertLabelToId = (component: string, label: string) => {
  const lowerCaseLabel = label.toLowerCase().replace(/\s/g, '-')
  return component + '-' + lowerCaseLabel + '-id'
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  component,
  label,
  required = true,
  fullWidth = true,
  autoFocus = false,
  variant = 'standard',
  margin = 'normal',
  maxLength = 99,
  value,
  onChange,
  error = false,
  sx = {},
  multiline = false,
  maxRows = 4,
}) => {
  return (
    <TextField
      required={required}
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      label={label}
      variant={variant}
      margin={margin}
      id={convertLabelToId(component, label)}
      inputProps={{ maxLength: maxLength }}
      value={value}
      onChange={onChange}
      error={error}
      sx={sx}
      multiline={multiline}
      // Conditionally include maxRows only if multiline is true
      {...(multiline && { maxRows })}
    />
  )
}

export const FormSelectField: React.FC<FormSelectFieldProps> = ({
  component,
  required = false,
  formControlSx = { width: '100%', mt: '16px', mb: '8px' },
  error = false,
  inputLabelSx = { left: '-0.9em' },
  inputLabel,
  variant = 'standard',
  value,
  onChange,
  menuItems,
}) => {
  return (
    <FormControl sx={formControlSx} required={required} error={error}>
      <InputLabel sx={inputLabelSx}>{inputLabel}</InputLabel>
      <Select
        labelId={convertLabelToId(component, inputLabel)}
        id={convertLabelToId(component, inputLabel)}
        variant={variant}
        value={value.toString()}
        onChange={onChange}
      >
        {menuItems}
      </Select>
    </FormControl>
  )
}

const getStateItems = () =>
  STATES_LIST.map((state) => (
    <MenuItem key={state.abbreviation} value={state.abbreviation}>
      {state.abbreviation}
    </MenuItem>
  ))

export const FormSelectState: React.FC<StateSelectProps> = ({
  component,
  required = false,
  error = false,
  inputLabel,
  value,
  onChange,
}) => (
  <FormSelectField
    component={component}
    inputLabel={inputLabel}
    value={value}
    onChange={onChange}
    selectOptions={STATES_LIST}
    menuItems={getStateItems()}
    required={required}
    error={error}
  />
)

const getStatusItems = (statusList: string[]) =>
  statusList.map((status) => (
    <MenuItem key={status} value={status}>
      {status}
    </MenuItem>
  ))

export const FormSelectStatus: React.FC<StatusSelectProps> = ({
  component,
  required = true,
  error = false,
  inputLabel = 'Status',
  value,
  onChange,
  statusList,
}) => (
  <FormSelectField
    component={component}
    inputLabel={inputLabel}
    value={value}
    onChange={onChange}
    selectOptions={statusList}
    menuItems={getStatusItems(statusList)}
    required={required}
    error={error}
  />
)

export const FormCommentsField: React.FC<FormCommentFieldProps> = ({
  component,
  label = 'Comments',
  required = false,
  fullWidth = true,
  autoFocus = false,
  variant = 'standard',
  margin = 'normal',
  maxLength = 8888,
  value,
  onChange,
  error = false,
  sx = { mt: '16px', mb: '8px' },
  maxRows = 4,
}) => {
  return (
    <FormTextField
      component={component}
      label={label}
      required={required}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      variant={variant}
      margin={margin}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      error={error}
      sx={sx}
      multiline={true}
      maxRows={maxRows}
    />
  )
}
