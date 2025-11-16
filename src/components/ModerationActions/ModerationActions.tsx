import { Button, Space, Modal, Form, Select, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback, type RefObject } from 'react';
import type { RejectReason } from '../../types';

interface ModerationActionsProps {
  adId: number;
  onApprove: () => Promise<void>;
  onReject: (reason: RejectReason, comment?: string) => Promise<void>;
  onRequestChanges: (reason: RejectReason, comment?: string) => Promise<void>;
  disabled?: boolean;
  approveRef?: RefObject<(() => void) | null>;
  rejectRef?: RefObject<(() => void) | null>;
}

const rejectReasons: RejectReason[] = [
  'Запрещенный товар',
  'Неверная категория',
  'Некорректное описание',
  'Проблемы с фото',
  'Подозрение на мошенничество',
  'Другое',
];

const ModerationActions = ({
  onApprove,
  onReject,
  onRequestChanges,
  disabled = false,
  approveRef,
  rejectRef,
}: ModerationActionsProps) => {
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [changesModalVisible, setChangesModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rejectForm] = Form.useForm();
  const [changesForm] = Form.useForm();

  const handleApprove = useCallback(async () => {
    setLoading(true);
    try {
      await onApprove();
      message.success('Объявление одобрено');
    } catch {
      message.error('Ошибка при одобрении объявления');
    } finally {
      setLoading(false);
    }
  }, [onApprove]);

  const handleRejectClick = () => {
    setRejectModalVisible(true);
  };

  useEffect(() => {
    if (approveRef) {
      approveRef.current = handleApprove;
    }
  }, [approveRef, handleApprove]);

  useEffect(() => {
    if (rejectRef) {
      rejectRef.current = handleRejectClick;
    }
  }, [rejectRef]);

  const handleRejectSubmit = async () => {
    try {
      const values = await rejectForm.validateFields();
      setLoading(true);
      await onReject(values.reason, values.comment);
      message.success('Объявление отклонено');
      setRejectModalVisible(false);
      rejectForm.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        message.error('Ошибка при отклонении объявления');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangesSubmit = async () => {
    try {
      const values = await changesForm.validateFields();
      setLoading(true);
      await onRequestChanges(values.reason, values.comment);
      message.success('Запрос на изменения отправлен');
      setChangesModalVisible(false);
      changesForm.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        message.error('Ошибка при отправке запроса на изменения');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          size="large"
          onClick={handleApprove}
          loading={loading}
          disabled={disabled}
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
        >
          Одобрить
        </Button>

        <Button
          danger
          icon={<CloseOutlined />}
          size="large"
          onClick={handleRejectClick}
          disabled={disabled}
        >
          Отклонить
        </Button>

        <Button
          icon={<EditOutlined />}
          size="large"
          onClick={() => setChangesModalVisible(true)}
          disabled={disabled}
          style={{
            backgroundColor: '#faad14',
            borderColor: '#faad14',
            color: 'white',
          }}
        >
          Запросить изменения
        </Button>
      </Space>

      <Modal
        title="Отклонить объявление"
        open={rejectModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => setRejectModalVisible(false)}
        confirmLoading={loading}
        okText="Отклонить"
        cancelText="Отмена"
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Причина отклонения"
            rules={[{ required: true, message: 'Выберите причину' }]}
          >
            <Select placeholder="Выберите причину">
              {rejectReasons.map((reason) => (
                <Select.Option key={reason} value={reason}>
                  {reason}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.reason !== currentValues.reason
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('reason') === 'Другое' ? (
                <Form.Item
                  name="comment"
                  label="Комментарий"
                  rules={[{ required: true, message: 'Укажите причину' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Опишите причину отклонения"
                  />
                </Form.Item>
              ) : (
                <Form.Item name="comment" label="Дополнительный комментарий">
                  <Input.TextArea rows={4} placeholder="Необязательно" />
                </Form.Item>
              )
            }
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Запросить изменения"
        open={changesModalVisible}
        onOk={handleChangesSubmit}
        onCancel={() => setChangesModalVisible(false)}
        confirmLoading={loading}
        okText="Отправить"
        cancelText="Отмена"
      >
        <Form form={changesForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Причина запроса изменений"
            rules={[{ required: true, message: 'Выберите причину' }]}
          >
            <Select placeholder="Выберите причину">
              {rejectReasons.map((reason) => (
                <Select.Option key={reason} value={reason}>
                  {reason}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.reason !== currentValues.reason
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('reason') === 'Другое' ? (
                <Form.Item
                  name="comment"
                  label="Комментарий"
                  rules={[{ required: true, message: 'Укажите причину' }]}
                >
                  <Input.TextArea rows={4} placeholder="Опишите причину" />
                </Form.Item>
              ) : (
                <Form.Item name="comment" label="Дополнительный комментарий">
                  <Input.TextArea rows={4} placeholder="Необязательно" />
                </Form.Item>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModerationActions;
