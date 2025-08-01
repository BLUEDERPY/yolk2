import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Chip,
  Alert,
  Tabs,
  Tab,
  Paper,
  Grid,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Slider,
  LinearProgress,
} from '@mui/material';
import {
  Star,
  Heart,
  Share,
  Download,
  Settings,
  User,
  Bell,
  Search,
  Filter,
  TrendingUp,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { auroraColors, auroraTypography, auroraSpacing, auroraBorderRadius } from '../../themes/aurora';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nexus-tabpanel-${index}`}
      aria-labelledby={`nexus-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const NexusShowcase: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(30);
  const [switchValue, setSwitchValue] = useState(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h1" gutterBottom>
          Aurora Design System
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          The most beautiful design system a human could imagine - digital poetry through 
          color, motion, and light inspired by the Northern Lights.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Button variant="contained" size="large" startIcon={<Zap />}>
            Get Started
          </Button>
          <Button variant="outlined" size="large" startIcon={<Download />}>
            Download
          </Button>
          <ThemeToggle />
        </Stack>
      </Box>

      {/* Color Palette Section */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Color Palette
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            A carefully crafted palette that balances vibrancy with sophistication
          </Typography>
          
          <Grid container spacing={3}>
            {Object.entries(auroraColors).filter(([name]) => name !== 'holographic').map(([colorName, colorShades]) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={colorName}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
                    {colorName}
                  </Typography>
                  <Stack spacing={1}>
                    {Object.entries(colorShades).slice(0, 5).map(([shade, color]) => (
                      <Box
                        key={shade}
                        sx={{
                          height: 40,
                          backgroundColor: color,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: parseInt(shade) > 500 ? 'white' : 'black',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {shade}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Typography Section */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Typography System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Clean, readable typography with perfect hierarchy and spacing
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="h1">Heading 1 - Display Large</Typography>
              <Typography variant="caption" color="text.secondary">
                {auroraTypography.displayFont} • {auroraTypography.fontSize['6xl']} • Black
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2">Heading 2 - Display Medium</Typography>
              <Typography variant="caption" color="text.secondary">
                {auroraTypography.headingFont} • {auroraTypography.fontSize['5xl']} • Extrabold
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3">Heading 3 - Display Small</Typography>
              <Typography variant="caption" color="text.secondary">
                {auroraTypography.headingFont} • {auroraTypography.fontSize['4xl']} • Bold
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                Body text uses Geist font family for optimal readability across all devices. 
                This paragraph demonstrates the perfect balance between character spacing, 
                line height, and font weight for extended reading.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {auroraTypography.fontFamily} • {auroraTypography.fontSize.base} • Normal
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Secondary body text is slightly smaller and uses a muted color for 
                supporting information and captions.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {auroraTypography.fontFamily} • {auroraTypography.fontSize.sm} • Normal
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Component Examples */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Component Library
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Modern UI components with consistent styling and smooth interactions
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Buttons & Actions" />
            <Tab label="Forms & Inputs" />
            <Tab label="Data Display" />
            <Tab label="Navigation" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Buttons</Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button variant="contained">Primary</Button>
                    <Button variant="outlined">Secondary</Button>
                    <Button variant="text">Text</Button>
                  </Stack>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button variant="contained" size="small">Small</Button>
                    <Button variant="contained" size="medium">Medium</Button>
                    <Button variant="contained" size="large">Large</Button>
                  </Stack>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button variant="contained" startIcon={<Star />}>With Icon</Button>
                    <Button variant="outlined" endIcon={<Share />}>End Icon</Button>
                  </Stack>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Icon Buttons</Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <IconButton><Heart /></IconButton>
                    <IconButton color="primary"><Star /></IconButton>
                    <IconButton color="secondary"><Settings /></IconButton>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="User Profile">
                      <IconButton><User /></IconButton>
                    </Tooltip>
                    <Tooltip title="Notifications">
                      <IconButton><Bell /></IconButton>
                    </Tooltip>
                    <Tooltip title="Search">
                      <IconButton><Search /></IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Text Fields</Typography>
                <Stack spacing={3}>
                  <TextField label="Standard Input" variant="outlined" fullWidth />
                  <TextField 
                    label="Email Address" 
                    type="email" 
                    variant="outlined" 
                    fullWidth 
                    helperText="We'll never share your email"
                  />
                  <TextField 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    fullWidth 
                  />
                  <TextField 
                    label="Message" 
                    multiline 
                    rows={4} 
                    variant="outlined" 
                    fullWidth 
                  />
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Controls</Typography>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={switchValue} 
                        onChange={(e) => setSwitchValue(e.target.checked)} 
                      />
                    }
                    label="Enable notifications"
                  />
                  <Box>
                    <Typography gutterBottom>Volume: {sliderValue}%</Typography>
                    <Slider
                      value={sliderValue}
                      onChange={(e, newValue) => setSliderValue(newValue as number)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" gutterBottom>Upload Progress</Typography>
                    <LinearProgress variant="determinate" value={65} />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Cards & Content</Typography>
                <Stack spacing={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <User />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">John Doe</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Product Designer
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2">
                        Passionate about creating beautiful and functional user experiences 
                        that make a difference in people's lives.
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <TrendingUp color="green" />
                      <Typography variant="h6">Performance Metrics</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Your application is performing 23% better than last month.
                    </Typography>
                  </Paper>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Chips & Tags</Typography>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label="React" />
                    <Chip label="TypeScript" color="primary" />
                    <Chip label="Design System" variant="outlined" />
                    <Chip label="UI/UX" color="secondary" />
                  </Stack>
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip 
                      label="Premium" 
                      icon={<Star />} 
                      color="primary" 
                    />
                    <Chip 
                      label="Secure" 
                      icon={<Shield />} 
                      color="success" 
                    />
                    <Chip 
                      label="Global" 
                      icon={<Globe />} 
                      variant="outlined" 
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Alerts & Feedback</Typography>
            <Stack spacing={2}>
              <Alert severity="success">
                Your changes have been saved successfully!
              </Alert>
              <Alert severity="info">
                New features are available. Check out what's new.
              </Alert>
              <Alert severity="warning">
                Your subscription will expire in 3 days.
              </Alert>
              <Alert severity="error">
                There was an error processing your request.
              </Alert>
            </Stack>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Design Principles */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Aurora Design Principles
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The core principles that guide the Aurora design system - inspired by natural phenomena
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Zap size={32} color="white" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Organic Motion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Smooth, natural animations that feel alive and responsive, 
                  inspired by the flowing movements of aurora borealis.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Shield size={32} color="white" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Luminous Beauty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Holographic gradients and ethereal glows create an otherworldly 
                  experience while maintaining perfect readability.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'accent.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Globe size={32} color="white" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Cosmic Scale
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  From intimate micro-interactions to grand cosmic layouts, 
                  Aurora scales beautifully across all dimensions.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};