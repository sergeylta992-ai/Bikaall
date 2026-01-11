import cls from './loader.module.scss'

const Loader = ({load}:any) => {
  console.log("test",load)
  return (
    <div className={load?cls.wrap:cls.none}>
      <div className={cls.loader}></div>
    </div>
  );
};

export default Loader;