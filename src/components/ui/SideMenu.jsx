import { Box } from '@mui/material';

import { cn } from '@/core/utils';

export const SideMenu = ({ open, children }) => {
  return (
    <>
      <Box
        className={cn(
          'flex flex-col gap-1 absolute top-0 left-0 w-[250px] h-full p-2 bg-white overflow-hidden transition-transform z-50',
          {
            'translate-x-0': open,
            '-translate-x-full': !open,
          },
        )}
      >
        {children}
      </Box>
    </>
  );
};
