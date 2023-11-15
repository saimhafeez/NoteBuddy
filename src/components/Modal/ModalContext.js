import React, { createContext, useContext, useEffect, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalStack, setModalStack] = useState([]);
    const [modalData, setModalData] = useState(null);

    const openModal = (content) => {
        setModalContent({
            content,
            name: content.name
        });
        setModalVisible(true);
    };


    const closeModal = async () => {
        setModalVisible(false);
        // setModalData(modalData.filter((item) => item.name !== modalContent.name))
        // console.log('*********', modalData && modalData.filter((item) => item.name !== modalContent.name))

        modalData && modalData[modalContent.name] && delete modalData[modalContent.name]
        setModalContent(null);
        setModalStack([])
    };



    const stackOpenModal = (content) => {
        setModalStack([...modalStack, { content, name: content.name }]);
        openModal(content)
    };

    const stackCloseModal = () => {
        setModalContent(modalStack[modalStack.length - 1]);
        // setModalStack(modalStack.slice(0, -1));
        // console.log('-->', modalStack.slice(0, -1))
        // console.log('----->', modalStack)
    };

    const stackCloseModalAndDispose = () => {
        modalStack.pop();
        setModalContent(modalStack[modalStack.length - 1]);
        // setModalStack(modalStack.slice(0, -1));
        // console.log('-->', modalStack.slice(0, -1))
        // console.log('----->', modalStack)
    };

    const setDataForModal = (modalName, data) => {
        setModalData(pre => ({
            ...pre,
            [modalName]: data
        }))
    }

    const getModalData = (modalName) => {
        return modalData && modalData[modalName] || null
    }

    useEffect(() => {
        // console.log('modalStack', modalStack)
        // console.log('modalData', modalData)
    }, [modalStack, modalData]);

    return (
        <ModalContext.Provider value={{
            modalVisible,
            setModalVisible,
            modalContent,
            openModal,
            closeModal,
            stackOpenModal,
            stackCloseModal,
            stackCloseModalAndDispose,
            setDataForModal,
            getModalData,
            modalData
        }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    return useContext(ModalContext);
}
