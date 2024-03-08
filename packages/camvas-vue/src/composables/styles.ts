import { css } from '../../panda/css';

export const useStyles = () => {
  const wFull = css.raw({
    w: '100%',
  });

  const hFull = css.raw({
    h: '100%',
  });

  return {
    css,
    wFull,
    hFull,
  };
};
