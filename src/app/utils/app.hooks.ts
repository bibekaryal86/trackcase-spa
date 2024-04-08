import { useState } from 'react'

export const useModal = () => {
  const [showModal, setIsShowModal] = useState(false)
  const toggleModalView = () => setIsShowModal(!showModal)
  return {
    showModal,
    toggleModalView,
  }
}
