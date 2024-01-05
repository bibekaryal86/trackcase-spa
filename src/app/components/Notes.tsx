import { EditOutlined } from '@mui/icons-material'
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'

import { convertDateToLocaleString, Modal, NoteSchema, Table, TableData, TableHeaderData } from '../../app'
import { BUTTON_CANCEL, BUTTON_DELETE, ID_ACTION_BUTTON, ID_DEFAULT } from '../../constants'

interface NoteProps {
  noteObjectType: string
  noteObjectId: number
  notesList: NoteSchema[]
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => void
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) => void
  deleteNote: (noteObjectType: string, noteId: number) => void
}

const Notes = (props: NoteProps): React.ReactElement => {
  const { noteObjectType, noteObjectId, notesList } = props

  const [note, setNote] = useState('')
  const [noteInit, setNoteInit] = useState('')
  const [noteId, setNoteId] = useState(ID_DEFAULT)
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

  const notesTableHeaderData: TableHeaderData[] = [
    {
      id: 'modified',
      label: 'Date',
    },
    {
      id: 'user_name',
      label: 'User',
    },
    {
      id: 'note',
      label: 'Note',
      isDisableSorting: true,
    },
  ]

  const deletePrimaryButtonCallback = () => {
    props.deleteNote(noteObjectType, noteId)
    setIsShowDeleteModal(false)
    setNoteId(ID_DEFAULT)
    setNote('')
  }

  const deleteSecondaryButtonCallback = () => {
    setNoteId(ID_DEFAULT)
    setIsShowDeleteModal(false)
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        title="Delete Note"
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={deletePrimaryButtonCallback}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={deleteSecondaryButtonCallback}
        contentText="Are you sure you want to delete the Note?!?"
      />
    )
  }

  const actionButtons = (id: number, note: string) => (
    <>
      <Button
        sx={{ p: 0, minWidth: 0 }}
        onClick={() => {
          setNoteId(id)
          setNote(note)
          setNoteInit(note)
        }}
      >
        <EditOutlined />
      </Button>
      <Button
        sx={{ p: 0, minWidth: 0 }}
        onClick={() => {
          setNoteId(id)
          setIsShowDeleteModal(true)
        }}
      >
        <DeleteForeverOutlined />
      </Button>
    </>
  )

  const notesTableData: TableData[] = Array.from(notesList, (x) => {
    return {
      modified: convertDateToLocaleString(x.modified),
      user_name: x.userName,
      note: x.note,
      actions: actionButtons(x.id || ID_ACTION_BUTTON, x.note),
    }
  })

  const notesTable = () => (
    <Table componentName="Court Notes" headerData={notesTableHeaderData} tableData={notesTableData} />
  )

  const noteField = `${noteObjectType}-note`
  const addNote = () => (
    <TextField
      required
      autoFocus
      fullWidth
      variant="standard"
      id={noteField}
      label="Note"
      name={noteField}
      margin="normal"
      inputProps={{ maxLength: 2500 }}
      value={note}
      sx={{ m: 0, p: 0 }}
      onChange={(e) => setNote(e.target.value)}
      error={note.trim() === ''}
    />
  )

  const noteButtons = () => {
    return (
      <>
        {noteId && noteId > 0 ? (
          <Button
            disabled={note.trim() === noteInit}
            onClick={() => {
              props.editNote(noteObjectType, noteObjectId, note, noteId)
              setNote('')
            }}
          >
            Edit Note
          </Button>
        ) : (
          <Button
            disabled={note.trim() === ''}
            onClick={() => {
              props.addNote(noteObjectType, noteObjectId, note)
              setNote('')
            }}
          >
            Add Note
          </Button>
        )}
        <Button
          disabled={note === ''}
          onClick={() => {
            setNote('')
            setNoteId(ID_DEFAULT)
          }}
        >
          Cancel
        </Button>
      </>
    )
  }

  return (
    <div>
      {addNote()}
      {noteButtons()}
      {notesTable()}
      {isShowDeleteModal && deleteModal()}
    </div>
  )
}

export default Notes
