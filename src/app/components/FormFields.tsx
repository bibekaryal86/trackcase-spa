import { SelectChangeEvent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid, { GridDirection } from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField, { TextFieldVariants } from '@mui/material/TextField'
import { DatePicker, DateView, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'
import React, { ReactNode } from 'react'

import { componentStatusListForSelect } from '@app/components/CommonComponents'
import { DATE_FORMAT, ID_DEFAULT, STATES_LIST } from '@constants/index'
import { ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'

import { getDayjs } from '../utils/app.utils'

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
  name: string
  required?: boolean
  autoFocus?: boolean
  fullWidth?: boolean
  variant?: TextFieldVariants
  margin?: 'dense' | 'normal' | 'none' | undefined
  maxLength?: number
  value: string | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string
  sx?: object
  multiline?: boolean
  maxRows?: number
  type?: string
  InputLabelProps?: object
  isReadOnly?: boolean
}

interface FormCommentFieldProps {
  componentLabel: string
  name?: string
  required?: boolean
  autoFocus?: boolean
  fullWidth?: boolean
  variant?: TextFieldVariants
  margin?: 'dense' | 'normal' | 'none' | undefined
  maxLength?: number
  value: string | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  sx?: object
  multiline?: boolean
  maxRows?: number
}

interface FormSelectFieldProps {
  componentLabel: string
  name: string
  required?: boolean
  formControlSx?: object
  error?: boolean
  helperText?: string
  inputLabelSx?: object
  variant?: TextFieldVariants
  value: number | string
  onChange: (event: SelectChangeEvent, child: ReactNode) => void
  menuItems: React.ReactNode[]
  disabled?: boolean
}

interface StateSelectProps {
  componentLabel: string
  name?: string
  required?: boolean
  formControlSx?: object
  error?: boolean
  helperText?: string
  inputLabelSx?: object
  variant?: TextFieldVariants
  value: string | number | undefined
  onChange: (event: SelectChangeEvent, child: ReactNode) => void
}

interface StatusSelectProps extends StateSelectProps {
  statusList: ComponentStatusSchema[]
}

interface DatePickerProps {
  componentLabel: string
  name: string
  value: Dayjs | null | undefined
  onChange: (value: Dayjs | null) => void
  defaultValue?: Dayjs
  disableFuture?: boolean
  disablePast?: boolean
  disableOpenPicker?: boolean
  format?: string
  helperText?: string
  maxDate?: Dayjs
  minDate?: Dayjs
  required?: boolean
  views?: DateView[]
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
  name = '',
  required = false,
  fullWidth = false,
  autoFocus = false,
  variant = 'standard',
  margin = 'normal',
  maxLength = 99,
  value,
  onChange,
  error = false,
  helperText = '',
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
      value={value || ''}
      onChange={onChange}
      error={error}
      helperText={helperText}
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
      // Conditionally include
      {...(multiline && { maxRows })}
      {...(name && { name })}
    />
  )
}

export const FormCommentsField: React.FC<FormCommentFieldProps> = ({
  componentLabel,
  name = 'comments',
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
      name={name}
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
  name = '',
  required = false,
  formControlSx = { width: '100%', mt: '16px', mb: '8px' },
  error = false,
  helperText = '',
  inputLabelSx = { left: '-0.9em' },
  variant = 'standard',
  value,
  onChange,
  menuItems,
  disabled = false,
}) => {
  const { label, id } = getComponentLabelAndId(componentLabel)
  if (value === ID_DEFAULT) {
    value = ''
  }
  return (
    <FormControl sx={formControlSx} required={required} error={error}>
      <InputLabel sx={inputLabelSx}>{label}</InputLabel>
      <Select
        labelId={id}
        id={id}
        variant={variant}
        name={name}
        value={value.toString()}
        onChange={onChange}
        disabled={disabled}
      >
        {menuItems}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
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
  name = 'state',
  required = false,
  error = false,
  value,
  onChange,
  helperText = '',
}) => (
  <FormSelectField
    componentLabel={componentLabel}
    name={name}
    value={value || ''}
    onChange={onChange}
    menuItems={getStateItems()}
    required={required}
    error={error}
    helperText={helperText}
  />
)

export const FormSelectStatusField: React.FC<StatusSelectProps> = ({
  componentLabel,
  name = 'componentStatusId',
  required = true,
  error = false,
  helperText = '',
  value,
  onChange,
  statusList,
}) => (
  <FormSelectField
    componentLabel={componentLabel}
    name={name}
    value={value || ''}
    onChange={onChange}
    menuItems={componentStatusListForSelect(statusList)}
    required={required}
    error={error}
    helperText={helperText}
  />
)

export const FormDatePickerField: React.FC<DatePickerProps> = ({
  componentLabel,
  name,
  value,
  onChange,
  disableFuture = false,
  disablePast = false,
  disableOpenPicker = false,
  format = DATE_FORMAT,
  helperText = '',
  minDate,
  maxDate,
  required = false,
  views,
}) => {
  const { label } = getComponentLabelAndId(componentLabel)
  const dayjsValue = getDayjs(value)
  const error = dayjsValue ? !dayjsValue.isValid() : false
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        name={name}
        label={label}
        value={dayjsValue}
        onChange={onChange}
        disableFuture={disableFuture}
        disablePast={disablePast}
        disableOpenPicker={disableOpenPicker}
        format={format}
        minDate={minDate}
        maxDate={maxDate}
        views={views}
        slotProps={{
          textField: {
            error,
            required,
            helperText,
            fullWidth: true,
          },
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  )
}
