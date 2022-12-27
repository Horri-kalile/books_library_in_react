import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import storage from '../firebaseConfig'
export const UploadFirebase = async (file, setProgress) => {
  let imageurl = ''
  const storageRef = ref(storage, `/files/${file.name}`)
  const uploadTask = uploadBytesResumable(storageRef, file)
  await new Promise((resolve) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        )
        console.log(percent)
        setProgress(percent)
      },
      (err) => console.log(err),
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          imageurl = url
          console.log(imageurl)

          resolve()
        })
      },
    )
  })
  return imageurl
}
