import React from 'react'
import BaseModal from 'react-modal'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

BaseModal.setAppElement('#root')

export function Modal({ ...props }) {
  return (
    <BaseModal overlayClassName="Overlay" style={customStyles} {...props} />
  )
}
