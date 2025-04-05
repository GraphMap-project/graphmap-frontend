import { Box, TextField, Typography } from '@mui/material';

import { cn } from '@/core/utils';

export const SideMenu = ({ open, coordinates, intermediatePoints, children }) => {
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
        <Box className="flex justify-between items-center w-full mb-[2px]">
          <Typography variant="h6">Меню</Typography>
        </Box>

        {/* Текстовые поля для координат */}
        <Box className="flex-1 overflow-y-auto">
          <TextField
            label="Початкова точка (широта, довгота)"
            value={coordinates.start}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
          />

          {intermediatePoints.map((point, index) => (
            <TextField
              key={index}
              label={`Проміжна точка ${index + 1} (широта, довгота)`}
              value={`${point.lat}, ${point.lng}`}
              variant="outlined"
              fullWidth
              margin="normal"
              disabled
            />
          ))}

          <TextField
            label="Кінцева точка (широта, довгота)"
            value={coordinates.end}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
          />
        </Box>

        {children}
      </Box>
    </>
  );
};
