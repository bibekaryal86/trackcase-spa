import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Table as MuiTable, TableRow as MuiTableRow, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import { isBoolean } from 'lodash'
import React, { isValidElement, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'

import { getComponentNameDisplay } from '@app/components/CommonComponents'
import { USE_MEDIA_QUERY_INPUT } from '@constants/index'
import { isSuperuser } from '@users/utils/users.utils'

import Switch from './Switch'
import { TableData, TableHeaderData, TableOrder } from '../types/app.data.types'

const TABLE_EXPORT_KEYS_TO_AVOID = ['actions', 'Actions', 'collapsed']
const TABLE_EXPORT_KEY_FOR_TITLE = 'title'
// props
interface TableHeaderProps {
  headerData: TableHeaderData[]
  order: TableOrder
  orderBy?: string
  onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof TableData) => void
  isSortDisabledInTable?: boolean
  isCollapse?: boolean
}
interface TableProps {
  componentName: string
  headerData: TableHeaderData[]
  tableData: TableData[]
  verticalAlign?: string
  isExportToCsv?: boolean
  exportToCsvFileName?: string
  isSortDisabledInTable?: boolean
  defaultOrder?: TableOrder
  defaultOrderBy?: string
  defaultRowsPerPage?: number
  defaultDense?: boolean
  addModelComponent?: React.JSX.Element
  tableLayout?: string
  isDisablePagination?: boolean
  getSoftDeletedCallback?: (isIncludeDeleted: boolean) => void
}
interface TableRowProps {
  row: TableData
  tableData: TableData[]
  headerData: TableHeaderData[]
  verticalAlign?: string
  collapseRowKey?: string
}
// csv export
type CsvData = Record<string, string>
interface CsvHeaders {
  label: string
  key: string
}
interface CsvReport {
  headers: CsvHeaders[]
  data: CsvData[]
  filename: string
}

function getProperty<T>(value: T, property: keyof T): string {
  const propertyValue = value[property] as unknown

  if (isValidElement(propertyValue) && propertyValue.props) {
    const propsWithText = propertyValue.props as { text?: string }
    return String(propsWithText.text || '')
  }

  return String(propertyValue || '')
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aProperty = getProperty(a, orderBy)
  const bProperty = getProperty(b, orderBy)
  const comparisonResult = bProperty.localeCompare(aProperty)

  if (comparisonResult < 0) {
    return -1
  }
  if (comparisonResult > 0) {
    return 1
  }

  return 0
}

function getComparator<Key extends keyof TableData>(
  order: TableOrder,
  orderBy: Key,
): (a: TableData, b: TableData) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function getCsvReport(tableHeaders: TableHeaderData[], tableData: TableData[], tableFilename?: string): CsvReport {
  const tableDataKeys = Object.keys(tableData[0]) as Array<string>

  return {
    headers: getCsvHeaders(tableHeaders, tableDataKeys),
    data: getCsvData(tableData, tableDataKeys),
    filename: tableFilename ? tableFilename : 'trackcase_download.csv',
  }
}

function getCsvHeaders(tableHeaders: TableHeaderData[], tableDataKeys: string[]): CsvHeaders[] {
  const csvHeaders: CsvHeaders[] = []

  tableHeaders.forEach((header, index) => {
    !TABLE_EXPORT_KEYS_TO_AVOID.includes(tableDataKeys[index]) &&
      csvHeaders.push({
        label: header.label,
        key: tableDataKeys[index],
      })
  })

  return csvHeaders
}

function getCsvData(tableData: TableData[], tableDataKeys: string[]): CsvData[] {
  const csvData: CsvData[] = []

  tableData.forEach((data) => {
    const dataItem: CsvData = {}
    tableDataKeys.forEach((key) => {
      if (!TABLE_EXPORT_KEYS_TO_AVOID.includes(key)) {
        dataItem[key] = getDataItemValue(data[key])
      }
    })
    csvData.push(dataItem)
  })

  return csvData
}

