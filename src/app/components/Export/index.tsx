import { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';

const ExportButton = (params: any) => {
  const {
    param,
    exportLoader,
    exportHandler,
    title,
    okText,
    cancelText,
    placeholder,
  } = params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (param) {
      exportHandler();
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        type="default"
        icon={<FileExcelOutlined />}
        onClick={showModal}
        loading={exportLoader}
      >
        {title}
      </Button>
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
      >
        <Input placeholder={placeholder} />
      </Modal>
    </>
  );
};

export default ExportButton;
