import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import { Backdrop, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'
import { UploadFirebase } from './utils/UploadFirebase'

const url = 'http://localhost:5000/books'

const bookObject = {
  bookname: '',
  authorName: '',
  description: '',
  image: '',
}
function App() {
  const [modal, setmodal] = useState(bookObject)
  const [bookList, setbookList] = useState([])
  const [edit, setedit] = useState(false)
  const [open, setOpen] = useState(false)
  const [file, setfile] = useState(null)
  const [isUploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    axios.get(url).then((response) => {
      console.log(response.data)
      setbookList(response.data)
    })
  }, [])

  const changeHandler = (e) => {
    const value = e.target.value
    setmodal((modal) => ({
      ...modal,
      [e.target.name]: value,
    }))
  }
  const handleUpload = () => {
    if (!file) {
      alert('Please upload an image first!')
    }
    resultHandleUpload(file)
  }
  const resultHandleUpload = async (file) => {
    try {
      setUploading(true)
      const url = await UploadFirebase(file, setProgress)
      setUploading(false)
      console.log(url)
      setmodal((prev) => ({ ...prev, image: url }))
    } catch (error) {
      console.log(error)
    }
  }
  const AddBook = () => {
    setOpen(true)
    if (edit) {
      axios.put(url + `/${modal.id}`, modal).then((res) => {
        console.log(res)
        if (res.status === 200) alert('book edited successfully')
        else alert('error occured while editing')
      })
    } else {
      //requeste de creation de book
      axios.post(url, modal).then((res) => {
        console.log(res)
        if (res.statusText === 'Created') alert('book inserted successfully')
        else alert('error occured while inserting')
      })
      ClearData()
    }
    axios.get(url).then((response) => {
      setbookList(response.data)
    })
    setOpen(false)
  }
  const ClearData = () => {
    setmodal(bookObject)
    setfile(null)
  }
  const deleteRow = (id) => {
    setOpen(true)
    axios.delete(url + `/${id}`).then((res) => {
      console.log(res)
      if (res.status === 200) alert('book deleted successfully')
      else alert('error occured while deleting')
    })

    axios.get(url).then((response) => {
      console.log(response.data)
      setbookList(response.data)
    })
    setOpen(false)
  }
  const editRow = (Data) => {
    setmodal(Data)
    setedit(true)
  }
  return (
    <div className="App">
      <Box sx={{ m: 2, p: 2, border: '1px solid grey' }}>
        <TextField
          label="book name"
          name="bookname"
          variant="outlined"
          onChange={changeHandler}
          fullWidth
          sx={{ mr: 2, mb: 2 }}
          value={modal.bookname}
        />
        <TextField
          label="book author"
          name="authorName"
          variant="outlined"
          onChange={changeHandler}
          fullWidth
          sx={{ mr: 2, mb: 2 }}
          value={modal.authorName}
        />
        <TextField
          label="description"
          name="description"
          variant="outlined"
          onChange={changeHandler}
          fullWidth
          sx={{ mr: 2, mb: 2 }}
          value={modal.description}
        />
        <TextField
          name="image"
          type="file"
          variant="outlined"
          onChange={(e) => setfile(e.target.files[0])}
          fullWidth
          sx={{ mr: 2, mb: 2 }}
        />

        <Button name="btnimag" type="button" onClick={handleUpload}>
          Upload to Firebase
        </Button>
        <Backdrop sx={{ color: '#fff', zIndex: 99 }} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div style={{ marginBottom: '2rem' }}>
          {modal.image ? (
            <img src={modal.image} alt="" width="150" height="70" />
          ) : null}
        </div>
        {isUploading && (
          <div
            style={{
              width: '50vw',
              display: 'flex',
              margin: '2rem auto',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'stretch',
            }}
          >
            {progress}%
            <div
              style={{
                background: 'grey',
                height: 'fit-content',
                display: 'flex',
                width: '100%',
                borderRadius: '15px',
              }}
            >
              <div
                style={{
                  height: '5px',
                  borderRadius: '15px',
                  background: 'blue',
                  width: `${progress}%`,
                  transition: 'all 1s ease-in-out',
                }}
              />
            </div>
          </div>
        )}
        <Box textAlign={'center'}>
          <Button variant="contained" color="success" onClick={AddBook}>
            {edit ? 'update' : 'Ajoute'}
          </Button>
          <Button variant="contained" sx={{ ml: 3 }} onClick={ClearData}>
            clear
          </Button>
        </Box>
        <Box sx={{ m: 2, p: 2, border: '1px soid grey' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: 'grey' }}>
                <th style={{ textAlign: 'center' }}>book name</th>
                <th style={{ textAlign: 'center' }}>book author</th>
                <th style={{ textAlign: 'center' }}>description</th>
                <th style={{ textAlign: 'center' }}>image</th>
                <th style={{ textAlign: 'center' }}>action</th>
              </tr>
            </thead>
            <tbody>
              {bookList?.map((row, index) => (
                <tr key={row.id}>
                  <td>{row.bookname}</td>
                  <td>{row.authorName}</td>
                  <td>{row.description}</td>
                  <td>
                    <img
                      src={row.image}
                      alt={row.bookname}
                      width="50px"
                      height="50xp"
                    />
                  </td>
                  <td>
                    <EditIcon
                      style={{ color: 'green', cursor: 'pointer' }}
                      onClick={() => editRow(row)}
                    />
                    <DeleteForeverIcon
                      style={{ color: 'red ', cursor: 'pointer' }}
                      onClick={() => deleteRow(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </div>
  )
}

export default App
