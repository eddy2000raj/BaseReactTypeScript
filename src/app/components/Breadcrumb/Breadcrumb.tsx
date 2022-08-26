import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb, Typography } from 'antd';

const breadcrumbStyle = {
  marginBottom: 20,
};

const Breadcrumbs = () => {
  const location = useLocation();
  const { pathname } = location;
  const pathnames = pathname.split('/').filter(item => item);

  return (
    <Breadcrumb separator="/" style={breadcrumbStyle}>
      {pathnames.length > 0 ? (
        <Breadcrumb.Item>
          <Link className="breadcrumbItemLink" to="/">
            Home
          </Link>
        </Breadcrumb.Item>
      ) : (
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      )}
      {pathnames.map((name, index) => {
        const reg = /[^0-9a-zA-Z]+/;
        const str = name;
        const newStr = str.replace(reg, ' ');
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <Breadcrumb.Item key={name}>
            {isLast ? (
              <Typography.Text style={{ textTransform: 'uppercase' }}>
                {newStr}
              </Typography.Text>
            ) : (
              <Link to={`${routeTo}`}>
                <Typography.Text style={{ textTransform: 'capitalize' }}>
                  {' '}
                  {newStr}
                </Typography.Text>
              </Link>
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
