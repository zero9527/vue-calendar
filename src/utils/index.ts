type PrintType = 'primary' | 'default' | 'error' | 'warn' | 'success';
type PrintStyle = {
  [printType: string]: string;
};

// 控制台打印
export const printLog = (title: any, text: any = '', type: PrintType = 'default') => {
  const baseStyle = 'padding: 2px 4px;border-radius: 2px;color: #fff;';
  const style: PrintStyle = {
    primary: `${baseStyle}background: #1890ff;`,
    default: `${baseStyle}background: #9e9e9e;`,
    error: `${baseStyle}background: #ff4d4f;`,
    warn: `${baseStyle}background: #faad14;`,
    success: `${baseStyle}background: #52c41a;`,
  };
  console.log(`%c${title}`, style[type], text);
};
