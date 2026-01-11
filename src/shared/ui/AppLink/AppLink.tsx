import { Link, LinkProps } from 'react-router-dom';
import cls from './AppLink.module.scss'
import { classNames } from '../../lib/classNames/classNames';
import { FC } from 'react';

interface AppLinkProps extends LinkProps{
  className?:string;
}

const AppLink:FC<AppLinkProps> = (props) => {

  const {children,to,className,...otherProps} = props

  return (
   <Link 
   className={classNames(cls.AppLink, {},[className])}
   to={to}
   {...otherProps}
   >
    {children}
   </Link>
  );
};

export default AppLink;