function getDataItemValue(dataItem: string | number | boolean | React.JSX.Element | undefined): string {
  let dataItemValue = ''
  if (dataItem) {
    if (isValidElement(dataItem)) {
      for (const [key, value] of Object.entries(dataItem)) {
        if (key === 'props' && value[TABLE_EXPORT_KEY_FOR_TITLE]) {
          dataItemValue = value[TABLE_EXPORT_KEY_FOR_TITLE]
        }
      }
    } else {
      dataItemValue = dataItem.toString()
    }
  }
  return dataItemValue
}

function isTable(element: React.ReactNode): element is React.ReactElement<unknown> {
  return isValidElement(element) && (element.type as unknown) === Table
}

function getCollapseRowKey(tableData: TableData): string | undefined {
  for (const key in tableData) {
    if (isTable(tableData[key])) {
      return key
    }
  }
  return undefined
}

const emptyTableMessage = (
  componentName: string,
  showSoftDeleteComponent: React.JSX.Element | null,
): React.JSX.Element => {
  const messageText =
    'TABLE IS EMPTY! IF AN ERROR MESSAGE WAS NOT DISPLAYED, THEN THERE ARE LIKELY NO ' +
    'COMPONENT IN THE SYSTEM...'.replace('COMPONENT', getComponentNameDisplay(componentName, true))
  const messageStyle: React.CSSProperties = {
    paddingTop: '25px',
    paddingBottom: '25px',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    display: 'flex',
    fontSize: '0.75rem',
  }
  return (
    <div style={messageStyle}>
      {messageText}
      {showSoftDeleteComponent}
    </div>
  )
}

const tablePagination = (
  rowsPerPageOptions: number[],
  count: number,
  rowsPerPage: number,
  page: number,
  handleChangePage: (_event: unknown, newPage: number) => void,
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void,
  denseComponent: React.JSX.Element | null,
  exportComponent: React.JSX.Element | null,
  isSmallScreen: boolean,
  showSoftDeleteComponent: React.JSX.Element | null,
) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
    }}
  >
    {showSoftDeleteComponent}
    {exportComponent}
    {denseComponent}
    <TablePagination
      labelRowsPerPage={isSmallScreen ? '' : 'Rows per page'}
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </div>
)

