import { notification } from 'antd';

const errorNotification = (args: any) => {
  notification.error(args);
};

const successNotification = (args: any) => {
  notification.success(args);
};
export { errorNotification, successNotification };
