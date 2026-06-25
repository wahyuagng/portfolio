import { m } from 'framer-motion';
import { varBounce, MotionContainer } from '@components/animate';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from '../../assets/illustrations';

export function ViewForbidden() {
  return (
    <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Permission Denied
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>You do not have permission to access this page</Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <ForbiddenIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>
    </Container>
  );
}
