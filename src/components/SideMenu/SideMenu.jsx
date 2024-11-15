import { Box, Button, TextField, Typography } from '@mui/material';

import { cn } from '@/core/utils';

export const SideMenu = ({ open, setOpen, coordinates, children }) => {
  return (
    <>
      <Box
        className={cn(
          'flex flex-col gap-1 absolute top-0 left-0 w-[250px] bg-white overflow-hidden transition-transform z-50',
          {
            'translate-x-0': open,
            '-translate-x-full': !open,
          },
        )}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between', // Располагает элементы по краям
            alignItems: 'center', // Выравнивание по вертикали
            width: '100%', // Чтобы контейнер растягивался на всю ширину
            mb: 2,
          }}
        >
          <Typography variant="h6">Меню</Typography>
          <Button onClick={() => setOpen(false)}> {'<<'} </Button>
        </Box>

        {/* Текстовые поля для координат */}
        <TextField
          label="Начальная точка (широта, долгота)"
          value={coordinates.start}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Конечная точка (широта, долгота)"
          value={coordinates.end}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled
        />
        {children}
      </Box>
    </>
  );
};
