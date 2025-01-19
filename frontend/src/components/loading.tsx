import  { Fragment, useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useLoading } from '@/context/loading-context';

const Loading = () => {
  const { loading } = useLoading();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`loading-overlay ${loading ? 'visible' : ''}`}>
      <Box>
        <Fragment>
          <svg width={0} height={0}>
            <defs>
              <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#fff" />
              </linearGradient>
            </defs>
          </svg>
          <CircularProgress
            thickness={6}
            sx={{
              'svg > circle': {
                stroke: 'url(#my_gradient)',
                strokeLinecap: 'round',
              },
            }}
            className="circular-progress"
          />
        </Fragment>
      </Box>
    </div>
  );
};

export default Loading;
