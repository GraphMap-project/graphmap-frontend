import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, TextField, Typography } from '@mui/material';

import { cn } from '@/core/utils';

export const SideMenu = ({
  open,
  coordinates,
  intermediatePoints,
  children,
  addIntermediatePoint,
  startPointName,
  endPointName,
  intermediatePointNames,
}) => {
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
            value={startPointName || coordinates.start}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
          />

          {intermediatePoints.map((point, index) => (
            <TextField
              key={index}
              label={`Проміжна точка ${index + 1} (широта, довгота)`}
              value={intermediatePointNames[index] || `${point.lat}, ${point.lng}`}
              variant="outlined"
              fullWidth
              margin="normal"
              disabled
            />
          ))}

          <TextField
            label="Кінцева точка (широта, довгота)"
            value={endPointName || coordinates.end}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
          />
          <IconButton
            aria-label="addPoint"
            onClick={addIntermediatePoint}
            className="mb-2"
          >
            <AddIcon />
            <Typography className="text-primary">Додати проміжну точку</Typography>
          </IconButton>
        </Box>

        {children}
      </Box>
    </>
  );
};