const TableHeader = (props: TableHeaderProps) => {
  const { headerData, order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort && onRequestSort(event, property)
  }

  return (
    <TableHead>
      <MuiTableRow>
        {props.isCollapse && <TableCell />}
        {headerData.map((data) => (
          <TableCell
            key={data.id}
            align={data.align || 'left'}
            padding={data.isDisablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === data.id ? order : false}
          >
            <TableSortLabel
              disabled={props.isSortDisabledInTable || data.isDisableSorting}
              active={orderBy === data.id}
              direction={orderBy === data.id ? order : 'asc'}
              onClick={createSortHandler(data.id)}
            >
              {data.label}
              {orderBy === data.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </MuiTableRow>
    </TableHead>
  )
}

const TableRow = (props: TableRowProps) => {
  const [openCollapse, setOpenCollapse] = useState(false)
  return (
    <React.Fragment>
      <MuiTableRow sx={{ verticalAlign: props.verticalAlign ? props.verticalAlign : '' }}>
        {!!props.collapseRowKey && (
          <TableCell>
            <IconButton size="small" onClick={() => setOpenCollapse(!openCollapse)}>
              {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {(Object.keys(props.tableData[0]) as Array<keyof TableData>).map((key) => {
          let columnValue = props.row[key]
          if (isTable(columnValue)) {
            return null
          } else if (isBoolean(columnValue)) {
            columnValue = String(columnValue).toUpperCase()
          }
          const column = props.headerData.find((item) => item.id === key)
          return (
            column && (
              <TableCell
                sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                key={key.toString()}
                align={column.align || 'left'}
              >
                {columnValue}
              </TableCell>
            )
          )
        })}
      </MuiTableRow>
      {!!props.collapseRowKey && (
        <MuiTableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={(Object.keys(props.tableData[0]) as Array<keyof TableData>).length}
          >
            <Collapse in={openCollapse} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>{props.row[props.collapseRowKey]}</Box>
            </Collapse>
          </TableCell>
        </MuiTableRow>
      )}
    </React.Fragment>
  )
}

const Table = (props: TableProps) => {
  const { tableData } = props
  const rowsPerPageOptions = [5, 10, 15, 20]
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const collapseRowKey = getCollapseRowKey(tableData[0])

  const [order, setOrder] = useState<TableOrder>(props.defaultOrder || 'asc')
  const [orderBy, setOrderBy] = useState<keyof TableData>(props.defaultOrderBy || '')
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(props.defaultDense)
  const [rowsPerPage, setRowsPerPage] = useState(props.defaultRowsPerPage || 20)
  const [showSoftDeleted, setShowSoftDeleted] = useState(false)

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0

  const visibleRows = useMemo(
    () => tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort(getComparator(order, orderBy)),
    [order, orderBy, page, rowsPerPage, tableData],
  )

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof TableData) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(event.target.value, 10)
    setRowsPerPage(parsedValue)
    setPage(0)
  }

  const handleChangeDense = (event?: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event?.target.checked)
  }

  const denseComponent = (isSmallScreen: boolean) =>
    isSmallScreen ? null : (
      <FormControlLabel
        control={<Switch isChecked={dense || false} onChangeCallback={handleChangeDense} />}
        label="Dense"
      />
    )

  const handleChangeShowSoftDeleted = (event?: React.ChangeEvent<HTMLInputElement>) => {
    const isShowSoftDeleted = event ? event.target.checked : false
    setShowSoftDeleted(isShowSoftDeleted)
    props.getSoftDeletedCallback && props.getSoftDeletedCallback(isShowSoftDeleted)
  }

  const showSoftDeletedComponent = () =>
    isSuperuser() ? (
      <FormControlLabel
        sx={{ marginRight: 3 }}
        control={<Switch isChecked={showSoftDeleted} onChangeCallback={handleChangeShowSoftDeleted} />}
        label="Soft Deleted"
      />
    ) : null

  const exportComponent = () =>
    props.isExportToCsv && props.tableData && props.tableData.length > 0 ? (
      <CSVLink
        style={{ marginTop: 9, paddingRight: 29 }}
        {...getCsvReport(props.headerData, tableData, props.exportToCsvFileName)}
      >
        <Button>Export</Button>
      </CSVLink>
    ) : null

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '1.5em' }}>
        {props.addModelComponent}
      </div>
      <TableContainer sx={{ display: 'flex', borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
        <MuiTable
          stickyHeader
          sx={{ tableLayout: props.tableLayout || '' }}
          size={dense || isSmallScreen ? 'small' : 'medium'}
        >
          <TableHeader
            headerData={props.headerData}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            isSortDisabledInTable={props.isSortDisabledInTable}
            isCollapse={!!collapseRowKey}
          />
          <TableBody>
            {visibleRows.map((row: TableData, index: number) => (
              <TableRow
                key={index}
                row={row}
                tableData={tableData}
                headerData={props.headerData}
                collapseRowKey={collapseRowKey}
              />
            ))}
            {emptyRows > 0 && (
              <MuiTableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </MuiTableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {tableData.length === 0
        ? emptyTableMessage(props.componentName, showSoftDeletedComponent())
        : props.isDisablePagination
        ? null
        : tablePagination(
            rowsPerPageOptions,
            tableData.length,
            rowsPerPage,
            page,
            handleChangePage,
            handleChangeRowsPerPage,
            denseComponent(isSmallScreen),
            exportComponent(),
            isSmallScreen,
            showSoftDeletedComponent(),
          )}
    </div>
  )
}

export default Table
