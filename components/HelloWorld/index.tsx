import classNames from 'classnames/bind';
import styles from './HelloWorld.module.scss';

const cx = classNames.bind(styles);

interface HelloWorldProps {
  title?: string;
}

const HelloWorld = ({ title = 'Hello, World!' }: HelloWorldProps) => {
  return (
    <section className={cx('wrapper')}>
      <h1 className={cx('title')}>{title}</h1>
      <p className={cx('description')}>
        This project is set up and ready to build.
      </p>
    </section>
  );
};

export default HelloWorld;
