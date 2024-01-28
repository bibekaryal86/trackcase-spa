import { SelectChangeEvent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid, { GridDirection } from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField, { TextFieldVariants } from '@mui/material/TextField'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
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
  componentLabel: string
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
  type?: string
  InputLabelProps?: object
  isReadOnly?: boolean
}

interface FormCommentFieldProps {
  componentLabel: string
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
  componentLabel: string
  required?: boolean
  formControlSx?: object
  error?: boolean
  inputLabelSx?: object
  variant?: TextFieldVariants
  value: number | string
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
  menuItems: React.ReactNode[]
}

interface StateSelectProps {
  componentLabel: string
  required?: boolean
  formControlSx?: object
  error?: boolean
  inputLabelSx?: object
  variant?: TextFieldVariants
  value: string
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
}

interface StatusSelectProps {
  componentLabel: string
  required?: boolean
  formControlSx?: object
  error?: boolean
  inputLabelSx?: object
  variant?: TextFieldVariants
  value: string
  statusList: string[]
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
}

interface DatePickerProps {
  componentLabel: string
  value: Dayjs | undefined
  onChange: (value: Dayjs | null) => void
  defaultValue?: Dayjs
  disableFuture?: boolean
  disablePast?: boolean
  disableOpenPicker?: boolean
  format?: string
  maxDate?: Dayjs
  minDate?: Dayjs
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

const getComponentLabelAndId = (componentLabel: string) => {
  const componentAndLabel = componentLabel.split('--')
  const component = componentAndLabel[0].trim()
  const label = componentAndLabel[1].trim()
  const id = component.toLowerCase().replace(/\s/g, '-') + '-' + label.toLowerCase().replace(/\s/g, '-') + '-id'
  return { label: label, id: id }
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  componentLabel,
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
  type = 'text',
  InputLabelProps = {},
  isReadOnly = false,
}) => {
  const { label, id } = getComponentLabelAndId(componentLabel)
  return (
    <TextField
      required={required}
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      label={label}
      variant={variant}
      margin={margin}
      id={id}
      inputProps={{ maxLength: maxLength }}
      value={value}
      onChange={onChange}
      error={error}
      sx={sx}
      type={type}
      InputLabelProps={InputLabelProps}
      multiline={multiline}
      onKeyDown={
        isReadOnly
          ? (e) => {
              e.preventDefault()
            }
          : undefined
      }
      // Conditionally include maxRows only if multiline is true
      {...(multiline && { maxRows })}
    />
  )
}

export const FormCommentsField: React.FC<FormCommentFieldProps> = ({
  componentLabel,
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
      componentLabel={componentLabel}
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

export const FormSelectField: React.FC<FormSelectFieldProps> = ({
  componentLabel,
  required = false,
  formControlSx = { width: '100%', mt: '16px', mb: '8px' },
  error = false,
  inputLabelSx = { left: '-0.9em' },
  variant = 'standard',
  value,
  onChange,
  menuItems,
}) => {
  const { label, id } = getComponentLabelAndId(componentLabel)
  return (
    <FormControl sx={formControlSx} required={required} error={error}>
      <InputLabel sx={inputLabelSx}>{label}</InputLabel>
      <Select labelId={id} id={id} variant={variant} value={value.toString()} onChange={onChange}>
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

export const FormSelectStateField: React.FC<StateSelectProps> = ({
  componentLabel,
  required = false,
  error = false,
  value,
  onChange,
}) => (
  <FormSelectField
    componentLabel={componentLabel}
    value={value}
    onChange={onChange}
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

export const FormSelectStatusField: React.FC<StatusSelectProps> = ({
  componentLabel,
  required = true,
  error = false,
  value,
  onChange,
  statusList,
}) => (
  <FormSelectField
    componentLabel={componentLabel}
    value={value}
    onChange={onChange}
    menuItems={getStatusItems(statusList)}
    required={required}
    error={error}
  />
)

export const FormDatePickerField: React.FC<DatePickerProps> = ({
  componentLabel,
  value,
  onChange,
  disableFuture = false,
  disablePast = false,
  disableOpenPicker = false,
  format = 'YYYY-MM-DD',
  minDate,
  maxDate,
}) => {
  // TODO maxDate, minDate
  const { label, id } = getComponentLabelAndId(componentLabel)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        name={id}
        label={label}
        value={value ? dayjs(value) : null}
        onChange={onChange}
        disableFuture={disableFuture}
        disablePast={disablePast}
        disableOpenPicker={disableOpenPicker}
        format={format}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            helperText: format,
            fullWidth: true,
          },
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  )
}
